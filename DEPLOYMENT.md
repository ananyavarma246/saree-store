# 🚀 FREE Deployment Guide

## Prerequisites
1. Create accounts (all free):
   - [GitHub](https://github.com) (for code storage)
   - [Vercel](https://vercel.com) (for frontend)
   - [Railway](https://railway.app) (for backend)
   - [MongoDB Atlas](https://mongodb.com/atlas) (database already setup)

## Step 1: Push to GitHub
```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"

# Create repository on GitHub and push
git branch -M main
git remote add origin https://github.com/yourusername/saree-store.git
git push -u origin main
```

## Step 2: Deploy Frontend to Vercel (FREE)

### Manual Deployment:
1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Connect your GitHub repository
4. Select the `frontend` folder
5. Set environment variables:
   - `REACT_APP_API_URL`: `https://your-railway-backend-url.railway.app`
6. Deploy!

### CLI Deployment:
```bash
cd frontend
vercel login
vercel --prod
```

## Step 3: Deploy Backend to Railway (FREE)

### Manual Deployment:
1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Connect your GitHub repository
4. Select the `backend` folder
5. Set environment variables (copy from your .env file):
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `ADMIN_JWT_SECRET`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD_HASH`
   - `NODE_ENV=production`
6. Deploy!

### CLI Deployment:
```bash
cd backend
railway login
railway init
railway up
```

## Step 4: Update Frontend with Backend URL

1. Get your Railway backend URL (e.g., `https://your-app.railway.app`)
2. Update `.env.production` in frontend:
   ```
   REACT_APP_API_URL=https://your-app.railway.app
   ```
3. Redeploy frontend to Vercel

## Step 5: Update CORS in Backend

Update the CORS origin in `backend/src/app.js`:
```javascript
origin: process.env.NODE_ENV === 'production' 
  ? ['https://your-frontend.vercel.app'] 
  : ['http://localhost:3000', 'http://localhost:3001']
```

## 🎉 Your app is now live and FREE!

### Free Tier Limits:
- **Vercel**: Unlimited personal projects
- **Railway**: 500 hours/month (enough for personal use)
- **MongoDB Atlas**: 512MB storage
- **Total Cost**: $0/month

### Your Live URLs:
- Frontend: `https://alankree-freexrbwc-ananyas-projects-00b32e57.vercel.app`
- Backend: `https://alankree-production.up.railway.app`
- Admin Panel: `https://alankree-freexrbwc-ananyas-projects-00b32e57.vercel.app/admin`

### Default Admin Login:
- Email: admin@alankree.com
- Password: admin123
