// lib/api.ts
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '{{SUPABASE_URL}}'
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '{{SUPABASE_ANON_KEY}}'

export interface ScheduleData {
  profile_id: string
  schedule_date: string
  start_time: string
  end_time: string
}

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  success: boolean
}

export async function insertUserSchedules(schedules: ScheduleData[]): Promise<ApiResponse<any>> {
  try {
    console.log('🚀 Making POST request to Supabase...')
    console.log('📍 URL:', `${SUPABASE_URL}/rest/v1/profile_schedules`)
    console.log('📦 Request Body:', JSON.stringify(schedules, null, 2))
    console.log('🔑 Using API Key:', SUPABASE_ANON_KEY.substring(0, 20) + '...')
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/profile_schedules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(schedules)
    })

    console.log('📡 Response Status:', response.status)
    console.log('📡 Response Headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorData = await response.json()
      console.error('❌ API Error Response:', errorData)
      throw new Error(errorData.message || 'Failed to insert schedules')
    }

    const responseData = await response.json()
    console.log('✅ Success Response:', responseData)

    return {
      data: responseData,
      error: null,
      success: true
    }
  } catch (error) {
    console.error('💥 Error inserting schedules:', error)
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      success: false
    }
  }
}
