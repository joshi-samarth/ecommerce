# E-Commerce Authentication System - Implementation Summary

## Overview
A comprehensive authentication system supporting both regular users and admins with OTP-based verification and JWT-based session management.

---

## 🔑 Key Features

### 1. **User Registration**
- **Endpoint**: `POST /api/auth/register/send-otp`
  - Accepts: `email`, `password`
  - Sends OTP via email
  - Creates temporary session
  
- **Endpoint**: `POST /api/auth/register/verify-otp`
  - Accepts: `email`, `otp`
  - Verifies OTP and stores in temporary session
  - Registers user with pre-verified email
  
- **Endpoint**: `POST /api/auth/register` (backward compatibility)
  - Directly registers user if needed

### 2. **User Login**
- **Endpoint**: `POST /api/auth/login`
  - Accepts: `email`, `password`
  - Returns: JWT token with user info
  - Creates auth session

### 3. **Admin Login (with 2FA)**
- **Endpoint**: `POST /api/admin/login`
  - Accepts: `email`, `password`
  - Sends OTP via email to admin
  - Returns hint about OTP expiry
  
- **Endpoint**: `POST /api/admin/verify-otp`
  - Accepts: `email`, `otp`
  - Verifies OTP and issues JWT token
  - Returns: JWT token with admin info

### 4. **OTP Management**
- **Endpoint**: `POST /api/auth/resend-otp`
  - Accepts: `email`, `type` (registration/admin-login)
  - Resends OTP for ongoing procedures
  - Rate-limited to prevent abuse

### 5. **User Endpoints**
- **Endpoint**: `GET /api/auth/me` (Protected)
  - Returns current authenticated user info
  - Requires valid JWT token

- **Endpoint**: `POST /api/auth/logout`
  - Logs out user and invalidates session

---

## 📁 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, lowercase),
  password: String (hashed with bcrypt),
  phoneNumber: String,
  role: String (default: "user", can be "user" or "admin"),
  avatar: String,
  isEmailVerified: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### OTP Sessions Collection
```javascript
{
  _id: ObjectId,
  email: String,
  otp: String (hashed),
  type: String ("registration" or "admin-login"),
  expiresAt: Date (default: 10 minutes from creation),
  attempts: Number (default: 0, max: 5),
  tempData: Object {
    name: String (for registration),
    password: String (hashed, for registration),
    passwordHash: String
  },
  createdAt: Date
}
```

---

## 🔐 Security Features

### 1. **Password Security**
- Bcrypt hashing with salt rounds: 10
- Passwords never stored in plain text
- Password validation: min 8 characters, must include uppercase, lowercase, numbers, and special characters

### 2. **OTP Security**
- 6-digit OTP generated randomly
- OTP expires in 10 minutes
- Maximum 5 attempts per OTP
- OTP hashed before storage
- Rate limiting on resend (1 resend per 60 seconds)

### 3. **JWT Security**
- JWT tokens issued for 7 days validity
- Tokens include user ID, email, and role
- Secret key: `process.env.JWT_SECRET`
- Protected routes require valid JWT

### 4. **Email Verification**
- Users must verify email via OTP during registration
- Admin login requires OTP verification as 2-factor authentication
- Prevents fake/invalid email registrations

### 5. **Rate Limiting**
- OTP attempts limited to 5 per session
- Resend OTP limited to once per 60 seconds
- Login attempts trackable via error responses

---

## 📋 Middleware

### `protect.js` - Authentication Middleware
- Protects routes requiring authenticated users
- Validates JWT token from Authorization header
- Extracts and stores user info in request object
- Returns 401 if token is missing or invalid

---

## 🚀 API Routes Summary

| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| POST | `/api/auth/register/send-otp` | Send OTP for registration | ❌ |
| POST | `/api/auth/register/verify-otp` | Verify OTP and register | ❌ |
| POST | `/api/auth/login` | User login | ❌ |
| POST | `/api/admin/login` | Admin login (send OTP) | ❌ |
| POST | `/api/admin/verify-otp` | Admin verify OTP | ❌ |
| POST | `/api/auth/resend-otp` | Resend OTP | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |
| POST | `/api/auth/logout` | User logout | ✅ |

---

## 📝 Implementation Files

### Controllers
- **`authController.js`** - Main authentication logic
  - `sendRegistrationOTP()` - Send registration OTP
  - `verifyRegistrationOTP()` - Verify registration OTP
  - `registerUser()` - Create new user
  - `loginUser()` - User login
  - `adminLoginSendOTP()` - Send admin login OTP
  - `adminLoginVerifyOTP()` - Verify admin login OTP
  - `resendOTP()` - Resend OTP
  - `logoutUser()` - User logout
  - `getMe()` - Get current user

### Models
- **`User.js`** - User schema and validation
- **`OTPSession.js`** - OTP session schema

### Middleware
- **`protect.js`** - JWT verification middleware

### Routes
- **`authRoutes.js`** - Authentication routes

### Services
- **`emailService.js`** - Email sending functionality
- **`otpService.js`** - OTP generation and validation

### Utilities
- **`dateUtils.js`** - Date formatting utilities

### Seed
- **`seedController.js`** - Demo data creation

---

## 🧪 Testing with cURL

### 1. Send Registration OTP
```bash
curl -X POST http://localhost:5000/api/auth/register/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

### 2. Verify Registration OTP & Register
```bash
curl -X POST http://localhost:5000/api/auth/register/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email":"user@example.com",
    "otp":"123456",
    "name":"John Doe",
    "password":"SecurePass123!"
  }'
```

### 3. User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"SecurePass123!"}'
```

### 4. Admin Login (Send OTP)
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"AdminPass123!"}'
```

### 5. Admin Verify OTP
```bash
curl -X POST http://localhost:5000/api/admin/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","otp":"123456"}'
```

### 6. Get Current User (Protected)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 7. Logout
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 8. Resend OTP
```bash
curl -X POST http://localhost:5000/api/auth/resend-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","type":"registration"}'
```

---

## 🔧 Environment Variables Required

```
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRY=7d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=noreply@ecommerce.com
OTP_EXPIRY=10
DATABASE_URL=your_mongodb_url
```

---

## 📊 Authentication Flow Diagrams

### User Registration Flow
```
1. User provides email → /register/send-otp
2. System sends OTP via email
3. User provides OTP, name, password → /register/verify-otp
4. System verifies OTP and creates user account
5. User can login with credentials
```

### User Login Flow
```
1. User provides email & password → /login
2. System validates credentials
3. System issues JWT token
4. User can access protected routes with JWT
```

### Admin Login Flow (with 2FA)
```
1. Admin provides email & password → /admin/login
2. System validates credentials
3. System sends OTP via email
4. Admin provides OTP → /admin/verify-otp
5. System verifies OTP and issues JWT token
6. Admin can access admin routes with JWT
```

---

## ✅ Completion Checklist

- ✅ User registration with OTP verification
- ✅ User login with JWT
- ✅ Admin login with 2FA (OTP verification)
- ✅ OTP resend functionality
- ✅ User logout
- ✅ Protected routes with JWT middleware
- ✅ Password hashing with bcrypt
- ✅ Email sending via SMTP
- ✅ Database models and schemas
- ✅ Error handling and validation
- ✅ Environment configuration
- ✅ Auth routes setup

---

## 🎯 Next Steps

1. **Frontend Integration**: Implement UI for registration, login, and OTP verification
2. **Admin Dashboard**: Create admin panel with role-based access
3. **Refresh Token**: Implement refresh token for token renewal
4. **OAuth Integration**: Add Google/GitHub OAuth options
5. **2FA for Users**: Optional 2FA setup for regular users
6. **Session Management**: Track active sessions and device management
7. **Audit Logging**: Log authentication events for security

---

**Last Updated**: 2024
**Status**: ✅ Production Ready
