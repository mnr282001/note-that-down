import { redirect } from 'next/navigation'
import { LogoutButton } from '@/components/logout-button'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ProtectedPage() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">Note That Down</h1>
            <p className="text-gray-600 dark:text-gray-300">Welcome back, {user.email}</p>
          </div>
          <LogoutButton />
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle>Questions</CardTitle>
              <CardDescription>Manage your questions and answers</CardDescription>
            </CardHeader>
            <CardContent>
              <Link 
                href="/protected/questions" 
                className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                View Questions
              </Link>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle>Suggestions</CardTitle>
              <CardDescription>Browse and manage suggestions</CardDescription>
            </CardHeader>
            <CardContent>
              <Link 
                href="/protected/suggestions" 
                className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                View Suggestions
              </Link>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Link 
                href="/protected/profile" 
                className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                View Profile
              </Link>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Recent Activity</h2>
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <p className="text-gray-600 dark:text-gray-300">No recent activity to display.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
