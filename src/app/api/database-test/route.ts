import { NextRequest, NextResponse } from 'next/server'
import { getReports, getVolunteers, saveReport, saveVolunteer } from '../../../lib/database'

// GET /api/database-test - Test database operations
export async function GET() {
  try {
    console.log('Testing database operations...')
    
    // Test getting all data
    const reports = await getReports()
    const volunteers = await getVolunteers()
    
    const testResults = {
      timestamp: new Date().toISOString(),
      databaseStatus: 'Connected',
      reportsCount: reports.length,
      volunteersCount: volunteers.length,
      reports: reports.map(r => ({
        id: r.id,
        type: r.type,
        status: r.status,
        reportedAt: r.reportedAt
      })),
      volunteers: volunteers.map(v => ({
        id: v.id,
        name: v.name,
        email: v.email,
        department: v.department,
        isActive: v.isActive
      }))
    }
    
    console.log('Database test completed:', testResults)
    return NextResponse.json(testResults)
    
  } catch (error) {
    console.error('Database test failed:', error)
    return NextResponse.json(
      { 
        error: 'Database test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// POST /api/database-test - Test saving data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { operation, data } = body
    
    let result
    
    switch (operation) {
      case 'saveReport':
        const testReport = {
          id: Date.now().toString(),
          type: data.type || 'pothole',
          description: data.description || 'Test report description',
          location: data.location || 'Test Location',
          latitude: data.latitude || 12.9716,
          longitude: data.longitude || 77.5946,
          photos: data.photos || [],
          priority: data.priority || 'medium',
          status: 'reported',
          reportedBy: data.reportedBy || 'Test User',
          reportedAt: new Date(),
          beforePhotos: data.photos || [],
          aiAnalysis: {
            detectedDamage: [data.type || 'pothole'],
            confidence: 0.85,
            recommendedDepartment: 'Public Works'
          }
        }
        result = await saveReport(testReport)
        break
        
      case 'saveVolunteer':
        const testVolunteer = {
          id: Date.now().toString(),
          name: data.name || 'Test Volunteer',
          email: data.email || `test${Date.now()}@example.com`,
          phone: data.phone || '+91 98765 43210',
          department: data.department || 'Test Department',
          password: data.password || 'test123',
          isActive: true,
          completedTasks: 0,
          createdAt: new Date()
        }
        result = await saveVolunteer(testVolunteer)
        break
        
      default:
        return NextResponse.json(
          { error: 'Invalid operation. Use "saveReport" or "saveVolunteer"' },
          { status: 400 }
        )
    }
    
    console.log('Test save operation completed:', operation, result)
    return NextResponse.json({
      success: true,
      operation,
      result,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Test save operation failed:', error)
    return NextResponse.json(
      { 
        error: 'Test save operation failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
