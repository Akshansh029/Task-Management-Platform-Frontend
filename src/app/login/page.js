"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { login } from "@/lib/api/auth";
import { useToast } from "@/lib/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { token, message } = await login({ email, password });

      localStorage.setItem("token", token);

      toast({
        title: "Success",
        description: message || "Logged in successfully!",
      });

      router.push("/");
    } catch (error) {
      // Error handling is already done in apiClient interceptor via toast
      console.error("Login failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Design/Illustration (Visible on desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-muted items-center justify-center p-12 relative overflow-hidden bg-gradient-to-br from-primary/20 via-background to-secondary/20">
        <div className="relative z-10 text-center space-y-6 max-w-md">
          <div className="w-full h-[400px] relative mb-10 animate-pulse-slow">
            <Image
              src="/auth-illustration.png"
              alt="Auth Illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Manage Tasks with{" "}
            <span className="text-primary italic">Elegance</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Join thousands of teams streamlining their workflow with our premium
            platform.
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-secondary/10 rounded-full blur-3xl animate-float-delayed" />
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Welcome back
            </h2>
            <p className="text-muted-foreground">
              Please enter your details to sign in to your account.
            </p>
          </div>

          <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
              <CardDescription>
                Use your email and password to access your workspace.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 border-muted-foreground/20 focus:border-primary transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 border-muted-foreground/20 focus:border-primary transition-all duration-300"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 text-lg font-semibold transition-transform active:scale-95"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-primary hover:underline transition-all"
                >
                  Sign up for free
                </Link>
              </div>
            </CardFooter>
          </Card>

          <div className="text-center text-xs text-muted-foreground pt-4">
            &copy; 2026 Antigravity Task Platform. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
