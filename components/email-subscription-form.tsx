'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertCircle, CheckCircle2, Mail } from 'lucide-react'

export function EmailSubscriptionForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()
      
      // Insert the email into the existing email_subscribers table
      const { error } = await supabase
        .from('email_subscribers')
        .insert([{ email }])

      if (error) {
        // If the error is a duplicate key, we can consider it a success
        if (error.code === '23505') {
          setSuccess(true)
        } else {
          setError(error.message)
        }
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
    <div>
      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Stay Updated</h3>
      <form onSubmit={handleSubmit} className="space-y-2">
        {error && (
          <div className="flex items-center gap-2 p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 p-3 text-sm text-green-800 dark:text-green-300 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span>Thank you! We'll notify you when we launch.</span>
          </div>
        )}

        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Mail className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
          </div>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="pl-10 bg-white/60 dark:bg-gray-800/60 border border-indigo-100 dark:border-indigo-800/30 focus:ring-2 focus:ring-indigo-500"
          />
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
              Subscribing...
            </>
          ) : (
            'Notify Me'
          )}
        </Button>
      </form>
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
        We&apos;ll notify you when we launch. No spam, we promise!
      </p>
    </div>
  )
} 