export interface RoadDamageReport {
  id: string
  type: 'pothole' | 'crack' | 'tree_fall' | 'debris' | 'flood_damage' | 'other'
  description: string
  location: {
    latitude: number
    longitude: number
    address: string
  }
  photos: string[]
  priority: 'high' | 'medium' | 'low'
  status: 'reported' | 'in_progress' | 'completed'
  reportedBy: string
  reportedAt: Date
  assignedTo?: string
  completedAt?: Date
  beforePhotos: string[]
  afterPhotos?: string[]
  aiAnalysis?: {
    detectedDamage: string[]
    confidence: number
    recommendedDepartment: string
  }
}

export interface Volunteer {
  id: string
  name: string
  email: string
  phone: string
  department: string
  isActive: boolean
  completedTasks: number
}

export interface ReportStats {
  total: number
  completed: number
  inProgress: number
  reported: number
  highPriority: number
  mediumPriority: number
  lowPriority: number
}
