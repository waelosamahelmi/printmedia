# Hostinger Deployment Guide

## Quick Setup for 503 Error Fix

### Step 1: Push Your Code to Git

First, commit all changes and push to your repository:

```bash
git add .
git commit -m "fix: update server.js with robust error logging and diagnostics"
git push
```

### Step 2: Configure Hostinger Node.js App

In Hostinger hPanel:

1. **Go to:** Hosting -> Manage -> Node.js App

2. **Create or Edit Node.js App:**
   - **Node.js Version:** `20.x` (or 18.x)
   - **Application Mode:** `Production`
   - **Application Root:** `/home/u443955779/domains/printmedia.fi/public_html`
   - **Application URL:** `printmedia.fi`
   - **Startup Command:** `node server.js`

3. **Environment Variables** (ADD THESE!):
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=mysql://u443955779_printmedia:PrintMedia123@auth-db2025.hstgr.io:3306/u443955779_printmedia
   NEXTAUTH_URL=https://www.printmedia.fi
   NEXTAUTH_SECRET=PrintMedia2026SecretKey123456789
   NEXT_PUBLIC_SITE_URL=https://www.printmedia.fi
   SMTP_HOST=smtp.hostinger.com
   SMTP_PORT=465
   SMTP_USER=no-reply@printmedia.fi
   SMTP_PASSWORD=PrintMedia@123!
   ADMIN_EMAIL=admin@printmedia.fi
   ADMIN_PASSWORD=PrintMedia@Admin2026!
   ```

4. **Deployment Run Command:**
   ```bash
   npm install
   npm run build
   ```

### Step 3: Run Diagnostic

After deployment, SSH into Hostinger and run:

```bash
cd /home/u443955779/domains/printmedia.fi/public_html
node hostinger-diagnostic.js
```

This will check:
- Node.js version
- Required files
- Environment variables
- Build status
- Database connection

### Step 4: Check Logs

If you still get 503, check these logs:

**Via SSH:**
```bash
# Application logs
tail -f /home/u443955779/domains/printmedia.fi/error_log

# Or check the Node.js app logs in Hostinger hPanel
```

**Via Hostinger hPanel:**
- Go to Hosting -> Manage -> Logs
- Look for the "Node.js App" section

### Common 503 Causes & Fixes

#### 1. Missing .env File
**Symptom:** Server crashes with "DATABASE_URL not set"

**Fix:**
```bash
cd /home/u443955779/domains/printmedia.fi/public_html
cp .env.example .env
# Edit .env with your actual values
nano .env
```

#### 2. Build Failed
**Symptom:** .next directory doesn't exist

**Fix:**
```bash
cd /home/u443955779/domains/printmedia.fi/public_html
npm run build
```

#### 3. Prisma Client Not Generated
**Symptom:** Error about Prisma Client

**Fix:**
```bash
cd /home/u443955779/domains/printmedia.fi/public_html
npx prisma generate
```

#### 4. Port Already in Use
**Symptom:** "EADDRINUSE" error in logs

**Fix:**
- Make sure only one Node.js app is running
- Check Hostinger hPanel for conflicting apps

#### 5. Wrong Node.js Version
**Symptom:** Module import errors

**Fix:**
- Use Node.js 18.x or 20.x (NOT 16.x)

### What the New server.js Does

The updated `server.js` now:
1. ✓ Checks if .next and node_modules exist before starting
2. ✓ Validates environment variables
3. ✓ Logs detailed error messages
4. ✓ Catches and reports all errors
5. ✓ Shows startup progress with checkmarks

### Expected Server Output

When the server starts successfully, you should see:

```
==================================================
Starting Next.js Server for Hostinger
==================================================
NODE_ENV: production
PORT: 3000
HOSTNAME: 0.0.0.0
CWD: /home/u443955779/domains/printmedia.fi/public_html
==================================================
✓ .next directory exists
✓ node_modules directory exists
Loading Next.js...
Preparing Next.js app...
✓ Next.js app prepared successfully
Creating HTTP server...
==================================================
✓ Server running on http://0.0.0.0:3000
==================================================
```

### Still Getting 503?

Share these logs with me:
1. Output from `node hostinger-diagnostic.js`
2. Output from `error_log` file
3. Any errors in Hostinger hPanel -> Logs
4. The exact 503 error page text

I'll help you fix it!
