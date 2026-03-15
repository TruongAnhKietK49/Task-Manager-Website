# 🚀 TaskMinder – Task Management Web Application

TaskMinder is a simple **Task Management Web Application** that helps users manage projects and tasks efficiently.

Users can create projects, assign tasks to members, update task progress, and track work through a clean dashboard interface.

---

# 🌐 Live Demo

👉 https://task-manager-website-v2h5.onrender.com

---

# 📌 Features

### 🔐 Authentication

* User registration
* User login
* JWT-based authentication

### 📁 Project Management

* Create new projects
* View project list
* Invite or assign members to projects

### ✅ Task Management

* Create tasks inside projects
* Edit and update tasks
* Delete tasks
* Assign tasks to members

### 📊 Task Tracking

* Set **priority levels**
* Update **task status**
* Track progress visually

### 📊 Dashboard

* Overview of projects
* Overview of tasks
* Simple productivity insights

---

# 🛠 Tech Stack

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcrypt

## Frontend

* HTML
* CSS
* JavaScript
* Bootstrap 5

## Deployment

* Backend + Frontend: Render
* Database: MongoDB Atlas

---

# 📂 Project Structure

```
Task-Manager-Website
│
├── backend
│   ├── config
│   │   └── database.js
│   │
│   ├── controllers
│   │   ├── auth.controller.js
│   │   ├── project.controller.js
│   │   └── task.controller.js
│   │
│   ├── models
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   │
│   ├── routes
│   │   ├── auth.routes.js
│   │   ├── project.routes.js
│   │   └── task.routes.js
│   │
│   └── server.js
│
├── frontend
│   ├── pages
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── dashboard.html
│   │   ├── project.html
│   │   └── task.html
│   │
│   ├── js
│   │   ├── login.js
│   │   ├── project.js
│   │   └── task.js
│   │
│   └── css
│
├── public
│
├── .gitignore
├── package.json
└── README.md
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone repository

```
git clone https://github.com/YOUR_USERNAME/Task-Manager-Website.git
```

```
cd Task-Manager-Website
```

---

## 2️⃣ Install dependencies

```
npm install
```

---

## 3️⃣ Create environment variables

Create a `.env` file in the root folder.

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## 4️⃣ Run the server

```
npm start
```

Server will run at:

```
http://localhost:3000
```

---

# 🔗 API Endpoints

### Authentication

```
POST /api/auth/register
POST /api/auth/login
```

### Projects

```
GET /api/projects
POST /api/projects
GET /api/projects/:id
DELETE /api/projects/:id
```

### Tasks

```
GET /api/tasks
POST /api/tasks
PUT /api/tasks/:id
DELETE /api/tasks/:id
```

---

# 📸 Screenshots

*(You can add screenshots here later)*

Example:

```
/screenshots/dashboard.png
/screenshots/project.png
/screenshots/task.png
```

---

# 🚀 Deployment

The application is deployed using:

* **Render** for hosting the backend and frontend
* **MongoDB Atlas** for database

---

# 👨‍💻 Author

**Anh Kiệt Trương**

GitHub:
https://github.com/TruongAnhKiet49

---

# ⭐ Support

If you like this project, please consider giving it a ⭐ on GitHub.
