import { supabase } from './supabase'
import { RoadDamageReport, Volunteer } from '../types'

// Report operations
export async function getReports(): Promise<RoadDamageReport[]> {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('reportedAt', { ascending: false })

    if (error) {
      console.error('Error fetching reports:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error in getReports:', error)
    return []
  }
}

export async function saveReport(report: RoadDamageReport): Promise<RoadDamageReport> {
  try {
    const { data, error } = await supabase
      .from('reports')
      .insert([report])
      .select()

    if (error) {
      console.error('Error saving report:', error)
      throw error
    }

    console.log('Report saved successfully:', data?.[0]?.id)
    return data?.[0] || report
  } catch (error) {
    console.error('Error in saveReport:', error)
    throw error
  }
}

export async function updateReport(reportId: string, updates: Partial<RoadDamageReport>): Promise<RoadDamageReport> {
  try {
    const { data, error } = await supabase
      .from('reports')
      .update(updates)
      .eq('id', reportId)
      .select()

    if (error) {
      console.error('Error updating report:', error)
      throw error
    }

    if (!data || data.length === 0) {
      throw new Error('Report not found')
    }

    return data[0]
  } catch (error) {
    console.error('Error in updateReport:', error)
    throw error
  }
}

export async function deleteReport(reportId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', reportId)

    if (error) {
      console.error('Error deleting report:', error)
      throw error
    }

    return true
  } catch (error) {
    console.error('Error in deleteReport:', error)
    throw error
  }
}

// Volunteer operations
export async function getVolunteers(): Promise<Volunteer[]> {
  try {
    const { data, error } = await supabase
      .from('volunteers')
      .select('*')
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('Error fetching volunteers:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error in getVolunteers:', error)
    return []
  }
}

export async function saveVolunteer(volunteer: Volunteer): Promise<Volunteer> {
  try {
    const { data, error } = await supabase
      .from('volunteers')
      .insert([volunteer])
      .select()

    if (error) {
      console.error('Error saving volunteer:', error)
      throw error
    }

    console.log('Volunteer saved successfully:', data?.[0]?.id)
    return data?.[0] || volunteer
  } catch (error) {
    console.error('Error in saveVolunteer:', error)
    throw error
  }
}

export async function findVolunteerByEmail(email: string): Promise<Volunteer | null> {
  try {
    const { data, error } = await supabase
      .from('volunteers')
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null
      }
      console.error('Error finding volunteer by email:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error in findVolunteerByEmail:', error)
    return null
  }
}

export async function updateVolunteer(volunteerId: string, updates: Partial<Volunteer>): Promise<Volunteer> {
  try {
    const { data, error } = await supabase
      .from('volunteers')
      .update(updates)
      .eq('id', volunteerId)
      .select()

    if (error) {
      console.error('Error updating volunteer:', error)
      throw error
    }

    if (!data || data.length === 0) {
      throw new Error('Volunteer not found')
    }

    return data[0]
  } catch (error) {
    console.error('Error in updateVolunteer:', error)
    throw error
  }
}

export async function deleteVolunteer(volunteerId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('volunteers')
      .delete()
      .eq('id', volunteerId)

    if (error) {
      console.error('Error deleting volunteer:', error)
      throw error
    }

    return true
  } catch (error) {
    console.error('Error in deleteVolunteer:', error)
    throw error
  }
}

// Initialize database tables (run once)
export async function initializeDatabase() {
  try {
    console.log('Initializing Supabase database...')
    
    // Check if tables exist by trying to select from them
    const { error: reportsError } = await supabase.from('reports').select('id').limit(1)
    const { error: volunteersError } = await supabase.from('volunteers').select('id').limit(1)
    
    if (reportsError || volunteersError) {
      console.log('Tables may not exist. Please create them manually in Supabase dashboard.')
      console.log('Reports error:', reportsError?.message)
      console.log('Volunteers error:', volunteersError?.message)
    } else {
      console.log('Database tables are ready!')
    }
  } catch (error) {
    console.error('Error initializing database:', error)
  }
}
