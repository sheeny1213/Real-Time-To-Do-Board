# Real-Time Collaborative To-Do Board — Frontend

## Overview
This is the frontend for the Real-Time Collaborative To-Do Board application. It is a custom-built React app (no UI libraries) that allows multiple users to manage tasks in real time, similar to a minimal Trello board. The app features live sync, smart assignment, conflict resolution, and a unique, responsive UI.

## Tech Stack
- React (with hooks and context)
- Vite (build tool)
- Socket.IO Client
- Custom CSS (no Bootstrap or UI frameworks)

## Features
- User registration and login (custom forms)
- Kanban board with three columns: Todo, In Progress, Done
- Drag and drop tasks between columns
- Assign/reassign tasks to any user
- Smart Assign: assigns task to user with fewest active tasks
- Activity Log Panel: shows last 20 actions, updates live
- Real-time updates via Socket.IO
- Conflict handling UI for concurrent edits (merge/overwrite)
- Custom animations (e.g., drag-drop, modal transitions)
- Fully responsive for desktop and mobile

## Setup & Installation
1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd Assignment5/frontend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure API Proxy:**
   The Vite dev server is already configured to proxy `/api` requests to the backend (`http://localhost:5000`).
4. **Run the app:**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:3000` by default.

## Usage Guide
- Register a new account or log in.
- Add, edit, or delete tasks on the Kanban board.
- Drag and drop tasks between columns.
- Use the Smart Assign button to auto-assign tasks.
- View the Activity Log for recent actions.
- If a conflict occurs, resolve it using the provided UI.

## Deployment
- Deploy to Vercel, Netlify, or any static hosting provider.
- Set the backend API URL in your deployment environment if needed.

## Links
- **Backend Repo:** [link-to-backend]
- **Live App:** [link-to-deployed-app]
- **Demo Video:** [link-to-demo-video]
- **Logic Document:** [link-to-logic-document]

## License
MIT
