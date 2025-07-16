# Real-Time Collaborative To-Do Board — Backend

## Overview
This is the backend for the Real-Time Collaborative To-Do Board application. It provides RESTful APIs for user authentication, task management, action logging, and real-time updates using Socket.IO. The backend is built with Node.js, Express, and MongoDB.

## Tech Stack
- Node.js
- Express.js
- MongoDB (Mongoose)
- Socket.IO
- JWT (jsonwebtoken)
- bcryptjs
- CORS

## Features
- User registration and login with JWT authentication
- Secure password hashing
- CRUD API for tasks (title, description, assigned user, status, priority)
- Real-time updates via Socket.IO
- Action logging (last 20 actions)
- Conflict detection and resolution for concurrent edits

## Setup & Installation
1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd Assignment5/backend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Environment Variables:**
   Create a `.env` file in the backend directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. **Run the server:**
   ```bash
   node index.js
   ```
   The backend will run on `http://localhost:5173` by default.

## API Endpoints
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive JWT
- `GET /api/tasks` — Get all tasks (auth required)
- `POST /api/tasks` — Create a new task (auth required)
- `PUT /api/tasks/:id` — Update a task (auth required, with conflict detection)
- `DELETE /api/tasks/:id` — Delete a task (auth required)
- `GET /api/tasks/actions/log` — Get last 20 actions (auth required)

## Real-Time Events (Socket.IO)
- `tasks:update` — Receive updated task list
- `task:add`, `task:move`, `task:assign` — Emit to update tasks in real time

## Deployment
- Deploy to Render, Railway, Cyclic, Heroku, or any Node.js-compatible host.
- Set environment variables in your deployment dashboard.

## License
BIT
