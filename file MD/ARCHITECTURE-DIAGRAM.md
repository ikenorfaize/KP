# 🗺️ Project Architecture - Multi-Repo Structure

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    KP PROJECT (Multi-Repo)                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              │
            ┌─────────────────┴─────────────────┐
            │                                   │
            ▼                                   ▼
    ┌───────────────┐                  ┌───────────────┐
    │   BACKEND     │                  │   FRONTEND    │
    │   Port 3001   │◄────────────────►│   Port 5173   │
    │   Express.js  │   HTTP Requests  │   React+Vite  │
    └───────────────┘                  └───────────────┘
            │                                   │
            │                                   │
            ▼                                   ▼
    ┌───────────────┐                  ┌───────────────┐
    │   MongoDB     │                  │    Browser    │
    │   Database    │                  │     User      │
    └───────────────┘                  └───────────────┘
```

---

## Backend Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     BACKEND (Port 3001)                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────┐     ┌────────────┐     ┌────────────┐      │
│  │  Express   │────►│  MongoDB   │────►│ Cloudinary │      │
│  │   Server   │     │  Database  │     │   Upload   │      │
│  └────────────┘     └────────────┘     └────────────┘      │
│        │                                                    │
│        ├─── /api/login           (Authentication)          │
│        ├─── /api/register        (User Registration)       │
│        ├─── /api/applications    (CRUD Applications)       │
│        ├─── /api/users           (CRUD Users)              │
│        ├─── /api/news            (CRUD News)               │
│        └─── /api/upload          (File Uploads)            │
│                                                              │
│  Files:                                                      │
│  ├── src/index.js           (Main API server)              │
│  ├── src/mongodb.js         (Database connection)          │
│  ├── src/cloudinaryService.js (File upload service)        │
│  └── src/file-server.js     (File server - Port 3002)      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Port 5173)                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │              React Application                      │    │
│  │                                                      │    │
│  │  Pages:                                             │    │
│  │  ├── HomePage          (Landing page)               │    │
│  │  ├── LoginPage         (User login)                 │    │
│  │  ├── RegisterPage      (User registration)          │    │
│  │  ├── DashboardPage     (Admin dashboard)            │    │
│  │  ├── ApplicationPage   (Application form)           │    │
│  │  └── NewsPage          (News management)            │    │
│  │                                                      │    │
│  │  Services:                                          │    │
│  │  ├── apiService.js     (API communication)          │    │
│  │  ├── EmailService.js   (Email integration)          │    │
│  │  └── FileUploadService.js (File uploads)            │    │
│  │                                                      │    │
│  │  Components:                                        │    │
│  │  ├── Navbar            (Navigation)                 │    │
│  │  ├── Sidebar           (Admin sidebar)              │    │
│  │  ├── ApplicationCard   (Display applications)       │    │
│  │  └── NewsManager       (Manage news)                │    │
│  │                                                      │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  Styling:                                                    │
│  ├── Tailwind CSS         (Utility-first CSS)              │
│  ├── Custom CSS           (Component styles)               │
│  └── Responsive Design    (Mobile-first)                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Communication Flow

```
┌─────────────┐                                      ┌─────────────┐
│             │   1. User opens browser              │             │
│   BROWSER   │─────────────────────────────────────►│  FRONTEND   │
│             │                                      │  Port 5173  │
│             │   2. Serves React app                │             │
│             │◄─────────────────────────────────────│             │
└─────────────┘                                      └─────────────┘
                                                            │
                                                            │
                        3. User performs action            │
                           (login, submit form, etc.)      │
                                                            │
                                                            ▼
                                                     ┌─────────────┐
                                                     │   BACKEND   │
                        4. API request (fetch)       │  Port 3001  │
                        POST /api/login             │             │
                        Body: {email, password}      │             │
                     ┌──────────────────────────────►│             │
                     │                                │             │
                     │  5. Process request            │             │
                     │     - Validate data            │             │
                     │     - Query MongoDB            │             │
                     │     - Generate response        │             │
                     │                                │             │
                     │  6. Send response              └─────────────┘
                     │     Status: 200                      │
                     │     Body: {user, token}              │
                     │                                      │
                     │                                      ▼
┌─────────────┐      │                             ┌─────────────┐
│             │      │                             │             │
│  FRONTEND   │◄─────┘                             │   MongoDB   │
│             │                                    │   Database  │
│             │  7. Update UI                      │             │
│             │     - Store token                  │             │
│             │     - Redirect to dashboard        │             │
│             │                                    │             │
└─────────────┘                                    └─────────────┘
       │
       │  8. Show dashboard with data
       ▼
┌─────────────┐
│   BROWSER   │
│   (User)    │
└─────────────┘
```

---

## Data Flow Example: Submit Application

```
┌────────────────────────────────────────────────────────────────┐
│  Step 1: User fills form in Frontend                           │
│  Component: ApplicationForm.jsx                                │
│  Data: {name, email, documents, etc.}                          │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│  Step 2: Frontend validates and sends to Backend              │
│  Service: apiService.submitApplication()                      │
│  Method: POST /api/applications                               │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│  Step 3: Backend receives and validates                       │
│  File: backend/src/index.js                                   │
│  - Check required fields                                      │
│  - Validate email format                                      │
│  - Check for duplicates                                       │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│  Step 4: Upload files to Cloudinary                           │
│  Service: cloudinaryService.js                                │
│  - Upload documents                                           │
│  - Get public URLs                                            │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│  Step 5: Save to MongoDB                                      │
│  Collection: applications                                     │
│  - Insert new document                                        │
│  - Generate ID                                                │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│  Step 6: Send email notification                              │
│  Service: EmailJS                                             │
│  - Send confirmation to user                                  │
│  - Notify admin                                               │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│  Step 7: Return response to Frontend                          │
│  Status: 201 Created                                          │
│  Body: {id, message, data}                                    │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────┐
│  Step 8: Frontend shows success message                       │
│  Component: Shows toast/modal                                 │
│  Action: Redirect to status page                              │
└────────────────────────────────────────────────────────────────┘
```

---

## Folder Structure Detailed

```
KP/
│
├── backend/                          # Backend Project
│   ├── src/                          # Source code
│   │   ├── index.js                  # Main API server (Express)
│   │   ├── mongodb.js                # MongoDB connection & methods
│   │   ├── cloudinaryService.js      # File upload to Cloudinary
│   │   ├── file-server.js            # File serving (port 3002)
│   │   ├── db.json                   # Fallback JSON database
│   │   └── [...path].js              # Vercel serverless function
│   │
│   ├── uploads/                      # Uploaded files (local dev)
│   ├── mongodb-import/               # Database seed data
│   │   ├── applications.json
│   │   ├── users.json
│   │   └── news.json
│   │
│   ├── node_modules/                 # Backend dependencies
│   ├── package.json                  # Backend dependencies config
│   ├── .env                          # Backend environment variables
│   ├── .gitignore                    # Backend git ignore
│   └── README.md                     # Backend documentation
│
├── frontend/                         # Frontend Project
│   ├── src/                          # Source code
│   │   ├── main.jsx                  # App entry point
│   │   ├── App.jsx                   # Main App component
│   │   │
│   │   ├── pages/                    # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   └── ...
│   │   │
│   │   ├── componen/                 # Reusable components
│   │   │   ├── Navbar/
│   │   │   ├── Sidebar/
│   │   │   ├── ApplicationCard/
│   │   │   └── ...
│   │   │
│   │   ├── services/                 # API & external services
│   │   │   ├── apiService.js         # Backend API calls
│   │   │   ├── EmailService.js       # EmailJS integration
│   │   │   └── FileUploadService.js  # File upload handling
│   │   │
│   │   ├── context/                  # React Context (state management)
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── utils/                    # Utility functions
│   │   └── assets/                   # Images, fonts, etc.
│   │
│   ├── public/                       # Static assets
│   ├── node_modules/                 # Frontend dependencies
│   ├── package.json                  # Frontend dependencies config
│   ├── vite.config.js                # Vite configuration
│   ├── tailwind.config.js            # Tailwind CSS config
│   ├── postcss.config.js             # PostCSS config
│   ├── .env                          # Frontend environment variables
│   ├── .gitignore                    # Frontend git ignore
│   └── README.md                     # Frontend documentation
│
└── [Documentation]                   # Project documentation
    ├── QUICK-START.md
    ├── README-MULTIREPO.md
    ├── RESTRUCTURE-COMPLETE.md
    └── BEFORE-AFTER-COMPARISON.md
```

---

## Port Usage

```
┌──────────────┬──────────────────────────────────────────┐
│     Port     │              Service                     │
├──────────────┼──────────────────────────────────────────┤
│    3001      │  Backend API Server (Express)            │
│    3002      │  File Server (for file uploads)          │
│    5173      │  Frontend Dev Server (Vite)              │
│    27017     │  MongoDB (if running locally)            │
└──────────────┴──────────────────────────────────────────┘
```

---

## Environment Variables

### Backend `.env`
```
┌──────────────────────────────────────────────────────┐
│ MONGODB_URI          → Database connection           │
│ PORT                 → API server port (3001)        │
│ FILE_PORT            → File server port (3002)       │
│ CLOUDINARY_*         → File upload service           │
│ FRONTEND_URL         → CORS configuration            │
│ ALLOWED_ORIGINS      → Security settings             │
└──────────────────────────────────────────────────────┘
```

### Frontend `.env`
```
┌──────────────────────────────────────────────────────┐
│ VITE_API_URL         → Backend API endpoint          │
│ VITE_FILE_SERVER_URL → File server endpoint          │
│ VITE_EMAILJS_*       → Email service config          │
│ VITE_APP_NAME        → Application name              │
└──────────────────────────────────────────────────────┘
```

---

## Development Workflow

```
┌─────────────────────────────────────────────────────────┐
│                  Terminal 1: Backend                     │
├─────────────────────────────────────────────────────────┤
│  $ cd backend                                           │
│  $ npm start                                            │
│                                                          │
│  ✓ MongoDB connected                                    │
│  ✓ Server running on http://localhost:3001             │
│  ✓ File server on http://localhost:3002                │
│                                                          │
│  [Shows API logs]                                       │
│  POST /api/login - 200 OK                              │
│  GET /api/applications - 200 OK                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                 Terminal 2: Frontend                     │
├─────────────────────────────────────────────────────────┤
│  $ cd frontend                                          │
│  $ npm run dev                                          │
│                                                          │
│  VITE v7.0.0  ready in 500 ms                           │
│                                                          │
│  ➜  Local:   http://localhost:5173/                    │
│  ➜  Network: use --host to expose                      │
│                                                          │
│  [Shows Vite logs]                                      │
│  ✓ HMR connected                                        │
│  ✓ Page reloaded                                        │
└─────────────────────────────────────────────────────────┘
```

---

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Easy to understand and maintain
- ✅ Scalable and professional structure
- ✅ Independent development and deployment
- ✅ Better debugging and testing
