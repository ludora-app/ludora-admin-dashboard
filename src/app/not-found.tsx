import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Custom 404 page that redirects users based on their authentication status.
 * If authenticated, redirects to the admin dashboard.
 * If not authenticated, redirects to the login page.
 */
export default async function NotFound() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("ludora_access_token")?.value;
  const refreshToken = cookieStore.get("ludora_refresh_token")?.value;

  const isAuthenticated = !!accessToken || !!refreshToken;

  if (isAuthenticated) {
    redirect("/admin/dashboard");
  } else {
    redirect("/login");
  }
}
