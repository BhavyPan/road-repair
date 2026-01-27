import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('=== MINIMAL TEST ===')
    
    const body = await request.json()
    console.log('Received:', body)
    
    // Test basic Supabase connection
    const { supabase } = await import('../../../lib/supabase')
    
    // Create report with only essential fields that definitely exist
    const basicReport = {
      id: Date.now().toString(),
      type: 'pothole',
      description: 'Test report',
      location: 'Test location',
      status: 'reported',
      reportedBy: 'Test User'
    }
    
    console.log('Basic report:', basicReport)
    
    const { data, error } = await supabase
      .from('reports')
      .insert([basicReport])
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
      message: 'Report created successfully!',
      data: data?.[0]
    })
    
  } catch (error) {
    console.error('Minimal test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
