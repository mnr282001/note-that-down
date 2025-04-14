import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LogoutButton } from '@/components/logout-button'
import Link from 'next/link'
import { ArrowRight, HelpCircle, Lightbulb, User, Clock, Activity } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ProtectedPage() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-purple-50 to-white dark:from-gray-900 dark:via-indigo-950 dark:to-gray-800 p-4 md:p-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-10 w-40 h-40 bg-blue-400 dark:bg-blue-600 rounded-full opacity-20 blur-3xl animate-blob"></div>
        <div className="absolute top-3/4 -right-10 w-60 h-60 bg-purple-400 dark:bg-purple-600 rounded-full opacity-20 blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-indigo-400 dark:bg-indigo-600 rounded-full opacity-20 blur-3xl animate-blob animation-delay-2000"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">Note That Down</h1>
            <p className="text-gray-600 dark:text-gray-300">Welcome back, {user.email}</p>
          </div>
          <LogoutButton />
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/80 backdrop-blur-md overflow-hidden hover:shadow-2xl transition-shadow">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500"></div>
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mr-3">
                  <HelpCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <CardTitle className="text-xl">Questions</CardTitle>
                  <CardDescription>Manage your questions and answers</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link 
                href="/protected/questions" 
                className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-300"
              >
                View Questions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/80 backdrop-blur-md overflow-hidden hover:shadow-2xl transition-shadow">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"></div>
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mr-3">
                  <Lightbulb className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-xl">Suggestions</CardTitle>
                  <CardDescription>Browse and manage suggestions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link 
                href="/protected/suggestions" 
                className="inline-flex items-center justify-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-300"
              >
                View Suggestions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/80 backdrop-blur-md overflow-hidden hover:shadow-2xl transition-shadow">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500"></div>
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-3">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-xl">Profile</CardTitle>
                  <CardDescription>Manage your account settings</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link 
                href="/protected/profile" 
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300"
              >
                View Profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-600 dark:text-indigo-400 flex items-center">
            <Activity className="h-6 w-6 mr-2" />
            Recent Activity
          </h2>
          <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/80 backdrop-blur-md overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600"></div>
            <CardContent className="p-6">
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Clock className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-300">No recent activity to display.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
