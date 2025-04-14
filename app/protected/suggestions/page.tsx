import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Lightbulb, Send } from 'lucide-react'
import Link from 'next/link'

export default async function SuggestionsPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-purple-50 to-white dark:from-gray-900 dark:via-indigo-950 dark:to-gray-800 p-4 md:p-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-10 w-40 h-40 bg-blue-400 dark:bg-blue-600 rounded-full opacity-20 blur-3xl animate-blob"></div>
        <div className="absolute top-3/4 -right-10 w-60 h-60 bg-purple-400 dark:bg-purple-600 rounded-full opacity-20 blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-indigo-400 dark:bg-indigo-600 rounded-full opacity-20 blur-3xl animate-blob animation-delay-2000"></div>
      </div>
      
      <div className="max-w-2xl mx-auto relative z-10">
        <div className="flex items-center mb-6">
          <Link 
            href="/protected" 
            className="inline-flex items-center justify-center rounded-md bg-gray-200 dark:bg-gray-700 px-3 py-1.5 text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-4"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Link>
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Submit Suggestions</h1>
        </div>
        
        <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/80 backdrop-blur-md overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500"></div>
          <CardHeader className="pb-2 px-4 md:px-6">
            <CardTitle className="text-2xl md:text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Your Ideas Matter
            </CardTitle>
            <CardDescription className="text-center text-sm md:text-base">
              Help us improve by sharing your suggestions
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 px-4 md:px-6">
            <form className="space-y-6">
              <div className="space-y-2">
                <Label className="text-indigo-700 dark:text-indigo-300 flex items-center">
                  <Lightbulb className="h-4 w-4 mr-1 text-indigo-500 dark:text-indigo-400" />
                  Your Suggestions
                </Label>
                <Textarea
                  name="suggestions"
                  className="bg-white/60 dark:bg-gray-800/60 border border-indigo-100 dark:border-indigo-800/30 focus:ring-2 focus:ring-indigo-500"
                  rows={6}
                  placeholder="Please share your suggestions for improvement..."
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-indigo-700 dark:text-indigo-300">Category</Label>
                <Select>
                  <SelectTrigger className="bg-white/60 dark:bg-gray-800/60 border border-indigo-100 dark:border-indigo-800/30 focus:ring-2 focus:ring-indigo-500">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="feature">Feature Request</SelectItem>
                    <SelectItem value="improvement">Improvement</SelectItem>
                    <SelectItem value="bug">Bug Report</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors duration-300 inline-flex items-center justify-center"
              >
                Submit Suggestion
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 