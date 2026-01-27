import { RoadDamageReport, Volunteer, ReportStats } from '../types'

// Mock data for development
export const mockReports: RoadDamageReport[] = [
  {
    id: '1',
    type: 'pothole',
    description: 'Large pothole on main street causing traffic issues',
    location: '123 Main Street, Bangalore',
    latitude: 12.9716,
    longitude: 77.5946,
    photos: ['/api/placeholder/400/300'],
    priority: 'high',
    status: 'reported',
    reportedBy: 'John Doe',
    reportedAt: new Date('2024-01-15T10:30:00'),
    beforePhotos: ['/api/placeholder/400/300'],
    aiAnalysis: {
      detectedDamage: ['pothole', 'asphalt_damage'],
      confidence: 0.92,
      recommendedDepartment: 'Public Works'
    }
  },
  {
    id: '2',
    type: 'crack',
    description: 'Multiple cracks on the highway shoulder',
    location: 'Highway 42, Bangalore',
    latitude: 12.9726,
    longitude: 77.5956,
    photos: ['/api/placeholder/400/300'],
    priority: 'medium',
    status: 'in_progress',
    reportedBy: 'Jane Smith',
    reportedAt: new Date('2024-01-14T14:20:00'),
    assignedTo: 'volunteer1',
    beforePhotos: ['/api/placeholder/400/300'],
    aiAnalysis: {
      detectedDamage: ['surface_crack', 'structural_damage'],
      confidence: 0.87,
      recommendedDepartment: 'Road Maintenance'
    }
  },
  {
    id: '3',
    type: 'tree_fall',
    description: 'Tree fell blocking the road after storm',
    location: 'Park Road, Bangalore',
    latitude: 12.9736,
    longitude: 77.5966,
    photos: ['/api/placeholder/400/300'],
    priority: 'high',
    status: 'completed',
    reportedBy: 'Mike Johnson',
    reportedAt: new Date('2024-01-13T09:15:00'),
    assignedTo: 'volunteer2',
    completedAt: new Date('2024-01-13T16:30:00'),
    beforePhotos: ['/api/placeholder/400/300'],
    afterPhotos: ['/api/placeholder/400/300'],
    aiAnalysis: {
      detectedDamage: ['fallen_tree', 'road_blockage'],
      confidence: 0.95,
      recommendedDepartment: 'Emergency Services'
    }
  }
]

export const mockVolunteers: Volunteer[] = [
  {
    id: 'volunteer1',
    name: 'Alice Wilson',
    email: 'alice@example.com',
    phone: '+91 98765 43210',
    department: 'Public Works',
    isActive: true,
    completedTasks: 15
  },
  {
    id: 'volunteer2',
    name: 'Bob Brown',
    email: 'bob@example.com',
    phone: '+91 98765 43211',
    department: 'Emergency Services',
    isActive: true,
    completedTasks: 23
  }
]

export const getMockStats = (): ReportStats => {
  const total = mockReports.length
  const completed = mockReports.filter(r => r.status === 'completed').length
  const inProgress = mockReports.filter(r => r.status === 'in_progress').length
  const reported = mockReports.filter(r => r.status === 'reported').length
  const highPriority = mockReports.filter(r => r.priority === 'high').length
  const mediumPriority = mockReports.filter(r => r.priority === 'medium').length
  const lowPriority = mockReports.filter(r => r.priority === 'low').length

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
