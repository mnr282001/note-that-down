'use client'

import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface MagicLinkButtonProps {
  email: string
}

export function MagicLinkButton({ email }: MagicLinkButtonProps) {
  const handleMagicLinkToQuestions = async () => {
    if (!email) {
      alert('No email address found')
      return
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_URL}/protected/questions`,
        },
      })
      
      if (error) throw error
      alert('Check your email for the magic link!')
    } catch (error) {
      console.error("Error sending magic link:", error)
      alert(`Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`)
    }
  }

  return (
    <Button
      onClick={handleMagicLinkToQuestions}
      className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-300"
    >
      <Mail className="mr-2 h-4 w-4" />
      Get Magic Link
    </Button>
  )
} 