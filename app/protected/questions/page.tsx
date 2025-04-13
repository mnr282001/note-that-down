import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

interface Question {
  id: string
  text: string
  type: 'text' | 'number' | 'select'
  options?: string[]
}

const dummyQuestions: Question[] = [
  {
    id: 'q1',
    text: 'How satisfied are you with our service?',
    type: 'select',
    options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied']
  },
  {
    id: 'q2',
    text: 'What improvements would you suggest?',
    type: 'text'
  },
  {
    id: 'q3',
    text: 'How many times have you used our service?',
    type: 'number'
  }
]

export default async function QuestionsPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Feedback Questions</h1>
      <form className="space-y-6">
        {dummyQuestions.map((question) => (
          <div key={question.id} className="space-y-2">
            <label className="block text-sm font-medium">
              {question.text}
            </label>
            {question.type === 'text' && (
              <textarea
                name={question.id}
                className="w-full p-2 border rounded-md"
                rows={3}
              />
            )}
            {question.type === 'number' && (
              <input
                type="number"
                name={question.id}
                className="w-full p-2 border rounded-md"
              />
            )}
            {question.type === 'select' && (
              <select
                name={question.id}
                className="w-full p-2 border rounded-md"
              >
                <option value="">Select an option</option>
                {question.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  )
} 