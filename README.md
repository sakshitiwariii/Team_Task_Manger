# Team Task Manager

A full-stack task and project management platform built for collaborative teams. The application allows organizations to manage projects, assign tasks, track progress, and monitor productivity through a responsive dashboard with role-based access control.

## Live Demo

* Frontend: https://teamtaskmanger-production-3462.up.railway.app
* Backend API:https://teamtaskmanger-production-a7a3.up.railway.app/

---

# Features

## Authentication & Authorization

* Secure signup and login system
* JWT-based authentication
* Role-based access control
* Admin and Member roles
* Protected frontend routes

## Project Management

* Create and manage projects
* Add or remove team members
* Update project status
* Track project progress
* View project-specific tasks

## Task Management

* Create and assign tasks
* Task priority levels
* Due date tracking
* Task status updates
* Search and filtering
* Member-specific task access

## Dashboard & Analytics

* Overview cards for task statistics
* Completed, pending, and overdue metrics
* Visual analytics using charts
* Productivity tracking

## UI/UX

* Fully responsive layout
* Modern dark-themed dashboard
* Sidebar navigation
* Toast notifications
* Loading and empty states

---

# Tech Stack

## Frontend

* React
* Vite
* Tailwind CSS
* React Router DOM
* Axios
* Recharts
* React Hot Toast
* Lucide React

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Express Validator
* bcryptjs

## CI/CD Pipeline

GitHub Actions workflow has been configured for automated build and deployment.

## Workflow Features

* Runs automatically on push to the `main` branch
* Installs frontend and backend dependencies
* Builds the frontend application
* Validates backend setup before deployment
* Supports automatic deployment workflows

The workflow configuration is available in:

```txt
.github/workflows/ci-cd.yml
```

---

# Deployment

* Railway
* MongoDB Atlas

---

# Project Structure

```bash
Team_Task_Manager/
│
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layout/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   │
│   └── package.json
│
├── README.md
└── package.json
```

---

# Environment Variables

## Server (`server/.env`)

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

## Client (`client/.env`)

```env
VITE_API_URL=http://localhost:5000/api
```

---

# Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/Team_Task_Manager.git
cd Team_Task_Manager
```

## 2. Install Dependencies

From the project root:

```bash
npm run install:all
```

---

# Running the Application

## Start Backend

```bash
npm run dev:server
```

Backend runs on:

```txt
http://localhost:5000
```

## Start Frontend

```bash
npm run dev:client
```

Frontend runs on:

```txt
http://localhost:5173
```

---

# API Endpoints

## Authentication

| Method | Endpoint           | Description                |
| ------ | ------------------ | -------------------------- |
| POST   | `/api/auth/signup` | Register user              |
| POST   | `/api/auth/login`  | Login user                 |
| GET    | `/api/auth/me`     | Get current user           |
| GET    | `/api/auth/users`  | Get all users (Admin only) |

---

## Projects

| Method | Endpoint                              | Description           |
| ------ | ------------------------------------- | --------------------- |
| GET    | `/api/projects`                       | Get all projects      |
| POST   | `/api/projects`                       | Create project        |
| GET    | `/api/projects/:id`                   | Get project details   |
| POST   | `/api/projects/:id/members`           | Add member            |
| DELETE | `/api/projects/:id/members/:memberId` | Remove member         |
| PATCH  | `/api/projects/:id/status`            | Update project status |

---

## Tasks

| Method | Endpoint               | Description         |
| ------ | ---------------------- | ------------------- |
| GET    | `/api/tasks`           | Get tasks           |
| GET    | `/api/tasks/dashboard` | Dashboard analytics |
| POST   | `/api/tasks`           | Create task         |
| PATCH  | `/api/tasks/:id`       | Update task         |

---

# Deployment

## Backend Deployment (Railway)

1. Push the repository to GitHub
2. Create a new Railway project
3. Connect the GitHub repository
4. Set the root directory to:

```txt
server
```

5. Add environment variables
6. Deploy the backend service

---

## Frontend Deployment

The frontend can be deployed using Railway, Vercel, or Netlify.

### Build Command

```bash
npm run build
```

### Output Directory

```txt
dist
```

### Production Environment Variable

```env
VITE_API_URL=https://your-backend-url/api
```

---

# Security & Best Practices

* Passwords are hashed using bcryptjs
* JWT authentication for secure sessions
* Role-based access restrictions
* Input validation using express-validator
* Centralized error handling middleware
* Protected API routes

---

# Future Improvements

* Real-time notifications
* Drag and drop task boards
* Team chat integration
* File attachments
* Activity logs
* Email reminders
* Unit and integration testing

---

# Author

Sakshi Tiwari

GitHub: `https://github.com/sakshitiwariii`
LinkedIn: `www.linkedin.com/in/sakshi-tiwari-6464522ab`

