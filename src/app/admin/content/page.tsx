'use client';

import { useState } from 'react';
import { Save, RefreshCw } from 'lucide-react';

export default function AdminContentPage() {
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState({
    heroTitle: 'Turn Your Photos Into Beautiful Books',
    heroSubtitle: 'Intelligent photo book creator that automatically organizes your memories into stunning layouts.',
    aboutMission: 'Our mission is to help families preserve their precious memories...',
  });

  const saveContent = async () => {
    setSaving(true);
    // TODO: Implement API call to save content
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    alert('Content saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
            <p className="text-gray-600 mt-2">Edit page content and copy</p>
          </div>
          <button
            onClick={saveContent}
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Save Changes
              </>
            )}
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Homepage Hero</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={content.heroTitle}
                  onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle
                </label>
                <textarea
                  rows={3}
                  value={content.heroSubtitle}
                  onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">About Page</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mission Statement
              </label>
              <textarea
                rows={6}
                value={content.aboutMission}
                onChange={(e) => setContent({ ...content, aboutMission: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
