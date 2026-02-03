# 🚀 EduLumix Backend - Render Deployment Guide

## 📦 **Quick Deploy to Render**

### **Step 1: Connect GitHub Repository**

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → Select **"Web Service"**
3. Connect your GitHub account
4. Select repository: **`edulumix-backend`**
5. Click **"Connect"**

---

### **Step 2: Configure Web Service**

Fill in the following details:

**Basic Settings:**
```
Name: edulumix-backend
Region: Singapore (or closest to your target audience)
Branch: main
Root Directory: (leave blank - already in backend folder)
Runtime: Node
Build Command: npm install
Start Command: npm start
```

**Instance Type:**
```
Choose: Free (or upgrade for production)
```

---

### **Step 3: Environment Variables**

Add these environment variables in Render:

#### **Required Variables:**

```env
NODE_ENV=production
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
CLIENT_URL=https://your-frontend-domain.com
```

#### **Admin Account (Optional but Recommended):**

```env
SUPER_ADMIN_NAME=Your Name
SUPER_ADMIN_EMAIL=admin@yourdomain.com
SUPER_ADMIN_PASSWORD=SecurePassword@123
```

#### **How to Get MongoDB URI:**

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new cluster (Free M0 tier available)
3. Click **"Connect"** → **"Connect your application"**
4. Copy the connection string
5. Replace `<password>` with your database password
6. Add database name: `mongodb+srv://username:password@cluster.mongodb.net/edulumix?retryWrites=true&w=majority`

#### **Generate JWT Secret:**

Run in terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

### **Step 4: Deploy**

1. Click **"Create Web Service"**
2. Wait for deployment (takes 2-3 minutes)
3. Your backend will be live at: `https://edulumix-backend.onrender.com`

---

## ✅ **Post-Deployment Steps**

### **1. Verify Deployment**

Visit: `https://your-backend-url.onrender.com/api/health`

You should see:
```json
{
  "success": true,
  "message": "EduLumix API is running",
  "timestamp": "2026-02-03T..."
}
```

### **2. Create Super Admin**

SSH into Render or use Render Shell and run:
```bash
npm run seed
```

This will create your super admin account.

### **3. Test API Endpoints**

```bash
# Health check
GET https://your-backend-url.onrender.com/api/health

# Root
GET https://your-backend-url.onrender.com/

# Login
POST https://your-backend-url.onrender.com/api/auth/login
Body: { "email": "admin@yourdomain.com", "password": "SecurePassword@123" }
```

---

## 🔧 **Configuration Files**

### **render.yaml** (Already included)

This file contains all deployment configuration:
```yaml
services:
  - type: web
    name: edulumix-backend
    runtime: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5000
```

---

## 🌐 **CORS Configuration**

The backend is configured to accept requests from:
- `http://localhost:5173` (local development)
- `*.netlify.app` (Netlify deployments)
- `*.web.app` (Firebase deployments)
- `*.firebaseapp.com` (Firebase deployments)
- `https://edulumix.in` (custom domain)

**To add your frontend domain:**

Edit `server.js` and add your domain to `allowedOrigins` array:
```javascript
const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL,
  'https://edulumix.in',
  'https://your-frontend-domain.com', // Add here
];
```

---

## 📊 **Monitoring & Logs**

### **View Logs:**
1. Go to Render Dashboard
2. Click on your service
3. Click **"Logs"** tab
4. Real-time logs will appear

### **Monitor Performance:**
- CPU usage
- Memory usage
- Response times
- Error rates

---

## 🔐 **Security Best Practices**

1. ✅ **Use strong JWT_SECRET** (32+ characters)
2. ✅ **Enable HTTPS** (Render provides free SSL)
3. ✅ **Set strong admin password**
4. ✅ **Keep dependencies updated**
5. ✅ **Enable rate limiting** (already configured)
6. ✅ **Use environment variables** (never commit secrets)

---

## 🚨 **Troubleshooting**

### **Issue: Deployment Failed**

**Solution:**
- Check build logs in Render
- Verify all environment variables are set
- Ensure MongoDB connection string is correct
- Check if Node version is compatible (v18+)

### **Issue: MongoDB Connection Error**

**Solution:**
- Verify MONGO_URI is correct
- Check if IP whitelist includes Render's IPs (use 0.0.0.0/0 for allow all)
- Ensure MongoDB cluster is active
- Check network access settings in MongoDB Atlas

### **Issue: CORS Errors**

**Solution:**
- Add your frontend domain to `allowedOrigins` in `server.js`
- Redeploy the backend
- Clear browser cache

### **Issue: API Returns 404**

**Solution:**
- Check if route exists in `routes/` folder
- Verify route is imported in `server.js`
- Check endpoint URL (must include `/api/`)

---

## 📈 **Scaling & Performance**

### **Free Tier Limitations:**
- ⚠️ Service spins down after 15 minutes of inactivity
- ⚠️ First request after spin-down takes 30-60 seconds
- ⚠️ 750 hours/month free (sufficient for single service)

### **Upgrade Benefits:**
- ✅ Always-on instances
- ✅ More CPU and RAM
- ✅ Auto-scaling
- ✅ Priority support

### **Performance Tips:**
1. **Enable caching** for frequently accessed data
2. **Use database indexes** for faster queries
3. **Implement pagination** for large datasets
4. **Compress responses** (gzip already enabled)
5. **Use CDN** for static assets

---

## 🔄 **Continuous Deployment**

Render automatically deploys when you push to GitHub:

```bash
git add .
git commit -m "Update backend"
git push origin main
```

Render will:
1. Detect the push
2. Run build command
3. Deploy new version
4. Zero-downtime deployment

---

## 📱 **API Endpoints Documentation**

### **Authentication:**
```
POST /api/auth/signup - Register new user
POST /api/auth/login - Login user
GET  /api/auth/me - Get current user
PUT  /api/auth/profile - Update profile
```

### **Jobs:**
```
GET    /api/jobs - Get all jobs
GET    /api/jobs/:slug - Get job by slug
POST   /api/jobs - Create job (auth required)
PUT    /api/jobs/:id - Update job (auth required)
DELETE /api/jobs/:id - Delete job (auth required)
POST   /api/jobs/:id/like - Like/unlike job
```

### **Resources:**
```
GET    /api/resources - Get all resources
GET    /api/resources/:slug - Get resource by slug
POST   /api/resources - Create resource (auth required)
PUT    /api/resources/:id - Update resource
DELETE /api/resources/:id - Delete resource
```

### **Blogs:**
```
GET    /api/blogs - Get all blogs
GET    /api/blogs/:slug - Get blog by slug
POST   /api/blogs - Create blog (auth required)
PUT    /api/blogs/:id - Update blog
DELETE /api/blogs/:id - Delete blog
```

### **Courses:**
```
GET    /api/courses - Get all courses
GET    /api/courses/:slug - Get course by slug
POST   /api/courses - Create course (super admin)
PUT    /api/courses/:id - Update course
DELETE /api/courses/:id - Delete course
```

### **Mock Tests:**
```
GET    /api/mocktests - Get all mock tests
GET    /api/mocktests/:slug - Get mock test by slug
POST   /api/mocktests - Create mock test (super admin)
PUT    /api/mocktests/:id - Update mock test
DELETE /api/mocktests/:id - Delete mock test
```

### **Digital Products:**
```
GET    /api/products - Get all products
GET    /api/products/:slug - Get product by slug
POST   /api/products - Create product (auth required)
PUT    /api/products/:id - Update product
DELETE /api/products/:id - Delete product
```

### **Users (Super Admin Only):**
```
GET    /api/users - Get all users
GET    /api/users/:id - Get user by ID
PUT    /api/users/:id/status - Update user status
DELETE /api/users/:id - Delete user
```

---

## 🎯 **Custom Domain Setup**

### **Add Custom Domain:**

1. Go to Render Dashboard → Your Service
2. Click **"Settings"** → **"Custom Domain"**
3. Add your domain: `api.yourdomain.com`
4. Add CNAME record in your DNS:
   ```
   Type: CNAME
   Name: api
   Value: your-backend.onrender.com
   ```
5. Wait for DNS propagation (5-30 minutes)
6. SSL certificate will be auto-provisioned

---

## 📞 **Support & Resources**

- **Render Docs:** https://render.com/docs
- **MongoDB Docs:** https://docs.mongodb.com/
- **Node.js Best Practices:** https://github.com/goldbergyoni/nodebestpractices
- **Express.js Guide:** https://expressjs.com/

---

## ✅ **Deployment Checklist**

Before going live:

- [ ] MongoDB Atlas cluster created
- [ ] All environment variables set
- [ ] Super admin account created
- [ ] API endpoints tested
- [ ] CORS configured for frontend domain
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active
- [ ] Monitoring enabled
- [ ] Backup strategy in place
- [ ] Error tracking setup (optional)

---

## 🎉 **Your Backend is Live!**

Backend URL: `https://your-backend.onrender.com`

**Next Steps:**
1. Update frontend `VITE_API_URL` to your backend URL
2. Test all API endpoints
3. Monitor logs for any errors
4. Set up regular database backups
5. Consider upgrading for production traffic

---

**Last Updated:** February 3, 2026  
**Version:** 1.0  
**Status:** ✅ Ready for Production
