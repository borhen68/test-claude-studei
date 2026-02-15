#!/bin/bash

# Create all necessary directories
mkdir -p src/app/{about,how-it-works,pricing,gallery,blog,contact,faq,terms,privacy,shipping,admin/{blog,content,testimonials,newsletter}}
mkdir -p src/app/api/{blog,contact,newsletter,testimonials,admin/blog}
mkdir -p src/app/blog/[slug]
mkdir -p src/app/api/blog/[slug]
mkdir -p src/components/{blog,testimonials}

echo "Directories created successfully!"
