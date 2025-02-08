"use client"

import Image from "next/image"
import { LoginForm } from "./LoginForm"
import { ImageCarousel } from "./image-carousel"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Left Section (Login Form) */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 xl:px-12 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="mx-auto w-full max-w-md space-y-8">
          <div className="text-center">
            <Image
              src="/helmetpro/logo.jpeg"
              alt="Logo"
              width={80}
              height={80}
              className="mx-auto h-20 w-auto rounded-full shadow-md"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-center text-sm text-gray-600">Sign in to your account to continue</p>
          </div>
          <LoginForm />
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

