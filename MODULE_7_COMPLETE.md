# Module 7: Order Management - Complete Documentation

## Overview
Module 7 implements a complete order management system for the e-commerce platform, including:
- Order creation from cart with validation
- Real-time order tracking and status updates
- Email notifications for customers
- Admin order management dashboard
- Order history for customers
- Stock management and coupon handling

---

## BACKEND IMPLEMENTATION

### 1. Models

#### Order Model (`server/models/Order.js`)
- **Auto-generated Order Number**: `ORD-YYYYMMDD-XXXXX` format
- **Item Snapshots**: Stores name, image, price at time of order
- **Status Tracking**: Full lifecycle from placed → delivered
- **Status History**: Complete audit trail with admin notes
- **Address Storage**: Full shipping address with validation
- **Payment Tracking**: Status and method (COD or online)
- **Methods**:
  - `canBeCancelled()`: Check if order can be cancelled

### 2. Controllers

#### User Order Controller (`server/controllers/orderController.js`)
- **createOrder**: 
  - Validates cart items and stock
  - Creates order with snapshots
  - Reduces product stock
  - Increments coupon usage
  - Clears cart on success
  - Sends confirmation email
  - Returns order with success message
  
- **getMyOrders**: 
  - Fetches user's orders with pagination
  - Supports status filtering
  - Populates product details for links
  
- **getOrderById**: 
  - Retrieves single order
  - Security check: users can only see their own orders
  
- **cancelOrder**: 
  - Validates order can be cancelled
  - Restores stock
  - Handles refunds if needed
  - Sends cancellation email

#### Admin Order Controller (`server/controllers/adminOrderController.js`)
- **getAllOrders**: 
  - Multi-filter support (status, payment, search, date range)
  - Pagination
  - Returns summary statistics
  
- **getOrderStats**: 
  - Total orders, revenue, averages
  - Orders by status breakdown
  - Today's metrics
  
- **getOrderByIdAdmin**: 
  - Full order details with all relations
  
- **updateOrderStatus**: 
  - One-way status progression validation
  - Auto-sets estimated delivery on ship
  - Auto-marks COD as paid on delivery
  - Restores stock on cancellation
  - Sends status update email
  
- **updatePaymentStatus**: 
  - Admin payment status control
  
- **addOrderNote**: 
  - Internal admin notes

### 3. Email System

#### Email Utility (`server/utils/sendEmail.js`)
- Nodemailer integration
- Development mode: Auto-generates Ethereal test account
- Non-blocking error handling
- Preview URLs for test emails

#### Email Templates (`server/utils/emailTemplates.js`)
Three professional HTML templates:
1. **Order Confirmation**: Shows items, price breakdown, shipping address
2. **Status Updates**: Dynamic message based on status with delivery estimate
3. **Cancellation**: Includes refund information

### 4. Routes

#### User Routes (`server/routes/orderRoutes.js`)
```
POST   /api/orders               - Create order
GET    /api/orders/my-orders     - Get user's orders
GET    /api/orders/:id           - Get order details
PUT    /api/orders/:id/cancel    - Cancel order
```

#### Admin Routes (`server/routes/adminOrderRoutes.js`)
```
GET    /api/admin/orders         - List all orders (with filters)
GET    /api/admin/orders/stats   - Get statistics
GET    /api/admin/orders/:id     - Get order detail
PUT    /api/admin/orders/:id/status  - Update status
PUT    /api/admin/orders/:id/payment - Update payment status
PUT    /api/admin/orders/:id/note    - Add notes
```

### 5. Database Updates
- **Updated Admin Stats** (`adminController.js`):
  - Now uses real Order model
  - Calculates total revenue from paid orders
  - Includes real order counts

### 6. Server Configuration
- Mount both route sets in `server.js`
- Updated admin routes to include order routes

---

## FRONTEND IMPLEMENTATION

### 1. Hooks

#### useOrders Hook (`client/src/hooks/useOrders.js`)
```javascript
- State: orders, pagination, loading, error, filters
- Methods:
  - fetchOrders(customFilters)
  - updateFilter(key, value)
  - changePage(page)
  - cancelOrder(orderId, reason)
```

### 2. Checkout Components

#### CheckoutSteps (`components/checkout/CheckoutSteps.jsx`)
- Visual 3-step progress indicator
- Shows completed, current, and future steps
- Step labels: Address → Review → Payment

#### AddressStep (`components/checkout/AddressStep.jsx`)
- Display saved addresses as selectable cards
- Form to add new address
- Validates all required fields
- Auto-selects new address after creation

#### ReviewStep (`components/checkout/ReviewStep.jsx`)
- Shows delivery address (with change button)
- Lists all cart items with images
- Price breakdown (subtotal, discount, shipping, total)
- Payment method selection (COD only for now)
- Place Order button with loading state

#### PaymentPlaceholder (`components/checkout/PaymentPlaceholder.jsx`)
- Simple component noting Module 8 for online payments
- Currently directs to COD flow

### 3. Checkout Pages

#### CheckoutPage (`pages/shop/CheckoutPage.jsx`)
- Protected route (/checkout)
- Redirect if cart empty
- Multi-step checkout flow
- Creates order via `/api/orders`
- Clears cart on success
- Navigates to success page

#### OrderSuccessPage (`pages/shop/OrderSuccessPage.jsx`)
- Shows success animation
- Displays order number (copyable)
- Summary of items and total
- Estimated delivery date
- Shipping address recap
- Links to order details and continue shopping

### 4. Order Components

#### OrderStatusStepper (`components/orders/OrderStatusStepper.jsx`)
- Horizontal flow: Placed → Confirmed → Processing → Shipped → Delivered
- Shows dates from status history
- Handles cancelled/returned states

#### OrderItemsList (`components/orders/OrderItemsList.jsx`)
- Table showing all order items
- Images, names, unit prices, quantities
- Links to product detail pages

#### OrderCard (`components/orders/OrderCard.jsx`)
- Compact card for order lists
- Shows order number, date, status badges
- Payment status badge
- Item count and first item name
- Click to view details

### 5. Order Pages

#### OrderDetailPage (`pages/shop/OrderDetailPage.jsx`)
- Full order view for customers
- Status stepper at top
- Left: Items list and price breakdown
- Right: Shipping info, payment status
- Cancel button (if allowed)
- Skeleton loading state

#### OrdersTab (`pages/user/OrdersTab.jsx`)
- Replaces Module 3 placeholder
- Filter tabs: All, Active, Delivered, Cancelled
- Order cards in responsive grid
- Empty states per filter
- Pagination support
- Loading skeletons

### 6. Admin Order Components

#### OrderTable (`components/admin/orders/OrderTable.jsx`)
- Full-width admin table
- Columns: Order #, Customer, Items, Total, Payment, Status, Date, Actions
- View detail button for each order
- Status badges with colors

#### OrderStatusSelect (`components/admin/orders/OrderStatusSelect.jsx`)
- Dropdown for valid next statuses
- Optional note field
- Handles validation & updates
- Loading state during update
- Toast notifications

### 7. Admin Order Pages

#### AdminOrdersPage (`pages/admin/orders/AdminOrdersPage.jsx`)
- Stats cards: Total Orders, Revenue, Avg Value, Pending
- Multi-filter bar: Status, Payment, Search
- OrderTable component
- Real-time stat updates

#### AdminOrderDetailPage (`pages/admin/orders/AdminOrderDetailPage.jsx`)
- Full order view with admin controls
- Status update section with note input
- Payment status selector
- Admin notes textarea with save button
- Complete status history timeline
- Customer and shipping details

### 8. Routing

Updated in `main.jsx`:
```javascript
// Protected routes
/checkout                   → CheckoutPage
/order-success/:orderId    → OrderSuccessPage
/account/orders/:orderId   → OrderDetailPage
/account/orders             → OrdersTab (in UserLayout)

// Admin routes
/admin/orders              → AdminOrdersPage
/admin/orders/:id          → AdminOrderDetailPage
```

### 9. Sidebar Update
- Enabled Orders link in admin sidebar
- Removed "disabled" and "Soon" labels
- Now navigates to `/admin/orders`

---

## ENVIRONMENT VARIABLES

Add to `server/.env`:

```env
# Email Configuration
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=your_ethereal_user
SMTP_PASS=your_ethereal_pass
FRONTEND_URL=http://localhost:5173

# Or use real SMTP (Gmail, SendGrid, etc)
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password
```

---

## INSTALLATION STEPS

### Backend
```bash
cd server
npm install nodemailer
npm run dev
```

### Frontend
```bash
cd client
npm run dev
```

### Email Testing
1. If `SMTP_USER` not set, Ethereal account auto-generates
2. Check terminal for preview URL after each email
3. Production: Replace with real SMTP credentials

---

## KEY FEATURES

✅ **Automatic Order Numbers**: `ORD-YYYYMMDD-XXXXX`
✅ **Item Snapshots**: Prices locked at order time
✅ **Stock Management**: Auto-deduct and restore
✅ **Email Notifications**: Confirmation, status updates, cancellations
✅ **Status Progression**: One-way validation to prevent errors
✅ **Coupon Integration**: Track usage after order
✅ **Cart Clearing**: Auto-clear after successful order
✅ **Admin Dashboard**: Full order stats and management
✅ **Multi-Step Checkout**: Address selection → Review → Order
✅ **Order History**: Filter and search for customers
✅ **Cancellation Support**: With refund handling
✅ **Security**: Users can only see their own orders

---

## TESTING CHECKLIST

### Checkout Flow
- [ ] Add product to cart
- [ ] Navigate to checkout
- [ ] Select existing address or add new
- [ ] Review order details
- [ ] Place order
- [ ] Verify success page
- [ ] Check email confirmation (Ethereal)
- [ ] Verify cart is cleared
- [ ] Check order in /account/orders

### Order Management
- [ ] View order details from account
- [ ] See order status and history
- [ ] Cancel order (if in valid status)
- [ ] Verify cancellation email
- [ ] Check stock was restored

### Admin Dashboard
- [ ] View orders in admin panel
- [ ] Filter by status and payment
- [ ] Search for orders
- [ ] View full order detail
- [ ] Update order status with note
- [ ] Update payment status
- [ ] Add/edit admin notes
- [ ] See stats update in real-time

### Edge Cases
- [ ] Out of stock item validation
- [ ] Inactive product handling
- [ ] Invalid address fields
- [ ] Order cancellation when not allowed (shipped/delivered)
- [ ] Coupon usage increment
- [ ] Email failure (should not block order)

---

## NOTES

1. **COD Only**: Online payment is scaffolded for Module 8
2. **Email Staging**: Ethereal is perfect for development
3. **Stock Atomicity**: Order created before stock reduction to maintain consistency
4. **Email Non-Blocking**: Mail failures don't affect order success
5. **Status History**: Complete audit trail for compliance
6. **Coupon Integration**: Only increments on successful order creation
7. **Cart Clearing**: Automatic after order success
8. **Pagination**: Built into both user and admin order lists

---

## NEXT STEPS (Module 8)

- Implement online payment integration (Razorpay, Stripe)
- Add order return/exchange flow
- Implement email reminder for pending orders
- Add invoice PDF generation
- Payment webhook handling
- Order analytics dashboard
