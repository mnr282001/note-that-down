import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function SuggestionsPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Submit Suggestions</h1>
      <form className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Your Suggestions
          </label>
          <textarea
            name="suggestions"
            className="w-full p-2 border rounded-md"
            rows={6}
            placeholder="Please share your suggestions for improvement..."
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Category
          </label>
          <select
            name="category"
            className="w-full p-2 border rounded-md"
          >
            <option value="">Select a category</option>
            <option value="feature">Feature Request</option>
            <option value="improvement">Improvement</option>
            <option value="bug">Bug Report</option>
            <option value="other">Other</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Submit Suggestion
        </button>
      </form>
    </div>
  )
} 