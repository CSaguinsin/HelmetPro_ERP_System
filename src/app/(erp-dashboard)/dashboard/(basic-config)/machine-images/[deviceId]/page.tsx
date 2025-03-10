"use client"

import { useParams } from "next/navigation"
import MediaUploadComponent from "../MediaUploadComponent"

export default function MachineImagesPage() {
  const params = useParams()
  const deviceId = params.deviceId as string // Extract deviceId from the URL

  return (
    <div>
      <MediaUploadComponent deviceId={deviceId} />
    </div>
  )
}