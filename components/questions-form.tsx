'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, CalendarDays, CheckCircle, Clock, File, HelpCircle, Lightbulb, Send } from 'lucide-react'
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
  const supabase = createClientComponentClient()
  const router = useRouter()

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
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('User not authenticated')
      
      const currentDate = new Date().toISOString()
      
      const { error } = await supabase
        .from('standup_entries')
        .insert({
          user_id: user.id,
          answers: answers,
          created_at: currentDate
        })
      
      if (error) throw error
      
      alert('Standup notes submitted successfully! An email summary will be generated shortly.')
      router.push('/protected')
    } catch (error: any) {
      alert(`Error submitting standup notes: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
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
            href="/suggestions"
            className="ml-auto text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 text-sm flex items-center"
          >
            <Lightbulb className="h-4 w-4 mr-1" />
            Suggest Improvements
          </Link>
        </div>
        
        <Card className="max-w-2xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {standupQuestions.map((question) => (
                  <div key={question.id} className="space-y-2">
                    <Label htmlFor={question.id}>{question.text}</Label>
                    {question.type === 'text' && (
                      <Textarea
                        id={question.id}
                        value={answers[question.id] as string || ''}
                        onChange={(e) => handleChange(question.id, e.target.value)}
                        placeholder={question.placeholder}
                        required={question.required}
                        className="min-h-[100px]"
                      />
                    )}
                    {question.type === 'number' && (
                      <Input
                        id={question.id}
                        type="number"
                        value={answers[question.id] as string || ''}
                        onChange={(e) => handleChange(question.id, e.target.value)}
                        placeholder={question.placeholder}
                        required={question.required}
                      />
                    )}
                    {question.type === 'select' && (
                      <Select
                        value={answers[question.id] as string || ''}
                        onValueChange={(value) => handleChange(question.id, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={question.placeholder} />
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
                              <CheckCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-8 flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}