import { supabase } from './supabase'

// Report operations
export async function getReports(): Promise<any[]> {
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

export async function saveReport(report: any): Promise<any> {
  try {
    const { data, error } = await supabase
      .from('reports')
      .insert([report])
      .select()
      .single()
    
    if (error) {
      console.error('Error saving report:', error)
      throw error
    }
    
    console.log('Report saved to Supabase:', data.id)
    return data
  } catch (error) {
    console.error('Error in saveReport:', error)
    throw error
  }
}

export async function updateReport(reportId: string, updates: any): Promise<any> {
  try {
    const { data, error } = await supabase
      .from('reports')
      .update(updates)
      .eq('id', reportId)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating report:', error)
      throw error
    }
    
    return data
  } catch (error) {
    console.error('Error in updateReport:', error)
    throw error
  }
}

// Volunteer operations
export async function getVolunteers(): Promise<any[]> {
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

export async function saveVolunteer(volunteer: any): Promise<any> {
  try {
    const { data, error } = await supabase
      .from('volunteers')
      .insert([volunteer])
      .select()
      .single()
    
    if (error) {
      console.error('Error saving volunteer:', error)
      throw error
    }
    
    return data
  } catch (error) {
    console.error('Error in saveVolunteer:', error)
    throw error
  }
}

export async function findVolunteerByEmail(email: string): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .from('volunteers')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error finding volunteer:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Error in findVolunteerByEmail:', error)
    return null
  }
}

export async function updateVolunteer(volunteerId: string, updates: any): Promise<any> {
  try {
    const { data, error } = await supabase
      .from('volunteers')
      .update(updates)
      .eq('id', volunteerId)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating volunteer:', error)
      throw error
    }
    
    return data
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
