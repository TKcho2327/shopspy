import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gvyycqxsezrzktfjzmsj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2eXljcXhzZXpyemt0ZmpqbXNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyMTY2MDQsImV4cCI6MjA2Mzc5MjYwNH0.saRIwpGk8e23YGJC41kKvmbYldYkUbcISMrR-jqYl7w'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)