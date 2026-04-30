import ky from "ky";
import { useAuthStore } from "@/services/auth-store";
import { getApiUrl } from "@/utils/api-url";
import { POST as refreshTokenPost } from "./queries/refresh-token.query";

let refreshPromise: Promise<string | null> | null = null;

const handleLogout = () => {
  refreshPromise = null;
  useAuthStore.getState().logout();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

async function handleRefreshToken(refreshToken: string): Promise<string | null> {
  try {
    const response = await refreshTokenPost(refreshToken);

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    useAuthStore.getState().setTokens(accessToken, newRefreshToken);

    return accessToken;
  } catch {
    handleLogout();
    return null;
  }
}

const kyApi = ky.create({
  prefix: getApiUrl(),
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const token = useAuthStore.getState().accessToken;
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async ({ request, response }) => {
        const isRefreshRequest = request.url.includes("/auth-b2c/refresh-token") || request.url.includes("/auth-b2b/login-admin");
        
        if (response.status === 401 && !isRefreshRequest) {
          const refreshToken = useAuthStore.getState().refreshToken;

          if (!refreshToken) {
            handleLogout();
            return response;
          }

          try {
            if (!refreshPromise) {
              refreshPromise = handleRefreshToken(refreshToken);
            }

            const newToken = await refreshPromise;
            refreshPromise = null;

            if (newToken) {
              const newRequest = new Request(request, {
                headers: {
                  ...Object.fromEntries(request.headers.entries()),
                  Authorization: `Bearer ${newToken}`,
                },
              });
              return ky(newRequest);
            }
          } catch {
            refreshPromise = null;
          }
        }
        return response;
      },
    ],
  },
  retry: {
    limit: 3,
    methods: ["get", "put", "delete", "patch"],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
  },
});

export { kyApi };
