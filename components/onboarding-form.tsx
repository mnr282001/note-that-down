'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'

// Define types for our form data
type TaskType = 'coding' | 'meetings' | 'documentation' | 'design' | 'customer_interaction' | 'analysis' | 'other'
type OrganizationMethod = 'to_do_lists' | 'calendar_blocks' | 'project_management' | 'other'
type WorkStyle = 'single_task' | 'multiple_tasks'
type StandupFrequency = 'daily' | 'several_times_week' | 'weekly' | 'rarely'
type QuestionStyle = 'direct' | 'reflective'
type Department = 'engineering' | 'design' | 'product' | 'marketing' | 'sales' | 'support' | 'other'

interface OnboardingFormData {
  // Professional Context
  jobTitle: string
  department: Department
  taskTypes: TaskType[]
  
  // Work Style
  responsibilities: string[]
  organizationMethod: OrganizationMethod
  workStyle: WorkStyle
  
  // Standup & Communication
  standupFrequency: StandupFrequency
  valuableInformation: string
  biggestChallenge: string
  currentTrackingMethod: string
  
  // Goals & Development
  professionalGoals: string[]
  performanceMetrics: string[]
  
  // App Preferences
  signupReason: string
  checkinTime: string
  questionStyle: QuestionStyle
}

export function OnboardingForm() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 5
  
  // Initialize form data
  const [formData, setFormData] = useState<OnboardingFormData>({
    jobTitle: '',
    department: 'engineering',
    taskTypes: [],
    responsibilities: [''],
    organizationMethod: 'to_do_lists',
    workStyle: 'single_task',
    standupFrequency: 'daily',
    valuableInformation: '',
    biggestChallenge: '',
    currentTrackingMethod: '',
    professionalGoals: [''],
    performanceMetrics: [''],
    signupReason: '',
    checkinTime: '15:00',
    questionStyle: 'direct'
  })
  
  // Handle input changes
  const handleInputChange = (field: keyof OnboardingFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  
  // Handle array input changes (like responsibilities, goals, etc.)
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
  
  // Handle checkbox changes for task types
  const handleTaskTypeChange = (type: TaskType, checked: boolean) => {
    setFormData(prev => {
      if (checked) {
        return { ...prev, taskTypes: [...prev.taskTypes, type] }
      } else {
        return { ...prev, taskTypes: prev.taskTypes.filter(t => t !== type) }
      }
    })
  }
  
  // Navigate to next step
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1)
    }
  }
  
  // Navigate to previous step
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }
  
  // Submit the form
  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }
      
      // Insert data into various tables
      
      // 1. User Profiles
      await supabase.from('user_profiles').insert({
        id: user.id,
        job_title: formData.jobTitle,
        department: formData.department
      })
      
      // 2. User Tasks
      for (const taskType of formData.taskTypes) {
        await supabase.from('user_tasks').insert({
          user_id: user.id,
          task_type: taskType
        })
      }
      
      // 3. User Responsibilities
      for (const responsibility of formData.responsibilities) {
        if (responsibility.trim()) {
          await supabase.from('user_responsibilities').insert({
            user_id: user.id,
            responsibility
          })
        }
      }
      
      // 4. Work Preferences
      await supabase.from('work_preferences').insert({
        user_id: user.id,
        organization_method: formData.organizationMethod,
        work_style: formData.workStyle
      })
      
      // 5. Standup Preferences
      await supabase.from('standup_preferences').insert({
        user_id: user.id,
        frequency: formData.standupFrequency,
        valuable_information: formData.valuableInformation,
        biggest_challenge: formData.biggestChallenge,
        current_tracking_method: formData.currentTrackingMethod
      })
      
      // 6. Professional Goals
      for (const goal of formData.professionalGoals) {
        if (goal.trim()) {
          await supabase.from('professional_goals').insert({
            user_id: user.id,
            goal
          })
        }
      }
      
      // 7. Performance Metrics
      for (const metric of formData.performanceMetrics) {
        if (metric.trim()) {
          await supabase.from('performance_metrics').insert({
            user_id: user.id,
            metric
          })
        }
      }
      
      // 8. App Preferences
      await supabase.from('app_preferences').insert({
        user_id: user.id,
        signup_reason: formData.signupReason,
        checkin_time: formData.checkinTime,
        question_style: formData.questionStyle
      })
      
      // Redirect to dashboard
      router.push('/protected')
    } catch (error) {
      console.error('Error submitting onboarding form:', error)
      alert('There was an error saving your preferences. Please try again.')
    }
  }
  
  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Professional Context</h2>
            <p className="text-gray-600 dark:text-gray-400">Tell us about your role and responsibilities.</p>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="jobTitle">What is your job title/role?</Label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                  placeholder="e.g. Software Engineer, Product Manager"
                />
              </div>
              
              <div>
                <Label htmlFor="department">Which department or team do you work in?</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => handleInputChange('department', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>What types of tasks make up the majority of your workday?</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="coding"
                      checked={formData.taskTypes.includes('coding')}
                      onCheckedChange={(checked) => handleTaskTypeChange('coding', checked as boolean)}
                    />
                    <Label htmlFor="coding">Coding</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="meetings"
                      checked={formData.taskTypes.includes('meetings')}
                      onCheckedChange={(checked) => handleTaskTypeChange('meetings', checked as boolean)}
                    />
                    <Label htmlFor="meetings">Meetings</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="documentation"
                      checked={formData.taskTypes.includes('documentation')}
                      onCheckedChange={(checked) => handleTaskTypeChange('documentation', checked as boolean)}
                    />
                    <Label htmlFor="documentation">Documentation</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="design"
                      checked={formData.taskTypes.includes('design')}
                      onCheckedChange={(checked) => handleTaskTypeChange('design', checked as boolean)}
                    />
                    <Label htmlFor="design">Design</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="customer_interaction"
                      checked={formData.taskTypes.includes('customer_interaction')}
                      onCheckedChange={(checked) => handleTaskTypeChange('customer_interaction', checked as boolean)}
                    />
                    <Label htmlFor="customer_interaction">Customer Interaction</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="analysis"
                      checked={formData.taskTypes.includes('analysis')}
                      onCheckedChange={(checked) => handleTaskTypeChange('analysis', checked as boolean)}
                    />
                    <Label htmlFor="analysis">Analysis</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="other"
                      checked={formData.taskTypes.includes('other')}
                      onCheckedChange={(checked) => handleTaskTypeChange('other', checked as boolean)}
                    />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Work Style</h2>
            <p className="text-gray-600 dark:text-gray-400">Tell us about how you prefer to work.</p>
            
            <div className="space-y-4">
              <div>
                <Label>What are your 3-5 primary responsibilities in your current role?</Label>
                {formData.responsibilities.map((responsibility, index) => (
                  <div key={index} className="flex items-center space-x-2 mt-2">
                    <Input
                      value={responsibility}
                      onChange={(e) => handleArrayInputChange('responsibilities', index, e.target.value)}
                      placeholder={`Responsibility ${index + 1}`}
                    />
                    {formData.responsibilities.length > 1 && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeArrayItem('responsibilities', index)}
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
                {formData.responsibilities.length < 5 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => addArrayItem('responsibilities')}
                  >
                    Add Responsibility
                  </Button>
                )}
              </div>
              
              <div>
                <Label>How do you prefer to organize your tasks?</Label>
                <RadioGroup
                  value={formData.organizationMethod}
                  onValueChange={(value) => handleInputChange('organizationMethod', value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="to_do_lists" id="to_do_lists" />
                    <Label htmlFor="to_do_lists">To-do lists</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="calendar_blocks" id="calendar_blocks" />
                    <Label htmlFor="calendar_blocks">Calendar blocks</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="project_management" id="project_management" />
                    <Label htmlFor="project_management">Project management tools</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other_org" />
                    <Label htmlFor="other_org">Other</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label>Do you prefer to focus on one task until completion or work on multiple tasks in parallel?</Label>
                <RadioGroup
                  value={formData.workStyle}
                  onValueChange={(value) => handleInputChange('workStyle', value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="single_task" id="single_task" />
                    <Label htmlFor="single_task">One task until completion</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="multiple_tasks" id="multiple_tasks" />
                    <Label htmlFor="multiple_tasks">Multiple tasks in parallel</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        )
      
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Standup & Communication</h2>
            <p className="text-gray-600 dark:text-gray-400">Tell us about your standup habits and preferences.</p>
            
            <div className="space-y-4">
              <div>
                <Label>How often do you participate in standups?</Label>
                <RadioGroup
                  value={formData.standupFrequency}
                  onValueChange={(value) => handleInputChange('standupFrequency', value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="daily" id="daily" />
                    <Label htmlFor="daily">Daily</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="several_times_week" id="several_times_week" />
                    <Label htmlFor="several_times_week">Several times a week</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekly" id="weekly" />
                    <Label htmlFor="weekly">Weekly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rarely" id="rarely" />
                    <Label htmlFor="rarely">Rarely</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label htmlFor="valuableInformation">What information do you find most valuable to share during standups?</Label>
                <Textarea
                  id="valuableInformation"
                  value={formData.valuableInformation}
                  onChange={(e) => handleInputChange('valuableInformation', e.target.value)}
                  placeholder="e.g. Completed tasks, blockers, upcoming work"
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="biggestChallenge">What's your biggest challenge with preparing for or participating in standups?</Label>
                <Textarea
                  id="biggestChallenge"
                  value={formData.biggestChallenge}
                  onChange={(e) => handleInputChange('biggestChallenge', e.target.value)}
                  placeholder="e.g. Remembering what I worked on, time management"
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="currentTrackingMethod">How do you currently track what you've accomplished each day?</Label>
                <Textarea
                  id="currentTrackingMethod"
                  value={formData.currentTrackingMethod}
                  onChange={(e) => handleInputChange('currentTrackingMethod', e.target.value)}
                  placeholder="e.g. Notes app, sticky notes, memory"
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        )
      
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Goals & Development</h2>
            <p className="text-gray-600 dark:text-gray-400">Tell us about your professional goals and metrics.</p>
            
            <div className="space-y-4">
              <div>
                <Label>What are your current professional development goals?</Label>
                {formData.professionalGoals.map((goal, index) => (
                  <div key={index} className="flex items-center space-x-2 mt-2">
                    <Input
                      value={goal}
                      onChange={(e) => handleArrayInputChange('professionalGoals', index, e.target.value)}
                      placeholder={`Goal ${index + 1}`}
                    />
                    {formData.professionalGoals.length > 1 && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeArrayItem('professionalGoals', index)}
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
                  className="mt-2"
                  onClick={() => addArrayItem('professionalGoals')}
                >
                  Add Goal
                </Button>
              </div>
              
              <div>
                <Label>What metrics or achievements are most important for your performance evaluations?</Label>
                {formData.performanceMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center space-x-2 mt-2">
                    <Input
                      value={metric}
                      onChange={(e) => handleArrayInputChange('performanceMetrics', index, e.target.value)}
                      placeholder={`Metric ${index + 1}`}
                    />
                    {formData.performanceMetrics.length > 1 && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeArrayItem('performanceMetrics', index)}
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
                  className="mt-2"
                  onClick={() => addArrayItem('performanceMetrics')}
                >
                  Add Metric
                </Button>
              </div>
            </div>
          </div>
        )
      
      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">App Preferences</h2>
            <p className="text-gray-600 dark:text-gray-400">Tell us how you'd like to use the app.</p>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="signupReason">What prompted you to try our app?</Label>
                <Textarea
                  id="signupReason"
                  value={formData.signupReason}
                  onChange={(e) => handleInputChange('signupReason', e.target.value)}
                  placeholder="e.g. Looking for a better way to prepare for standups"
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="checkinTime">What time would be ideal for you to receive the afternoon check-in questions?</Label>
                <Input
                  id="checkinTime"
                  type="time"
                  value={formData.checkinTime}
                  onChange={(e) => handleInputChange('checkinTime', e.target.value)}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label>Would you prefer direct questions or reflective prompts?</Label>
                <RadioGroup
                  value={formData.questionStyle}
                  onValueChange={(value) => handleInputChange('questionStyle', value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="direct" id="direct" />
                    <Label htmlFor="direct">Direct questions (e.g., "What did you accomplish today?")</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="reflective" id="reflective" />
                    <Label htmlFor="reflective">Reflective prompts (e.g., "Thinking about today's work, which accomplishments stand out?")</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Welcome to Note That Down</CardTitle>
        <CardDescription>
          Let's personalize your experience. This will only take a few minutes.
        </CardDescription>
        <div className="mt-4">
          <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Step {currentStep} of {totalSteps}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        {renderStep()}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        {currentStep < totalSteps ? (
          <Button onClick={nextStep}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit}>
            Complete
            <Check className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
} 