// app/questions/form/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import QuestionsForm from './questions-form'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function QuestionsPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/')
  }

  return <QuestionsForm />
}