import { createClient } from '@/lib/supabase/server'
import { validateMagicLink } from '@/lib/magic-link'
import { redirect } from 'next/navigation'

// Define the page component
export default async function MagicLinkPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  // Await the params to get the token
  const { token } = await params
  const supabase = await createClient()
  
  // Validate the magic link
  const magicLinkData = await validateMagicLink(token)
  
  if (!magicLinkData) {
    // If the link is invalid or expired, redirect to login
    redirect('/login?error=invalid_link')
  }

  // Sign in the user using the magic link token
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: magicLinkData.userId,
    password: token, // Using the token as a one-time password
  })

  if (signInError) {
    redirect('/login?error=auth_failed')
  }

  // Redirect to the appropriate form based on formType
  const redirectPath = magicLinkData.formType === 'questions' 
    ? '/protected/questions'
    : '/protected/suggestions'

  redirect(redirectPath)
} 