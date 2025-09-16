# Copilot Instructions for CodeCraft-QuizCraft

## Project Overview

- **Purpose:** Gamified platform to create awareness among students about Disaster Management.
- **Architecture:**
  - **Monorepo** with `backend` (Node.js/Express) and `frontend` (React, Create React App).
  - **Backend** handles authentication, scenario management, scoring, and video drills via REST APIs.
  - **Frontend** provides user interface for quizzes, video scenarios, leaderboards, and authentication.

## Key Directories & Files

- `backend/`
  - `controllers/`: Business logic for auth, scenarios, scores, video drills.
  - `models/`: Mongoose models for core entities (User, Scenario, Score, Question, VideoDrill, VideoScenario).
  - `routes/`: API route definitions, grouped by feature.
  - `middleware/`: Auth, error, and role-based access control.
  - `uploads/videos/`: Disaster scenario videos, organized by type (e.g., flood).
  - `config/db.js`: MongoDB connection setup.
  - `server.js`: Express app entry point.
- `frontend/`
  - `src/components/`: UI components (Navbar, DrillCard, VideoDrill, etc.).
  - `src/pages/`: Main pages (Home, Dashboard, Leaderboard, Login, Register, ScenarioPlayer, VideoDrills).
  - `src/services/`: API service wrappers for backend communication.
  - `src/context/AuthContext.js`: Global auth state management.

## Developer Workflows

- **Backend:**
  - Start: `npm run dev` (uses nodemon for hot reload)
  - API endpoints: See `routes/` and `controllers/` for structure and naming.
  - MongoDB required; connection config in `config/db.js`.
- **Frontend:**
  - Start: `npm start` (CRA default)
  - Build: `npm run build`
  - Test: `npm test`
  - Uses Tailwind CSS (`tailwind.config.js`, `postcss.config.js`).

## Patterns & Conventions

- **API Design:** RESTful, feature-based route grouping, consistent naming (`/api/auth`, `/api/scenario`, etc.).
- **State Management:** React Context for authentication; API calls via service files.
- **Error Handling:** Centralized middleware in backend (`errorMiddleware.js`).
- **Role-Based Access:** `roleMiddleware.js` restricts sensitive endpoints.
- **Video Scenarios:** Video files mapped to scenario logic; see `videoScenarioController.js` and `uploads/videos/`.
- **Frontend Routing:** React Router for page navigation; protected routes via `ProtectedRoute.jsx`.

## Integration Points

- **Frontend <-> Backend:** All data flows through REST APIs defined in backend `routes/` and consumed via frontend `services/`.
- **Authentication:** JWT-based, managed in backend and persisted in frontend context.
- **Scoring & Leaderboard:** Score logic in backend, leaderboard UI in frontend.

## Examples

- To add a new scenario: Create model in `models/Scenario.js`, controller in `controllers/scenarioController.js`, route in `routes/scenarioRoutes.js`, and frontend page/component.
- To add a new video drill: Place video in `uploads/videos/`, update `VideoDrill.js` and backend controller/service.

## External Dependencies

- **Backend:** Express, Mongoose, JWT, Nodemon
- **Frontend:** React, Tailwind CSS, Axios

## Tips for AI Agents

- Always check both backend and frontend for feature implementation.
- Follow existing naming and folder conventions for new features.
- Use service files for API calls; do not call APIs directly in components.
- For new models, update both backend and frontend as needed.

---

_If any section is unclear or missing, please ask for clarification or provide feedback to improve these instructions._
