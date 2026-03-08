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
import { register } from "@/lib/api/auth";
import { useToast } from "@/lib/hooks/use-toast";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await register({ name, email, password });

      toast({
        title: "Account Created",
        description:
          response.message ||
          "Your account has been successfully created. Please log in.",
      });

      // Redirect to login page as requested
      router.push("/login");
    } catch (error) {
      // Error handling is already done in apiClient interceptor via toast
      console.error("Registration failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-muted items-center justify-center p-12 relative overflow-hidden bg-gradient-to-tr from-secondary/20 via-background to-primary/20">
        {/* <div className="relative z-10 text-center space-y-6 max-w-md"> */}
        <div className="w-full h-[400px] relative mb-10">
          <Image
            src="/Coworking.svg"
            alt="Auth Illustration"
            fill
            className="object-contain"
            priority
          />
        </div>
        {/* <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Start Your <span className="text-primary italic">Journey</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Create an account and start collaborating with your team today.
          </p>
        </div> */}

        {/* Decorative elements */}
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-3xl animate-float" />
      </div>

      {/* Right side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Create an account
            </h2>
            <p className="text-muted-foreground">
              Enter your details to create your personalized workspace.
            </p>
          </div>

          <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
              <CardDescription>
                Full access to all features with a free account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-10 border-muted-foreground/20 focus:border-primary transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 border-muted-foreground/20 focus:border-primary transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10 border-muted-foreground/20 focus:border-primary transition-all duration-300"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-10 text-sm font-semibold transition-transform active:scale-95 mt-4"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-primary hover:underline transition-all"
                >
                  Sign in instead
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
