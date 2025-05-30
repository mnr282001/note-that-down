import Link from 'next/link'
import { ArrowRight, HelpCircle, Lightbulb, User, Clock, Activity } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LogoutButton } from '@/components/logout-button'
import { MagicLinkButton } from '@/components/magic-link-button'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ProtectedPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    redirect('/')
  }  console.log("SUPABASE USER", user);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
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
      
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400">Note That Down</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Welcome back, {user?.email}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            {user?.email && <MagicLinkButton email={user.email} />}
            <Link
              href="/protected/profile"
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-3 sm:px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-300"
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
            <LogoutButton />
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Link href="/protected/questions" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="p-2 sm:p-3 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                  <HelpCircle className="h-5 sm:h-6 w-5 sm:w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">Questions</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Manage your questions</p>
                </div>
              </div>
              <div className="mt-3 sm:mt-4 flex items-center text-indigo-600 dark:text-indigo-400">
                <span className="text-sm font-medium">View Questions</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          <Link href="/protected/suggestions" className="group">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="p-2 sm:p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Lightbulb className="h-5 sm:h-6 w-5 sm:w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">Suggestions</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Share your ideas</p>
                </div>
              </div>
              <div className="mt-3 sm:mt-4 flex items-center text-purple-600 dark:text-purple-400">
                <span className="text-sm font-medium">View Suggestions</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Clock className="h-5 sm:h-6 w-5 sm:w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">Activity</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Track your progress</p>
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <Activity className="h-6 sm:h-8 w-6 sm:w-8 text-gray-400 dark:text-gray-600" />
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">No recent activity</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
