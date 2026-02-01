# Render.com Deployment Configuration for Backend

## Build Command
```
npm install
```

## Start Command
```
npm start
```

## Environment Variables (Set in Render Dashboard)
- `MONGO_URI` = mongodb+srv://mdmijanur:Mijanur12345@cluster0.q2zhngv.mongodb.net/edulearnix?retryWrites=true&w=majority
- `JWT_SECRET` = edulearnix_jwt_secret_key_2026_very_secure
- `PORT` = 5000
- `NODE_ENV` = production
- `CLIENT_URL` = https://your-frontend-domain.netlify.app
- `SUPER_ADMIN_NAME` = Md Mijanur Molla
- `SUPER_ADMIN_EMAIL` = mdmijanur.molla@edulearnix.com
- `SUPER_ADMIN_PASSWORD` = MijaN@123

## Deployment Steps:
1. Go to https://render.com
2. Click "New +" > "Web Service"
3. Connect your GitHub repository
4. Select the `backend` folder as root directory
5. Set Runtime: Node
6. Set Build Command: `npm install`
7. Set Start Command: `npm start`
8. Add all environment variables listed above
9. Click "Create Web Service"

## Post-Deployment:
- Run seed command: `npm run seed` (via Render shell) to create super admin
- Update frontend .env with Render backend URL
