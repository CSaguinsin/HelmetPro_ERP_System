'use client'

import Image from "next/image";
import { LoginForm } from "./LoginForm";
import { ImageCarousel } from "./image-carousel";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-white lg:flex-row">
      {/* Left Section (Login Form) */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8 xl:px-12">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
          <div className="flex justify-center">
            <Image 
              src="/helmetpro/logo.jpeg" 
              alt="Logo" 
              width={64} 
              height={64} 
              className="h-[5rem] w-auto" 
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <LoginForm />
        </div>
      </div>

      {/* Right Section (Image Carousel) */}
      <div className="relative hidden h-64 lg:block lg:h-auto lg:flex-1">
        <ImageCarousel />
      </div>
    </div>
  )
}
