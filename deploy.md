# Quick Deployment Guide - FREE Options

##  Fastest Way: Deploy Both on Render.com (Simplest)

Render.com can host both your backend AND frontend for free!

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Ready for deployment"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Deploy on Render.com

#### A. Create PostgreSQL Database
1. Go to https://render.com → "New +" → "PostgreSQL"
2. Name: `shopapp-db`
3. Plan: **Free**
4. Click "Create Database"
5. **Copy the Internal Database URL** (starts with `postgres://`)

#### B. Deploy Backend
1. Go to https://render.com → "New +" → "Web Service"
2. Connect your GitHub repo
3. Settings:
   - **Name**: `shopapp-backend`
   - **Root Directory**: `server`
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt && alembic upgrade head`
   - **Start Command**: `uvicorn app:app --host 0.0.0.0 --port $PORT`
4. **Environment Variables**:
   - `DATABASE_URL` = (Internal Database URL from step A)
   - `FRONTEND_URL` = `https://shopapp-frontend.onrender.com` (you'll set this later)
5. Click "Create Web Service"
6. Wait 5-10 minutes
7. **Copy your backend URL**: `https://shopapp-backend.onrender.com`

#### C. Deploy Frontend
1. Go to https://render.com → "New +" → "Static Site"
2. Connect your GitHub repo
3. Settings:
   - **Name**: `shopapp-frontend`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
4. **Environment Variables**:
   - `REACT_APP_API_URL` = `https://shopapp-backend.onrender.com` (from step B)
5. Click "Create Static Site"
6. Wait 3-5 minutes
7. **Copy your frontend URL**: `https://shopapp-frontend.onrender.com`

#### D. Update Backend CORS
1. Go to Backend → "Environment"
2. Update `FRONTEND_URL` = `https://shopapp-frontend.onrender.com`
3. Service will auto-restart

**Done!** Your app is live at: `https://shopapp-frontend.onrender.com`

---

##  Alternative: Backend on Render + Frontend on Vercel

### Backend (Render.com) - Same as above

### Frontend (Vercel.com)

1. Go to https://vercel.com → "Add New Project"
2. Import GitHub repo
3. Settings:
   - **Root Directory**: `client`
   - **Framework**: Create React App
   - **Environment Variable**:
     - `REACT_APP_API_URL` = `https://shopapp-backend.onrender.com`
4. Click "Deploy"
5. **Copy your frontend URL**: `https://your-project.vercel.app`

**Update Backend CORS**: Set `FRONTEND_URL` = `https://your-project.vercel.app`

---

##  What's Already Configured

   - Database supports PostgreSQL via `DATABASE_URL` env variable  
   - CORS supports production URLs via `FRONTEND_URL` env variable  
  - PostgreSQL driver (`psycopg2-binary`) added to requirements  
   - Alembic configured for PostgreSQL  
   Frontend uses `REACT_APP_API_URL` environment variable  

---

##  Important Notes

1. **DATABASE_URL**: Render provides `postgres://` - code automatically converts to `postgresql://`
2. **CORS**: Must match your exact frontend URL (no trailing slash)
3. **Environment Variables**: Set in Render/Vercel dashboard, not in code
4. **Free Tier**: 
   - Render: 750 hours/month (enough for 24/7)
   - Vercel: 100 GB bandwidth/month

---

##  Troubleshooting

**Database Connection Error**:
- Use Internal Database URL (not External) on Render
- Check `DATABASE_URL` is set correctly

**CORS Errors**:
- Make sure `FRONTEND_URL` in backend matches exact frontend URL
- Check for trailing slashes

**Build Fails**:
- Check logs on Render/Vercel dashboard
- Verify `requirements.txt` includes all dependencies

---

##  After Deployment

- **Frontend**: `https://your-frontend-url.com`
- **Backend API**: `https://your-backend-url.onrender.com`
- **API Docs**: `https://your-backend-url.onrender.com/docs`

Your app is now live and accessible worldwide! 
