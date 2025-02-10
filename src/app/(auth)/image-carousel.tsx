"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

const images = [
  "/helmetpro/carousel1.jpg",
  "/helmetpro/carousel2.jpg",
  "/helmetpro/carousel3.jpg",
  "/helmetpro/carousel4.jpg",
]

export function ImageCarousel() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
  }

  if (!mounted) return null

  return (
    <div className="fixed right-0 h-full w-[55%]">
      <Slider {...settings} className="h-full">
        {images.map((src, index) => (
          <div key={index} className="relative h-screen">
            <Image 
              src={src} 
              alt={`Slide ${index + 1}`} 
              fill
              priority={index === 0}
              className="object-cover"
            />
          </div>
        ))}
      </Slider>
    </div>
  )
}