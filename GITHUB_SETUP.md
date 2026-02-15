# GitHub Setup Instructions

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `frametale`
3. Description: "Smart photo book creator - Upload photos, get a beautiful book"
4. Visibility: **Private** (for now) or Public
5. **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

## Step 2: Push Local Code to GitHub

GitHub will show you commands. Use these instead:

```bash
cd /root/.openclaw/workspace/frametale

# Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/frametale.git

# Rename branch to main (modern convention)
git branch -M main

# Push code
git push -u origin main
```

**Or if you're using SSH:**

```bash
git remote add origin git@github.com:YOUR_USERNAME/frametale.git
git branch -M main
git push -u origin main
```

## Step 3: Verify

1. Refresh your GitHub repo page
2. You should see:
   - ✅ All code files
   - ✅ `docs/` folder with 9 documentation files
   - ✅ `PROGRESS.md`
   - ✅ `README.md`
   - ✅ 2 commits

## Step 4: Set Up GitHub Secrets (Later)

When you're ready to deploy, add these secrets:
- Settings → Secrets and variables → Actions → New repository secret

Required secrets:
- `DATABASE_URL`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `STRIPE_SECRET_KEY`
- `PRINTFUL_API_KEY`

## What's in the Repo

```
frametale/
├── docs/                      # Complete documentation
│   ├── START_HERE.md          # Read this first
│   ├── PRD.md                 # Product requirements
│   ├── TECHNICAL_SPEC.md      # Architecture
│   └── ... (6 more docs)
├── src/
│   ├── app/
│   │   ├── page.tsx           # Landing page ✅
│   │   └── upload/page.tsx    # Upload page ✅
│   └── lib/                   # Utilities & types
├── PROGRESS.md                # Development status
├── .env.example               # Environment template
└── package.json
```

## Collaborating

**To work on this from another machine:**

```bash
git clone https://github.com/YOUR_USERNAME/frametale.git
cd frametale
npm install
cp .env.example .env.local
# Fill in .env.local with your credentials
npm run dev
```

## Branching Strategy

**Recommended:**
- `main` - Production-ready code
- `develop` - Active development
- `feature/*` - New features
- `fix/*` - Bug fixes

**Example workflow:**
```bash
git checkout -b feature/database-setup
# Make changes
git add .
git commit -m "feat: add database schema and Supabase client"
git push origin feature/database-setup
# Create Pull Request on GitHub
```

## Next Steps

1. Create the GitHub repo
2. Push the code
3. Share the repo URL with me
4. I can continue building via GitHub commits
5. Or you can clone and work locally

---

**Ready to push to GitHub!** 🚀
