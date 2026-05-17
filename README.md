# Mini Service Request Board (GlobalTNA Assessment)

A high-performance, premium full-stack web application designed for homeowners to post service requests (e.g. plumbing, electrical, carpentry, painting) and tradespeople to search, filter, and track project status changes.

This repository satisfies all **Core Brief Requirements** and **all optional Bonus Features** in an enterprise-grade, clean-separated directory structure.

---

## 🌟 Key Features Implemented

1. **Clean Full-Stack Architecture**: Strictly separated client (`frontend`) and API server (`backend`) codebases.
2. **MongoDB Docker Integration**: Simplified local database orchestration via `docker-compose.yml` mapped to an isolated port to prevent host conflicts.
3. **Keyword Search (Bonus)**: Implemented regex keyword lookup in the `/api/jobs` query pipeline across `title` and `description`.
4. **JWT Authentication & Protection (Bonus)**: Complete sign-up, sign-in, and authorization flows. Only logged-in users can post new requests, transition job statuses, or delete jobs.
5. **Robust Integration Testing (Bonus)**: 14 test suites built with **Jest & Supertest** covering CRUD endpoints, filters, regex searches, data validation constraints, and auth guards.
6. **Database Seeding (Bonus)**: A single CLI command populates the database with a test user and 8 realistic, well-categorized jobs.
7. **Stunning Dark Glassmorphism UI**: High-fidelity dashboard utilizing **TailwindCSS v4**, custom visual indicators, animated loading states, responsive cards, and validation checks.

---

## 📁 Repository Structure

```text
mini_service_request_board/
├── docker-compose.yml        # Docker Compose configuration for local MongoDB
├── backend/                  # Express REST API codebase
│   ├── src/
│   │   ├── config/           # Database configuration
│   │   ├── controllers/      # Route controllers (Auth, Jobs)
│   │   ├── middleware/       # JWT protection, global error handler
│   │   ├── models/           # Mongoose schemas (User, JobRequest)
│   │   ├── routes/           # Routing bindings
│   │   └── app.js & server.js
│   ├── tests/                # Integration tests (Jest & Supertest)
│   ├── seed.js               # Database seeder script
│   └── package.json
└── frontend/                 # Next.js 14+ (App Router) codebase
    ├── src/
    │   ├── app/              # Routes, screens, and global themes
    │   ├── components/       # Reusable components (Navbar, Cards, Spinners)
    │   └── context/          # Global AuthContext API
    └── package.json
```

---

## 🚀 Quick Start Guide

Follow these steps to run the complete stack locally in under 3 minutes:

### 1. Database Setup (Docker)
In the root directory, spin up the local MongoDB instance:
```bash
docker compose up -d
```
> **Note**: Mapped to port `27018` to avoid collision with any existing databases running on default port `27017` on your local system.

---

### 2. Backend Server Setup
Navigate into the `backend` folder and run the server:
```bash
cd backend
# Install dependencies
npm install

# Run database seeder (seeds 1 test user and 8 realistic jobs)
npm run seed

# Run the backend in development mode (nodemon)
npm run dev
```
The REST API will run on `http://localhost:5001`.

---

### 3. Frontend App Setup
Open a new terminal window in the root directory and run the frontend:
```bash
cd frontend
# Install dependencies
npm install

# Run the dev server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing the API
We have provided comprehensive unit and integration tests. To run the test suites:
```bash
cd backend
npm test
```
*All 14 tests will run in an isolated test database container environment and output clear status results.*

---

## 🔌 API Endpoints

The API is fully documented and structured under the `/api` prefix. Private endpoints require a JSON Web Token (JWT) sent in the HTTP `Authorization` header.

### 🔑 Authentication Endpoints

| Endpoint | Method | Auth Required | Description | Request Body Example |
| :--- | :--- | :---: | :--- | :--- |
| `/api/auth/register` | `POST` | ❌ No | Registers a new user. | `{"name": "Jane Doe", "email": "jane@example.com", "password": "password123"}` |
| `/api/auth/login` | `POST` | ❌ No | Authenticates user and returns JWT. | `{"email": "jane@example.com", "password": "password123"}` |
| `/api/auth/me` | `GET` | 🔒 Yes | Retrieves current logged-in user profile. | *None (Sends JWT in Auth header)* |

### 🛠️ Job Request Endpoints

| Endpoint | Method | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| `/api/jobs` | `GET` | ❌ No | Lists all jobs. Supports query filters (category, status, keyword search). |
| `/api/jobs/:id` | `GET` | ❌ No | Fetches a single job request by ID. |
| `/api/jobs` | `POST` | 🔒 Yes | Creates a new job request with fields validation. |
| `/api/jobs/:id` | `PATCH` | 🔒 Yes | Updates **only** the status of a job. |
| `/api/jobs/:id` | `DELETE` | 🔒 Yes | Deletes a job request by ID. |

---

#### 📌 Endpoint Details & Payload Specs

#### 🔍 `GET /api/jobs`
* **Query Parameters**:
  * `category` *(Optional)*: Filter by job category. Supported: `Plumbing`, `Electrical`, `Painting`, `Joinery`, `Gardening`, `Cleaning`, `Other`.
  * `status` *(Optional)*: Filter by job status. Supported: `Open`, `In Progress`, `Closed`.
  * `search` *(Optional)*: Keyword search against `title` and `description` fields (case-insensitive regex search).
* **Example Request**:
  `GET /api/jobs?category=Plumbing&status=Open&search=leak`

---

#### 🆕 `POST /api/jobs`
* **Headers**: `Authorization: Bearer <your_jwt_token>`
* **Request Body** *(All fields required)*:
  ```json
  {
    "title": "Fix leaking bathroom faucet",
    "description": "The master bathroom faucet is dripping continuously and needs a washer replacement.",
    "category": "Plumbing",
    "location": "London, UK",
    "contactName": "John Doe",
    "contactEmail": "john@example.com"
  }
  ```

---

#### 🔄 `PATCH /api/jobs/:id`
* **Headers**: `Authorization: Bearer <your_jwt_token>`
* **Request Body** *(Only status is allowed and validated)*:
  ```json
  {
    "status": "In Progress"
  }
  ```
  *(Status must be one of: `Open`, `In Progress`, `Closed`)*

---

#### 🗑️ `DELETE /api/jobs/:id`
* **Headers**: `Authorization: Bearer <your_jwt_token>`
* **Response**:
  ```json
  {
    "success": true,
    "message": "Job request successfully deleted",
    "data": {}
  }
  ```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
Create a `.env` file inside the `backend` directory (populated automatically by our seeder):
```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27018/service-request-board
JWT_SECRET=supersecretkeyforglobaltnaassessment
NODE_ENV=development
```

### Frontend (`frontend/.env.local`)
Create a `.env.local` file inside the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

---

## 🤝 Seed Credentials
If you wish to log in on the frontend to post, update, or delete requests, use the pre-seeded credentials:
- **Email**: `john@example.com`
- **Password**: `password123`
