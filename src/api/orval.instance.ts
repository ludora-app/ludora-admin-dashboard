import ky from "ky";

/**
 * Custom instance for Orval
 * This instance uses ky to make requests.
 */
export const customInstance = async <T>(
  config: {
    url: string;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    params?: any;
    data?: any;
    headers?: any;
  },
  options?: any,
): Promise<T> => {
  const { url, method, params, data, headers } = config;

  const response = await ky(url, {
    method,
    searchParams: params,
    json: data,
    headers: {
      ...headers,
      ...options?.headers,
    },
    ...options,
  });

  return response.json<T>();
};

export default customInstance;
