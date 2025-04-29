import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SuggestionsFormWrapper from './suggestions-form-wrapper'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function SuggestionsPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/')
  }

  // Pass any server data to the client component if needed
  // For example, you could fetch user profile data here
  
  return <SuggestionsFormWrapper />
}