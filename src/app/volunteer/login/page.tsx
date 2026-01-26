'use client'

import { useState, useEffect } from 'react'
import { Users, Eye, EyeOff, AlertCircle, Shield, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AnimatedLayout from '../../../components/AnimatedLayout'

export default function VolunteerLogin() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    department: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulate authentication/registration
    setTimeout(() => {
      if (isSignUp) {
        // Sign up logic - accept any valid registration
        if (formData.name && formData.email && formData.password) {
          // Store volunteer data in localStorage for demo purposes
          const volunteers = JSON.parse(localStorage.getItem('volunteers') || '[]')
          const newVolunteer = {
            id: Date.now().toString(),
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            department: formData.department,
            isActive: true,
            completedTasks: 0
          }
          volunteers.push(newVolunteer)
          localStorage.setItem('volunteers', JSON.stringify(volunteers))
          localStorage.setItem('currentVolunteer', JSON.stringify(newVolunteer))
          router.push('/volunteer/dashboard')
        } else {
          setError('Please fill in all required fields')
        }
      } else {
        // Sign in logic - accept any valid email/password
        if (formData.email && formData.password) {
          // Check if volunteer exists or create a new one for demo
          const volunteers = JSON.parse(localStorage.getItem('volunteers') || '[]')
          let volunteer = volunteers.find((v: any) => v.email === formData.email)
          
          if (!volunteer) {
            // Create new volunteer for demo purposes
            volunteer = {
              id: Date.now().toString(),
              name: formData.email.split('@')[0],
              email: formData.email,
              phone: '',
              department: 'General',
              isActive: true,
              completedTasks: 0
            }
            volunteers.push(volunteer)
            localStorage.setItem('volunteers', JSON.stringify(volunteers))
          }
          
          localStorage.setItem('currentVolunteer', JSON.stringify(volunteer))
          router.push('/volunteer/dashboard')
        } else {
          setError('Please enter email and password')
        }
      }
      setIsLoading(false)
    }, 1500)
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

      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-5rem)] px-4">
        <div className={`w-full max-w-md transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="card">
            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="text-white" size={36} />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {isSignUp ? 'Volunteer Sign Up' : 'Volunteer Login'}
              </h1>
              <p className="text-white/80">
                {isSignUp ? 'Create your volunteer account' : 'Sign in to access your dashboard'}
              </p>
            </div>

            {error && (
              <div className="glass-morphism border-l-4 border-red-500 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <AlertCircle className="text-red-400 mr-3" size={20} />
                  <span className="text-white">{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignUp && (
                <div className={`transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                  <label htmlFor="name" className="block text-white font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="input-field"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required={isSignUp}
                  />
                </div>
              )}

              <div className={`transition-all duration-1000 delay-900 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <label htmlFor="email" className="block text-white font-medium mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  className="input-field"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div className={`transition-all duration-1000 delay-1000 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <label htmlFor="password" className="block text-white font-medium mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className="input-field pr-12"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {isSignUp && (
                <>
                  <div className={`transition-all duration-1000 delay-1100 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    <label htmlFor="phone" className="block text-white font-medium mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      className="input-field"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>

                  <div className={`transition-all duration-1000 delay-1200 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    <label htmlFor="department" className="block text-white font-medium mb-2">
                      Department
                    </label>
                    <select
                      id="department"
                      className="input-field"
                      value={formData.department}
                      onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    >
                      <option value="">Select Department</option>
                      <option value="Public Works">Public Works</option>
                      <option value="Transportation">Transportation</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                </>
              )}

              <div className={`transition-all duration-1000 delay-1300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {isSignUp ? 'Creating Account...' : 'Signing In...'}
                    </div>
                  ) : (
                    `${isSignUp ? 'Create Account' : 'Sign In'}`
                  )}
                </button>
              </div>
            </form>

            <div className={`mt-6 text-center transition-all duration-1000 delay-1400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <span className="text-white/60">{isSignUp ? 'Already have an account?' : "Don't have an account?"}</span>
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setError('')
                  setFormData({
                    name: '',
                    email: '',
                    password: '',
                    phone: '',
                    department: ''
                  })
                }}
                className="ml-2 text-white font-medium hover:text-white/80 transition-colors"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AnimatedLayout>
  )
}
