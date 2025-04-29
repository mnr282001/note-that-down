'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import { Session } from '@supabase/supabase-js'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, CalendarDays, CheckCircle, Clock, File, HelpCircle, Lightbulb, Send, ThumbsUp } from 'lucide-react'
import Link from 'next/link'

interface Question {
  id: string
  text: string
  type: 'text' | 'number' | 'select' | 'multiselect'
  options?: string[]
  placeholder?: string
  required?: boolean
}

const standupQuestions: Question[] = [
  {
    id: 'accomplished',
    text: 'What did you accomplish today?',
    type: 'text',
    placeholder: 'Describe the tasks you completed today...',
    required: true
  },
  {
    id: 'working_on',
    text: 'What are you planning to work on next?',
    type: 'text',
    placeholder: 'Describe your upcoming tasks or focus areas...',
    required: true
  },
  {
    id: 'blockers',
    text: 'Are you facing any obstacles or blockers?',
    type: 'text',
    placeholder: 'Describe any issues preventing you from making progress...',
    required: false
  },
  {
    id: 'time_spent',
    text: 'How many hours did you work on your main task today?',
    type: 'number',
    placeholder: 'Enter hours',
    required: false
  },
  {
    id: 'task_status',
    text: 'What\'s the status of your current primary task?',
    type: 'select',
    options: ['Not Started', 'In Progress', 'Blocked', 'Ready for Review', 'Completed'],
    required: true
  },
  {
    id: 'need_help',
    text: 'Do you need help from any team members?',
    type: 'text',
    placeholder: 'Mention specific team members and topics you need assistance with...',
    required: false
  },
  {
    id: 'additional_notes',
    text: 'Any additional notes for the team?',
    type: 'text',
    placeholder: 'Share any other information that might be relevant...',
    required: false
  }
]

export default function QuestionsForm() {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [session, setSession] = useState<Session | null>(null)
  const [submitted, setSubmitted] = useState(false)
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

  const handleChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const handleMultiSelectChange = (questionId: string, value: string) => {
    const currentSelected = selectedOptions[questionId] || []
    let newSelected: string[]
    
    if (currentSelected.includes(value)) {
      newSelected = currentSelected.filter(item => item !== value)
    } else {
      newSelected = [...currentSelected, value]
    }
    
    setSelectedOptions(prev => ({ ...prev, [questionId]: newSelected }))
    setAnswers(prev => ({ ...prev, [questionId]: newSelected }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Validate required fields
    const requiredQuestions = standupQuestions.filter(q => q.required)
    const missingRequired = requiredQuestions.some(q => 
      !answers[q.id] || 
      (Array.isArray(answers[q.id]) && (answers[q.id] as string[]).length === 0) ||
      (typeof answers[q.id] === 'string' && (answers[q.id] as string).trim() === '')
    )
    
    if (missingRequired) {
      alert('Please fill out all required fields.')
      setIsSubmitting(false)
      return
    }
    
    try {
      if (!session) {
        console.error('No active session')
        return
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError) {
        console.error('User error:', userError)
        throw userError
      }
      
      if (!user) {
        console.error('No user found')
        return
      }
      
      const currentDate = new Date().toISOString()
      
      // Transform answers to include question text
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => {
        const question = standupQuestions.find(q => q.id === questionId)
        return {
          questionId,
          questionText: question?.text || '',
          answer: answer
        }
      })
      
      const { error: insertError } = await supabase
        .from('standup_entries')
        .insert({
          user_id: user.id,
          answers: formattedAnswers,
          created_at: currentDate
        })
      
      if (insertError) {
        console.error('Insert error:', insertError)
        throw insertError
      }
      
      setSubmitted(true)
      setTimeout(() => {
        router.push('/protected')
      }, 3000)
    } catch (error: unknown) {
      console.error('Submission error:', error)
      if (error instanceof Error && (error.message.includes('cookie') || error.message.includes('auth'))) {
        console.error('Authentication error:', error)
      } else {
        alert(`Error submitting standup notes: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Format today's date
  const today = new Date()
  const formattedDate = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  // Add a check for session at the start of the component
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
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-purple-50 to-white dark:from-gray-900 dark:via-indigo-950 dark:to-gray-800 p-4 md:p-8">
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="flex items-center mb-6">
            <Link 
              href="/protected" 
              className="inline-flex items-center justify-center rounded-md bg-gray-200 dark:bg-gray-700 px-3 py-1.5 text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 mr-4"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back
            </Link>
            <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Daily Standup Notes</h1>
            <Link
              href="/protected/suggestions"
              className="ml-auto text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 text-sm flex items-center"
            >
              <Lightbulb className="h-4 w-4 mr-1" />
              Suggest Improvements
            </Link>
          </div>
          
          <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/80 backdrop-blur-md overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500"></div>
            <div className="py-16 px-6 text-center">
              <div className="flex justify-center mb-4">
                <ThumbsUp className="h-16 w-16 text-green-500 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Thank You!</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Your standup notes have been submitted successfully. An email summary will be generated shortly.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Redirecting you back to the dashboard...
              </p>
            </div>
          </Card>
        </div>
      </div>
    )
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
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Daily Standup Notes</h1>
          <Link
            href="/protected/suggestions"
            className="ml-auto text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 text-sm flex items-center"
          >
            <Lightbulb className="h-4 w-4 mr-1" />
            Suggest Improvements
          </Link>
        </div>
        
        <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/80 backdrop-blur-md overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500"></div>
          
          <CardHeader className="pb-2 px-4 md:px-6">
            <div className="flex items-center justify-center mb-2">
              <CalendarDays className="h-6 w-6 text-indigo-500 dark:text-indigo-400 mr-2" />
              <CardTitle className="text-2xl md:text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                Daily Standup
              </CardTitle>
            </div>
            
            <div className="text-center mb-2">
              <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 text-sm font-medium">
                <Clock className="h-3.5 w-3.5 mr-1" />
                {formattedDate}
              </div>
            </div>
            
            <CardDescription className="text-center text-sm md:text-base px-6">
              Share your daily updates to keep the team informed about your progress, 
              plans, and any challenges you&apos;re facing. Your responses will be used to 
              generate a comprehensive standup summary email.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 px-4 md:px-6 pt-2">
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 rounded-lg px-4 py-3 text-sm text-blue-700 dark:text-blue-300">
              <p className="flex items-start">
                <HelpCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-blue-500 dark:text-blue-400" />
                <span>
                  <strong>What is a standup?</strong> A standup is a brief daily meeting for software teams to 
                  synchronize activities and discuss progress. This form collects the three key components: 
                  what you accomplished, what you&apos;re working on next, and any blockers you&apos;re facing.
                </span>
              </p>
            </div>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              {standupQuestions.map((question) => (
                <div key={question.id} className="space-y-2">
                  <Label className="text-indigo-700 dark:text-indigo-300 flex items-center">
                    {question.required ? (
                      <CheckCircle className="h-4 w-4 mr-1 text-indigo-500 dark:text-indigo-400" />
                    ) : (
                      <File className="h-4 w-4 mr-1 text-indigo-500 dark:text-indigo-400" />
                    )}
                    {question.text}
                    {question.required && (
                      <span className="ml-1 text-pink-500">*</span>
                    )}
                  </Label>
                  
                  {question.type === 'text' && (
                    <Textarea
                      name={question.id}
                      className="bg-white/60 dark:bg-gray-800/60 border border-indigo-100 dark:border-indigo-800/30 focus:ring-2 focus:ring-indigo-500"
                      rows={3}
                      placeholder={question.placeholder}
                      onChange={(e) => handleChange(question.id, e.target.value)}
                    />
                  )}
                  
                  {question.type === 'number' && (
                    <Input
                      type="number"
                      name={question.id}
                      className="bg-white/60 dark:bg-gray-800/60 border border-indigo-100 dark:border-indigo-800/30 focus:ring-2 focus:ring-indigo-500"
                      placeholder={question.placeholder}
                      onChange={(e) => handleChange(question.id, e.target.value)}
                    />
                  )}
                  
                  {question.type === 'select' && (
                    <Select onValueChange={(value) => handleChange(question.id, value)}>
                      <SelectTrigger className="bg-white/60 dark:bg-gray-800/60 border border-indigo-100 dark:border-indigo-800/30 focus:ring-2 focus:ring-indigo-500">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {question.options?.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  
                  {question.type === 'multiselect' && (
                    <div className="grid grid-cols-2 gap-2">
                      {question.options?.map((option) => (
                        <div 
                          key={option}
                          className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer border ${
                            selectedOptions[question.id]?.includes(option)
                              ? 'bg-indigo-100 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700'
                              : 'bg-white/60 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700'
                          }`}
                          onClick={() => handleMultiSelectChange(question.id, option)}
                        >
                          <span className="text-sm">{option}</span>
                          {selectedOptions[question.id]?.includes(option) && (
                            <CheckCircle className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                  <p className="flex items-start">
                    <CalendarDays className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                    <span>
                      Your responses will be processed by our AI to generate a concise standup summary email for your team.
                      This helps everyone stay aligned without requiring a synchronous meeting.
                    </span>
                  </p>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors duration-300 inline-flex items-center justify-center py-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Processing...</>
                  ) : (
                    <>
                      Submit Standup Notes
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}