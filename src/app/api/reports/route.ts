import { NextRequest, NextResponse } from 'next/server'
import { getReports, saveReport, updateReport } from '../../../lib/database'
import { RoadDamageReport } from '../../../types'

// GET /api/reports - Fetch all reports
export async function GET() {
  try {
    const reports = await getReports()
    return NextResponse.json(reports)
  } catch (error) {
    console.error('Error fetching reports:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    )
  }
}

// POST /api/reports - Create a new report
export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/reports - Request received')
    const body = await request.json()
    console.log('Request body:', JSON.stringify(body, null, 2))
    
    // Validate required fields
    if (!body.type || !body.description || !body.location) {
      console.log('Validation failed - missing fields:', { type: !!body.type, description: !!body.description, location: !!body.location })
      return NextResponse.json(
        { error: 'Missing required fields: type, description, location' },
        { status: 400 }
      )
    }
    
    console.log('Validation passed, creating report...')
    const newReport: RoadDamageReport = {
      id: Date.now().toString(),
      type: body.type,
      description: body.description,
      location: body.location,
      latitude: body.latitude || 0,
      longitude: body.longitude || 0,
      photos: body.photos || [],
      priority: body.priority || 'medium',
      status: 'reported',
      reportedBy: body.reportedBy || 'Anonymous',
      reportedAt: new Date(),
      beforePhotos: body.photos || [],
      aiAnalysis: body.aiAnalysis || {
        detectedDamage: [body.type],
        confidence: 0.85,
        recommendedDepartment: 'Public Works'
      }
    }

    console.log('Saving report to database...')
    const savedReport = await saveReport(newReport)
    console.log('Report saved successfully:', savedReport.id)
    
    return NextResponse.json(savedReport, { status: 201 })
  } catch (error) {
    console.error('Error creating report:', error)
    return NextResponse.json(
      { error: 'Failed to create report: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}

// PATCH /api/reports - Update an existing report
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body
    
    if (!id) {
      return NextResponse.json(
        { error: 'Report ID is required' },
        { status: 400 }
      )
    }
    
    const updatedReport = await updateReport(id, updates)
    
    return NextResponse.json(updatedReport)
  } catch (error) {
    console.error('Error updating report:', error)
    if (error instanceof Error && error.message === 'Report not found') {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update report' },
      { status: 500 }
    )
  }
}
