# Real-Time Collaborative To-Do Board

## Overview
A web-based collaborative to-do board where multiple users can log in, manage tasks, and see changes in real time—similar to a minimal Trello board but with live sync, smart assignment, and conflict resolution.

## Tech Stack
- **Frontend:** React, Vite, Socket.IO Client, Custom CSS
- **Backend:** Node.js, Express, MongoDB (Mongoose), Socket.IO, JWT, bcryptjs

## Features
- User registration and login (JWT authentication)
- Kanban board with three columns: Todo, In Progress, Done
- Drag and drop tasks between columns
- Assign/reassign tasks to any user
- Smart Assign: assigns task to user with fewest active tasks
- Activity Log Panel: shows last 20 actions, updates live
- Real-time updates via Socket.IO
- Conflict handling UI for concurrent edits (merge/overwrite)
- Custom animations and fully responsive design

## Setup & Installation

### Backend
1. `cd backend`
2. `npm install`
3. Create a `.env` file with:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. `node index.js` (or `npm start` if you have a start script)

### Frontend
1. `cd frontend`
2. `npm install`
3. Create a `.env` file with:
   ```
   VITE_SOCKET_URL=https://your-backend.onrender.com
   ```
4. `npm run dev`

## Usage Guide
- Register or log in.
- Add, edit, or delete tasks on the Kanban board.
- Drag and drop tasks between columns.
- Use Smart Assign to auto-assign tasks.
- View the Activity Log for recent actions.
- Resolve conflicts using the provided UI.

## Deployment Links
- **Frontend (Vercel):** [frontend.vercel.app](https://real-time-to-do-board-frontend.vercel.app/)
- **Backend (Render):** [backend.onrender.com](https://real-time-todo-g0xb.onrender.com)
- **Demo Video:** [Loom Demo]()
- **Logic Document:** [Logic_Document.md](https://drive.google.com/file/d/17C3qbwiRi6wcC3ac22q4payYNHv5ayYs/view?usp=drive_link)

## Smart Assign & Conflict Handling
- **Smart Assign:** Automatically assigns a task to the user with the fewest active tasks. See [Logic_Document.md](https://drive.google.com/file/d/17C3qbwiRi6wcC3ac22q4payYNHv5ayYs/view?usp=drive_link) for details.
- **Conflict Handling:** If two users edit the same task at the same time, both versions are shown and users can choose to merge or overwrite.

## License
BIT
