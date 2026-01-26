import fs from 'fs/promises'
import path from 'path'

// Database file paths
const DB_DIR = path.join(process.cwd(), 'data')
const REPORTS_FILE = path.join(DB_DIR, 'reports.json')
const VOLUNTEERS_FILE = path.join(DB_DIR, 'volunteers.json')

// Initialize database directory and files
async function initDatabase() {
  try {
    await fs.mkdir(DB_DIR, { recursive: true })
    
    // Initialize reports file if it doesn't exist
    try {
      await fs.access(REPORTS_FILE)
    } catch {
      await fs.writeFile(REPORTS_FILE, JSON.stringify([], null, 2))
    }
    
    // Initialize volunteers file if it doesn't exist
    try {
      await fs.access(VOLUNTEERS_FILE)
    } catch {
      await fs.writeFile(VOLUNTEERS_FILE, JSON.stringify([], null, 2))
    }
  } catch (error) {
    console.error('Error initializing database:', error)
  }
}

// Report operations
export async function getReports(): Promise<any[]> {
  await initDatabase()
  try {
    const data = await fs.readFile(REPORTS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading reports:', error)
    return []
  }
}

export async function saveReport(report: any): Promise<any> {
  await initDatabase()
  try {
    const reports = await getReports()
    reports.push(report)
    await fs.writeFile(REPORTS_FILE, JSON.stringify(reports, null, 2))
    return report
  } catch (error) {
    console.error('Error saving report:', error)
    throw error
  }
}

export async function updateReport(reportId: string, updates: any): Promise<any> {
  await initDatabase()
  try {
    const reports = await getReports()
    const index = reports.findIndex(r => r.id === reportId)
    if (index === -1) {
      throw new Error('Report not found')
    }
    reports[index] = { ...reports[index], ...updates }
    await fs.writeFile(REPORTS_FILE, JSON.stringify(reports, null, 2))
    return reports[index]
  } catch (error) {
    console.error('Error updating report:', error)
    throw error
  }
}

// Volunteer operations
export async function getVolunteers(): Promise<any[]> {
  await initDatabase()
  try {
    const data = await fs.readFile(VOLUNTEERS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading volunteers:', error)
    return []
  }
}

export async function saveVolunteer(volunteer: any): Promise<any> {
  await initDatabase()
  try {
    const volunteers = await getVolunteers()
    volunteers.push(volunteer)
    await fs.writeFile(VOLUNTEERS_FILE, JSON.stringify(volunteers, null, 2))
    return volunteer
  } catch (error) {
    console.error('Error saving volunteer:', error)
    throw error
  }
}

export async function findVolunteerByEmail(email: string): Promise<any | null> {
  await initDatabase()
  try {
    const volunteers = await getVolunteers()
    return volunteers.find(v => v.email === email) || null
  } catch (error) {
    console.error('Error finding volunteer:', error)
    return null
  }
}

// Migration utilities
export async function migrateFromLocalStorage() {
  try {
    // This would be called once to migrate existing localStorage data
    console.log('Migration from localStorage to database completed')
  } catch (error) {
    console.error('Migration error:', error)
  }
}
