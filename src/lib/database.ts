import fs from 'fs/promises'
import path from 'path'

// In-memory storage for Vercel serverless environment
let inMemoryReports: any[] = []
let inMemoryVolunteers: any[] = []
let isInitialized = false

// Database file paths
const DB_DIR = path.join(process.cwd(), 'data')
const REPORTS_FILE = path.join(DB_DIR, 'reports.json')
const VOLUNTEERS_FILE = path.join(DB_DIR, 'volunteers.json')

// Initialize database directory and files
async function initDatabase() {
  if (isInitialized) return
  
  try {
    // Check if we're in Vercel serverless environment
    if (process.env.VERCEL) {
      console.log('Running in Vercel environment, using in-memory storage')
      isInitialized = true
      return
    }
    
    await fs.mkdir(DB_DIR, { recursive: true })
    
    // Initialize reports file if it doesn't exist
    try {
      await fs.access(REPORTS_FILE)
      const data = await fs.readFile(REPORTS_FILE, 'utf-8')
      inMemoryReports = JSON.parse(data)
    } catch {
      await fs.writeFile(REPORTS_FILE, JSON.stringify([], null, 2))
      inMemoryReports = []
    }
    
    // Initialize volunteers file if it doesn't exist
    try {
      await fs.access(VOLUNTEERS_FILE)
      const data = await fs.readFile(VOLUNTEERS_FILE, 'utf-8')
      inMemoryVolunteers = JSON.parse(data)
    } catch {
      await fs.writeFile(VOLUNTEERS_FILE, JSON.stringify([], null, 2))
      inMemoryVolunteers = []
    }
    
    isInitialized = true
  } catch (error) {
    console.error('Error initializing database:', error)
    isInitialized = true // Don't retry
  }
}

// Report operations
export async function getReports(): Promise<any[]> {
  await initDatabase()
  return inMemoryReports
}

export async function saveReport(report: any): Promise<any> {
  await initDatabase()
  try {
    inMemoryReports.push(report)
    
    // Try to save to file system if not in Vercel
    if (!process.env.VERCEL) {
      await fs.writeFile(REPORTS_FILE, JSON.stringify(inMemoryReports, null, 2))
    }
    
    console.log('Report saved successfully (in-memory count:', inMemoryReports.length, ')')
    return report
  } catch (error) {
    console.error('Error saving report:', error)
    throw error
  }
}

export async function updateReport(reportId: string, updates: any): Promise<any> {
  await initDatabase()
  try {
    const index = inMemoryReports.findIndex(r => r.id === reportId)
    if (index === -1) {
      throw new Error('Report not found')
    }
    inMemoryReports[index] = { ...inMemoryReports[index], ...updates }
    
    // Try to save to file system if not in Vercel
    if (!process.env.VERCEL) {
      await fs.writeFile(REPORTS_FILE, JSON.stringify(inMemoryReports, null, 2))
    }
    
    return inMemoryReports[index]
  } catch (error) {
    console.error('Error updating report:', error)
    throw error
  }
}

// Volunteer operations
export async function getVolunteers(): Promise<any[]> {
  await initDatabase()
  return inMemoryVolunteers
}

export async function saveVolunteer(volunteer: any): Promise<any> {
  await initDatabase()
  try {
    inMemoryVolunteers.push(volunteer)
    
    // Try to save to file system if not in Vercel
    if (!process.env.VERCEL) {
      await fs.writeFile(VOLUNTEERS_FILE, JSON.stringify(inMemoryVolunteers, null, 2))
    }
    
    return volunteer
  } catch (error) {
    console.error('Error saving volunteer:', error)
    throw error
  }
}

export async function findVolunteerByEmail(email: string): Promise<any | null> {
  await initDatabase()
  try {
    return inMemoryVolunteers.find(v => v.email === email) || null
  } catch (error) {
    console.error('Error finding volunteer:', error)
    return null
  }
}

export async function updateVolunteer(volunteerId: string, updates: any): Promise<any> {
  await initDatabase()
  try {
    const index = inMemoryVolunteers.findIndex(v => v.id === volunteerId)
    if (index === -1) {
      throw new Error('Volunteer not found')
    }
    inMemoryVolunteers[index] = { ...inMemoryVolunteers[index], ...updates }
    
    // Try to save to file system if not in Vercel
    if (!process.env.VERCEL) {
      await fs.writeFile(VOLUNTEERS_FILE, JSON.stringify(inMemoryVolunteers, null, 2))
    }
    
    return inMemoryVolunteers[index]
  } catch (error) {
    console.error('Error updating volunteer:', error)
    throw error
  }
}

export async function deleteVolunteer(volunteerId: string): Promise<boolean> {
  await initDatabase()
  try {
    const index = inMemoryVolunteers.findIndex(v => v.id === volunteerId)
    if (index === -1) {
      throw new Error('Volunteer not found')
    }
    
    inMemoryVolunteers.splice(index, 1)
    
    // Try to save to file system if not in Vercel
    if (!process.env.VERCEL) {
      await fs.writeFile(VOLUNTEERS_FILE, JSON.stringify(inMemoryVolunteers, null, 2))
    }
    
    return true
  } catch (error) {
    console.error('Error deleting volunteer:', error)
    throw error
  }
}
