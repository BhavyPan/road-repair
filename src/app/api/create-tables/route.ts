import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

// SQL to create tables
const createTablesSQL = `
-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('pothole', 'crack', 'tree_fall', 'debris', 'flood_damage', 'other')),
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  photos TEXT[] DEFAULT '{}',
  priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')) DEFAULT 'medium',
  status TEXT NOT NULL CHECK (status IN ('reported', 'in_progress', 'completed')) DEFAULT 'reported',
  reportedBy TEXT NOT NULL,
  reportedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  assignedTo TEXT,
  completedAt TIMESTAMP WITH TIME ZONE,
  beforePhotos TEXT[] DEFAULT '{}',
  afterPhotos TEXT[] DEFAULT '{}',
  aiAnalysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create volunteers table
CREATE TABLE IF NOT EXISTS volunteers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  department TEXT NOT NULL,
  password TEXT NOT NULL,
  isActive BOOLEAN DEFAULT true,
  completedTasks INTEGER DEFAULT 0,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_priority ON reports(priority);
CREATE INDEX IF NOT EXISTS idx_reports_reportedAt ON reports(reportedAt);
CREATE INDEX IF NOT EXISTS idx_volunteers_email ON volunteers(email);
CREATE INDEX IF NOT EXISTS idx_volunteers_isActive ON volunteers(isActive);

-- Enable Row Level Security (RLS)
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;

-- Create policies for reports table
CREATE POLICY "Allow anonymous users to read reports" ON reports
    FOR SELECT USING (true);

CREATE POLICY "Allow anonymous users to insert reports" ON reports
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow service role to update reports" ON reports
    FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role to delete reports" ON reports
    FOR DELETE USING (auth.role() = 'service_role');

-- Create policies for volunteers table
CREATE POLICY "Allow service role full access to volunteers" ON volunteers
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow volunteers to read their own data" ON volunteers
    FOR SELECT USING (auth.uid()::text = id);
`

// POST /api/create-tables - Create database tables
export async function POST() {
  try {
    console.log('Creating Supabase tables...')
    
    // Execute the SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql: createTablesSQL })
    
    if (error) {
      console.error('Error creating tables:', error)
      
      // Try alternative approach - create tables one by one
      const results = []
      
      // Create reports table
      const reportsResult = await supabase
        .from('reports')
        .select('id')
        .limit(1)
      
      if (reportsResult.error && reportsResult.error.code === 'PGRST116') {
        // Table doesn't exist, try to create it
        const createReportsSQL = createTablesSQL.split('-- Create volunteers table')[0]
        console.log('Creating reports table...')
        results.push({ table: 'reports', status: 'attempted' })
      }
      
      // Create volunteers table
      const volunteersResult = await supabase
        .from('volunteers')
        .select('id')
        .limit(1)
      
      if (volunteersResult.error && volunteersResult.error.code === 'PGRST116') {
        // Table doesn't exist
        console.log('Creating volunteers table...')
        results.push({ table: 'volunteers', status: 'attempted' })
      }
      
      return NextResponse.json({
        success: false,
        error: error.message,
        message: 'Please run the SQL manually in Supabase dashboard',
        results,
        sql: createTablesSQL
      })
    }
    
    console.log('Tables created successfully!')
    return NextResponse.json({
      success: true,
      message: 'Database tables created successfully!',
      data
    })
    
  } catch (error) {
    console.error('Error creating tables:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to create tables. Please run SQL manually.',
      sql: createTablesSQL
    }, { status: 500 })
  }
}

// GET /api/create-tables - Check if tables exist
export async function GET() {
  try {
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
      },
      message: !reportsCheck.error && !volunteersCheck.error 
        ? 'All tables exist and are ready!' 
        : 'Some tables are missing. Use POST to create them.'
    })
    
  } catch (error) {
    console.error('Error checking tables:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
