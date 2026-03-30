# 🚀 Railway.app Deployment Checklist

## Pre-Deployment ✅ (ALL DONE)

- ✅ Code written & tested
- ✅ Prisma schema created
- ✅ Environment variables configured
- ✅ Git repository initialized
- ✅ railway.json created
- ✅ Procfile created
- ✅ Package.json updated with build/start scripts

---

## Deployment Steps (5 Minutes)

### Step 1: Create GitHub Repository
```bash
# Go to github.com → New Repository
# Name: apex-seo
# Public or Private (your choice)
# Copy HTTPS URL
```

### Step 2: Push Code to GitHub
```bash
cd "d:\My Code base\Seo Plugin shopify"

# Add remote (replace URL)
git remote add origin https://github.com/YOUR_USERNAME/apex-seo.git
git branch -M main
git push -u origin main
```

### Step 3: Create Railway Project
1. Go to **railway.app**
2. Click **"Start a New Project"**
3. Select **"Deploy from GitHub"**
4. Authorize GitHub
5. Select **apex-seo** repository
6. Click **"Deploy"**

### Step 4: Add PostgreSQL Database
1. In Railway dashboard, click **"+ New Service"**
2. Select **"PostgreSQL"**
3. Railway creates `DATABASE_URL` automatically

### Step 5: Set Environment Variables
In Railway → Variables tab, add:

```env
SHOPIFY_API_KEY=your_key_here
SHOPIFY_API_SECRET=your_secret_here
APP_URL=https://YOUR_APP_NAME.up.railway.app
ANTHROPIC_API_KEY=optional
PSI_API_KEY=optional
```

**Note:** `DATABASE_URL` is auto-set by Railway PostgreSQL service

### Step 6: Deploy Database Migrations
```bash
# SSH into Railway container
railway shell

# Run migrations
npm run prisma:deploy

# Exit
exit
```

### Step 7: Visit Your App
Click the Railway URL or visit in browser:
```
https://apex-seo-production.up.railway.app
```

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] App loads without errors
- [ ] `/app/dashboard` accessible
- [ ] `/app/meta-tags` page works
- [ ] Database tables created (`railway shell && psql`)
- [ ] Logs show "Apex SEO running on port 3000"
- [ ] No 404 errors in console

---

## 📊 What You Get (Free Tier)

| Item | Included |
|------|----------|
| **Compute** | 512MB RAM, 1 shared vCPU |
| **Database** | PostgreSQL 1GB storage |
| **Monthly Credit** | $5 (lifetime) |
| **Estimated Cost** | $2-3/month (within free credit) |
| **SSL/HTTPS** | Automatic ✅ |
| **Auto-Deploy** | On every git push ✅ |

---

## 🔑 Next: Shopify Integration

Once deployed, you need:

1. **Shopify Development Store**
   - Go to partner.shopify.com
   - Create development store

2. **Create Shopify App**
   - Set App URL to Railway URL
   - Add scopes from app.shopify.toml
   - Get API key & secret

3. **Update Environment Variables**
   ```env
   SHOPIFY_API_KEY=your_shopify_key
   SHOPIFY_API_SECRET=your_shopify_secret
   ```

4. **Git Push = Auto Deploy**
   ```bash
   git push origin main  # Railway redeploys automatically
   ```

---

## 🐛 Troubleshooting

### Build Failed
- Check Railway build logs
- Ensure all dependencies in package.json
- Verify Node.js version (18+)

### Database Connection Error
```bash
railway shell
echo $DATABASE_URL  # Should show PostgreSQL URL
npm run prisma:deploy  # Run migrations
```

### App Shows "Cannot GET /"
- Check that routes are properly defined
- Verify `app/server.ts` exists
- Check Railway logs: `railway logs --follow`

### Environment Variables Not Working
```bash
railway shell
env | grep SHOPIFY  # Verify variables are set
```

---

## 📱 Testing Checklist

1. **Test Dashboard**
   - Navigate to `/app/dashboard`
   - Should show "Store SEO Score" card
   - Database query working ✅

2. **Test Meta Tags Editor**
   - Go to `/app/meta-tags/products`
   - Enter product data
   - Click Save
   - Data persists after refresh ✅

3. **Test Scoring**
   - Edit meta title/description
   - See live score update
   - Readability metrics appear ✅

4. **Test Settings**
   - Save API keys
   - Values persist in database ✅

---

## 🎯 Production Readiness

- ✅ PostgreSQL database
- ✅ Automatic HTTPS
- ✅ Auto-deploy on git push
- ✅ Environment variables secured
- ✅ Prisma migrations automated
- ✅ $5/month free credit

**You're production-ready!** 🚀

---

## Quick Command Reference

```bash
# Deploy (just git push!)
git push origin main

# View logs
railway logs -f

# SSH into app
railway shell

# Run migrations
npm run prisma:deploy

# View environment
railway env

# Restart app
railway restart
```

---

## 🆘 Support

- **Railway Docs**: https://docs.railway.app
- **Issues**: Check Railway status: https://status.railway.app
- **Chat**: Railway community Discord

---

**You've got this! 💪**

Questions? Check RAILWAY_DEPLOYMENT.md for detailed steps.
