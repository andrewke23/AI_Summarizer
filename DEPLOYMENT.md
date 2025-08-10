# Deployment Guide - AI Summarizer Extension Backend

## 🚀 Deploy to Railway (Free)

### Step 1: Prepare Your Code
1. Make sure all files are committed to GitHub
2. Ensure `.env` file is in `.gitignore` (it should be)

### Step 2: Deploy via Railway Web Interface
1. Go to https://railway.app/dashboard
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account
5. Select your repository
6. Railway will automatically detect it's a Node.js app

### Step 3: Set Environment Variables
In Railway dashboard, go to your project → Variables tab and add:

```
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/summaries
JWT_SECRET=your_jwt_secret_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

### Step 4: Get Your Deployment URL
1. Go to your project's "Deployments" tab
2. Copy the generated URL (e.g., `https://your-app-name.railway.app`)

### Step 5: Update Your Extension
Update the API URL in your `popup.js` file:
```javascript
const API_BASE_URL = 'https://your-app-name.railway.app';
```

## 🔧 Alternative: Deploy to Render (Free)

1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Add environment variables (same as above)

## 📝 Notes
- Free tiers have limitations but are perfect for demos
- Your backend will sleep after inactivity (wakes up on first request)
- Consider upgrading for production use 