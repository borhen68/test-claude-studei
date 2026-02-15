'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/dashboard-layout';
import { User, Mail, Lock, Bell, Shield, Save } from 'lucide-react';

interface UserProfile {
  id: string;
  name?: string;
  email: string;
  emailVerified: boolean;
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    fetch('/api/user/profile')
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setName(data.user.name || '');
        setEmail(data.user.email);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, emailNotifications }),
      });

      if (!res.ok) throw new Error('Failed to save');

      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl space-y-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-neutral-600 mt-2">Manage your account preferences</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100">
                <User className="w-6 h-6 text-violet-600" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900">Profile</h2>
            </div>

            <div className="space-y-5">
              {/* Name */}
              <div className="relative">
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder=" "
                  className="peer w-full h-14 px-4 pt-6 pb-2 rounded-xl border-2 border-neutral-200 bg-white/50 backdrop-blur-sm text-neutral-900 placeholder-transparent focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                />
                <label
                  htmlFor="name"
                  className="absolute left-4 top-2 text-xs text-neutral-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-violet-600"
                >
                  Full name
                </label>
              </div>

              {/* Email */}
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=" "
                  className="peer w-full h-14 px-4 pt-6 pb-2 rounded-xl border-2 border-neutral-200 bg-white/50 backdrop-blur-sm text-neutral-900 placeholder-transparent focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                />
                <label
                  htmlFor="email"
                  className="absolute left-4 top-2 text-xs text-neutral-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-violet-600"
                >
                  Email address
                </label>
                {user?.emailVerified && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      <Shield className="w-3 h-3" />
                      Verified
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100">
                <Bell className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900">Notifications</h2>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-white/50">
              <div>
                <div className="font-medium text-neutral-900">Email notifications</div>
                <div className="text-sm text-neutral-600">Receive updates about your orders</div>
              </div>
              <button
                type="button"
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  emailNotifications ? 'bg-gradient-to-r from-violet-600 to-indigo-600' : 'bg-neutral-300'
                }`}
              >
                <div className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white transition-transform ${
                  emailNotifications ? 'translate-x-6' : ''
                }`} />
              </button>
            </div>
          </motion.div>

          {/* Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100">
                <Lock className="w-6 h-6 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900">Security</h2>
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-between p-4 rounded-xl bg-white/50 hover:bg-white/80 transition-colors group"
            >
              <div className="text-left">
                <div className="font-medium text-neutral-900 group-hover:text-violet-700 transition-colors">
                  Change password
                </div>
                <div className="text-sm text-neutral-600">Update your password</div>
              </div>
              <svg className="w-5 h-5 text-neutral-400 group-hover:text-violet-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>

          {/* Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-4 rounded-xl ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {message.text}
            </motion.div>
          )}

          {/* Save button */}
          <motion.button
            type="submit"
            disabled={saving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full h-14 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Changes'}
          </motion.button>
        </form>
      </div>
    </DashboardLayout>
  );
}
