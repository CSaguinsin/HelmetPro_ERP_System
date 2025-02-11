"use client"

import { useState } from "react"
import Image from "next/image"
import LoginForm from "../login/page"
import SignUpForm from "../SignupForm"
import { useRouter } from 'next/navigation'
import { ImageCarousel } from "../image-carousel"
export default function LoginPage() {
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false)

  return (
    <div className="flex min-h-screen">
      {/* Left Section (Form) */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 xl:px-12 bg-white">
        <div className="mx-auto w-full max-w-md space-y-8">
          <div className="text-center" onClick={() => router.push('/')}>
            <Image
              src="/helmetpro/logo.jpeg"
              alt="Logo"
              width={80}
              height={80}
              className="mx-auto h-20 w-auto rounded-full shadow-md"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {isSignUp ? "Create an Account" : "Welcome Back"}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {isSignUp ? "Sign up to get started" : "Sign in to your account to continue"}
            </p>
          </div>
          {isSignUp ? (
            <SignUpForm switchToLogin={() => setIsSignUp(false)} />
          ) : (
            <LoginForm switchToSignUp={() => setIsSignUp(true)} />
          )}
        </div>
      </div>

      {/* Right Section (Image Carousel) */}
      <div className="hidden lg:block lg:w-1/2">
        <div className="h-full">
          <ImageCarousel />
        </div>
      </div>
    </div>
  )
}
