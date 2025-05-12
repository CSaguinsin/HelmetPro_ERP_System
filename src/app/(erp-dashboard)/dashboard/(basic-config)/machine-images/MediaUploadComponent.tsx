"use client"

import React, { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Upload, ImagePlus, Video, X, Menu, ImageIcon, CheckCircle2, AlertCircle, Info } from "lucide-react"
import Sidebar from "../../../../components/Sidebar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Image from "next/image"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { getAssets, uploadAsset, type MediaFile } from "@/lib/hardwareApi"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { LoadingDots } from "../../../../components/loading-dots"

type FileWithPreview = {
  id: string
  file: File
  preview: string
  progress: number
  status: "uploading" | "complete" | "error"
}

export default function MediaUploadComponent({ 
  deviceId,
  onBack
}: { 
  deviceId: string;
  onBack?: () => void;
}) {
  const [companyLogo, setCompanyLogo] = useState<FileWithPreview | null>(null)
  const [videoAd, setVideoAd] = useState<FileWithPreview | null>(null)
  const [companyImages, setCompanyImages] = useState<FileWithPreview[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [deviceDetails, setDeviceDetails] = useState<{name: string; status: string} | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user, loading: authLoading, isAuthenticated } = useAuth()

  // Check authentication state
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch device details
  useEffect(() => {
    // Don't fetch if still authenticating
    if (authLoading) return;
    
    const fetchDeviceDetails = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("device_list")
          .select("device_name, device_status, device_reg_id")
          .eq("device_id", deviceId)
          .single();
          
        if (error) throw error;
        
        setDeviceDetails({
          name: data.device_name || data.device_reg_id || `Device ID: ${deviceId}`,
          status: data.device_status
        });
      } catch (err) {
        console.error("Error fetching device details:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDeviceDetails();
  }, [deviceId, authLoading]);

  const handleUpload = async (file: File, type: "logo" | "video" | "image") => {
    const fileData: FileWithPreview = {
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: "uploading",
    }

    // Update state
    if (type === "logo") setCompanyLogo(fileData)
    else if (type === "video") setVideoAd(fileData)
    else setCompanyImages((prev) => [...prev, fileData])

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('deviceId', deviceId);
      formData.append('type', type);
      
      const result = await uploadAsset(formData);
      if (result.error) throw new Error(result.error);

      // Update status to complete
      if (type === "logo") setCompanyLogo((prev) => ({ ...prev!, status: "complete" }))
      else if (type === "video") setVideoAd((prev) => ({ ...prev!, status: "complete" }))
      else setCompanyImages((prev) =>
        prev.map((img) => img.id === fileData.id ? { ...img, status: "complete" } : img)
      )
    } catch (error) {
      console.error("Upload failed:", error)
      // Update status to error
      if (type === "logo") setCompanyLogo((prev) => ({ ...prev!, status: "error" }))
      else if (type === "video") setVideoAd((prev) => ({ ...prev!, status: "error" }))
      else setCompanyImages((prev) =>
        prev.map((img) => img.id === fileData.id ? { ...img, status: "error" } : img)
      )
    }
  }

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) await handleUpload(file, "logo")
  }

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) await handleUpload(file, "video")
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newFiles = Array.from(files).slice(0, 3 - companyImages.length)
      newFiles.forEach(async (file) => await handleUpload(file, "image"))
    }
  }

  const removeImage = (index: number) => {
    setCompanyImages((prev) => {
      const newImages = [...prev]
      URL.revokeObjectURL(newImages[index].preview)
      newImages.splice(index, 1)
      return newImages
    })
  }

  const removeLogo = () => {
    if (companyLogo) {
      URL.revokeObjectURL(companyLogo.preview)
      setCompanyLogo(null)
    }
  }

  const removeVideo = () => {
    if (videoAd) {
      URL.revokeObjectURL(videoAd.preview)
      setVideoAd(null)
    }
  }

  const getUploadCount = () => {
    let count = 0
    if (companyLogo) count++
    if (videoAd) count++
    count += companyImages.length
    return count
  }

  const getCompleteCount = () => {
    let count = 0
    if (companyLogo?.status === "complete") count++
    if (videoAd?.status === "complete") count++
    count += companyImages.filter((img) => img.status === "complete").length
    return count
  }

  const totalUploads = getUploadCount()
  const completedUploads = getCompleteCount()
  const uploadProgress = totalUploads ? Math.round((completedUploads / totalUploads) * 100) : 0

  const handleSaveAndContinue = async () => {
    try {
      setIsSaving(true)
      
      // Get all uploaded media files
      const result = await getAssets();
      if (result.error) throw new Error(result.error);

      const mediaFiles = result.data || [];

      // Verify all required media types are present
      const hasLogo = mediaFiles.some((file: MediaFile) => file.file_type === 'logo');
      const hasVideo = mediaFiles.some((file: MediaFile) => file.file_type === 'video');
      const hasImages = mediaFiles.some((file: MediaFile) => file.file_type === 'image');

      if (!hasLogo || !hasVideo || !hasImages) {
        toast({
          title: "Missing Required Media",
          description: "Please upload all required media types: logo, video, and at least one image.",
          variant: "destructive"
        });
        return;
      }

      // Update device status to indicate media is configured
      const updateResult = await fetch('/api/device/update', {
        method: 'PUT',
        headers: { 
          'access_token': localStorage.getItem('auth_token') || '',
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 
          deviceId,
          media_configured: true 
        }),
      });
      
      const updateResponse = await updateResult.json();
      if (updateResponse.error) throw new Error(updateResponse.error);

      toast({
        title: "Success",
        description: "Media files have been saved successfully.",
      });

      // Redirect back to dashboard
      router.push('/dashboard');

    } catch (error) {
      console.error('Error saving media:', error);
      toast({
        title: "Error",
        description: "Failed to save media files. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  }

  useEffect(() => {
    // Don't fetch assets if still authenticating
    if (authLoading) return;
    
    const fetchAssets = async () => {
      try {
        // Store the device ID in localStorage temporarily so API calls will include it
        if (deviceId) {
          localStorage.setItem('device_info', JSON.stringify({ device_id: deviceId }));
        }
        
        // Call the getAssets function with the device ID
        const result = await getAssets();
        if (result.error) throw new Error(result.error);
        
        const mediaFiles = result.data || [];
        
        // Update state with existing media files
        mediaFiles.forEach((file: MediaFile) => {
          const fileData: FileWithPreview = {
            id: crypto.randomUUID(),
            file: new File([], file.file_name),
            preview: file.file_url,
            progress: 100,
            status: "complete"
          };
          
          if (file.file_type === 'logo') setCompanyLogo(fileData);
          else if (file.file_type === 'video') setVideoAd(fileData);
          else if (file.file_type === 'image') setCompanyImages(prev => [...prev, fileData]);
        });
      } catch (error) {
        console.error('Error fetching assets:', error);
      }
    };
    
    fetchAssets();
    
    // Clean up function to remove temporary device info from localStorage
    return () => {
      localStorage.removeItem('device_info');
    };
  }, [deviceId, authLoading]);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Sidebar for larger screens */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {(isLoading || authLoading) ? (
          <div className="flex items-center justify-center h-screen">
            <LoadingDots />
          </div>
        ) : (
          <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {onBack && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={onBack}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      ← Back to devices
                    </Button>
                  )}
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Media Upload</h1>
                {deviceDetails && (
                  <div className="flex items-center gap-2 mt-1 text-gray-600 dark:text-gray-300">
                    <span>Device: <span className="font-medium">{deviceDetails.name}</span></span>
                    <Badge 
                      variant={deviceDetails.status === 'Enable' || deviceDetails.status === 'active' ? 'success' : 'default'}
                    >
                      {deviceDetails.status === 'Enable' || deviceDetails.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                {totalUploads > 0 && (
                  <div className="hidden sm:flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full px-3 py-1 shadow-sm">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {completedUploads}/{totalUploads} complete
                    </span>
                    <Progress value={uploadProgress} className="w-20 h-2" />
                  </div>
                )}

                {/* Mobile Sidebar Toggle */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Toggle sidebar</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                    <Sidebar />
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Upload Progress Summary (Mobile) */}
            {totalUploads > 0 && (
              <div className="sm:hidden mb-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Upload Progress</span>
                      <span className="text-sm">
                        {completedUploads}/{totalUploads}
                      </span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Media Upload Tabs */}
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="all" className="relative">
                  All
                  {totalUploads > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {totalUploads}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="logo" className="relative">
                  Logo
                  {companyLogo && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      1
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="video" className="relative">
                  Video
                  {videoAd && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      1
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="images" className="relative">
                  Images
                  {companyImages.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {companyImages.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Logo Card */}
                  <MediaUploadCard
                    title="Company Logo"
                    description="Upload your company logo (PNG or JPG)"
                    icon={<ImageIcon className="h-5 w-5" />}
                    fileType="image/*"
                    onUpload={handleLogoUpload}
                    fileData={companyLogo}
                    onRemove={removeLogo}
                    inputId="company-logo-all"
                    maxSize="5MB"
                  />

                  {/* Video Card */}
                  <MediaUploadCard
                    title="Video Ad"
                    description="Upload your promotional video (MP4)"
                    icon={<Video className="h-5 w-5" />}
                    fileType="video/*"
                    onUpload={handleVideoUpload}
                    fileData={videoAd}
                    onRemove={removeVideo}
                    inputId="video-ad-all"
                    maxSize="50MB"
                  />

                  {/* Images Card */}
                  <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <ImagePlus className="h-5 w-5 text-primary" />
                          </div>
                          <CardTitle className="text-lg font-semibold">Company Images</CardTitle>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Upload up to 3 company images</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <CardDescription>Upload up to 3 showcase images (PNG or JPG)</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-2">
                        {companyImages.map((image, index) => (
                          <div
                            key={index}
                            className="relative aspect-square rounded-md overflow-hidden border border-gray-200 dark:border-gray-700"
                          >
                            <Image
                              src={image.preview || "/placeholder.svg"}
                              alt={`Company Image ${index + 1}`}
                              className="object-cover"
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                            {image.status === "uploading" && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <Progress value={image.progress} className="w-3/4 h-1.5" />
                              </div>
                            )}
                            {image.status === "complete" && (
                              <div className="absolute top-1 right-1">
                                <CheckCircle2 className="h-4 w-4 text-green-500 bg-white rounded-full" />
                              </div>
                            )}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute top-1 left-1 h-6 w-6 bg-black/30 hover:bg-black/50 text-white rounded-full"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Remove image?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to remove this image? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => removeImage(index)}>Remove</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        ))}

                        {Array.from({ length: 3 - companyImages.length }).map((_, index) => (
                          <div
                            key={`empty-${index}`}
                            className="relative aspect-square rounded-md overflow-hidden border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-gray-800"
                          >
                            {index === 0 && (
                              <>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                  className="hidden"
                                  id="company-images-all"
                                  multiple
                                />
                                <Label
                                  htmlFor="company-images-all"
                                  className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                  <ImagePlus className="h-5 w-5 text-gray-400 dark:text-gray-500 mb-1" />
                                  <span className="text-xs text-gray-500 dark:text-gray-400">Add</span>
                                </Label>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 text-xs text-gray-500">Max 5MB per image</CardFooter>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="logo">
                <div className="max-w-md mx-auto">
                  <MediaUploadCard
                    title="Company Logo"
                    description="Upload your company logo (PNG or JPG)"
                    icon={<ImageIcon className="h-5 w-5" />}
                    fileType="image/*"
                    onUpload={handleLogoUpload}
                    fileData={companyLogo}
                    onRemove={removeLogo}
                    inputId="company-logo-tab"
                    maxSize="5MB"
                    expanded
                  />
                </div>
              </TabsContent>

              <TabsContent value="video">
                <div className="max-w-md mx-auto">
                  <MediaUploadCard
                    title="Video Ad"
                    description="Upload your promotional video (MP4)"
                    icon={<Video className="h-5 w-5" />}
                    fileType="video/*"
                    onUpload={handleVideoUpload}
                    fileData={videoAd}
                    onRemove={removeVideo}
                    inputId="video-ad-tab"
                    maxSize="50MB"
                    expanded
                  />
                </div>
              </TabsContent>

              <TabsContent value="images">
                <Card className="bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <ImagePlus className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg font-semibold">Company Images</CardTitle>
                      </div>
                    </div>
                    <CardDescription>Upload up to 3 showcase images for your company</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {companyImages.map((image, index) => (
                        <div
                          key={index}
                          className="relative rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 aspect-video sm:aspect-square"
                        >
                          <Image
                            src={image.preview || "/placeholder.svg"}
                            alt={`Company Image ${index + 1}`}
                            className="object-cover"
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                          {image.status === "uploading" && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <div className="w-3/4 space-y-2">
                                <Progress value={image.progress} className="h-1.5" />
                                <p className="text-white text-xs text-center">{image.progress}%</p>
                              </div>
                            </div>
                          )}
                          {image.status === "complete" && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle2 className="h-5 w-5 text-green-500 bg-white rounded-full" />
                            </div>
                          )}
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeImage(index)}
                            className="absolute bottom-2 right-2"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      ))}

                      {companyImages.length < 3 && (
                        <div className="relative rounded-md overflow-hidden border border-dashed border-gray-300 dark:border-gray-600 aspect-video sm:aspect-square flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="company-images-tab"
                            multiple
                          />
                          <Label
                            htmlFor="company-images-tab"
                            className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors p-4"
                          >
                            <ImagePlus className="h-8 w-8 text-gray-400 dark:text-gray-500 mb-2" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                              Click to upload image
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                              PNG, JPG up to 5MB
                            </span>
                          </Label>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <p className="text-sm text-gray-500">{companyImages.length}/3 images uploaded</p>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={companyImages.length === 0}
                      onClick={() => setCompanyImages([])}
                    >
                      Clear all
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8">
              <Button 
                variant="outline" 
                onClick={onBack || (() => router.push('/dashboard'))}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveAndContinue}
                disabled={totalUploads === 0 || completedUploads !== totalUploads || isSaving}
              >
                {isSaving ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Saving...
                  </>
                ) : (
                  'Save & Continue'
                )}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}


interface MediaUploadCardProps {
  title: string
  description: string
  icon: React.ReactNode
  fileType: string
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  fileData: FileWithPreview | null
  onRemove: () => void
  inputId: string
  maxSize: string
  expanded?: boolean
}

function MediaUploadCard({
  title,
  description,
  icon,
  fileType,
  onUpload,
  fileData,
  onRemove,
  inputId,
  maxSize,
  expanded = false,
}: MediaUploadCardProps) {
  return (
    <Card
      className={`bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden ${expanded ? "h-full" : ""}`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-full">{icon}</div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Maximum file size: {maxSize}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <Input type="file" accept={fileType} onChange={onUpload} className="hidden" id={inputId} />

          {!fileData ? (
            <Label
              htmlFor={inputId}
              className={`flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors p-6 ${expanded ? "h-48" : "aspect-video"}`}
            >
              <Upload className="h-8 w-8 text-gray-400 dark:text-gray-500 mb-2" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                Click to upload {title.toLowerCase()}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">Maximum size: {maxSize}</span>
            </Label>
          ) : (
            <div className={`relative w-full rounded-lg overflow-hidden ${expanded ? "h-48" : "aspect-video"}`}>
              {fileType.includes("image") ? (
                <div className="relative w-full h-full">
                  <Image
                    src={fileData.preview || "/placeholder.svg"}
                    alt={title}
                    className="object-contain bg-gray-100 dark:bg-gray-700"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ) : (
                <video
                  src={fileData.preview}
                  className="w-full h-full object-contain bg-gray-100 dark:bg-gray-700"
                  controls
                />
              )}

              {fileData.status === "uploading" && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="w-3/4 space-y-2">
                    <Progress value={fileData.progress} className="h-2" />
                    <p className="text-white text-xs text-center">{fileData.progress}% uploaded</p>
                  </div>
                </div>
              )}

              {fileData.status === "complete" && (
                <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              )}

              {fileData.status === "error" && (
                <div className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1">
                  <AlertCircle className="h-5 w-5" />
                </div>
              )}

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="absolute bottom-2 right-2">
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove {title.toLowerCase()}?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to remove this {title.toLowerCase()}? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onRemove}>Remove</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Label
                htmlFor={inputId}
                className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs rounded-md px-2 py-1 cursor-pointer hover:bg-primary/90 transition-colors"
              >
                Replace
              </Label>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <p className="text-xs text-gray-500">
          {fileType.includes("image") ? "Recommended size: 1024x1024px" : "Recommended length: 30-60 seconds"}
        </p>
      </CardFooter>
    </Card>
  )
}