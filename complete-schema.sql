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

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_volunteers_updated_at BEFORE UPDATE ON volunteers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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
