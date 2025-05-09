"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
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
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
  
    try {
      console.log("Attempting signup with:", { email });
      
      const { success, error } = await signUp(email, password);

      if (!success) {
        setErrorMessage(error || "Signup failed. Please try again.");
        toast({
          variant: "destructive",
          title: "Signup failed",
          description: error || "Please try again later.",
        });
        return;
      }

      setSuccessMessage("Account created successfully!");
      toast({
        title: "Account created successfully",
        description: "You can now log in with your credentials.",
      });
      
      // Show success modal
      setIsVerificationModalOpen(true);
    } catch (error) {
      console.error("Signup error:", error);
      setErrorMessage("An unexpected error occurred. Please try again later.");
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
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

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
            <DialogTitle>Account Created Successfully</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Your account has been created successfully. You can now log in with your credentials.
            </p>
            <Button 
              className="w-full" 
              onClick={() => {
                setIsVerificationModalOpen(false);
                switchToLogin();
              }}
            >
              Go to Login
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}