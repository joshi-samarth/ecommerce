# Module 2: Admin Dashboard - Complete Build

## ✅ What's Been Created

### Backend Files
- **server/controllers/adminController.js** — 4 admin endpoints with safe model handling
- **server/routes/adminRoutes.js** — Protected routes with `protect + isAdmin` middleware
- **server/server.js** — Updated to mount admin routes

### Frontend Files
- **client/src/layouts/AdminLayout.jsx** — Main layout wrapper with sidebar & topbar
- **client/src/components/admin/Sidebar.jsx** — Navigation sidebar with active state
- **client/src/components/admin/TopBar.jsx** — Top navigation bar with user info
- **client/src/components/admin/StatCard.jsx** — Reusable stat card component
- **client/src/pages/admin/AdminDashboardPage.jsx** — Dashboard with stats grid
- **client/src/pages/admin/AdminUsersPage.jsx** — User management table
- **client/src/main.jsx** — Updated routes with nested admin routes

---

## 🚀 Backend Endpoints

All endpoints require both `protect` and `isAdmin` middleware.

### Statistics
```
GET /api/admin/stats
Response:
{
  "success": true,
  "data": {
    "totalUsers": 1,
    "totalAdmins": 1,
    "totalProducts": 0,
    "totalOrders": 0,
    "totalRevenue": 0
  }
}
```

### Users Management
```
GET /api/admin/users
Response: Array of all users (password excluded)

PUT /api/admin/users/:id/role
Body: { "role": "admin" | "user" }
Returns: Updated user object

DELETE /api/admin/users/:id
Returns: { "success": true, "message": "User deleted successfully" }
```

---

## 🧪 Testing the Admin Dashboard

### Step 1: Start Both Servers

**Backend:**
```powershell
cd server
npm run dev
```

**Frontend:**
```powershell
cd client
npm run dev
```

### Step 2: Seed Demo Data (Already Done)

The demo users from Module 1 already exist:
- Admin: `admin@example.com` / `admin123`
- User: `user@example.com` / `password123`

### Step 3: Test Admin Login

1. Go to http://localhost:5173/admin-login
2. Click "🔑 Demo Admin Credentials"
3. Click "Admin Sign In"
4. You'll be redirected to `/admin` (Admin Dashboard)

### Step 4: Explore Dashboard

**Dashboard (/admin):**
- View 5 stat cards:
  - Total Users: 2 (admin + demo user)
  - Total Admins: 1
  - Total Products: 0
  - Total Orders: 0
  - Total Revenue: ₹0.00
- "Recent Orders" placeholder (coming in Module 7)

**Users Management (/admin/users):**
- Table with all users
- View: Name, Email, Role, Join Date
- Actions:
  - **Make Admin/Make User** — Changes user role
  - **Delete** — Removes user from system
  - Actions disabled on current logged-in admin's own row

### Step 5: Test User Management

1. Click "Users" in sidebar
2. See table with 2 users (admin + demo user)
3. Try toggling the demo user's role (Make Admin)
4. Try deleting a user (will prompt confirmation)
5. Verify success message appears

---

## 🎨 Feature Highlights

### Frontend Features
✅ **Responsive Sidebar** — Hidden on mobile, toggle button shows overlay
✅ **Active NavLink Styling** — Bold + blue border-left on active page
✅ **Stat Cards** — Color-coded with icons, responsive grid
✅ **User Table** — Sortable, action buttons, role badges
✅ **Loading States** — Spinner while fetching
✅ **Error Handling** — Toast notifications for errors/success
✅ **User Info** — Displays logged-in admin name & role
✅ **Logout** — Sidebar logout button redirects to /login

### Backend Features
✅ **Safe Model Handling** — Stats won't crash if Product/Order don't exist
✅ **Parallel Fetching** — Uses Promise.all for efficiency
✅ **Role Protection** — Prevent admins from changing own role
✅ **Self-Delete Protection** — Admins can't delete themselves
✅ **Clean Errors** — Proper JSON error responses
✅ **No Password Leaks** — Password field excluded from all responses

---

## 📁 File Structure

```
server/
  ✅ controllers/adminController.js   (NEW)
  ✅ routes/adminRoutes.js             (NEW)
  ✅ server.js                         (UPDATED)

client/src/
  ✅ layouts/AdminLayout.jsx           (NEW)
  ✅ pages/admin/AdminDashboardPage.jsx (NEW)
  ✅ pages/admin/AdminUsersPage.jsx    (NEW)
  ✅ components/admin/Sidebar.jsx      (NEW)
  ✅ components/admin/TopBar.jsx       (NEW)
  ✅ components/admin/StatCard.jsx     (NEW)
  ✅ main.jsx                          (UPDATED)
```

---

## 🔐 Security Notes

- ✅ All admin routes protected with `protect` + `isAdmin` middleware
- ✅ Password field never exposed in API responses
- ✅ Admin can't modify own role or delete own account
- ✅ CORS configured for frontend origin only
- ✅ JWT tokens in httpOnly cookies

---

## 🚦 Route Tree

```
/login                    → UserLoginPage
/admin-login             → AdminLoginPage
/register                → UserRegisterPage

/                        → Home (protected user route)

/admin                   → AdminLayout (protected admin route)
  ├─ index               → AdminDashboardPage
  └─ /users              → AdminUsersPage
```

---

## ✨ What's Next?

**Module 3 (Products)** will add:
- Product model & CRUD operations
- `/admin/products` page in admin dashboard
- Product stats in dashboard

**Module 4 (Shopping)** will add:
- Home page product catalog
- Shopping cart functionality

**Module 7 (Orders)** will add:
- Order model & CRUD operations
- `/admin/orders` page
- Revenue calculation in stats

---

## 🐛 Troubleshooting

**Q: Admin dashboard shows 0 for Products/Orders/Revenue?**
A: This is expected! Those models are created in Modules 4 & 7. The stats endpoint safely handles missing models.

**Q: Can't toggle user role?**
A: You can't change the admin's own role. Create another admin first with `/api/admin/users/:id/role`, then toggle it.

**Q: Sidebar not showing on mobile?**
A: Tap the blue button (☰) at bottom-right to toggle sidebar overlay.

**Q: Getting 403 Forbidden on admin endpoints?**
A: Make sure you're logged in as admin. Regular users can't access `/api/admin` routes.

---

**Module 2 is complete! Admin dashboard is fully functional with user management. 🎉**
