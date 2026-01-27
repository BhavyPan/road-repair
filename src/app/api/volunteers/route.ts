import { NextRequest, NextResponse } from 'next/server'
import { getVolunteers, saveVolunteer, findVolunteerByEmail, updateVolunteer, deleteVolunteer } from '../../../lib/database'
import { Volunteer } from '../../../types'

// GET /api/volunteers - Fetch all volunteers
export async function GET() {
  try {
    const volunteers = await getVolunteers()
    return NextResponse.json(volunteers)
  } catch (error) {
    console.error('Error fetching volunteers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch volunteers' },
      { status: 500 }
    )
  }
}

// POST /api/volunteers - Handle volunteer login/signup
export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/volunteers - Request received')
    const body = await request.json()
    console.log('Request body:', JSON.stringify(body, null, 2))
    
    const { action, email, password, name, phone, department } = body
    
    if (!action || !email) {
      return NextResponse.json(
        { error: 'Action and email are required' },
        { status: 400 }
      )
    }

    if (action === 'login') {
      // Handle volunteer login
      if (!password) {
        return NextResponse.json(
          { error: 'Password is required for login' },
          { status: 400 }
        )
      }

      const volunteer = await findVolunteerByEmail(email)
      if (!volunteer) {
        return NextResponse.json(
          { error: 'Volunteer not found' },
          { status: 404 }
        )
      }

      // Simple password check (in production, use hashed passwords)
      if (volunteer.password !== password) {
        return NextResponse.json(
          { error: 'Invalid password' },
          { status: 401 }
        )
      }

      // Return volunteer data without password
      const { password: _, ...volunteerData } = volunteer
      console.log('Volunteer logged in successfully:', volunteerData.email)
      return NextResponse.json(volunteerData)

    } else if (action === 'signup') {
      // Handle volunteer signup
      if (!name || !password) {
        return NextResponse.json(
          { error: 'Name and password are required for signup' },
          { status: 400 }
        )
      }

      // Check if volunteer already exists
      const existingVolunteer = await findVolunteerByEmail(email)
      if (existingVolunteer) {
        return NextResponse.json(
          { error: 'Volunteer with this email already exists' },
          { status: 409 }
        )
      }

      // Create new volunteer
      const newVolunteer: Volunteer = {
        id: Date.now().toString(),
        name,
        email,
        phone: phone || '',
        department: department || 'General',
        password, // In production, hash this password
        isActive: true,
        completedTasks: 0,
        createdAt: new Date()
      }

      const savedVolunteer = await saveVolunteer(newVolunteer)
      console.log('Volunteer signed up successfully:', savedVolunteer.email)

      // Return volunteer data without password
      const { password: _, ...volunteerData } = savedVolunteer
      return NextResponse.json(volunteerData, { status: 201 })

    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use "login" or "signup"' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error in volunteer operation:', error)
    return NextResponse.json(
      { error: 'Failed to process volunteer request: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}

// PATCH /api/volunteers - Update volunteer information
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body
    
    if (!id) {
      return NextResponse.json(
        { error: 'Volunteer ID is required' },
        { status: 400 }
      )
    }

    const updatedVolunteer = await updateVolunteer(id, updates)
    
    // Return volunteer data without password
    const { password: _, ...volunteerData } = updatedVolunteer
    return NextResponse.json(volunteerData)
  } catch (error) {
    console.error('Error updating volunteer:', error)
    if (error instanceof Error && error.message === 'Volunteer not found') {
      return NextResponse.json(
        { error: 'Volunteer not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update volunteer' },
      { status: 500 }
    )
  }
}

// DELETE /api/volunteers - Delete a volunteer
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Volunteer ID is required' },
        { status: 400 }
      )
    }

    await deleteVolunteer(id)
    
    return NextResponse.json({ success: true, message: 'Volunteer deleted successfully' })
  } catch (error) {
    console.error('Error deleting volunteer:', error)
    if (error instanceof Error && error.message === 'Volunteer not found') {
      return NextResponse.json(
        { error: 'Volunteer not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to delete volunteer' },
      { status: 500 }
    )
  }
}
