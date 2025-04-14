'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()

  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    
    // Clear any cached data
    window.localStorage.clear()
    window.sessionStorage.clear()
    
    // Force a hard navigation to the root page
    window.location.href = '/'
  }

  return <Button onClick={logout}>Logout</Button>
}
