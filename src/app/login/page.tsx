import { LoginForm } from "@/features/auth/login-form";

export const metadata = {
  title: "Login | Ludora Admin",
  description: "Login to the Ludora Admin Dashboard",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950">
      <LoginForm />
    </div>
  );
}
