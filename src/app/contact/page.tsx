'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50">
      {/* Header */}
      <header className="glass border-b border-neutral-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Frametale
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-4"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-neutral-600 max-w-2xl mx-auto"
          >
            Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="glass rounded-2xl p-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-violet-600" />
              </div>
              <h3 className="font-bold text-neutral-900 mb-2">Email us</h3>
              <p className="text-neutral-600 text-sm mb-3">Our team is here to help</p>
              <a href="mailto:support@frametale.com" className="text-violet-600 hover:text-violet-700 font-medium">
                support@frametale.com
              </a>
            </div>

            <div className="glass rounded-2xl p-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-bold text-neutral-900 mb-2">Live chat</h3>
              <p className="text-neutral-600 text-sm mb-3">Available Mon-Fri, 9am-5pm EST</p>
              <button className="text-indigo-600 hover:text-indigo-700 font-medium">
                Start a conversation
              </button>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="glass rounded-3xl p-8 md:p-10">
              {!success ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative">
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder=" "
                      className="peer w-full h-14 px-4 pt-6 pb-2 rounded-xl border-2 border-neutral-200 bg-white/50 backdrop-blur-sm text-neutral-900 placeholder-transparent focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                    />
                    <label
                      htmlFor="name"
                      className="absolute left-4 top-2 text-xs text-neutral-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-violet-600"
                    >
                      Your name
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder=" "
                      className="peer w-full h-14 px-4 pt-6 pb-2 rounded-xl border-2 border-neutral-200 bg-white/50 backdrop-blur-sm text-neutral-900 placeholder-transparent focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-4 top-2 text-xs text-neutral-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-violet-600"
                    >
                      Email address
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      id="subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      placeholder=" "
                      className="peer w-full h-14 px-4 pt-6 pb-2 rounded-xl border-2 border-neutral-200 bg-white/50 backdrop-blur-sm text-neutral-900 placeholder-transparent focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                    />
                    <label
                      htmlFor="subject"
                      className="absolute left-4 top-2 text-xs text-neutral-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-violet-600"
                    >
                      Subject
                    </label>
                  </div>

                  <div className="relative">
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={6}
                      placeholder=" "
                      className="peer w-full px-4 pt-6 pb-2 rounded-xl border-2 border-neutral-200 bg-white/50 backdrop-blur-sm text-neutral-900 placeholder-transparent focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all resize-none"
                    />
                    <label
                      htmlFor="message"
                      className="absolute left-4 top-2 text-xs text-neutral-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-violet-600"
                    >
                      Your message
                    </label>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full h-14 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    {loading ? 'Sending...' : 'Send Message'}
                  </motion.button>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-3">Message sent!</h3>
                  <p className="text-neutral-600 mb-8">We'll get back to you as soon as possible.</p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="text-violet-600 hover:text-violet-700 font-medium"
                  >
                    Send another message
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
