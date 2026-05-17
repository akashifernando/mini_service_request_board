# Mini Service Request Board - REST API Backend

Built with **Node.js, Express, and Mongoose (MongoDB)**. Operates as an isolated REST service, utilizing JWT for stateless route protection and Jest for integration testing.

---

## 🛠️ Tech Stack & Middleware
- **Express.js**: Core router and middleware engine.
- **Mongoose**: Model schemas with custom regex format checks for emails.
- **bcryptjs**: Salting and hashing credentials before persisting.
- **jsonwebtoken (JWT)**: Security guard middleware extracting credentials from HTTP headers.
- **cors**: Handles cross-origin requests.
- **Global Error Handler**: Mongoose ObjectID CastError mappings, duplicate fields checks, and custom API messages.

---

## 🚦 Endpoint Specifications

### Authentication Routes
- `POST /api/auth/register` - Create user. Request body: `{ name, email, password }`
- `POST /api/auth/login` - Sign-in user. Request body: `{ email, password }`
- `GET /api/auth/me` - Profile checking (Private, expects token in headers).

### Job Routes
- `GET /api/jobs` - List jobs. Supports optional parameters:
  - `?category=Plumbing`
  - `?status=Open`
  - `?search=tap` (Regex keyword search across title and description)
- `GET /api/jobs/:id` - Retrieve full details for a single job request.
- `POST /api/jobs` - Create service request (Private). Request body: `{ title, description, category, location, contactName, contactEmail }`
- `PATCH /api/jobs/:id` - Update status only (Private). Request body: `{ status }` (Validated enum: `Open | In Progress | Closed`)
- `DELETE /api/jobs/:id` - Delete service request (Private).

---

## 🧪 Running Integration Tests
All tests are written using **Jest** and **Supertest** to execute stateless, mock requests against an isolated test database.
```bash
# Run tests
npm test
```
*Note: Make sure Docker is running MongoDB on port 27018 before starting tests.*
