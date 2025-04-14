import { headers } from 'next/headers'
import { LoginForm } from '@/components/login-form'
import { SignUpForm } from '@/components/sign-up-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { EmailSubscriptionForm } from '@/components/email-subscription-form'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const headersList = await headers()
  const host = headersList.get('host') || ''
  const isLocalhost = host.includes('localhost:3000')
  
  // Check if user is already logged in
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // If user is logged in, redirect to dashboard
  if (user) {
    redirect('/protected')
  }

  // Determine which tab to show based on URL query parameter
  const defaultTab = params.tab === 'signup' ? 'signup' : 'login'

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-100 via-purple-50 to-white dark:from-gray-900 dark:via-indigo-950 dark:to-gray-800 p-3 md:p-6 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-10 w-40 h-40 bg-blue-400 dark:bg-blue-600 rounded-full opacity-20 blur-3xl animate-blob"></div>
        <div className="absolute top-3/4 -right-10 w-60 h-60 bg-purple-400 dark:bg-purple-600 rounded-full opacity-20 blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-indigo-400 dark:bg-indigo-600 rounded-full opacity-20 blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      {/* Confetti animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 left-1/4 w-2 h-2 bg-pink-500 rounded-full animate-confetti [animation-delay:0.0s]" />
        <div className="absolute -top-4 left-1/3 w-2 h-2 bg-yellow-500 rounded-full animate-confetti [animation-delay:0.2s]" />
        <div className="absolute -top-4 left-1/2 w-3 h-3 bg-green-500 rounded-full animate-confetti [animation-delay:0.4s]" />
        <div className="absolute -top-4 left-2/3 w-2 h-2 bg-blue-500 rounded-full animate-confetti [animation-delay:0.6s]" />
        <div className="absolute -top-4 left-3/4 w-2 h-2 bg-purple-500 rounded-full animate-confetti [animation-delay:0.8s]" />
        <div className="absolute -top-4 right-1/4 w-3 h-3 bg-red-500 rounded-full animate-confetti [animation-delay:1.0s]" />
        <div className="absolute -top-4 right-1/3 w-2 h-2 bg-indigo-500 rounded-full animate-confetti [animation-delay:1.2s]" />
        <div className="absolute -top-4 right-1/2 w-2 h-2 bg-orange-500 rounded-full animate-confetti [animation-delay:1.4s]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        <div className="text-center mb-4 md:mb-6">
          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Launching Soon</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400 mt-1">
            Note That Down
          </h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mt-1">
            Elevate your standups. Capture your progress. Organize your workflow.
          </p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 md:p-6 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Features Section - Left Column */}
            <div className="md:col-span-2">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                How Note That Down Transforms Your Workday
              </h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm">Save 30+ Minutes</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">No more scrambling</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm">AI-Powered Insights</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Personalized prep</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 rounded-full bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm">Improved Focus</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Track priorities</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm">Career Growth</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Document achievements</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center mt-4">
                Note That Down is revolutionizing how professionals prepare for standups and track their daily progress.
              </p>
            </div>

            {/* Form Section - Right Column */}
            <div className="md:col-span-1">
              {/* Email subscription form - always visible */}
              <div className="mb-6">
                <EmailSubscriptionForm />
              </div>
              
              {/* Login/Signup forms - only on localhost */}
              {isLocalhost && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Developer Access</h3>
                  <Tabs defaultValue={defaultTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="login" className="text-sm">Login</TabsTrigger>
                      <TabsTrigger value="signup" className="text-sm">Sign Up</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                      <LoginForm />
                    </TabsContent>
                    <TabsContent value="signup">
                      <SignUpForm />
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
