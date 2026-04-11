# E-Commerce Authentication Setup Guide

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd server
npm install
```

**Update `.env` with your MongoDB connection:**
```
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_super_secret_key_here
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**Start the backend:**
```bash
npm run dev  # Uses nodemon for auto-reload
```
Server runs on `http://localhost:5000`

---

### 2. Create Demo Users

Make a POST request to seed default admin and user accounts:

```bash
curl -X POST http://localhost:5000/api/auth/seed
```

This creates:
- **Admin:** email: `admin@example.com` | password: `admin123` (role: `admin`)
- **User:** email: `user@example.com` | password: `password123` (role: `user`)

---

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## 🔐 Demo Credentials

After running the seed endpoint, you can login with:

### Admin Login
- **URL:** http://localhost:5173/admin-login
- **Email:** admin@example.com
- **Password:** admin123
- **Access:** Admin Dashboard at `/admin`

### User Login
- **URL:** http://localhost:5173/login
- **Email:** user@example.com
- **Password:** password123
- **Access:** Home page at `/`

### Demo Credentials Buttons
Each login page has a "Demo Credentials" button to auto-fill the credentials for testing.

---

## ✅ Features

### 🎨 UI Improvements
- ✅ Logo with branding (ShopHub)
- ✅ Separate User and Admin login pages
- ✅ Modern gradient backgrounds
- ✅ Improved form styling
- ✅ Error/success notifications
- ✅ Demo credential buttons for easy testing

### 🔐 Authentication
- ✅ User registration & login
- ✅ Admin-only login
- ✅ Password validation (min 6 characters)
- ✅ Password confirmation matching
- ✅ httpOnly cookie-based sessions
- ✅ JWT token management
- ✅ Protected routes (PrivateRoute, AdminRoute)

### 📊 Route Structure
| Route | Purpose |
|-------|---------|
| `/login` | User login (redirects to `/` after success) |
| `/admin-login` | Admin login (redirects to `/admin` after success) |
| `/register` | User registration |
| `/` | Home page (protected) |
| `/admin` | Admin dashboard (protected + admin-only) |

---

## 🧪 Testing Workflow

1. **Start both servers** (backend & frontend)
2. **Seed demo users:** `curl -X POST http://localhost:5000/api/auth/seed`
3. **Visit frontend:** http://localhost:5173
4. **Click "Demo User/Admin Credentials"** to auto-fill login forms
5. **Login and test navigation**

---

## 🔒 Security Notes

- Passwords are hashed with bcryptjs (10 salt rounds)
- Tokens stored in httpOnly cookies (prevents XSS)
- CORS configured to accept only frontend origin
- Session restoration on app load
- Role-based access control (RBAC) for admin routes

---

## ⚙️ Important Configuration

**Production Notes:**
- Change `JWT_SECRET` to a strong value
- Set `NODE_ENV=production`
- Remove or secure the `/api/auth/seed` endpoint
- Use environment-specific database URIs
- Enable HTTPS for cookie secure flag

---

## 📝 File Structure

```
server/
  controllers/
    - authController.js (login, register, logout, getMe)
    - seedController.js (create demo users)
  routes/
    - authRoutes.js (all auth endpoints)
  middleware/
    - protect.js (JWT verification)
    - isAdmin.js (admin check)
  utils/
    - generateToken.js (JWT + cookie setup)
  models/
    - User.js (schema + password hashing)

client/
  src/
    pages/
      - UserLoginPage.jsx (user login)
      - AdminLoginPage.jsx (admin login + role check)
      - UserRegisterPage.jsx (user registration)
    components/
      - Logo.jsx (ShopHub branding)
      - PrivateRoute.jsx (protected routes)
      - AdminRoute.jsx (admin-only routes)
    context/
      - AuthContext.jsx (global auth state)
    api/
      - axios.js (HTTP client with credentials)
```

---

**Ready to test! 🎉**
