#!/bin/bash
set -e

echo "🚀 Apex SEO - Railway Deployment Script"
echo "======================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Git not initialized${NC}"
    echo "Run: git init"
    exit 1
fi

echo -e "${BLUE}✓ Git repository found${NC}"

# Check if remote is set
if ! git remote | grep -q origin; then
    echo -e "${RED}❌ GitHub remote not set${NC}"
    echo ""
    echo "Steps to fix:"
    echo "1. Create a GitHub repo at github.com/new"
    echo "2. Run: git remote add origin https://github.com/YOUR_USERNAME/apex-seo.git"
    echo "3. Run: git branch -M main"
    echo "4. Run: git push -u origin main"
    exit 1
fi

REMOTE_URL=$(git remote get-url origin)
echo -e "${BLUE}✓ GitHub remote set: $REMOTE_URL${NC}"

# Verify node modules
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📦 Installing dependencies...${NC}"
    npm install
fi
echo -e "${BLUE}✓ Dependencies ready${NC}"

# Check Prisma
if [ ! -d "node_modules/@prisma" ]; then
    echo -e "${BLUE}🔄 Generating Prisma client...${NC}"
    npm run prisma:generate
fi
echo -e "${BLUE}✓ Prisma client ready${NC}"

# Git status
echo ""
echo -e "${BLUE}📊 Git Status:${NC}"
git status

# Ask to push
echo ""
echo -e "${BLUE}🚀 Ready to push to GitHub!${NC}"
read -p "Push to GitHub? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}Pushing to GitHub...${NC}"
    git add .
    git commit -m "Deploy to Railway" --allow-empty
    git push origin main
    echo -e "${GREEN}✅ Code pushed to GitHub!${NC}"
fi

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✅ Ready for Railway Deployment!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "📝 Next steps:"
echo "1. Go to railway.app"
echo "2. Sign up (free)"
echo "3. Click 'Create Project'"
echo "4. Select 'Deploy from GitHub'"
echo "5. Choose 'apex-seo' repository"
echo "6. Click 'Deploy'"
echo "7. Add PostgreSQL from '+' button"
echo "8. Set environment variables:"
echo "   SHOPIFY_API_KEY=your_key"
echo "   SHOPIFY_API_SECRET=your_secret"
echo "   APP_URL=https://YOUR_RAILWAY_URL.up.railway.app"
echo ""
echo "🎉 That's it! Railway will auto-deploy!"
echo ""
echo "Check deployment:"
echo "  railway logs -f"
echo ""
