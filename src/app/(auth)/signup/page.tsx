"use client";

import { useState } from "react";
import { SignUpForm } from "../../components/SignUpForm";
import { LoginForm } from "../../components/LoginForm";

export default function SignUpPage() {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          {isLogin ? "Sign in to your account" : "Create an Account"}
        </h2>

        {isLogin ? (
          <LoginForm switchToSignUp={() => setIsLogin(false)} />
        ) : (
          <SignUpForm switchToLogin={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
}
