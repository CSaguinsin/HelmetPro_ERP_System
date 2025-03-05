"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, Maximize, Volume2, VolumeX, Loader2 } from "lucide-react"

export default function VideoShowcase() {
  return (
    <section className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 py-16 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">See Our Product in Action</h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Watch these videos to discover how our platform can transform your business operations and drive growth.
          </p>
        </div>

        <Tabs defaultValue="cinematic" className="w-full">
          <TabsList className="grid grid-cols-3 max-w-md mx-auto bg-white/10 text-white mb-8 rounded-lg p-1">
            <TabsTrigger value="cinematic" className="data-[state=active]:bg-white/20 rounded-lg">
              Overview
            </TabsTrigger>
            <TabsTrigger value="comparison" className="data-[state=active]:bg-white/20 rounded-lg">
              Comparison
            </TabsTrigger>
            <TabsTrigger value="testimonial" className="data-[state=active]:bg-white/20 rounded-lg">
              Testimonials
            </TabsTrigger>
          </TabsList>

          <div className="grid gap-8">
            <TabsContent value="cinematic" className="mt-0">
              <VideoPlayer
                src="/video/cinematic.mp4"
                title="Product Overview"
                description="A cinematic overview of our platform's capabilities and features."
              />
            </TabsContent>

            <TabsContent value="comparison" className="mt-0">
              <VideoPlayer
                src="/video/comparison.mp4"
                title="Product Comparison"
                description="See how our solution compares to traditional alternatives."
              />
            </TabsContent>

            <TabsContent value="testimonial" className="mt-0">
              <VideoPlayer
                src="/video/testimonial.mp4"
                title="Customer Testimonials"
                description="Hear what our customers have to say about their experience."
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </section>
  )
}

interface VideoPlayerProps {
  src: string
  title: string
  description: string
}

function VideoPlayer({ src, title, description }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState("0:00")
  const [duration, setDuration] = useState("0:00")
  const [isLoading, setIsLoading] = useState(true)
  const [showControls, setShowControls] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handlePlayPause = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
      setShowControls(true)
    } else {
      videoRef.current.play()
      setIsPlaying(true)
      setShowControls(false)
    }
  }

  const handleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleFullscreen = () => {
    if (!containerRef.current) return

    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      containerRef.current.requestFullscreen()
    }
  }

  const handleVideoClick = () => {
    // Toggle controls and play/pause on video click
    if (isPlaying) {
      handlePlayPause()
    } else {
      handlePlayPause()
    }
  }

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.target as HTMLVideoElement
    const currentProgress = (video.currentTime / video.duration) * 100
    setProgress(currentProgress)

    // Format current time
    const minutes = Math.floor(video.currentTime / 60)
    const seconds = Math.floor(video.currentTime % 60)
    setCurrentTime(`${minutes}:${seconds < 10 ? "0" + seconds : seconds}`)
  }

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.target as HTMLVideoElement
    // Format duration
    const minutes = Math.floor(video.duration / 60)
    const seconds = Math.floor(video.duration % 60)
    setDuration(`${minutes}:${seconds < 10 ? "0" + seconds : seconds}`)
    setIsLoading(false)
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return
    const progressBar = e.currentTarget
    const rect = progressBar.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    videoRef.current.currentTime = pos * videoRef.current.duration
  }

  return (
    <Card className="overflow-hidden bg-white/10 border-none shadow-xl rounded-2xl backdrop-blur-sm hover:shadow-2xl transition-shadow">
      <CardContent className="p-0">
        <div 
          ref={containerRef}
          id={`container-${src}`} 
          className="relative"
        >
          {/* Video Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}

          {/* Video Element */}
          <video
            ref={videoRef}
            id={src}
            className="w-full aspect-video object-contain rounded-t-2xl"
            src={src}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => {
              setIsPlaying(false)
              setShowControls(true)
            }}
            onClick={handleVideoClick}
            playsInline
          />

          {/* Video Info Overlay */}
          <div 
            className={`
              absolute inset-0 bg-gradient-to-t from-black/70 to-transparent 
              flex flex-col justify-end p-6 
              transition-opacity duration-300
              ${(isPlaying && !showControls) ? 'opacity-0' : 'opacity-100'}
            `}
          >
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{title}</h3>
            <p className="text-white/80 mb-4 max-w-2xl">{description}</p>
          </div>

          {/* Controls Overlay */}
          <div 
            className={`
              absolute inset-x-0 bottom-0 p-4
              transition-opacity duration-300
              ${(isPlaying && !showControls) ? 'opacity-0' : 'opacity-100'}
            `}
          >
            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-white/30 rounded-full mb-4 cursor-pointer" onClick={handleProgressClick}>
              <div className="h-full bg-white rounded-full" style={{ width: `${progress}%` }} />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePlayPause}
                  className="text-white hover:text-white/80 transition-colors z-10 relative"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </button>

                <button
                  onClick={handleMute}
                  className="text-white hover:text-white/80 transition-colors z-10 relative"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
                </button>

                <span className="text-white text-sm">
                  {currentTime} / {duration}
                </span>
              </div>

              <button
                onClick={handleFullscreen}
                className="text-white hover:text-white/80 transition-colors z-10 relative"
                aria-label="Fullscreen"
              >
                <Maximize className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}