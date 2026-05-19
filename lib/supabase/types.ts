// lib/supabase/types.ts
export interface Instrument {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  image_url: string | null
  color_accent: string
  created_at: string
}

export interface Teacher {
  id: string
  name: string
  instrument_slug: string
  bio: string
  specialty: string
  experience_years: number
  image_url: string | null
  email: string | null
  is_active: boolean
  created_at: string
}

export interface Course {
  id: string
  instrument_id: string
  teacher_id: string | null
  name: string
  level: 'beginner' | 'intermediate' | 'advanced'
  description: string
  duration_weeks: number
  price: number
  schedule_days: string
  max_students: number
  current_students: number
  is_active: boolean
  created_at: string
  instruments?: Instrument
  teachers?: Teacher
}

export interface Schedule {
  id: string
  course_id: string
  day_of_week: string
  start_time: string
  end_time: string
  available_spots: number
  created_at: string
}

export interface Testimonial {
  id: string
  student_name: string
  instrument_slug: string | null
  rating: number
  comment: string
  avatar_url: string | null
  is_approved: boolean
  created_at: string
}

export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  instrument_interest: string
  preferred_schedule: string
  message: string
  source: string
  status: string
  created_at: string
}

export interface SiteStat {
  id: string
  stat_key: string
  stat_value: number
  label: string
  updated_at: string
}
