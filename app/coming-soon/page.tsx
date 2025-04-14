'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MailCheck, ArrowRight, Check, Calendar, Bell, Sparkles, Zap, Clock, Target } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ComingSoonPage() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [error, setError] = useState('');
  
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email && !isSubmitting) {
      setIsSubmitting(true);
      setError('');
      
      try {
        // Store email in Supabase
        const { error } = await supabase
          .from('email_subscribers')
          .insert([{ email }]);
        
        if (error) {
          // Check if it's a duplicate email error
          if (error.code === '23505') {
            setError('This email is already subscribed.');
          } else {
            console.error('Error:', error);
            setError('Something went wrong. Please try again.');
          }
          setIsSubmitting(false);
          return;
        }
        
        // Show confetti animation
        setShowConfetti(true);
        
        // Wait a bit then show the success message
        setTimeout(() => {
          setIsSubscribed(true);
          setEmail('');
          setIsSubmitting(false);
        }, 600);
        
        // Hide confetti after animation completes
        setTimeout(() => {
          setShowConfetti(false);
        }, 3000);
        
      } catch (error) {
        console.error('Error:', error);
        setError('Something went wrong. Please try again.');
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-100 via-purple-50 to-white dark:from-gray-900 dark:via-indigo-950 dark:to-gray-800 p-4 md:p-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-10 w-40 h-40 bg-blue-400 dark:bg-blue-600 rounded-full opacity-20 blur-3xl animate-blob"></div>
        <div className="absolute top-3/4 -right-10 w-60 h-60 bg-purple-400 dark:bg-purple-600 rounded-full opacity-20 blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-indigo-400 dark:bg-indigo-600 rounded-full opacity-20 blur-3xl animate-blob animation-delay-2000"></div>
      </div>
      
      {/* Confetti effect */}
      {showConfetti && (
        <div className="confetti-container absolute inset-0 z-20 pointer-events-none overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div 
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                background: `hsl(${Math.random() * 360}, 100%, 50%)`,
                animationDuration: `${Math.random() * 3 + 2}s`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}
      
      <div className="w-full max-w-xl space-y-6 md:space-y-8 relative z-10">
        <div className="text-center space-y-2 md:space-y-3">
          <div className="flex justify-center">
            <span className="px-3 py-1 md:px-4 md:py-1 bg-indigo-100 dark:bg-indigo-900/60 rounded-full text-indigo-600 dark:text-indigo-300 text-xs md:text-sm font-medium inline-flex items-center">
              <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              Launching Soon
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400 mt-2 md:mt-3">
            Note That Down
          </h1>
          <p className="mt-2 text-lg md:text-xl text-gray-600 dark:text-gray-300 px-2">
            Elevate your standups. Capture your progress. Organize your workflow.
          </p>
        </div>
        
        <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/80 backdrop-blur-md overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500"></div>
          <CardHeader className="pb-2 px-4 md:px-6">
            <CardTitle className="text-2xl md:text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              Coming Soon
            </CardTitle>
            <CardDescription className="text-center text-sm md:text-base">
              We&apos;re crafting something special just for you
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-5 md:space-y-6 px-4 md:px-6">
            {/* Key Benefits Showcase - Mobile Optimized */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-lg p-3 md:p-4 border border-indigo-100 dark:border-indigo-800/30">
              <h3 className="text-center text-indigo-700 dark:text-indigo-300 font-medium text-sm md:text-base mb-2 md:mb-3 flex items-center justify-center">
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                How Note That Down Transforms Your Workday
              </h3>
              
              {/* Grid that changes from 2 columns on desktop to 1 column on small mobile devices */}
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 md:gap-3">
                <div className="flex items-start space-x-2 p-2 rounded-md bg-white/60 dark:bg-gray-800/60 border border-indigo-100 dark:border-gray-700">
                  <div className="mt-0.5">
                    <Clock className="w-4 h-4 md:w-5 md:h-5 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-200">Save 30+ Minutes</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-xs md:text-xs">No more scrambling</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 p-2 rounded-md bg-white/60 dark:bg-gray-800/60 border border-indigo-100 dark:border-gray-700">
                  <div className="mt-0.5">
                    <Zap className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-200">AI-Powered Insights</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-xs md:text-xs">Personalized prep</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 p-2 rounded-md bg-white/60 dark:bg-gray-800/60 border border-indigo-100 dark:border-gray-700">
                  <div className="mt-0.5">
                    <Target className="w-4 h-4 md:w-5 md:h-5 text-pink-500" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-200">Improved Focus</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-xs md:text-xs">Track priorities</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 p-2 rounded-md bg-white/60 dark:bg-gray-800/60 border border-indigo-100 dark:border-gray-700">
                  <div className="mt-0.5">
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-200">Career Growth</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-xs md:text-xs">Document achievements</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 md:space-y-4">
              <p className="text-gray-600 dark:text-gray-300 text-center text-sm md:text-base px-1">
                Note That Down is revolutionizing how professionals prepare for standups and track their daily progress.
              </p>
              
              {!isSubscribed ? (
                <form onSubmit={handleSubmit} className="space-y-2 md:space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="flex-1 px-3 py-2 md:px-4 md:py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm md:text-base"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                      required
                    />
                    <button 
                      type="submit" 
                      className={`px-3 py-2 md:px-4 md:py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors duration-300 inline-flex items-center justify-center text-sm md:text-base ${isSubmitting ? 'opacity-80 cursor-not-allowed' : ''}`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing
                        </>
                      ) : (
                        <>
                          Notify Me
                          <Bell className="ml-1 md:ml-2 w-3 h-3 md:w-4 md:h-4" />
                        </>
                      )}
                    </button>
                  </div>
                  {error && (
                    <p className="text-red-500 dark:text-red-400 text-xs text-center">
                      {error}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    We&apos;ll notify you when we launch. No spam, we promise!
                  </p>
                </form>
              ) : (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 p-3 md:p-4 rounded-md flex flex-col items-center justify-center animate-fade-in">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-800/50 rounded-full flex items-center justify-center mb-2">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-green-800 dark:text-green-300 text-sm md:text-base font-medium">
                    You&apos;re on the list!
                  </p>
                  <p className="text-green-700/80 dark:text-green-400/80 text-xs md:text-sm mt-1">
                    Thanks for your interest. We&apos;ll notify you when we launch.
                  </p>
                </div>
              )}
            </div>
            
            <div className="pt-3 md:pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-center mb-2 md:mb-3 text-sm md:text-base">What to expect</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                <div className="flex flex-col items-center text-center p-2 md:p-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-1 md:mb-2">
                    <MailCheck className="w-4 h-4 md:w-5 md:h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="font-medium text-sm md:text-base">Daily Check-ins</h4>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Effortless tracking of your progress</p>
                </div>
                <div className="flex flex-col items-center text-center p-2 md:p-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mb-1 md:mb-2">
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h4 className="font-medium text-sm md:text-base">Smart Standups</h4>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">AI-powered meeting preparation</p>
                </div>
                <div className="flex flex-col items-center text-center p-2 md:p-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mb-1 md:mb-2">
                    <Check className="w-4 h-4 md:w-5 md:h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h4 className="font-medium text-sm md:text-base">Productivity Insights</h4>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Track progress and patterns</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center text-xs md:text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Note That Down. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
