"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import bcrypt from "bcryptjs";

export default function SignUpForm() {
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
      // Step 1: Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
  
      if (authError) {
        toast({ variant: "destructive", title: "Signup failed", description: authError.message });
        setIsLoading(false);
        return;
      }
  
      const user = authData?.user;
      if (!user) {
        toast({ variant: "destructive", title: "Signup failed", description: "User not created." });
        setIsLoading(false);
        return;
      }
  
      // Step 2: Insert user data into `user_clients` table
      const { error: userError } = await supabase.from("user_clients").insert([
        {
          email,
          password, // Storing plain text passwords is a security risk (see notes below)
          erp_user_id: user.id, // Store `auth.users.id` as `erp_user_id`
        },
      ]);
  
      if (userError) {
        toast({ variant: "destructive", title: "Signup failed", description: userError.message });
        setIsLoading(false);
        return;
      }
  
      toast({ title: "Signup successful", description: "Check your email for a confirmation link." });
      router.push("/dashboard");
    } catch (error) {
      toast({ variant: "destructive", title: "An error occurred", description: "Please try again later." });
    } finally {
      setIsLoading(false);
    }
  }
  
  

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email address</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3">
              {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
            </button>
          </div>
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? <Loader className="animate-spin h-5 w-5 mr-2" /> : "Sign up"}
      </Button>
    </form>
  );
}
