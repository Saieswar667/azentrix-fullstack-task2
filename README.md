# 🗂 TaskFlow — Multi-User Task Management

A Trello-style Kanban board with JWT auth, role-based access, and real-time updates. Built for the Azentrix Full Stack Developer Internship Assessment.

---

## 🌐 Live Links

| Service | URL |
|---------|-----|
| Frontend | https://azentrix-fullstack-task2.vercel.app |
| Backend API | https://azentrix-fullstack-task2.onrender.com |
| GitHub | https://github.com/Saieswar667/azentrix-fullstack-task2 |

---

## 📌 Project Overview

TaskFlow is a collaborative task management platform that lets teams organize work using a Kanban-style board. Users can create, update, delete, and manage tasks across different stages of completion.

---

## ✨ Features

### Authentication
- User registration and login
- JWT-based authentication
- Protected routes

### Task Management
- Create, edit, and delete tasks
- Assign tasks to users
- Set priority levels and due dates

### Drag & Drop Board
- Three columns: **To Do**, **In Progress**, **Done**
- Drag and drop tasks between columns

### Role-Based Access
- **Admin** — view all users, change roles, delete users, manage the system
- **Member** — create tasks, manage assigned tasks, collaborate on the board

### Real-Time Updates
- Instant task updates across sessions via Socket.IO

### Responsive Design
- Works on desktop, tablet, and mobile

---

## 🛠 Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React, Vite, Axios, Socket.IO Client, CSS3 |
| Backend | Node.js, Express.js, JWT, Socket.IO |
| Database | MySQL (Railway) |
| Deployment | Vercel (Frontend), Render (Backend) |

---

## 🗄 Database Schema

### Users Table

| Field | Type |
|-------|------|
| id | INT |
| name | VARCHAR |
| email | VARCHAR |
| password | VARCHAR |
| role | VARCHAR |
| created_at | TIMESTAMP |

### Tasks Table

| Field | Type |
|-------|------|
| id | INT |
| title | VARCHAR |
| description | TEXT |
| assignee | VARCHAR |
| due_date | VARCHAR |
| priority | VARCHAR |
| status | VARCHAR |
| created_by | INT |
| created_at | TIMESTAMP |

---

## 🚀 Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/Saieswar667/azentrix-fullstack-task2.git
```

### 2. Set up the backend

```bash
cd server
npm install
npm run dev
```

Create a `.env` file in the `server` directory:

```env
PORT=5000
DB_HOST=your_database_host
DB_PORT=3306
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
JWT_SECRET=your_secret_key
```

### 3. Set up the frontend

```bash
cd client
npm install
npm run dev
```

---

## 📷 Screenshots

### Login Page
<img width="1913" height="867" alt="image" src="https://github.com/user-attachments/assets/a005167d-0add-48ed-9a4e-1c1aa3f39c4a" />


### Drag And Drop
<img width="1898" height="867" alt="image" src="https://github.com/user-attachments/assets/3a7f8ae5-e0c6-4c54-8911-54d0d7476a26" />   <img width="1900" height="868" alt="image" src="https://github.com/user-attachments/assets/f76915f1-16ff-4eea-a6ba-d99a036b1a65" />



### Task Board
<img width="1899" height="864" alt="image" src="https://github.com/user-attachments/assets/bd1dc74d-8168-4522-859a-e2d09802f821" />


### Admin Panel
<img width="1898" height="858" alt="image" src="https://github.com/user-attachments/assets/30b2348f-0729-4877-860c-9e9f1d603df6" />  <img width="1896" height="862" alt="image" src="https://github.com/user-attachments/assets/63e1d91e-3a65-4541-94de-1612f0c139dc" />

### Railway Working And Connection
<img width="1919" height="860" alt="image" src="https://github.com/user-attachments/assets/c5443d50-32b8-43c1-af8e-48f17b8dea94" />
### Vercel Working And Connection
<img width="1891" height="858" alt="image" src="https://github.com/user-attachments/assets/a339a0f2-d191-4867-9db6-5ecacc7ece40" />
### Render Working And Connection
<img width="1890" height="858" alt="image" src="https://github.com/user-attachments/assets/94a4d6c7-cbfb-49d8-bc08-2e47c5048978" />




---


---

## 📈 Future Improvements

- Multiple boards support
- Team invitations
- Task comments and file attachments
- Activity history and notifications
- Dark mode

---

## ✅ Assessment Requirements Covered

-  JWT Authentication
-  MySQL Integration
-  Role-Based Access Control
-  Task CRUD Operations
-  Drag & Drop Board
-  Admin User Management
-  Real-Time Updates (Socket.IO)
-  Responsive UI
-  Deployed on Vercel & Render

---

## 👨‍💻 Author

**Sai Eswar**  
Full Stack Developer Internship — Azentrix Assessment Submission  
GitHub: https://github.com/Saieswar667
