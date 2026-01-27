'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Camera,
  Upload,
  LogOut,
  TrendingUp,
  X,
  Shield,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { RoadDamageReport } from '../../../types'
import AnimatedLayout from '../../../components/AnimatedLayout'
import PhotoDisplay from '../../../components/PhotoDisplay'
import { convertToBase64 } from '../../../utils/photoUtils'
import { debugReportData, addTestReport } from '../../../utils/debugUtils'
import { reportsApi, sessionApi } from '@/lib/api'

export default function VolunteerDashboard() {
  const [reports, setReports] = useState<RoadDamageReport[]>([])
  const [selectedReport, setSelectedReport] = useState<RoadDamageReport | null>(null)
  const [filter, setFilter] = useState<'all' | 'solved' | 'unsolved'>('all')
  const [afterPhotos, setAfterPhotos] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentVolunteer, setCurrentVolunteer] = useState<any>(null)
  const router = useRouter()

  // Load reports from database
  const loadReports = async () => {
    try {
      console.log('Volunteer Dashboard: Loading reports from database...')
      const reportsData = await reportsApi.getAll()
      console.log('Volunteer Dashboard: Reports loaded:', reportsData.length, reportsData)
      // Convert date strings back to Date objects
      const reportsWithDates = reportsData.map((report: any) => ({
        ...report,
        reportedAt: new Date(report.reportedAt),
        completedAt: report.completedAt ? new Date(report.completedAt) : undefined
      }))
      setReports(reportsWithDates)
      
      // Debug: Log report data
      debugReportData(reportsWithDates, 'Volunteer Dashboard Load Reports')
    } catch (error) {
      console.error('Error loading reports:', error)
      setReports([])
    }
  }

  useEffect(() => {
    const initializeDashboard = async () => {
      setIsLoaded(true)

      // Load current volunteer
      const volunteer = sessionApi.getCurrentVolunteer()
      if (!volunteer) {
        router.push('/volunteer/login')
        return
      }
      setCurrentVolunteer(volunteer)

      await loadReports()
    }
    
    initializeDashboard()
    
    const handleStorageChange = () => {
      loadReports()
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('focus', loadReports) // Refresh when window gains focus
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('focus', loadReports)
    }
  }, [router])

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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAfterPhotos(prev => [...prev, ...files].slice(0, 5)) // Limit to 5 photos
  }

  const removePhoto = (index: number) => {
    setAfterPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const handleCompleteReport = async (reportId: string) => {
    setIsUploading(true)
    
    try {
      // Convert after photos to base64
      console.log('Converting', afterPhotos.length, 'after photos to base64...')
      const base64AfterPhotos = await Promise.all(afterPhotos.map(convertToBase64))
      console.log('After photos converted successfully')
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Update report in database
      const updatedReport = await reportsApi.update(reportId, {
        status: 'completed',
        completedAt: new Date().toISOString(),
        afterPhotos: base64AfterPhotos
      })
      
      console.log('Report updated in database:', updatedReport)
      
      // Update local state
      setReports(prev => prev.map(report => 
        report.id === reportId 
          ? { ...report, status: 'completed', completedAt: new Date() }
          : report
      ))
      
      // Reset form
      setSelectedReport(null)
      setAfterPhotos([])
      setIsUploading(false)
    } catch (error) {
      console.error('Error completing report:', error)
      setIsUploading(false)
    }
  }

  const handleLogout = () => {
    sessionApi.clearCurrentVolunteer()
    router.push('/volunteer/login')
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
            <div className={`flex items-center space-x-4 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="text-white/80">
                Welcome, <span className="font-semibold text-white">{currentVolunteer?.name || 'Volunteer'}</span>
              </div>
              <button
                onClick={() => {
                  debugReportData(reports, 'Volunteer Dashboard Manual Debug')
                  addTestReport()
                  setTimeout(() => loadReports(), 100)
                }}
                className="text-xs text-white/60 hover:text-white px-2 py-1 border border-white/20 rounded"
              >
                Debug
              </button>
              <Link href="/" className="btn-secondary flex items-center">
                <ArrowLeft className="mr-2" size={20} />
                Back to Home
              </Link>
              <button
                onClick={handleLogout}
                className="btn-secondary flex items-center"
              >
                <LogOut className="mr-2" size={20} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-5xl font-bold text-white mb-6 gradient-text">
            Volunteer Dashboard
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Manage and track road damage reports in your community
          </p>
        </div>

        {/* Filter Buttons */}
        <div className={`text-center mb-8 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className={`card text-center hover-lift transition-all duration-1000 delay-900 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <AlertTriangle className="text-white" size={36} />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">{filteredReports.length}</h3>
            <p className="text-white/80">Total Reports</p>
          </div>

          <div className={`card text-center hover-lift transition-all duration-1000 delay-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Clock className="text-white" size={36} />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">{filteredReports.filter(r => r.status !== 'completed').length}</h3>
            <p className="text-white/80">In Progress</p>
          </div>

          <div className={`card text-center hover-lift transition-all duration-1000 delay-1100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle className="text-white" size={36} />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">{filteredReports.filter(r => r.status === 'completed').length}</h3>
            <p className="text-white/80">Completed</p>
          </div>
        </div>

        {/* Reports List */}
        <div className={`transition-all duration-1000 delay-1200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {filteredReports.length === 0 ? (
            <div className="card text-center py-12">
              <CheckCircle className="mx-auto text-white/60 mb-4" size={64} />
              <h3 className="text-2xl font-bold text-white mb-2">No Reports Found</h3>
              <p className="text-white/80">
                {filter === 'solved' ? 'No solved reports yet' :
                 filter === 'unsolved' ? 'No unsolved reports! Great work!' :
                 'No reports have been submitted yet'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredReports.map((report, index) => {
                console.log('Volunteer Dashboard - Report:', report.id, {
                  beforePhotos: report.beforePhotos?.length || 0,
                  afterPhotos: report.afterPhotos?.length || 0,
                  location: report.location,
                  type: report.type
                })
                
                return (
                  <div key={report.id} className="card hover-lift">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{report.type}</h3>
                      <p className="text-white/80 flex items-center mb-2">
                        <MapPin className="mr-2" size={16} />
                        {report.location}
                      </p>
                      <p className="text-white/60 text-sm mb-3">
                        Reported: {new Date(report.reportedAt).toLocaleDateString()}
                        {report.completedAt && ` • Completed: ${new Date(report.completedAt).toLocaleDateString()}`}
                      </p>
                      
                      {/* Map Location */}
                      {(report.latitude && report.longitude) && (
                        <div className="mb-4">
                          <div className="w-full h-32 rounded-lg overflow-hidden border border-white/20">
                            <iframe
                              src={`https://www.openstreetmap.org/export/embed.html?bbox=${report.longitude - 0.005},${report.latitude - 0.005},${report.longitude + 0.005},${report.latitude + 0.005}&layer=mapnik&marker=${report.latitude},${report.longitude}`}
                              className="w-full h-full border-0"
                              loading="lazy"
                            />
                          </div>
                          <button
                            onClick={() => window.open(`https://www.google.com/maps?q=${report.latitude},${report.longitude}`, '_blank')}
                            className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center"
                          >
                            <MapPin className="mr-2" size={14} />
                            View in Google Maps
                          </button>
                        </div>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      report.status === 'completed' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' :
                      report.status === 'in_progress' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white' :
                      'bg-gradient-to-r from-gray-500 to-slate-500 text-white'
                    }`}>
                      {report.status === 'completed' ? '✅ Fixed' : 
                       report.status === 'in_progress' ? '🔧 In Progress' : 
                       '📋 Reported'}
                    </span>
                  </div>

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

                  {report.status !== 'completed' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedReport(report)}
                        className="btn-primary flex-1"
                      >
                        Mark as Complete
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            const updatedReport = await reportsApi.update(report.id, {
                              status: 'in_progress'
                            })
                            
                            // Update local state
                            setReports(prev => prev.map(r => 
                              r.id === report.id 
                                ? { ...r, status: 'in_progress' as const }
                                : r
                            ))
                          } catch (error) {
                            console.error('Error updating report status:', error)
                          }
                        }}
                        className="btn-secondary flex-1"
                      >
                        In Progress
                      </button>
                    </div>
                  )}
                </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      {/* Completion Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Complete Report</h2>
              <button
                onClick={() => {
                  setSelectedReport(null)
                  setAfterPhotos([])
                }}
                className="text-white/60 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">{selectedReport.type}</h3>
              <p className="text-white/80">{selectedReport.location}</p>
            </div>

            <div className="mb-6">
              <h4 className="text-white font-medium mb-3">Upload After Photos:</h4>
              <div className="border-2 border-dashed border-white/30 rounded-2xl p-6 text-center hover:border-white/50 transition-colors">
                <input
                  type="file"
                  id="after-photos"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <label htmlFor="after-photos" className="cursor-pointer">
                  <Upload className="mx-auto text-white/60 mb-3" size={32} />
                  <p className="text-white font-semibold mb-1">Click to upload photos</p>
                  <p className="text-white/60 text-sm">PNG, JPG, GIF up to 10MB each (Max 5 photos)</p>
                </label>
              </div>
              
              {afterPhotos.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {afterPhotos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`After ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border-2 border-white/20"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedReport(null)
                  setAfterPhotos([])
                }}
                className="btn-secondary flex-1"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                onClick={() => handleCompleteReport(selectedReport.id)}
                className="btn-primary flex-1"
                disabled={isUploading || afterPhotos.length === 0}
              >
                {isUploading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Completing...
                  </div>
                ) : (
                  'Complete Report'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AnimatedLayout>
  )
}
