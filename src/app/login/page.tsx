'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
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
              Welcome Back
            </h1>
            <p className="text-lg text-neutral-600">
              Sign in to continue creating beautiful photo books
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white/80 backdrop-blur-xl border-2 border-neutral-200 rounded-3xl shadow-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Alert */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-start gap-3"
                >
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 font-medium">{error}</p>
                </motion.div>
              )}

              {/* Email Field */}
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

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-neutral-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-neutral-300 text-violet-600 focus:ring-violet-500"
                  />
                  <span className="text-sm text-neutral-600">Remember me</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
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
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-neutral-600 font-medium">
                  Or continue as guest
                </span>
              </div>
            </div>

            {/* Guest CTA */}
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={() => router.push('/upload')}
            >
              Create Without Account
            </Button>
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
