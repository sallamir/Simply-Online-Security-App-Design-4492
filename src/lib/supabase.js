import { createClient } from '@supabase/supabase-js'

// Updated with secure environment variables approach
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://ezddhpptywphszvxnmto.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6ZGRocHB0eXdwaHN6dnhubXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMjEwMjIsImV4cCI6MjA2Njg5NzAyMn0.a8DCZIXhs-Ye3EMBGNrNyNMWpvZm7RfumtGtoE80qrA'

if (SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  throw new Error('Missing Supabase variables');
}

export default createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})