'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Lightbulb, Send, ThumbsUp } from 'lucide-react'
import { Session } from '@supabase/supabase-js'
import { FormLayout } from '@/components/ui/form-layout'

export default function SuggestionsForm() {
  const [suggestion, setSuggestion] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [session, setSession] = useState<Session | null>(null)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const router = useRouter()

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
    }
    getSession()
  }, [supabase.auth])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    if (!suggestion.trim()) {
      alert('Please enter a suggestion before submitting.')
      setIsSubmitting(false)
      return
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('User not authenticated')
      
      const { error } = await supabase
        .from('suggestions')
        .insert({
          user_id: user.id,
          suggestion: suggestion
        })
      
      if (error) throw error
      
      setSubmitted(true)
      setTimeout(() => {
        router.push('/protected')
      }, 3000)
    } catch (error: unknown) {
      console.error('Submission error:', error)
      if (error instanceof Error) {
        alert(`Error submitting suggestion: ${error.message}`)
      } else {
        alert('An unknown error occurred while submitting your suggestion')
      }
      setIsSubmitting(false)
    }
  }

  return (
    <FormLayout title="Improvement Suggestions" session={session}>
      <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/80 backdrop-blur-md overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500"></div>
        
        {submitted ? (
          <CardHeader className="pb-2 px-4 md:px-6">
            <div className="flex items-center justify-center mb-2">
              <ThumbsUp className="h-16 w-16 text-green-500 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Thank You!</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Your suggestion has been submitted successfully. We&apos;ll use it to improve future standup summaries.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Redirecting you back to the dashboard...
            </p>
          </CardHeader>
        ) : (
          <>
            <CardHeader className="pb-2 px-4 md:px-6">
              <div className="flex items-center justify-center mb-2">
                <Lightbulb className="h-6 w-6 text-amber-500 dark:text-amber-400 mr-2" />
                <CardTitle className="text-2xl md:text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                  Suggest Improvements
                </CardTitle>
              </div>
              <CardDescription className="text-center text-sm md:text-base">
                Help us make your standup summaries more useful
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6 px-4 md:px-6">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label className="text-indigo-700 dark:text-indigo-300">
                    How can we improve the standup summary emails?
                  </Label>
                  <Textarea
                    value={suggestion}
                    onChange={(e) => setSuggestion(e.target.value)}
                    className="bg-white/60 dark:bg-gray-800/60 border border-indigo-100 dark:border-indigo-800/30 focus:ring-2 focus:ring-indigo-500"
                    rows={6}
                    placeholder="Share your ideas for making the standup summaries more effective. For example: 'Include more code context', 'Summarize blockers across the team', 'Link to JIRA tickets', etc."
                  />
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors duration-300 inline-flex items-center justify-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>Processing...</>
                    ) : (
                      <>
                        Submit Suggestion
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="text-sm text-gray-500 dark:text-gray-400 pt-2">
                  <p>
                    Your feedback helps our AI improve future standup summaries. Each suggestion is reviewed and may be incorporated into the email generation process.
                  </p>
                </div>
              </form>
            </CardContent>
          </>
        )}
      </Card>
    </FormLayout>
  )
}