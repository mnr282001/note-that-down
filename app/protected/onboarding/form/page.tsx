import { createClient } from '@/lib/supabase/server'
import { OnboardingForm } from '@/components/onboarding-form'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <div>Please log in to access this page</div>
  } else {
    console.log("SUPABASE USER", user.email);
  }

  return (
    <div className="container mx-auto py-8">
      <OnboardingForm />
    </div>
  )
} 