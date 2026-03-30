# Railway.app Deployment Guide

Deploy Apex SEO to Railway.app in 5 minutes! 🚀

## Prerequisites

1. **GitHub Account** (Railway pulls code from GitHub)
2. **Railway Account** (Sign up at railway.app)
3. **PostgreSQL Database** (Railway provides free tier)

## Step 1: Push to GitHub

```bash
# Initialize git repository
cd "d:\My Code base\Seo Plugin shopify"
git init
git add .
git commit -m "Initial Apex SEO commit"

# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/apex-seo.git
git branch -M main
git push -u origin main
```

## Step 2: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Click **"Create Project"**
3. Select **"Deploy from GitHub"**
4. Authorize GitHub access
5. Select your **apex-seo** repository
6. Click **"Deploy"**

## Step 3: Configure PostgreSQL Database

### Add Database to Project:
1. In Railway project dashboard, click **"+ New"**
2. Select **"PostgreSQL"**
3. Railway automatically creates `DATABASE_URL` environment variable

### Verify Connection:
```bash
# In your local terminal
railway link  # Link local project to Railway
railway shell
echo $DATABASE_URL
```

## Step 4: Set Environment Variables

In Railway Dashboard → Settings → Environment:

```env
# Shopify Configuration
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
APP_URL=https://YOUR_RAILWAY_URL.railway.app

# Database (auto-set by Railway)
DATABASE_URL=postgres://...

# Optional: AI & Analytics
ANTHROPIC_API_KEY=your_claude_api_key
PSI_API_KEY=your_pagespeed_key
```

## Step 5: Run Database Migrations

```bash
# Option 1: Via Railway Console
railway shell
npm run prisma:deploy

# Option 2: Connect locally
railway link
npm run prisma:deploy
```

## Step 6: Deploy

Railway auto-deploys when you push to GitHub:

```bash
# Make changes locally
echo "Updated" >> README.md
git add .
git commit -m "Update deployment guide"
git push origin main

# Railway automatically redeploys! 🎉
```

## Monitoring & Logs

```bash
# View live logs
railway logs

# Shell into running container
railway shell

# Check deployed URL
railway open
```

---

## 💡 Railway Features (Free Tier)

| Feature | Free Tier | Limit |
|---------|-----------|-------|
| **Monthly Credit** | $5 | Lifetime |
| **Compute** | Included | 1 shared vCPU |
| **RAM** | 512MB | Per app |
| **PostgreSQL** | Included | 1 database |
| **Storage** | 1GB | PostgreSQL storage |

**Cost for Apex SEO:** ~$2-3/month (within free credit)

---

## 🔒 Security Checklist

- ✅ Never commit `.env` (already in .gitignore)
- ✅ Use Railway secrets for sensitive keys
- ✅ Enable HTTPS (automatic)
- ✅ Database credentials protected by Railway
- ✅ Prisma migrations run automatically

---

## 📊 Monitoring

### Health Check
```bash
curl https://YOUR_RAILWAY_URL.railway.app/health
```

### Database Status
```bash
railway shell
psql
\dt  # List all tables
SELECT * FROM "Shop" LIMIT 5;
```

### Performance
- Railway dashboard shows CPU/Memory usage
- Check logs for errors: `railway logs --follow`

---

## Troubleshooting

### Build Fails
```bash
# Check build logs
railway logs

# Common issue: Missing dependencies
npm install
git add package-lock.json
git push
```

### Database Connection Error
```bash
# Verify migrations ran
railway shell
npm run prisma:migrate
```

### App Won't Start
```bash
# Check environment variables
railway env

# Verify DATABASE_URL is set
echo $DATABASE_URL
```

---

## 📱 Production Checklist

- [ ] All environment variables set
- [ ] Database migrations deployed
- [ ] Shopify API keys configured
- [ ] Custom domain (optional)
- [ ] Monitoring enabled
- [ ] Backups configured

---

## 🚀 Next Steps

1. **Install on Shopify Test Store**
   - Go to your Railway app URL
   - Follow Shopify OAuth flow
   - Test dashboard & product editor

2. **Load Testing**
   - Create 100+ sample products
   - Test SEO scoring performance

3. **Prepare for App Store**
   - Create app listing
   - Add screenshots
   - Write description

---

## Quick Commands

```bash
# Deploy
git push origin main

# View logs
railway logs -f

# Run migrations
railway shell && npm run prisma:deploy

# Reset database (⚠️ destroys data)
railway shell && npm run prisma:reset

# View environment
railway env
```

---

**Happy Deploying! 🎉**

Questions? Check Railway docs: https://docs.railway.app
