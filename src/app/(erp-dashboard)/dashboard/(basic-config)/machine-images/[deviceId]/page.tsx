"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import MediaUploadComponent from "../MediaUploadComponent"
import { useAuth } from "@/lib/auth-context"

export default function MachineImagesPage() {
  const params = useParams()
  const deviceId = params.deviceId as string
  const router = useRouter()
  const { loading, isAuthenticated } = useAuth()

  useEffect(() => {
    // If not authenticated after auth context has loaded, redirect to login
    if (!loading && !isAuthenticated) {
      router.push("/")
    }
  }, [loading, isAuthenticated, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect in the useEffect
  }

  return (
    <div>
      <MediaUploadComponent deviceId={deviceId} />
    </div>
  )
}