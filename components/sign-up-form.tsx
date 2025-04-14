'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, CheckCircle2, Mail, Lock, UserPlus } from 'lucide-react'

export function SignUpForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const supabase = createClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/4 -left-10 w-40 h-40 bg-blue-400 dark:bg-blue-600 rounded-full opacity-20 blur-3xl animate-blob"></div>
        <div className="absolute top-3/4 -right-10 w-60 h-60 bg-purple-400 dark:bg-purple-600 rounded-full opacity-20 blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-indigo-400 dark:bg-indigo-600 rounded-full opacity-20 blur-3xl animate-blob animation-delay-2000"></div>
      </div>
      
      <form onSubmit={handleSignUp} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 text-sm text-green-800 dark:text-green-300 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span>Check your email for a confirmation link to complete your registration.</span>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-indigo-700 dark:text-indigo-300">Email</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Mail className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
            </div>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10 bg-white/60 dark:bg-gray-800/60 border border-indigo-100 dark:border-indigo-800/30 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-indigo-700 dark:text-indigo-300">Password</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-10 bg-white/60 dark:bg-gray-800/60 border border-indigo-100 dark:border-indigo-800/30 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password" className="text-indigo-700 dark:text-indigo-300">Confirm Password</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
            </div>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="pl-10 bg-white/60 dark:bg-gray-800/60 border border-indigo-100 dark:border-indigo-800/30 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors duration-300 inline-flex items-center justify-center" 
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </>
          ) : (
            <>
              Sign Up
              <UserPlus className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
