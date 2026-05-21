"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { signInSchema, type SignInInput } from "@/lib/validations/auth";
import { FaGoogle } from "react-icons/fa";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data: SignInInput) {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (result?.error) {
        setError("Invalid email or password. Please try again.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="font-bold text-2xl">Welcome back</CardTitle>
        <CardDescription>Sign in to your Ucomp account</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {registered && (
          <div className="bg-green-50 p-3 rounded-md text-green-600 text-sm">
            Account created successfully! Please sign in.
          </div>
        )}
        {error && (
          <div className="bg-red-50 p-3 rounded-md text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...register("email")}
              />
              <FieldError errors={[errors.email]} />
            </Field>
            <Field>
              <div className="flex justify-between items-center">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Link
                  href="/forgot-password"
                  className="text-slate-500 hover:text-slate-900 text-xs"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
              />
              <FieldError errors={[errors.password]} />
            </Field>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </FieldGroup>
        </form>

        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-slate-400 text-xs">or</span>
          <Separator className="flex-1" />
        </div>

        {/* Google Button */}
        <Button
          variant="outline"
          className="gap-2 w-full"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
        >
          <FaGoogle className="w-4 h-4" />
          {isGoogleLoading ? "Redirecting..." : "Continue with Google"}
        </Button>
      </CardContent>

      <CardFooter className="justify-center">
        <p className="text-slate-600 text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-slate-900 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
