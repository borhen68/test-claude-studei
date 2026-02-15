# Frametale - Quick Start 🚀

## Get Running in 2 Minutes

### 1. Install & Start

```bash
npm install
npm run dev
```

Open http://localhost:3000

### 2. Test the Full Flow

**Option A: Try with Real Photos**

1. Visit http://localhost:3000
2. Click "Start Creating"
3. Upload 20-50 photos
4. Wait for upload & processing
5. View your book!

**Option B: Use Sample Data**

```bash
npm run seed
# Follow the URLs shown
```

## What to Test

### ✅ Upload Page
- Drag & drop photos
- Watch upload progress
- See thumbnails generate
- Click "Create My Book"

### ✅ Book Viewer
- Navigate with arrow keys or buttons
- Zoom in/out
- Toggle fullscreen
- Download PDF

### ✅ Checkout
- Select product (3 options)
- Enter shipping info
- Mock payment (use: 4242 4242 4242 4242)
- See order confirmation

### ✅ Dashboard
- Enter your email
- See all your books
- View orders
- Download PDFs

### ✅ Admin Panel
Visit http://localhost:3000/admin
- See all orders
- Update order status
- Download print PDFs

## Key URLs

- **Home**: http://localhost:3000
- **Upload**: http://localhost:3000/upload
- **Dashboard**: http://localhost:3000/dashboard
- **Admin**: http://localhost:3000/admin

## File Locations

- **Uploaded Photos**: `public/uploads/books/`
- **Thumbnails**: `public/uploads/thumbnails/`
- **Database**: `frametale.db` (SQLite)

## Next Steps

1. ✅ Test the flow end-to-end
2. 📝 Customize the design/branding
3. 🔧 Add real Stripe keys (optional)
4. 🚀 Deploy to Vercel
5. 🎉 Launch!

## Troubleshooting

**Port 3000 in use?**
```bash
npm run dev -- -p 3001
```

**Upload not working?**
```bash
mkdir -p public/uploads/books public/uploads/thumbnails
```

**Database errors?**
- Delete `frametale.db` and restart
- Or set `DATABASE_URL` for PostgreSQL

---

That's it! You now have a fully functional photo book app. 📸 ✨
