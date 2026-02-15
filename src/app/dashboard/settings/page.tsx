'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface User {
  id: string;
  email: string;
  name?: string;
  emailVerified: boolean;
  createdAt: string;
}

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/user/profile')
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setName(data.user.name || '');
      })
      .catch(console.error);
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const updates: any = {};
      
      if (name !== user?.name) {
        updates.name = name;
      }

      if (newPassword) {
        if (newPassword !== confirmPassword) {
          setError('New passwords do not match');
          setLoading(false);
          return;
        }
        if (!currentPassword) {
          setError('Current password is required to change password');
          setLoading(false);
          return;
        }
        updates.currentPassword = currentPassword;
        updates.newPassword = newPassword;
      }

      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to update profile');
        return;
      }

      setSuccess('Profile updated successfully');
      setUser(data.user);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            {/* Profile Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500">
                  {user.emailVerified ? (
                    <span className="text-green-600">✓ Email verified</span>
                  ) : (
                    <span className="text-yellow-600">⚠ Email not verified</span>
                  )}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            {/* Password Change */}
            <div className="space-y-4 pt-6 border-t">
              <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
              
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <p className="text-xs text-gray-500">Must be at least 8 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>

          {/* Account Info */}
          <div className="pt-6 border-t">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <span className="font-medium">Account created:</span>{' '}
                {new Date(user.createdAt).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">User ID:</span> {user.id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
