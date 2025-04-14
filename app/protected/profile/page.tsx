import { redirect } from 'next/navigation'
import { LogoutButton } from '@/components/logout-button'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft, User, Mail, Calendar, Clock, Key, RefreshCw } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ProfilePage() {
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
      
      <div className="max-w-4xl mx-auto relative z-10">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">Profile</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage your account settings</p>
          </div>
          <div className="flex gap-4">
            <Link 
              href="/protected" 
              className="inline-flex items-center justify-center rounded-md bg-gray-200 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-300"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
            <LogoutButton />
          </div>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/80 backdrop-blur-md overflow-hidden hover:shadow-2xl transition-shadow">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500"></div>
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mr-3">
                  <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <CardTitle className="text-xl">Account Information</CardTitle>
                  <CardDescription>Your personal account details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center p-3 bg-white/50 dark:bg-gray-700/30 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mr-3">
                  <Mail className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-base text-gray-900 dark:text-gray-100">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-white/50 dark:bg-gray-700/30 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mr-3">
                  <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Created</p>
                  <p className="text-base text-gray-900 dark:text-gray-100">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-white/50 dark:bg-gray-700/30 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mr-3">
                  <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Sign In</p>
                  <p className="text-base text-gray-900 dark:text-gray-100">
                    {new Date(user.last_sign_in_at || '').toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/80 backdrop-blur-md overflow-hidden hover:shadow-2xl transition-shadow">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"></div>
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mr-3">
                  <Key className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-xl">Account Actions</CardTitle>
                  <CardDescription>Manage your account settings</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link 
                href="/auth/update-password" 
                className="flex items-center justify-center w-full p-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-300"
              >
                <Key className="mr-2 h-4 w-4" />
                Change Password
              </Link>
              <Link 
                href="/auth/forgot-password" 
                className="flex items-center justify-center w-full p-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors duration-300"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset Password
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 