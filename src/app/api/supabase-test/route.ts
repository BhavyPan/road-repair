import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

// GET /api/supabase-test - Test Supabase connection
export async function GET() {
  try {
    console.log('Testing Supabase connection...')
    
    // Test basic connection
    const { data, error } = await supabase
      .from('reports')
      .select('count')
      .limit(1)

    if (error) {
      console.error('Supabase connection error:', error)
      return NextResponse.json({
        connected: false,
        error: error.message,
        details: {
          code: error.code,
          hint: error.hint,
          details: error.details
        }
      })
    }

    console.log('Supabase connection successful!')
    return NextResponse.json({
      connected: true,
      message: 'Successfully connected to Supabase',
      testResult: data
    })

  } catch (error) {
    console.error('Supabase test failed:', error)
    return NextResponse.json({
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to connect to Supabase'
    })
  }
}

// POST /api/supabase-test - Test table creation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { operation } = body

    if (operation === 'checkTables') {
      // Check if tables exist
      const reportsCheck = await supabase.from('reports').select('id').limit(1)
      const volunteersCheck = await supabase.from('volunteers').select('id').limit(1)

      return NextResponse.json({
        tables: {
          reports: {
            exists: !reportsCheck.error,
            error: reportsCheck.error?.message || null
          },
          volunteers: {
            exists: !volunteersCheck.error,
            error: volunteersCheck.error?.message || null
          }
        }
      })
    }

    return NextResponse.json({ error: 'Invalid operation' }, { status: 400 })

  } catch (error) {
    console.error('Table check failed:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
