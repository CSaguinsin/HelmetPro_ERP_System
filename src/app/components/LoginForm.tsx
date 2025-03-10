"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface LoginFormProps {
  switchToSignUp: () => void;
}

export function LoginForm({ switchToSignUp }: LoginFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    try {
      console.log("Attempting login with:", { email });

      // First, check if the user exists in the users table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (userError) {
        console.error("User lookup error:", userError);
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "User not found",
        });
        return;
      }

      // Then attempt to authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error("Auth error:", authError);
        toast({
          variant: "destructive",
          title: "Login failed",
          description: authError.message,
        });
        return;
      }

      if (authData.user) {
        console.log("Login successful:", authData.user);

        // Store necessary data
        localStorage.setItem("user_client_id", userData.user_client_id);
        localStorage.setItem("erp_user_id", userData.erp_user_id);

        toast({
          title: "Login successful",
          description: `Welcome back, ${authData.user.email}!`,
        });

        // Add a small delay before navigation
        setTimeout(() => {
          router.push("/dashboard");
        }, 500);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
          placeholder="you@example.com"
        />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
          </button>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader className="animate-spin -ml-1 mr-3 h-5 w-5" />
            Logging in...
          </>
        ) : (
          "Log in"
        )}
      </Button>

      <p className="text-sm text-gray-600 text-center">
        Don&apos;t have an account?{" "}
        <a 
          href="#" 
          onClick={(e) => { 
            e.preventDefault(); 
            switchToSignUp(); 
          }} 
          className="font-medium text-blue-600 hover:underline"
        >
          Sign up
        </a>
      </p>
    </form>
  );
}
