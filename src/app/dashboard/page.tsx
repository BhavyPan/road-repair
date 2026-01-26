'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Users,
  MapPin,
  BarChart3,
  Shield,
  ArrowLeft,
  Camera
} from 'lucide-react'
import Link from 'next/link'
import { mockReports, getMockStats } from '../../lib/data'
import { RoadDamageReport } from '../../types'
import AnimatedLayout from '../../components/AnimatedLayout'
import PhotoDisplay from '../../components/PhotoDisplay'
import { reportsApi } from '../../lib/api'

export default function PublicDashboard() {
  const [reports, setReports] = useState<RoadDamageReport[]>([])
  const [stats, setStats] = useState(getMockStats())
  const [filter, setFilter] = useState<'all' | 'solved' | 'unsolved'>('all')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
    const loadReports = async () => {
      try {
        console.log('Dashboard: Loading reports from database...')
        const reportsData = await reportsApi.getAll()
        console.log('Dashboard: Reports loaded:', reportsData.length, reportsData)
        // Convert date strings back to Date objects
        const reportsWithDates = reportsData.map((report: any) => ({
          ...report,
          reportedAt: new Date(report.reportedAt),
          completedAt: report.completedAt ? new Date(report.completedAt) : undefined
        }))
        setReports(reportsWithDates)
        
        // Update stats based on real data
        const realStats = calculateStats(reportsWithDates)
        setStats(realStats)
        console.log('Dashboard: Stats updated:', realStats)
      } catch (error) {
        console.error('Error loading reports:', error)
        setReports([])
      }
    }

    loadReports()
    
    // Listen for window focus to refresh data
    const handleFocus = () => {
      loadReports()
    }
    
    window.addEventListener('focus', handleFocus)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  const calculateStats = (reportsData: RoadDamageReport[]) => {
    const total = reportsData.length
    const completed = reportsData.filter(r => r.status === 'completed').length
    const inProgress = reportsData.filter(r => r.status === 'in_progress').length
    const reported = reportsData.filter(r => r.status === 'reported').length
    const highPriority = reportsData.filter(r => r.priority === 'high').length
    const mediumPriority = reportsData.filter(r => r.priority === 'medium').length
    const lowPriority = reportsData.filter(r => r.priority === 'low').length

    return {
      total,
      completed,
      inProgress,
      reported,
      highPriority,
      mediumPriority,
      lowPriority
    }
  }

  // Filter reports based on selected filter
  const getFilteredReports = () => {
    switch (filter) {
      case 'solved':
        return reports.filter(report => report.status === 'completed')
      case 'unsolved':
        return reports.filter(report => report.status !== 'completed')
      default:
        return reports
    }
  }

  const filteredReports = getFilteredReports()
  const displayReports = filteredReports.slice(-5).reverse() // Show last 5 filtered reports

  const solvedReports = reports.filter(report => report.status === 'completed')
  const unsolvedReports = reports.filter(report => report.status !== 'completed')

  const completionRate = reports.length > 0 ? Math.round((solvedReports.length / reports.length) * 100) : 0

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
            <div className={`flex items-center space-x-4 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <Link href="/" className="btn-secondary flex items-center">
                <ArrowLeft className="mr-2" size={20} />
                Back to Home
              </Link>
              <Link href="/report" className="btn-primary">
                Report Damage
              </Link>
              <Link href="/volunteer/login" className="btn-secondary">
                Volunteer Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Buttons */}
        <div className={`text-center mb-8 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              All Problems
            </button>
            <button
              onClick={() => setFilter('unsolved')}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                filter === 'unsolved'
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              Unsolved
            </button>
            <button
              onClick={() => setFilter('solved')}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                filter === 'solved'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                  : 'text-white hover:bg-white/20'
              }`}
            >
              Solved
            </button>
          </div>
          <p className="text-white/80 mt-3">
            Showing {filter === 'all' ? 'all' : filter} problems ({filteredReports.length} total)
          </p>
        </div>

        <div className={`text-center mb-12 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-5xl font-bold text-white mb-6 gradient-text">
            Community Progress Dashboard
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Track the impact of community reporting and volunteer efforts in keeping our roads safe
          </p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className={`card text-center hover-lift transition-all duration-1000 delay-900 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <AlertTriangle className="text-white" size={36} />
            </div>
            <h3 className="text-4xl font-bold text-white mb-2">{reports.length}</h3>
            <p className="text-white/80">Total Reports</p>
          </div>

          <div className={`card text-center hover-lift transition-all duration-1000 delay-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle className="text-white" size={36} />
            </div>
            <h3 className="text-4xl font-bold text-white mb-2">{solvedReports.length}</h3>
            <p className="text-white/80">Fixed Issues</p>
          </div>

          <div className={`card text-center hover-lift transition-all duration-1000 delay-1100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Clock className="text-white" size={36} />
            </div>
            <h3 className="text-4xl font-bold text-white mb-2">{unsolvedReports.length}</h3>
            <p className="text-white/80">In Progress</p>
          </div>

          <div className={`card text-center hover-lift transition-all duration-1000 delay-1200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <TrendingUp className="text-white" size={36} />
            </div>
            <h3 className="text-4xl font-bold text-white mb-2">{completionRate}%</h3>
            <p className="text-white/80">Completion Rate</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={`card mb-12 transition-all duration-1000 delay-1300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-2xl font-bold mb-6 text-white">Overall Progress</h2>
          <div className="relative">
            <div className="bg-white/10 rounded-full h-12 overflow-hidden backdrop-blur-sm">
              <div
                style={{ width: `${completionRate}%` }}
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 h-full rounded-full flex items-center justify-center transition-all duration-1000 shimmer"
              >
                <span className="text-white font-bold text-lg">{completionRate}% Complete</span>
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-6 text-sm text-white/80">
            <span>{solvedReports.length} Completed</span>
            <span>{unsolvedReports.length} In Progress</span>
            <span>{reports.filter(r => r.status === 'reported').length} Pending</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Priority Breakdown */}
          <div className={`card transition-all duration-1000 delay-1400 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <h2 className="text-2xl font-bold mb-6 flex items-center text-white">
              <BarChart3 className="mr-3" size={28} />
              Priority Breakdown
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mr-4 shadow-lg"></div>
                  <span className="font-medium text-white text-lg">High Priority</span>
                </div>
                <span className="text-3xl font-bold text-white">{reports.filter(r => r.priority === 'high').length}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mr-4 shadow-lg"></div>
                  <span className="font-medium text-white text-lg">Medium Priority</span>
                </div>
                <span className="text-3xl font-bold text-white">{reports.filter(r => r.priority === 'medium').length}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mr-4 shadow-lg"></div>
                  <span className="font-medium text-white text-lg">Low Priority</span>
                </div>
                <span className="text-3xl font-bold text-white">{reports.filter(r => r.priority === 'low').length}</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className={`card transition-all duration-1000 delay-1500 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <h2 className="text-2xl font-bold mb-6 flex items-center text-white">
              <Clock className="mr-3" size={28} />
              {filter === 'all' ? 'Recent Activity' : 
               filter === 'solved' ? 'Solved Problems' : 
               'Unsolved Problems'} ({displayReports.length})
            </h2>
            {displayReports.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="mx-auto text-white/60 mb-4" size={64} />
                <p className="text-white/80 text-lg">
                  {filter === 'solved' ? 'No solved problems yet' :
                   filter === 'unsolved' ? 'No unsolved problems! Great work!' :
                   'No reports yet'}
                </p>
              </div>
            ) : (
              <div className="space-y-6 max-h-96 overflow-y-auto">
                {displayReports.map((report, index) => (
                  <div key={report.id} className="border border-white/20 rounded-xl p-6 hover:bg-white/5 transition-all duration-300 hover-lift">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-white text-xl mb-2">{report.type}</h4>
                        <p className="text-white/80 flex items-center mb-2">
                          <MapPin className="mr-2" size={16} />
                          {report.location.address}
                        </p>
                        <p className="text-white/60 text-sm mb-3">
                          Coordinates: {report.location.latitude.toFixed(4)}, {report.location.longitude.toFixed(4)}
                        </p>
                        
                        {/* Before Photos */}
                        <PhotoDisplay 
                          photos={report.beforePhotos || []} 
                          title="Before Photos" 
                          icon="camera" 
                        />
                        
                        {/* After Photos */}
                        <PhotoDisplay 
                          photos={report.afterPhotos || []} 
                          title="After Photos" 
                          icon="check" 
                        />
                        {(report.location.latitude && report.location.longitude) && (
                          <div className="mb-3">
                            <div className="w-full h-32 rounded-lg overflow-hidden border border-white/20">
                              <iframe
                                src={`https://www.openstreetmap.org/export/embed.html?bbox=${report.location.longitude - 0.005},${report.location.latitude - 0.005},${report.location.longitude + 0.005},${report.location.latitude + 0.005}&layer=mapnik&marker=${report.location.latitude},${report.location.longitude}`}
                                className="w-full h-full border-0"
                                loading="lazy"
                              />
                            </div>
                            <button
                              onClick={() => window.open(`https://www.google.com/maps?q=${report.location.latitude},${report.location.longitude}`, '_blank')}
                              className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center"
                            >
                              <MapPin className="mr-2" size={14} />
                              View in Google Maps
                            </button>
                          </div>
                        )}
                        <p className="text-white/60 text-sm">
                          Reported: {new Date(report.reportedAt).toLocaleDateString()}
                          {report.completedAt && ` • Completed: ${new Date(report.completedAt).toLocaleDateString()}`}
                        </p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ml-4 ${
                        report.status === 'completed' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' :
                        report.status === 'in_progress' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' :
                        'bg-gradient-to-r from-gray-500 to-slate-500 text-white'
                      }`}>
                        {report.status === 'completed' ? '✅ Fixed' : 
                         report.status === 'in_progress' ? '🔧 In Progress' : 
                         '📋 Reported'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </AnimatedLayout>
  )
}
