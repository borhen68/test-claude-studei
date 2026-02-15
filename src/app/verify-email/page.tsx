'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50/50 to-amber-50/30 flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-40 w-96 h-96 bg-violet-300/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-20 -right-40 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="relative w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Link href="/" className="inline-block mb-8">
            <motion.div className="inline-flex items-center gap-3" whileHover={{ scale: 1.05 }}>
              <div className="p-3 bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-br from-violet-900 to-purple-700 bg-clip-text text-transparent">
                Frametale
              </span>
            </motion.div>
          </Link>

          <div className="bg-white/80 backdrop-blur-xl border-2 border-neutral-200 rounded-3xl shadow-2xl p-12">
            <div className="inline-flex p-6 bg-violet-100 rounded-3xl mb-8">
              <Mail className="h-16 w-16 text-violet-600" />
            </div>
            
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">
              Verify Your Email
            </h1>
            
            <p className="text-lg text-neutral-600 mb-3 leading-relaxed">
              We've sent a verification link to
            </p>
            <p className="text-lg font-bold text-violet-600 mb-8">
              {email}
            </p>
            
            <p className="text-neutral-600 mb-8 leading-relaxed">
              Click the link in the email to activate your account and start creating beautiful photo books.
            </p>

            <div className="bg-violet-50 border-2 border-violet-200 rounded-2xl p-6 mb-8">
              <p className="text-sm text-violet-900 font-medium mb-2">
                Didn't receive the email?
              </p>
              <ul className="text-sm text-violet-800 space-y-1 text-left">
                <li>• Check your spam or junk folder</li>
                <li>• Make sure the email address is correct</li>
                <li>• Wait a few minutes and check again</li>
              </ul>
            </div>

            <Link href="/login">
              <Button variant="primary" size="lg" className="w-full" magnetic>
                Go to Login
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
