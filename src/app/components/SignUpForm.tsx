"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SignUpFormProps {
  switchToLogin: () => void;
}

export function SignUpForm({ switchToLogin }: SignUpFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
  
    try {
      // Step 1: Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
  
      if (authError) {
        toast({
          variant: "destructive",
          title: "Signup failed",
          description: authError.message,
        });
        return;
      }
  
      // Step 2: Generate a user_client_id
      const userClientId = uuidv4();
  
      // Step 3: Insert into both users and user_clients tables
      if (authData.user) {
        // Insert into users table
        const { error: userError } = await supabase
          .from("users")
          .insert([
            {
              user_client_id: userClientId,
              erp_user_id: authData.user.id,
              email: authData.user.email,
              password: password,
            },
          ]);
  
        if (userError) {
          throw userError;
        }
  
        // Insert into user_clients table
        const { error: userClientError } = await supabase
          .from("user_clients")
          .insert([
            {
              user_client_id: userClientId,
              erp_user_id: authData.user.id,
              email: authData.user.email,
              password: password,
            },
          ]);
  
        if (userClientError) {
          throw userClientError;
        }
      }
  
      toast({
        title: "Signup successful",
        description: "Please check your email to verify your account.",
      });
      setIsVerificationModalOpen(true);
    } catch (error) {
      console.error("Signup error:", error);
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
    <>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader className="animate-spin -ml-1 mr-3 h-5 w-5" />
              Signing up...
            </>
          ) : (
            "Sign up"
          )}
        </Button>

        <p className="text-sm text-gray-600 text-center">
          Already have an account?{" "}
          <a href="#" onClick={(e) => { e.preventDefault(); switchToLogin(); }} className="font-medium text-blue-600 hover:underline">
            Log in
          </a>
        </p>
      </form>

      <Dialog open={isVerificationModalOpen} onOpenChange={setIsVerificationModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Your Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              We&apos;ve sent a verification email to {email}. Please check your inbox and click the link to verify your account.
            </p>
            <Button 
              className="w-full" 
              onClick={() => {
                setIsVerificationModalOpen(false);
                switchToLogin();
              }}
            >
              Got it!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
