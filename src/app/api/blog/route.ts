import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET(request: NextRequest) {
  try {
    const blogDir = path.join(process.cwd(), 'src/content/blog');
    
    // Check if blog directory exists
    if (!fs.existsSync(blogDir)) {
      return NextResponse.json([]);
    }

    const files = fs.readdirSync(blogDir);
    const posts = files
      .filter((filename) => filename.endsWith('.md'))
      .map((filename) => {
        const filePath = path.join(blogDir, filename);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContents);
        
        return {
          slug: filename.replace('.md', ''),
          title: data.title || 'Untitled',
          excerpt: data.excerpt || '',
          date: data.date || new Date().toISOString(),
          author: data.author || 'Frametale Team',
          category: data.category || 'General',
          featured: data.featured || false,
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Blog API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}
