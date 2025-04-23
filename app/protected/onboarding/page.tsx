import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { LogoutButton } from '@/components/logout-button'

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-purple-50 to-white dark:from-gray-900 dark:via-indigo-950 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-2xl mx-auto relative z-10">
        <div className="flex justify-end mb-4">
          <LogoutButton />
        </div>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 md:p-8 shadow-xl">
          <div className="text-center space-y-6">
            <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              Welcome to Note That Down!
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Before you get started, we need to set up your profile. This will help us personalize your experience.
            </p>
            <div className="pt-4">
              <Link href="/protected/onboarding/form">
                <Button size="lg" className="w-full md:w-auto">
                  Start Onboarding
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 