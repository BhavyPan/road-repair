import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('=== DEBUG: Report Submission ===')
    
    const body = await request.json()
    console.log('Received data:', JSON.stringify(body, null, 2))
    
    // Test basic Supabase connection
    const { supabase } = await import('../../../lib/supabase')
    
    // Test if we can read from reports table
    console.log('Testing read access...')
    const { data: readData, error: readError } = await supabase
      .from('reports')
      .select('id')
      .limit(1)
    
    console.log('Read test:', { readData, readError })
    
    // Create a minimal test report
    const testReport = {
      id: Date.now().toString(),
      type: body.type || 'pothole',
      description: body.description || 'Test description',
      location: body.location || 'Test location',
      latitude: body.latitude || 12.9716,
      longitude: body.longitude || 77.5946,
      photos: body.photos || [],
      priority: body.priority || 'medium',
      status: 'reported',
      reportedBy: body.reportedBy || 'Debug User',
      reportedAt: new Date().toISOString(),
      beforePhotos: body.photos || [],
      aiAnalysis: {
        detectedDamage: [body.type || 'pothole'],
        confidence: 0.85,
        recommendedDepartment: 'Public Works'
      }
    }
    
    console.log('Test report:', JSON.stringify(testReport, null, 2))
    
    // Try to insert
    console.log('Testing insert...')
    const { data: insertData, error: insertError } = await supabase
      .from('reports')
      .insert([testReport])
      .select()
    
    console.log('Insert result:', { insertData, insertError })
    
    if (insertError) {
      console.error('Insert error details:', {
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
        code: insertError.code
      })
      
      return NextResponse.json({
        success: false,
        error: insertError.message,
        details: insertError.details,
        code: insertError.code,
        testReport
      })
    }
    
    console.log('Success! Report created:', insertData?.[0]?.id)
    
    return NextResponse.json({
      success: true,
      message: 'Report created successfully',
      data: insertData?.[0],
      testReport
    })
    
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
