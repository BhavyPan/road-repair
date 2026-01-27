// API service functions to replace localStorage calls

const API_BASE = '/api'

// Reports API
export const reportsApi = {
  // Get all reports
  async getAll(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE}/reports`)
      if (!response.ok) {
        throw new Error('Failed to fetch reports')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching reports:', error)
      return []
    }
  },

  // Create a new report
  async create(reportData: any): Promise<any> {
    try {
      console.log('API: Creating report with data:', reportData)
      const response = await fetch(`${API_BASE}/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      })
      
      console.log('API: Response status:', response.status)
      console.log('API: Response ok:', response.ok)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API: Error response:', errorText)
        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { error: errorText }
        }
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }
      
      const result = await response.json()
      console.log('API: Success response:', result)
      return result
    } catch (error) {
      console.error('API: Error creating report:', error)
      throw error
    }
  },

  // Update a report
  async update(reportId: string, updates: any): Promise<any> {
    try {
      const response = await fetch(`${API_BASE}/reports`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: reportId, ...updates }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update report')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error updating report:', error)
      throw error
    }
  }
}

// Volunteers API
export const volunteersApi = {
  // Get all volunteers
  async getAll(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE}/volunteers`)
      if (!response.ok) {
        throw new Error('Failed to fetch volunteers')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching volunteers:', error)
      return []
    }
  },

  // Login volunteer
  async login(email: string, password: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE}/volunteers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, action: 'login' }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Login failed')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error logging in volunteer:', error)
      throw error
    }
  },

  // Sign up volunteer
  async signup(volunteerData: any): Promise<any> {
    try {
      const response = await fetch(`${API_BASE}/volunteers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...volunteerData, action: 'signup' }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Signup failed')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error signing up volunteer:', error)
      throw error
    }
  }
}

// Session management
export const sessionApi = {
  // Store current volunteer in localStorage (for session management)
  setCurrentVolunteer(volunteer: any) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentVolunteer', JSON.stringify(volunteer))
    }
  },

  // Get current volunteer from localStorage
  getCurrentVolunteer(): any | null {
    if (typeof window !== 'undefined') {
      const volunteer = localStorage.getItem('currentVolunteer')
      return volunteer ? JSON.parse(volunteer) : null
    }
    return null
  },

  // Clear current volunteer session
  clearCurrentVolunteer() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentVolunteer')
    }
  }
}
