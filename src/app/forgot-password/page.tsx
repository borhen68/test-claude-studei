'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSent(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50/50 to-amber-50/30 flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-40 w-96 h-96 bg-violet-300/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-20 -right-40 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="relative w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Back Link */}
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-8 font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>

          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <motion.div
                className="inline-flex items-center gap-3 mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <div className="p-3 bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-br from-violet-900 to-purple-700 bg-clip-text text-transparent">
                  Frametale
                </span>
              </motion.div>
            </Link>
            <h1 className="text-4xl font-bold text-neutral-900 mb-2">
              Reset Password
            </h1>
            <p className="text-lg text-neutral-600">
              Enter your email and we'll send you a reset link
            </p>
          </div>

          {/* Card */}
          <div className="bg-white/80 backdrop-blur-xl border-2 border-neutral-200 rounded-3xl shadow-2xl p-8">
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="inline-flex p-4 bg-green-100 rounded-full mb-6">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-3">
                  Check Your Email
                </h2>
                <p className="text-neutral-600 leading-relaxed mb-6">
                  We've sent a password reset link to<br />
                  <strong className="text-neutral-900">{email}</strong>
                </p>
                <p className="text-sm text-neutral-500 mb-8">
                  Didn't receive it? Check your spam folder or try again.
                </p>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => setSent(false)}
                  className="w-full"
                >
                  Send Another Link
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                      <Mail className="h-5 w-5" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={isLoading}
                  magnetic
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              </form>
            )}
          </div>

          {/* Sign Up Link */}
          <p className="text-center mt-8 text-neutral-600">
            Don't have an account?{' '}
            <Link
              href="/signup"
              className="font-semibold text-violet-600 hover:text-violet-700 transition-colors"
            >
              Sign up free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
