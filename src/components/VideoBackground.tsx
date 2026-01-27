'use client'

import { useState, useEffect } from 'react'

export default function VideoBackground() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          onLoadedData={() => setIsLoaded(true)}
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%231a1a2e;stop-opacity:1' /%3E%3Cstop offset='50%25' style='stop-color:%23162034;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%230f0f23;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1920' height='1080' fill='url(%23grad)' /%3E%3C/svg%3E"
        >
          <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" type="video/mp4" />
          <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" type="video/mp4" />
          {/* Fallback for browsers that don't support video */}
          <div className="w-full h-full bg-gradient-to-br from-gray-900 via-slate-900 to-black"></div>
        </video>
        
        {/* Dark Theme Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-gray-900/70 to-black/90"></div>
      </div>

      {/* Dark Theme Animated Particles */}
      <div className="absolute inset-0">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${8 + Math.random() * 6}s`
            }}
          >
            <div className="w-1 h-1 bg-cyan-400/20 rounded-full blur-sm"></div>
          </div>
        ))}
      </div>

      {/* Dark Theme Light Beams */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent animate-slide-right"></div>
        <div className="absolute top-0 -right-1/4 w-1/2 h-full bg-gradient-to-l from-transparent via-blue-500/5 to-transparent animate-slide-left"></div>
        <div className="absolute top-1/2 -left-1/4 w-1/2 h-1/2 bg-gradient-to-r from-transparent via-purple-500/3 to-transparent animate-slide-right" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Dark Theme Pulse Effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 bg-cyan-500/5 rounded-full animate-pulse-slow"></div>
        <div className="absolute w-64 h-64 bg-blue-500/5 rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Dark Theme Grid Overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>
    </div>
  )
}
