'use client'

import Link from 'next/link'
import { Camera, Users, Map, TrendingUp, Shield, Zap, Globe, ArrowRight, Star, CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import VideoBackground from '@/components/VideoBackground'

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Video Background */}
      <VideoBackground />

      {/* Navigation */}
      <nav className="relative z-10 glass-morphism border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className={`flex items-center space-x-3 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-bold text-white">RoadGuard</h1>
            </div>
            <div className={`flex items-center space-x-4 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <Link href="/report" className="btn-primary">
                <Camera className="inline-block mr-2" size={20} />
                Report Damage
              </Link>
              <Link href="/volunteer/login" className="btn-secondary">
                <Users className="inline-block mr-2" size={20} />
                Volunteer Portal
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-20">
          <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 mb-6">
              <Zap className="text-yellow-400 mr-2" size={16} />
              <span className="text-white text-sm font-medium">AI-Powered Road Safety Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">Keep Our Roads</span>
              <br />
              <span className="text-white">Safe Together</span>
            </h1>
            
            <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Report road damage instantly and help volunteers fix problems quickly. 
              Together we can make our roads safer for everyone with real-time tracking and AI analysis.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link href="/report" className="btn-primary group relative overflow-hidden">
                <span className="relative z-10 flex items-center">
                  <Camera className="inline-block mr-2 group-hover:rotate-12 transition-transform" size={20} />
                  Report Now
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </span>
                <div className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </Link>
              <Link href="/dashboard" className="btn-secondary group relative overflow-hidden">
                <span className="relative z-10 flex items-center">
                  <TrendingUp className="inline-block mr-2 group-hover:scale-110 transition-transform" size={20} />
                  View Progress
                </span>
                <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {[
            { number: "10K+", label: "Reports Filed", icon: Camera },
            { number: "95%", label: "Issues Resolved", icon: CheckCircle },
            { number: "500+", label: "Active Volunteers", icon: Users },
            { number: "24/7", label: "Monitoring", icon: Globe }
          ].map((stat, index) => (
            <div key={index} className="card text-center hover-lift">
              <stat.icon className="mx-auto text-white/80 mb-3" size={32} />
              <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
              <div className="text-white/60 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            {
              icon: Camera,
              title: "Smart Reporting",
              description: "AI-powered photo analysis and automatic location detection for accurate road damage reporting",
              features: ["Photo Upload", "GPS Location", "AI Analysis", "Instant Reporting"]
            },
            {
              icon: Users,
              title: "Volunteer Network",
              description: "Dedicated volunteers work together to fix reported issues quickly and efficiently",
              features: ["Real-time Updates", "Task Assignment", "Progress Tracking", "Community Driven"]
            },
            {
              icon: Map,
              title: "Live Tracking",
              description: "Monitor the status of reported issues with real-time updates and interactive maps",
              features: ["Interactive Maps", "Status Updates", "Before/After Photos", "Analytics"]
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className={`card hover-lift transition-all duration-1000 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${700 + index * 200}ms` }}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <feature.icon className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-white/70 mb-6 leading-relaxed">{feature.description}</p>
              <ul className="space-y-2">
                {feature.features.map((item, idx) => (
                  <li key={idx} className="flex items-center text-white/60 text-sm">
                    <Star className="text-yellow-400 mr-2" size={14} fill="currentColor" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className={`text-center transition-all duration-1000 delay-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="card max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 shimmer"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to Make a Difference?
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Join our community of volunteers and help keep our roads safe for everyone.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/volunteer/login" className="btn-primary">
                  <Users className="inline-block mr-2" size={20} />
                  Become a Volunteer
                </Link>
                <Link href="/dashboard" className="btn-secondary">
                  <TrendingUp className="inline-block mr-2" size={20} />
                  View Impact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
