# Project ATLAS 🪐
**A Gamified 3D Spatial Workspace & Full-Stack Productivity Ecosystem**

![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Three.js](https://img.shields.io/badge/React_Three_Fiber-black?style=for-the-badge&logo=three.js&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-Bear-brown?style=for-the-badge)

### 🌐 [**Live Demo →**](https://atlas-os-client.vercel.app/)

Project ATLAS is a decoupled full-stack (MERN) spatial operating system designed to eliminate context-switching and digital fatigue. It merges robust, database-driven task management with an immersive, WebGL-powered 3D canvas, rendering functional productivity tools as interactive spatial objects.

## 🚀 Engineering Highlights
This project was architected with a focus on strict data integrity, hardware-accelerated rendering, and modular scalability:
*   **Decoupled Full-Stack Architecture:** Engineered a stateless Node.js/Express backend with Mongoose ODM to serve RESTful endpoints, completely independent of the React frontend rendering pipeline.
*   **High-Fidelity WebGL Performance:** Achieved a stable 60 FPS rendering loop by bridging React Three Fiber (`@react-three/fiber`) with selective 2D DOM re-rendering, avoiding costly layout reflows during heavy glassmorphic UI transitions.
*   **Advanced Analytics (Chronos Engine):** Implemented the native HTML5 `Document.visibilityState` API to track tab foreground/background state with millisecond precision, generating highly accurate user Focus Scores persisted to MongoDB.
*   **Zero-CORS Environment:** Configured a transparent Vite reverse proxy layer to eliminate cross-origin development blocks, establishing a strict-port communication boundary between the React client and Express API.
*   **Asynchronous State Management:** Utilized Zustand for lightweight, boilerplate-free global state orchestration, seamlessly syncing MongoDB CRUD operations with 3D canvas raycasting events.

## 🧠 Core Modules
*   **Command Desk:** A robust task management interface supporting full CRUD operations, instantly syncing local Zustand state with the MongoDB instance via asynchronous Express routes.
*   **Chronos Tracker:** A time-tracking suite that logs actual "focused" vs "distracted" time, rendering historical session data programmatically via custom CSS/SVG charting.
*   **Career Hub:** A dynamic internship application tracker. Users can create, update, and manage the status of job applications (Applied, Interviewing, Rejected) through dedicated REST endpoints.
*   **Curriculum Monolith:** A progressive learning path tracker to monitor skill acquisition (e.g., Web Technologies, Machine Learning) with live percentage-based progress calculations.
*   **Sonic Field (Audio Core):** A distraction-free, zero-lag UI overlay integrating static, curated YouTube VODs for deep focus, bypassing heavy iframe rendering on the main 3D canvas.

## 🛠️ Local Development Setup
Ensure you have Node.js and a local MongoDB instance running on port `27017` before starting.

**1. Clone the repository:**
\`\`\`bash
git clone https://github.com/rniszn/atlas-os.git
cd atlas-os
\`\`\`

**2. Setup Backend (Express API):**
\`\`\`bash
cd server
npm install
# Ensure your local MongoDB is running, then start the server
npm run dev
\`\`\`
*The API will initialize on `http://localhost:5000`.*

**3. Setup Frontend (React / WebGL):**
Open a new terminal window:
\`\`\`bash
cd client
npm install
npm run dev
\`\`\`
*The Vite proxy is configured to intercept `/api` requests and route them automatically. Open `http://localhost:3000` to enter the workspace.*

## 👨‍💻 Architecture & Lead Development
**Rohan G.** — Lead Backend & Systems Engineer
