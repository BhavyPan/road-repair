import { NextRequest, NextResponse } from 'next/server'
import { initializeDatabase } from '../../../lib/database-supabase'

// GET /api/database-setup - Initialize database tables
export async function GET() {
  try {
    console.log('Setting up Supabase database...')
    
    await initializeDatabase()
    
    return NextResponse.json({
      success: true,
      message: 'Database setup completed. Please run the SQL schema in your Supabase dashboard.',
      instructions: [
        '1. Go to your Supabase dashboard',
        '2. Navigate to SQL Editor',
        '3. Copy and run the contents of database-schema.sql',
        '4. This will create the reports and volunteers tables'
      ]
    })
  } catch (error) {
    console.error('Database setup failed:', error)
    return NextResponse.json(
      { 
        error: 'Database setup failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
