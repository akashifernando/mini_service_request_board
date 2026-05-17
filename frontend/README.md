# Mini Service Request Board - Next.js Frontend

Built with **Next.js 14+ (App Router)** and styled using **TailwindCSS v4**. Operates as a fast, single-page application talking directly to the Express REST API.

---

## 🎨 Design Theme & Core Stack
- **Next.js App Router**: Client-side page routes and components.
- **TailwindCSS v4**: Dynamic utility classes, CSS properties, variables, and dark glassmorphic layouts.
- **React Context API (`AuthContext`)**: Session synchronization, profile recoveries from localStorage, and token distribution in fetch helpers.
- **Native Fetch API**: Handles custom request headers, methods, and status responses.

---

## 📱 Page Specifications
1. **Home Screen (`/`)**: Main browsing hub. Fully supports real-time filters (category, status) and debounced keyword input fields, populating job grids dynamically.
2. **Details Screen (`/jobs/[id]`)**: Full specification card listing contact names, email mailing triggers, and authorization boundaries. Offers dropdown adjustments for status transitions and red delete verification dialogs only to authenticated users.
3. **Form Screen (`/jobs/new`)**: Premium forms to post new jobs. Standardizes input properties, performs client-side syntax checks, and autofills contact details from logged-in profiles.
4. **Auth Screens (`/login` & `/register`)**: Glassmorphic forms validating input lengths, password match requirements, and matching backend user credentials.

---

## ⚙️ Development Startup
Ensure that your Express API is running on `http://localhost:5001`.
```bash
# Run local dev server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) inside your web browser.
