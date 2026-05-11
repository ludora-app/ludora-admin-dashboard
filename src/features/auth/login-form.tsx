"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useAuthB2BLoginAdmin } from "@/api/generated/api/auth-b2b/auth-b2b.api";
import { usersFindMe } from "@/api/generated/api/users/users.api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/services/auth-store";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);
  const setTokens = useAuthStore((state) => state.setTokens);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate: login, isPending } = useAuthB2BLoginAdmin({
    mutation: {
      onSuccess: async (response) => {
        try {
          if (response.status !== 200) {
            setError("Unexpected response from server");
            return;
          }

          const { accessToken, refreshToken } = response.data.data;

          // 1. Temporarily set tokens to allow findMe request to be authorized
          setTokens(accessToken, refreshToken);

          // 2. Fetch real user profile
          const userResponse = await usersFindMe();

          if (userResponse.status !== 200) {
            setError("Failed to fetch user profile");
            return;
          }

          const userData = userResponse.data.data;

          // 3. Save tokens in React Query cache
          queryClient.setQueryData(["auth-tokens"], {
            accessToken,
            refreshToken,
          });

          // 4. Update store with real user data
          setAuth(accessToken, refreshToken, {
            id: userData.uid,
            email: userData.email || "admin@ludora.com",
            role: "admin", // Hardcoded as this is the admin login endpoint
          });

          router.push("/admin/dashboard");
        } catch (err) {
          setError("Failed to fetch user profile after login");
          console.error(err);
        }
      },
      onError: (err: unknown) => {
        const error = err as Record<string, unknown>;
        const response = error?.response as Record<string, unknown> | undefined;
        const data = response?.data as Record<string, unknown> | undefined;
        const message =
          typeof data?.message === "string" ? data.message : "Invalid email or password";
        setError(message);
      },
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    setError(null);
    login({ data });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email and password to access the admin dashboard.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="admin@ludora.com" {...register("email")} />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
