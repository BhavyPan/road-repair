'use client'

import { useState, useEffect } from 'react'
import { Camera, CheckCircle, X } from 'lucide-react'

interface PhotoDisplayProps {
  photos: string[]
  title: string
  icon?: 'camera' | 'check'
}

export default function PhotoDisplay({ photos, title, icon = 'camera' }: PhotoDisplayProps) {
  const [validPhotos, setValidPhotos] = useState<string[]>([])

  useEffect(() => {
    // Filter out invalid photo URLs
    const filtered = photos.filter(photo => {
      try {
        // Check if it's a valid URL, blob URL, or base64 data
        return photo && (
          photo.startsWith('blob:') || 
          photo.startsWith('http') || 
          photo.startsWith('data:') ||
          photo.startsWith('blob:http')
        )
      } catch {
        return false
      }
    })
    setValidPhotos(filtered)
    console.log('PhotoDisplay - Valid photos:', filtered.length, 'out of', photos.length)
  }, [photos])

  if (validPhotos.length === 0) {
    return null
  }

  const IconComponent = icon === 'camera' ? Camera : CheckCircle

  return (
    <div className="mb-4">
      <h5 className="text-white font-medium mb-2 flex items-center">
        <IconComponent className="mr-2" size={14} />
        {title} ({validPhotos.length}):
      </h5>
      <div className="grid grid-cols-3 gap-2">
        {validPhotos.slice(0, 3).map((photo, idx) => (
          <div key={idx} className="relative group">
            <img
              src={photo}
              alt={`${title} ${idx + 1}`}
              className="w-full h-20 object-cover rounded-lg border border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer"
              onClick={() => {
                try {
                  window.open(photo, '_blank')
                } catch (error) {
                  console.error('Failed to open photo:', error)
                }
              }}
              onLoad={() => console.log('Photo loaded successfully:', title, idx)}
              onError={(e) => {
                console.error('Failed to load photo:', photo, 'for', title)
                e.currentTarget.style.display = 'none'
              }}
            />
            {validPhotos.length > 3 && idx === 2 && (
              <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center text-white font-semibold">
                +{validPhotos.length - 3}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
