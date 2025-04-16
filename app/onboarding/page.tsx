import { OnboardingForm } from '@/components/onboarding-form'

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-b from-indigo-100 via-purple-50 to-white dark:from-gray-900 dark:via-indigo-950 dark:to-gray-800">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-10 w-40 h-40 bg-blue-400 dark:bg-blue-600 rounded-full opacity-20 blur-3xl animate-blob"></div>
        <div className="absolute top-3/4 -right-10 w-60 h-60 bg-purple-400 dark:bg-purple-600 rounded-full opacity-20 blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-indigo-400 dark:bg-indigo-600 rounded-full opacity-20 blur-3xl animate-blob animation-delay-2000"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-2xl">
        <OnboardingForm />
      </div>
    </div>
  )
} 