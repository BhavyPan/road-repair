import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('=== SIMPLE TEST ===')
    
    const body = await request.json()
    console.log('Received:', body)
    
    // Test basic Supabase connection
    const { supabase } = await import('../../../lib/supabase')
    
    // Create minimal report without aiAnalysis
    const minimalReport = {
      id: Date.now().toString(),
      type: body.type || 'pothole',
      description: body.description || 'Test',
      location: body.location || 'Test location',
      latitude: 0,
      longitude: 0,
      photos: [],
      priority: 'medium',
      status: 'reported',
      reportedBy: body.reportedBy || 'Test',
      reportedAt: new Date().toISOString(),
      beforePhotos: []
    }
    
    console.log('Minimal report:', minimalReport)
    
    const { data, error } = await supabase
      .from('reports')
      .insert([minimalReport])
      .select()
    
    console.log('Result:', { data, error })
    
    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error.details,
        code: error.code
      })
    }
    
    return NextResponse.json({
      success: true,
      data: data?.[0]
    })
    
  } catch (error) {
    console.error('Simple test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
