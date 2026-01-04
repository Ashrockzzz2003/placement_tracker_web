# Quick Start Guide

## How to Run This Program

### Prerequisites
✅ Node.js v16+ installed  
✅ npm (comes with Node.js)  
✅ Backend server running on `http://localhost:5000`

---

## 🚀 Quick Start (3 Steps)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Run Development Server
```bash
npm run dev
```

### Step 3: Open in Browser
```
http://localhost:3000
```

---

## 📋 Available Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server (recommended) |
| `npm run build` | Build for production |
| `npm start` | Run production build |
| `npm run lint` | Check code quality |
| `npm run format` | Format code automatically |

---

## ✨ New Feature: Compare Placements Between Batches

**Location:** Admin/Manager Dashboard → Placements section

**What it does:**
- Compare placement data between two academic years
- View company hiring trends
- Analyze salary (CTC) distributions
- See placement statistics

**How to use:**
1. Log in as Admin or Manager
2. Go to Placements section
3. Scroll to "Compare Placements Between Batches"
4. Select two years to compare
5. Click "Compare" to see charts and stats

---

## 🔧 Configuration

### Backend URL
If backend is not on `localhost:5000`, create `.env.local`:
```
NEXT_PUBLIC_URL=http://your-server:5000
```

---

## 📁 Project Structure
```
placement_tracker_web/
├── app/                    # Pages and routes
├── util/                   # Components and utilities
│   └── ComparisonCharts.js # NEW: Batch comparison
├── public/                 # Static files
├── package.json            # Dependencies
└── next.config.js          # Configuration
```

---

## ❓ Troubleshooting

### Port 3000 is in use?
```bash
npm run dev -- -p 3001
```

### Dependencies not installing?
```bash
rm -rf node_modules package-lock.json
npm install
```

### Backend not connecting?
- Check if backend is running on port 5000
- Verify `NEXT_PUBLIC_URL` environment variable
- Check backend console for errors

---

## 📚 Documentation

- **Full Setup Guide:** See `SETUP_AND_RUN.md`
- **Implementation Details:** See `IMPLEMENTATION_SUMMARY.md`
- **GitHub Issues:** https://github.com/Ashrockzzz2003/placement_tracker_web/issues

---

## 🎯 Features Overview

### For Admin Users
- 📊 View all placements
- 🔍 Powerful search and filters
- 📈 View statistics (Max CTC, Avg CTC, Min CTC)
- **✨ NEW: Compare placements between batches**
- ➕ Add placements and companies
- 👥 Manage students and officials

### For Manager Users
- 📊 View placements
- ➕ Add new placements
- ➕ Add new companies
- 👥 Manage students
- **✨ NEW: Compare placements between batches**

### For Student Users
- 👤 View personal placements
- ✏️ Edit profile
- ➕ Add placement records

---

## 🎓 Important Information

**Supported Campuses:**
- Coimbatore (CB)
- Bangalore (BL)
- Nagercoil (NC)

**Supported Departments:**
- CSE, AIE, AID, MEE, ECE, EEE, RAI, EAC, ELC

**Required Backend Endpoints:**
- `/auth/login` - Authentication
- `/manager/getCompanies` - Get companies
- `/manager/getCompanyHireDataByBatch` - Batch data
- `/student/getAllPlacedStudentData` - Placement data

---

**Need Help?** Check the documentation files or create an issue on GitHub!
