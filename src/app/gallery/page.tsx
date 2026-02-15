'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, Eye } from 'lucide-react';

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Wedding', 'Travel', 'Family', 'Baby', 'Events'];

  const galleryItems = [
    { id: 1, title: 'Summer Adventures', category: 'Travel', likes: 142 },
    { id: 2, title: 'Our Wedding Day', category: 'Wedding', likes: 256 },
    { id: 3, title: 'Family Reunion 2026', category: 'Family', likes: 98 },
    { id: 4, title: 'Baby\'s First Year', category: 'Baby', likes: 189 },
    { id: 5, title: 'Europe Trip', category: 'Travel', likes: 221 },
    { id: 6, title: 'Anniversary Celebration', category: 'Events', likes: 167 },
    { id: 7, title: 'Graduation Memories', category: 'Events', likes: 134 },
    { id: 8, title: 'Beach Vacation', category: 'Travel', likes: 203 },
    { id: 9, title: 'Winter Wedding', category: 'Wedding', likes: 278 },
  ];

  const filtered = selectedCategory === 'All' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50">
      <header className="glass border-b border-neutral-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Frametale
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Gallery
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Get inspired by beautiful photo books created by our community
          </p>
        </motion.div>

        {/* Category filter */}
        <div className="glass rounded-2xl p-2 inline-flex gap-2 mb-12 mx-auto flex-wrap justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`relative px-6 py-3 rounded-xl font-medium transition-all ${
                selectedCategory === cat
                  ? 'text-white'
                  : 'text-neutral-700 hover:bg-white/50'
              }`}
            >
              {selectedCategory === cat && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{cat}</span>
            </button>
          ))}
        </div>

        {/* Masonry grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filtered.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="break-inside-avoid group cursor-pointer"
            >
              <div className="glass rounded-2xl overflow-hidden hover:shadow-xl transition-all">
                {/* Image placeholder with gradient */}
                <div className="aspect-[3/4] bg-gradient-to-br from-violet-200 via-indigo-200 to-purple-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button className="p-4 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors">
                      <Eye className="w-6 h-6 text-violet-600" />
                    </button>
                  </div>
                </div>
                
                {/* Details */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-violet-100 text-violet-700 mb-2">
                        {item.category}
                      </span>
                      <h3 className="font-bold text-neutral-900 group-hover:text-violet-700 transition-colors">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-neutral-600">
                    <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                      <Heart className="w-4 h-4" />
                      {item.likes}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link href="/upload">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 h-14 px-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-lg font-semibold shadow-xl shadow-violet-500/30 hover:shadow-2xl hover:shadow-violet-500/40 transition-all"
            >
              Create Your Own Book
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
}
