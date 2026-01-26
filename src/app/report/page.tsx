'use client'



import { useState, useEffect } from 'react'

import { Camera, MapPin, AlertCircle, Upload, X, Zap, Shield, Navigation, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react'

import Link from 'next/link'

import { RoadDamageReport } from '../../types'

import AnimatedLayout from '../../components/AnimatedLayout'

import { convertToBase64 } from '../../utils/photoUtils'

import { reportsApi } from '../../lib/api'



export default function ReportPage() {

  const [formData, setFormData] = useState({

    type: '',

    description: '',

    location: '',

    latitude: '',

    longitude: ''

  })

  const [photos, setPhotos] = useState<File[]>([])

  const [isSubmitting, setIsSubmitting] = useState(false)

  const [submitted, setSubmitted] = useState(false)

  const [error, setError] = useState('')

  const [isLoaded, setIsLoaded] = useState(false)



  useEffect(() => {

    setIsLoaded(true)

  }, [])



  const damageTypes = [

    { value: 'pothole', label: 'Pothole', icon: '🕳️', color: 'from-orange-500 to-red-500' },

    { value: 'crack', label: 'Road Crack', icon: '🦶', color: 'from-blue-500 to-cyan-500' },

    { value: 'tree_fall', label: 'Tree Fall', icon: '🌳', color: 'from-green-500 to-emerald-500' },

    { value: 'debris', label: 'Debris', icon: '🪨', color: 'from-gray-500 to-slate-500' },

    { value: 'flood_damage', label: 'Flood Damage', icon: '🌊', color: 'from-blue-600 to-indigo-600' },

    { value: 'other', label: 'Other', icon: '⚠️', color: 'from-purple-500 to-pink-500' }

  ]



  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {

    const files = Array.from(e.target.files || [])

    setPhotos(prev => [...prev, ...files].slice(0, 5)) // Limit to 5 photos

  }



  const removePhoto = (index: number) => {

    setPhotos(prev => prev.filter((_, i) => i !== index))

  }



  const getCurrentLocation = () => {

    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(

        (position) => {

          setFormData(prev => ({

            ...prev,

            latitude: position.coords.latitude.toString(),

            longitude: position.coords.longitude.toString()

          }))

        },

        (error) => {

          setError('Unable to get your location. Please enter it manually.')

        }

      )

    } else {

      setError('Geolocation is not supported by your browser.')

    }

  }



  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault()

    setIsSubmitting(true)



    try {

      // Convert photos to base64

      console.log('Converting', photos.length, 'photos to base64...')

      const base64Photos = await Promise.all(photos.map(convertToBase64))

      console.log('Photos converted successfully')

      

      // Create new report object

      const newReport: RoadDamageReport = {

        id: Date.now().toString(),

        type: formData.type as any,

        description: formData.description,

        location: {

          latitude: parseFloat(formData.latitude) || 0,

          longitude: parseFloat(formData.longitude) || 0,

          address: formData.location

        },

        photos: base64Photos as string[],

        priority: 'medium', // Default priority

        status: 'reported',

        reportedBy: 'Citizen',

        reportedAt: new Date(),

        beforePhotos: base64Photos as string[],

        aiAnalysis: {

          detectedDamage: [formData.type],

          confidence: 0.85,

          recommendedDepartment: 'Public Works'

        }

      }



      // Save to database via API
      console.log('Saving report to database...')
      await reportsApi.create(newReport)
      console.log('Report saved successfully')



      // Simulate API call delay

      await new Promise(resolve => setTimeout(resolve, 2000))

      

      setIsSubmitting(false)

      setSubmitted(true)

    } catch (error) {

      console.error('Error submitting report:', error)

      setIsSubmitting(false)

      setError('Failed to submit report. Please try again.')

    }

  }



  if (submitted) {

    return (

      <AnimatedLayout>

        <div className="relative z-10 min-h-screen flex items-center justify-center px-4">

          <div className={`card max-w-2xl w-full text-center transition-all duration-1000 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>

            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-slow">

              <CheckCircle className="text-white" size={40} />

            </div>

            

            <h1 className="text-4xl font-bold text-white mb-4">

              Report Submitted Successfully!

            </h1>

            

            <p className="text-xl text-white/80 mb-8 leading-relaxed">

              Thank you for helping keep our roads safe! Your report has been received and will be reviewed by our volunteer team.

            </p>

            

            <div className="grid grid-cols-2 gap-4 mb-8">

              <div className="glass-morphism rounded-2xl p-4">

                <Zap className="text-yellow-400 mx-auto mb-2" size={24} />

                <div className="text-white font-semibold">AI Analysis</div>

                <div className="text-white/60 text-sm">Processing your report</div>

              </div>

              <div className="glass-morphism rounded-2xl p-4">

                <Shield className="text-blue-400 mx-auto mb-2" size={24} />

                <div className="text-white font-semibold">Priority</div>

                <div className="text-white/60 text-sm">Medium Priority</div>

              </div>

            </div>

            

            <div className="flex flex-col sm:flex-row gap-4 justify-center">

              <Link href="/dashboard" className="btn-primary">

                View Progress

              </Link>

              <Link href="/" className="btn-secondary">

                Report Another Issue

              </Link>

            </div>

          </div>

        </div>

      </AnimatedLayout>

    )

  }



  return (

    <AnimatedLayout>

      {/* Navigation */}

      <nav className="glass-morphism border-b border-white/10">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex justify-between h-20 items-center">

            <div className={`flex items-center space-x-3 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>

              <Link href="/" className="flex items-center space-x-3">

                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">

                  <Shield className="text-white" size={24} />

                </div>

                <h1 className="text-2xl font-bold text-white">RoadGuard</h1>

              </Link>

            </div>

            <Link href="/" className={`btn-secondary flex items-center transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>

              <ArrowLeft className="mr-2" size={20} />

              Back to Home

            </Link>

          </div>

        </div>

      </nav>



      {/* Main Content */}

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className={`text-center mb-12 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 mb-6">

            <Camera className="text-yellow-400 mr-2" size={16} />

            <span className="text-white text-sm font-medium">Smart Damage Reporting</span>

          </div>

          

          <h1 className="text-4xl md:text-5xl font-bold mb-6">

            <span className="gradient-text">Report Road</span>

            <br />

            <span className="text-white">Damage Instantly</span>

          </h1>

          

          <p className="text-xl text-white/80 leading-relaxed">

            Help us keep our roads safe by reporting damage with photos and location.

            Our AI will analyze the issue and prioritize it for volunteers.

          </p>

        </div>



        {error && (

          <div className={`card mb-8 border-l-4 border-red-500 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>

            <div className="flex items-center">

              <AlertTriangle className="text-red-400 mr-3" size={24} />

              <p className="text-white">{error}</p>

            </div>

          </div>

        )}



        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Damage Type Selection */}

          <div className={`card transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">

              <AlertCircle className="mr-3 text-yellow-400" size={24} />

              What type of damage?

            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

              {damageTypes.map((type) => (

                <button

                  key={type.value}

                  type="button"

                  onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}

                  className={`relative overflow-hidden rounded-2xl p-4 transition-all duration-300 transform hover:scale-105 ${

                    formData.type === type.value

                      ? 'bg-gradient-to-r ' + type.color + ' text-white shadow-2xl'

                      : 'glass-morphism text-white/80 hover:text-white hover:bg-white/20'

                  }`}

                >

                  <div className="text-3xl mb-2">{type.icon}</div>

                  <div className="font-semibold">{type.label}</div>

                  {formData.type === type.value && (

                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>

                  )}

                </button>

              ))}

            </div>

          </div>



          {/* Description */}

          <div className={`card transition-all duration-1000 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

            <h2 className="text-2xl font-bold text-white mb-6">Describe the Issue</h2>

            <textarea

              value={formData.description}

              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}

              placeholder="Please describe the road damage in detail. Include size, severity, and any potential hazards..."

              className="input-field min-h-[120px] resize-none"

              required

            />

          </div>



          {/* Location */}

          <div className={`card transition-all duration-1000 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">

              <MapPin className="mr-3 text-blue-400" size={24} />

              Location

            </h2>

            <div className="space-y-4">

              <div>

                <input

                  type="text"

                  value={formData.location}

                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}

                  placeholder="Enter address or landmark"

                  className="input-field"

                  required

                />

              </div>

              <button

                type="button"

                onClick={getCurrentLocation}

                className="btn-secondary w-full"

              >

                <Navigation className="inline-block mr-2" size={20} />

                Use Current Location

              </button>

              <div className="grid grid-cols-2 gap-4">

                <input

                  type="number"

                  value={formData.latitude}

                  onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value }))}

                  placeholder="Latitude"

                  className="input-field"

                  step="any"

                />

                <input

                  type="number"

                  value={formData.longitude}

                  onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value }))}

                  placeholder="Longitude"

                  className="input-field"

                  step="any"

                />

              </div>

            </div>

          </div>



          {/* Photos */}

          <div className={`card transition-all duration-1000 delay-800 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">

              <Camera className="mr-3 text-green-400" size={24} />

              Upload Photos

            </h2>

            <div className="space-y-4">

              <div className="border-2 border-dashed border-white/30 rounded-2xl p-8 text-center hover:border-white/50 transition-colors">

                <input

                  type="file"

                  id="photos"

                  multiple

                  accept="image/*"

                  onChange={handlePhotoUpload}

                  className="hidden"

                />

                <label htmlFor="photos" className="cursor-pointer">

                  <Upload className="mx-auto text-white/60 mb-4" size={48} />

                  <p className="text-white font-semibold mb-2">Click to upload photos</p>

                  <p className="text-white/60 text-sm">PNG, JPG, GIF up to 10MB each (Max 5 photos)</p>

                </label>

              </div>

              

              {photos.length > 0 && (

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                  {photos.map((photo, index) => (

                    <div key={index} className="relative group">

                      <img

                        src={URL.createObjectURL(photo)}

                        alt={`Upload ${index + 1}`}

                        className="w-full h-32 object-cover rounded-2xl border-2 border-white/20"

                      />

                      <button

                        type="button"

                        onClick={() => removePhoto(index)}

                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"

                      >

                        <X size={16} />

                      </button>

                    </div>

                  ))}

                </div>

              )}

            </div>

          </div>



          {/* Submit Button */}

          <div className={`text-center transition-all duration-1000 delay-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

            <button

              type="submit"

              disabled={isSubmitting || !formData.type || !formData.description || !formData.location || photos.length === 0}

              className="btn-primary text-lg px-12 py-6 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"

            >

              <span className="relative z-10 flex items-center">

                {isSubmitting ? (

                  <>

                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>

                    Submitting Report...

                  </>

                ) : (

                  <>

                    <Shield className="mr-3 group-hover:rotate-12 transition-transform" size={24} />

                    Submit Report

                    <Zap className="ml-3 group-hover:scale-110 transition-transform" size={24} />

                  </>

                )}

              </span>

              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>

            </button>

          </div>

        </form>

      </main>

    </AnimatedLayout>

  )

}

