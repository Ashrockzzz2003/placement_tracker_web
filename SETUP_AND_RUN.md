# Placement Tracker Web - Setup and Run Guide

## Overview
This is a Next.js web application for tracking placements of students at Amrita School of Computing, Coimbatore.

## Prerequisites
Before running the application, ensure you have:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** (optional, for cloning the repository)
- **Backend Server** running on `http://localhost:5000` or configured via `NEXT_PUBLIC_URL`

## Installation Steps

### 1. Clone or Download the Repository
```bash
git clone https://github.com/Ashrockzzz2003/placement_tracker_web.git
cd placement_tracker_web
```

### 2. Install Dependencies
```bash
npm install
```

This will install all required packages listed in `package.json`:
- Next.js 15.1.3
- React
- TailwindCSS
- PrimeReact (UI Components)
- AOS (Animate On Scroll)
- Chart.js (for data visualization)

### 3. Set Environment Variables (Optional)
Create a `.env.local` file in the root directory if you need to configure the backend URL:

```bash
NEXT_PUBLIC_URL=http://your-backend-url:5000
```

By default, it connects to `http://localhost:5000`. If your backend is on a different server, update this accordingly.

## Running the Application

### Development Mode
To run the application in development mode with hot reload:

```bash
npm run dev
```

The application will be available at:
```
http://localhost:3000
```

### Production Mode
To build and run the application for production:

```bash
npm run build
npm start
```

The application will be available at:
```
http://localhost:3000
```

### Linting
To check for code style issues:

```bash
npm run lint
```

### Code Formatting
To format your code according to prettier rules:

```bash
npm run format
```

## Features Implemented

### New Feature: Compare Placements Between Batches
This feature allows admin and manager users to compare placement data across different academic years.

**Location:** `/dashboard/admin/placement` and `/dashboard/manager/placement`

**Capabilities:**
- Select two different academic batches (years)
- View company-wise comparison charts
- Analyze CTC (Cost to Company) distribution across salary ranges
- Compare statistics:
  - Total placements
  - Average CTC
  - Maximum CTC
  - Placement differences

**How to Use:**
1. Navigate to the Placements section
2. Scroll down to see the "Compare Placements Between Batches" section (appears if data from multiple years is available)
3. Select two different batches from the dropdowns
4. Click "Compare" button
5. View the generated comparison charts and statistics

**Data Visualizations:**
- **Company-wise Comparison Bar Chart:** Shows the number of hires by each company for both batches
- **CTC Range Distribution Bar Chart:** Displays salary distribution across different CTC ranges (₹0-5L, ₹5-10L, etc.)
- **Overall Statistics Cards:** Quick overview of key metrics for both batches

### Admin Features
- View all placements
- Filter by:
  - Student name or roll number
  - Gender
  - Section
  - Company
  - Campus
  - Internship status
  - PPO status
  - On/Off campus
  - Girls' drive
  - Higher studies
- View CTC statistics (Max, Min, Average)
- **NEW:** Compare placements between batches
- Manage companies
- Manage placements
- Manage students
- View officials
- Change batch year

### Manager Features
- View placements
- Add new placements
- Add new companies
- Manage student data
- **NEW:** Compare placements between batches

### Student Features
- View personal placements
- Edit profile
- Add/edit placements
- View dashboard

## Project Structure

```
placement_tracker_web/
├── app/                          # Next.js app directory
│   ├── dashboard/               # Dashboard pages
│   │   ├── admin/              # Admin pages
│   │   ├── manager/            # Manager pages
│   │   └── student/            # Student pages
│   ├── login/                   # Authentication
│   ├── register/                # Registration
│   ├── forgotPassword/          # Password recovery
│   └── page.js                  # Home page
├── util/                         # Utility components and functions
│   ├── ComparisonCharts.js      # NEW: Batch comparison component
│   ├── SearchBar.js
│   ├── StudentPlacementCard.js
│   ├── Top5PlacementCard.js
│   ├── LoadingScreen/
│   ├── config.js                # Configuration (departments, campuses, etc.)
│   ├── constants.js             # API endpoints
│   └── hash.js
├── public/                       # Static assets
├── assets/                       # Images and media
├── package.json                  # Dependencies
├── next.config.js               # Next.js configuration
├── jsconfig.json                # JavaScript configuration
├── tailwind.config.js           # TailwindCSS configuration
└── postcss.config.mjs           # PostCSS configuration
```

## Backend API Connection

The application communicates with a backend API (Node.js + Express + MySQL) for data operations.

**Base API URL:** `http://localhost:5000/api`

**Key Endpoints Used:**
- `/auth/login` - User login
- `/auth/studentRegister` - Student registration
- `/manager/getCompanies` - Get companies list
- `/manager/getCompanyHireDataByBatch` - Get placements by batch
- `/student/getAllPlacedStudentData` - Get all placements
- `/manager/addPlacementData` - Add new placement
- `/manager/getCompanyHireData` - Get company hire statistics

## Troubleshooting

### Backend Connection Issues
If you see errors about connecting to the API:
1. Ensure the backend server is running on `http://localhost:5000`
2. Check if the `NEXT_PUBLIC_URL` environment variable is correctly set
3. Verify backend is accessible: `http://localhost:5000/api`

### Port Already in Use
If port 3000 is already in use:
```bash
npm run dev -- -p 3001
```
Then access the app at `http://localhost:3001`

### Module Not Found Errors
Ensure all dependencies are installed:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Authentication Issues
- Clear browser storage: Clear cookies and local storage
- Log out and log in again
- Check if user credentials are correct

## Performance Optimization

The application uses:
- **Image Optimization:** Next.js Image component for optimized image loading
- **Code Splitting:** Automatic code splitting for better performance
- **Lazy Loading:** Components load on demand
- **CSS Optimization:** TailwindCSS for minimal CSS bundle size

## Deployment

### Using PM2 (Production Deployment)
The project includes a PM2 deployment script:

```bash
npm run deploy
```

This command builds the application and starts it with PM2 for process management.

### Using Docker (Optional)
You can also containerize the application for deployment.

## Technologies Used

| Category | Technologies |
|----------|--------------|
| Frontend Framework | Next.js 15, React |
| Styling | TailwindCSS, PostCSS |
| UI Components | PrimeReact |
| Data Visualization | Chart.js |
| Storage | React Secure Storage |
| Animations | AOS (Animate On Scroll) |
| Code Quality | ESLint, Prettier |
| Build Tool | Webpack (via Next.js) |

## Support

For issues or questions:
1. Check the [GitHub Issues](https://github.com/Ashrockzzz2003/placement_tracker_web/issues)
2. Review the [README.md](./README.md)
3. Contact the development team

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Team

- **Ashwin Narayanan S** - Lead Developer
- **Abhinav R** - Developer
- **Sanjith Thangarasu** - Features & Enhancement

---

**Last Updated:** January 4, 2026
