'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface OnboardingFormData {
  jobTitle: string
  department: string
  responsibilities: string[]
  valuableInformation: string
  biggestChallenge: string
  currentTrackingMethod: string
  signupReason: string
}

export function OnboardingForm() {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Initialize form data
  const [formData, setFormData] = useState<OnboardingFormData>({
    jobTitle: '',
    department: '',
    responsibilities: [''],
    valuableInformation: '',
    biggestChallenge: '',
    currentTrackingMethod: '',
    signupReason: ''
  })
  
  // Check session on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()

        console.log("SESSION DATA", session);
        
        if (error) {
          console.error('Session error:', error)
          router.push('/login')
          return
        }
        
        if (!session) {
          console.log('No session found')
          router.push('/login')
          return
        }
        
        setIsLoading(false)
      } catch (error) {
        console.error('Error checking session:', error)
        router.push('/login')
      }
    }
    
    checkSession()
  }, [router, supabase.auth])
  
  // Handle input changes
  const handleInputChange = (field: keyof OnboardingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  
  // Handle array input changes (like responsibilities)
  const handleArrayInputChange = (field: keyof OnboardingFormData, index: number, value: string) => {
    setFormData(prev => {
      const newArray = [...prev[field] as string[]]
      newArray[index] = value
      return { ...prev, [field]: newArray }
    })
  }
  
  // Add a new item to an array field
  const addArrayItem = (field: keyof OnboardingFormData) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[]), '']
    }))
  }
  
  // Remove an item from an array field
  const removeArrayItem = (field: keyof OnboardingFormData, index: number) => {
    setFormData(prev => {
      const newArray = [...(prev[field] as string[])]
      newArray.splice(index, 1)
      return { ...prev, [field]: newArray }
    })
  }
  
  // Submit the form
  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session) {
        console.error('Session error:', sessionError)
        router.push('/login')
        return
      }
      
      // Get user from session
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        console.error('User error:', userError)
        router.push('/')
        return
      }
      
      // Insert data into user_profiles
      const { error: profileError } = await supabase.from('user_profiles').insert({
        id: user.id,
        job_title: formData.jobTitle,
        department: formData.department,
        responsibilities: formData.responsibilities.filter(r => r.trim()),
        valuable_information: formData.valuableInformation,
        biggest_challenge: formData.biggestChallenge,
        current_tracking_method: formData.currentTrackingMethod,
        signup_reason: formData.signupReason
      })
      
      if (profileError) {
        console.error('Error saving profile:', profileError)
        throw new Error('Failed to save profile information')
      }
      
      // Redirect to dashboard
      router.push('/protected')
    } catch (error) {
      console.error('Error submitting onboarding form:', error)
      alert('There was an error saving your preferences. Please try again or contact support if the problem persists.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Welcome to Note That Down</CardTitle>
        <CardDescription>
          Let&apos;s get to know you better. This will help us personalize your experience.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="jobTitle">What is your job title/role?</Label>
          <Textarea
            id="jobTitle"
            value={formData.jobTitle}
            onChange={(e) => handleInputChange('jobTitle', e.target.value)}
            placeholder="e.g. Software Engineer, Product Manager"
            className="mt-2 min-h-[40px] max-h-[120px] resize-none"
            rows={1}
            disabled={isSubmitting}
          />
        </div>
        
        <div>
          <Label htmlFor="department">What is your department?</Label>
          <Textarea
            id="department"
            value={formData.department}
            onChange={(e) => handleInputChange('department', e.target.value)}
            placeholder="e.g. Engineering, Product, Design"
            className="mt-2 min-h-[40px] max-h-[120px] resize-none"
            rows={1}
            disabled={isSubmitting}
          />
        </div>
        
        <div>
          <Label>What are your main responsibilities?</Label>
          <div className="space-y-2 mt-2">
            {formData.responsibilities.map((responsibility, index) => (
              <div key={index} className="flex items-center gap-2">
                <Textarea
                  value={responsibility}
                  onChange={(e) => handleArrayInputChange('responsibilities', index, e.target.value)}
                  placeholder={`Responsibility ${index + 1}`}
                  className="min-h-[40px] max-h-[120px] resize-none"
                  rows={1}
                  disabled={isSubmitting}
                />
                {formData.responsibilities.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => removeArrayItem('responsibilities', index)}
                    disabled={isSubmitting}
                  >
                    <span className="sr-only">Remove</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => addArrayItem('responsibilities')}
              disabled={isSubmitting}
            >
              + Add Another Responsibility
            </Button>
          </div>
        </div>
        
        <div>
          <Label htmlFor="valuableInformation">What information do you find most valuable to share during standups?</Label>
          <Textarea
            id="valuableInformation"
            value={formData.valuableInformation}
            onChange={(e) => handleInputChange('valuableInformation', e.target.value)}
            placeholder="e.g. Completed tasks, blockers, upcoming work"
            className="mt-2 min-h-[40px] max-h-[120px] resize-none"
            rows={1}
            disabled={isSubmitting}
          />
        </div>
        
        <div>
          <Label htmlFor="biggestChallenge">What&apos;s your biggest challenge with preparing for or participating in standups?</Label>
          <Textarea
            id="biggestChallenge"
            value={formData.biggestChallenge}
            onChange={(e) => handleInputChange('biggestChallenge', e.target.value)}
            placeholder="e.g. Remembering what I worked on, time management"
            className="mt-2 min-h-[40px] max-h-[120px] resize-none"
            rows={1}
            disabled={isSubmitting}
          />
        </div>
        
        <div>
          <Label htmlFor="currentTrackingMethod">How do you currently track what you&apos;ve accomplished each day?</Label>
          <Textarea
            id="currentTrackingMethod"
            value={formData.currentTrackingMethod}
            onChange={(e) => handleInputChange('currentTrackingMethod', e.target.value)}
            placeholder="e.g. Notes app, sticky notes, memory"
            className="mt-2 min-h-[40px] max-h-[120px] resize-none"
            rows={1}
            disabled={isSubmitting}
          />
        </div>
        
        <div>
          <Label htmlFor="signupReason">What prompted you to try our app?</Label>
          <Textarea
            id="signupReason"
            value={formData.signupReason}
            onChange={(e) => handleInputChange('signupReason', e.target.value)}
            placeholder="e.g. Looking for a better way to prepare for standups"
            className="mt-2 min-h-[40px] max-h-[120px] resize-none"
            rows={1}
            disabled={isSubmitting}
          />
        </div>
        
        <Button 
          className="w-full" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Complete Onboarding'}
        </Button>
      </CardContent>
    </Card>
  )
} 