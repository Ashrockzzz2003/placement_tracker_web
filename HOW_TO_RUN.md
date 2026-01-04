# 🚀 How to Run This Program - Step by Step

## Prerequisites Check ✓
Before starting, make sure you have:
- ✅ Node.js installed (check: `node --version`)
- ✅ npm installed (check: `npm --version`)
- ✅ Backend server accessible at `http://localhost:5000`

---

## Step 1️⃣: Navigate to Project Directory

```bash
cd e:\placement_tracker_web
```

**Expected Result:** You're in the placement_tracker_web directory

---

## Step 2️⃣: Install Dependencies

```bash
npm install
```

**What this does:**
- Downloads all required packages (Next.js, React, etc.)
- Creates `node_modules` folder
- Generates `package-lock.json`

**Expected Time:** 1-3 minutes  
**Expected Result:** "added X packages" message

---

## Step 3️⃣: Start Development Server

```bash
npm run dev
```

**What this does:**
- Compiles Next.js application
- Starts dev server on port 3000
- Enables hot reload (auto-refresh on code changes)

**Expected Result:**
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

---

## Step 4️⃣: Open in Browser

Open your web browser and go to:

```
http://localhost:3000
```

**Expected Result:** Application loads with home page or login screen

---

## Login to Access Features

1. Enter your credentials (student/manager/admin)
2. Click "Sign In"
3. Navigate to Dashboard

---

## 🎯 To Use the New Feature (Compare Placements)

### If You're an Admin:
1. Go to: **Dashboard → Admin → Placements**
2. Scroll down to: **"Compare Placements Between Batches"**
3. Select first batch year
4. Select second batch year
5. Click **"Compare"** button
6. View the comparison charts and statistics

### If You're a Manager:
1. Go to: **Dashboard → Manager → Placements**
2. Same steps as admin

---

## 🛑 To Stop the Server

Press `Ctrl + C` in the terminal where the dev server is running.

---

## 📦 All Available Commands

| Command | Purpose | How to Run |
|---------|---------|-----------|
| **Start Dev** | Development mode with auto-reload | `npm run dev` |
| **Build** | Prepare for production | `npm run build` |
| **Start Prod** | Run production build | `npm start` |
| **Lint** | Check code quality | `npm run lint` |
| **Format** | Auto-format code | `npm run format` |
| **Deploy** | Deploy with PM2 | `npm run deploy` |

---

## ⚙️ Environment Setup (Optional)

If backend is NOT on `localhost:5000`, create a file called `.env.local` in the root directory:

**File: `.env.local`**
```
NEXT_PUBLIC_URL=http://your-backend-server:5000
```

Then restart the dev server.

---

## 🔧 Troubleshooting

### ❌ "Port 3000 already in use"
**Solution:** Use different port
```bash
npm run dev -- -p 3001
```
Then go to `http://localhost:3001`

---

### ❌ "Module not found" errors
**Solution:** Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

---

### ❌ "Cannot connect to backend"
**Solution:** 
1. Check if backend server is running on port 5000
2. Verify IP address in `.env.local` if on different machine
3. Check firewall settings

---

### ❌ "npm: command not found"
**Solution:** Install Node.js from https://nodejs.org/

---

## 📊 Project Structure

```
placement_tracker_web/
├── app/                           # Next.js pages
│   ├── page.js                   # Home page
│   ├── login/                    # Login page
│   ├── dashboard/                # Dashboard pages
│   │   ├── admin/               # Admin features
│   │   ├── manager/             # Manager features
│   │   └── student/             # Student features
│   └── [other routes]
├── util/                          # Utilities & components
│   ├── ComparisonCharts.js       # ✨ NEW: Batch comparison
│   ├── SearchBar.js
│   ├── StudentPlacementCard.js
│   ├── config.js                # Configuration
│   └── [other utilities]
├── public/                        # Static assets
├── package.json                   # Dependencies & scripts
├── next.config.js                # Next.js config
├── jsconfig.json
└── postcss.config.mjs
```

---

## 🎓 First Time User Guide

### 1. Setup (Do Once)
```bash
cd e:\placement_tracker_web
npm install
```

### 2. Run (Every Time)
```bash
npm run dev
```

### 3. Access
```
http://localhost:3000
```

### 4. Login
Use your Amrita credentials

### 5. Explore Dashboard
- View placements
- Use search and filters
- Try new comparison feature!

---

## ✨ What's New in This Version

**Issue #21: Compare Placements Between Batches**

NEW FEATURE! Now you can:
- Compare placement data across different years
- View company-wise hiring trends
- Analyze salary (CTC) distributions
- See year-over-year statistics

Located in: Admin/Manager Placements Dashboard

---

## 🔐 Important Notes

1. **Authentication Required:** You must log in to use the app
2. **Role-Based Access:** Different features based on your role
3. **Backend Required:** Ensure backend API is running
4. **Data Sensitive:** Handle student data securely

---

## 📞 Need Help?

1. Check documentation files:
   - `SETUP_AND_RUN.md` - Detailed setup
   - `QUICKSTART.md` - Quick reference
   - `IMPLEMENTATION_SUMMARY.md` - Technical details

2. Check browser console (F12) for errors

3. Check backend logs for API issues

4. Visit GitHub: https://github.com/Ashrockzzz2003/placement_tracker_web

---

## 🎉 You're Ready!

Once you see `ready - started server on 0.0.0.0:3000`, you're good to go!

Open `http://localhost:3000` and start using the Placement Tracker.

---

**Happy Coding! 🚀**
