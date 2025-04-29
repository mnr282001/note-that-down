import { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft, Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Session } from '@supabase/supabase-js'

interface FormLayoutProps {
  title: string
  showSuggestionsLink?: boolean
  children: ReactNode
  session: Session | null
}

export function FormLayout({ title, showSuggestionsLink = false, children, session }: FormLayoutProps) {
  const router = useRouter()

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Session Expired
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Please log in again to continue.
          </p>
          <Button
            onClick={() => router.push('/')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Go to Login
          </Button>
        </div>
      </div>
    )
  } else {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-purple-50 to-white dark:from-gray-900 dark:via-indigo-950 dark:to-gray-800 p-4 md:p-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-10 w-40 h-40 bg-blue-400 dark:bg-blue-600 rounded-full opacity-20 blur-3xl animate-blob"></div>
        <div className="absolute top-3/4 -right-10 w-60 h-60 bg-purple-400 dark:bg-purple-600 rounded-full opacity-20 blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-indigo-400 dark:bg-indigo-600 rounded-full opacity-20 blur-3xl animate-blob animation-delay-2000"></div>
      </div>
      
      <div className="max-w-2xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-6">
          <Link 
            href="/protected" 
            className="inline-flex items-center justify-center rounded-md bg-gray-200 dark:bg-gray-700 px-3 py-1.5 text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Link>
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{title}</h1>
          {showSuggestionsLink ? (
            <Link
              href="/protected/suggestions"
              className="inline-flex items-center text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 text-sm"
            >
              <Lightbulb className="h-4 w-4 mr-1" />
              Suggest Improvements
            </Link>
          ) : (
            <div className="w-[140px]"></div>
          )}
        </div>
        
        {children}
      </div>
    </div>
  )
} 
}