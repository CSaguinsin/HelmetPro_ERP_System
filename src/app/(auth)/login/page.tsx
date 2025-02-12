"use client";

import { useState } from "react";
import { SignUpForm } from "../../components/SignUpForm";
import { LoginForm } from "../../components/LoginForm";

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          {isSignUp ? "Create an Account" : "Sign in to your account"}
        </h2>

        {isSignUp ? (
          <SignUpForm switchToLogin={() => setIsSignUp(false)} />
        ) : (
          <LoginForm switchToSignUp={() => setIsSignUp(true)} />
        )}
      </div>
    </div>
  );
}
