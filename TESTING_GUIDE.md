# Module 5: Cart & Wishlist - Testing Guide

## ✅ Prerequisite Checks
- [x] Backend running on port 5000
- [x] Frontend running on port 5173
- [x] Both servers restarted after bug fixes
- [x] MongoDB connected
- [x] 3 test coupons seeded

## Test Coupons Reference
```
1. WELCOME10: 10% off, min ₹500, max discount ₹200
2. FLAT100: ₹100 off, min ₹1000
3. SAVE20: 20% off, min ₹2000, max discount ₹500
```

## 🛒 Cart API Endpoint Tests

### Test 1: POST /api/cart/add
**Scenario: Add product to cart**
- Login first (get auth cookie)
- Send: 
  ```json
  POST http://localhost:5000/api/cart/add
  {
    "productId": "67...",
    "quantity": 2,
    "price": 799
  }
  ```
- Expected: 200 OK with cart data, item added
- Edge Cases:
  - Quantity > stock → 400 error
  - Missing productId → 400 error
  - Not authenticated → 401 error

### Test 2: GET /api/cart
**Scenario: Fetch user's cart with populated product data**
- Expected: 200 OK with all product details populated
- Check: Item count, prices accurate, subtotal/total calculated

### Test 3: PUT /api/cart/update/:productId
**Scenario: Update quantity for existing cart item**
- Send: `{"quantity": 5}`
- Expected: 200 OK, quantity updated, totals recalculated
- Edge Case: Quantity > stock → 400 error (auto-fixed)

### Test 4: DELETE /api/cart/remove/:productId
**Scenario: Remove single item from cart**
- Expected: 200 OK, item removed
- Check: Item count decreases, totals recalculated

### Test 5: DELETE /api/cart/clear
**Scenario: Empty entire cart**
- Expected: 200 OK, cart cleared
- Check: itemCount = 0, items = []

---

## 💳 Coupon Tests

### Test 6: POST /api/cart/coupon (WELCOME10)
**Scenario: Apply 10% discount coupon - min ₹500 order**
- Add products totaling ₹800+
- Send: `{"couponCode": "WELCOME10"}`
- Expected: 
  - 200 OK
  - discount = ₹80 (10% of 800)
  - total reduced by ₹80
  - Message: "Coupon applied successfully"

### Test 7: POST /api/cart/coupon (WELCOME10 - Min Order Failed)
**Scenario: Apply coupon with insufficient order value**
- Add products totaling ₹300
- Send: `{"couponCode": "WELCOME10"}`
- Expected: 400 error
- Message: "Order value must be at least ₹500"

### Test 8: POST /api/cart/coupon (FLAT100)
**Scenario: Apply ₹100 flat discount - min ₹1000 order**
- Add products totaling ₹1500
- Send: `{"couponCode": "FLAT100"}`
- Expected:
  - 200 OK
  - discount = ₹100 (flat amount)
  - total reduced by ₹100

### Test 9: POST /api/cart/coupon (SAVE20)
**Scenario: Apply 20% discount - min ₹2000, max discount ₹500**
- Add products totaling ₹3000
- Send: `{"couponCode": "SAVE20"}`
- Expected:
  - 200 OK
  - Calculated discount = ₹600 (20% of 3000)
  - But capped at ₹500 (max limit)
  - total reduced by ₹500

### Test 10: POST /api/cart/coupon (Invalid Coupon)
**Scenario: Apply non-existent coupon**
- Send: `{"couponCode": "INVALID123"}`
- Expected: 400 error
- Message: "Invalid or expired coupon"

### Test 11: DELETE /api/cart/coupon
**Scenario: Remove applied coupon**
- Apply WELCOME10 first
- Then DELETE /api/cart/coupon
- Expected: 200 OK, coupon removed, total reset

---

## ❤️ Wishlist API Tests

### Test 12: POST /api/wishlist/toggle
**Scenario: Toggle product to wishlist**
- Send: `{"productId": "67..."}`
- Expected: 200 OK, item added
- Check: Response includes isWishlisted = true

### Test 13: POST /api/wishlist/toggle (Already Wishlisted)
**Scenario: Toggle product that's already wishlisted**
- Send same productId again
- Expected: 200 OK, item removed
- Check: Response includes isWishlisted = false

### Test 14: GET /api/wishlist
**Scenario: Fetch all wishlisted items**
- Expected: 200 OK with array of complete product objects
- Check: All product details populated (name, price, image)

### Test 15: DELETE /api/wishlist/clear
**Scenario: Clear entire wishlist**
- Expected: 200 OK, wishlist cleared
- Check: Next GET returns empty array []

---

## 🎨 UI Interaction Tests

### Test 16: Cart Drawer Animation
**Location: http://localhost:5173/products**
- Click cart icon in navbar
- Expected: 
  - Drawer slides in from right
  - Backdrop appears
  - Body scroll locked
  - Click backdrop/X → drawer slides out smoothly

### Test 17: Cart Badge Count
**Scenario: Add item to cart, check badge**
- Badge shows "2" when 2 items in cart
- Expected: Badge updates in real-time
- Click cart icon → drawer shows same count

### Test 18: Quantity Controls
**In CartDrawer:**
- Click + button → quantity increases instantly
- Click − button → quantity decreases instantly
- Expected: Total price updates immediately (optimistic update)
- Subtotal/Total recalculate instantly

### Test 19: Remove Item from Cart
**In CartDrawer:**
- Click trash icon on item
- Expected: 
  - Item removed instantly
  - Counter updates
  - Toast: "Item removed from cart"

### Test 20: Apply Coupon in UI
**In CartDrawer:**
- Enter "WELCOME10" in coupon field
- Click "Apply Coupon"
- Expected:
  - Toast success: "Coupon applied successfully"
  - Discount shows below items
  - Total updated
  - Coupon input becomes just display text

### Test 21: Remove Coupon in UI
**After applying coupon:**
- Click X/Remove button on coupon display
- Expected:
  - Toast: "Coupon removed"
  - Discount clears
  - Total reset to full price

### Test 22: Heart Button (Wishlist)
**On ProductCard:**
- Not wishlisted → outline heart
- Click → filled red heart (optimistic)
- Expected: 
  - Toast: "Added to wishlist"
  - Heart stays filled
- Click again → outline again
  - Toast: "Removed from wishlist"

### Test 23: Not Logged In - Cart
**Scenario: Add to cart without login**
- Expected: 
  - Toast error: "Please login first"
  - Cart not updated

### Test 24: Not Logged In - Wishlist
**Scenario: Click heart without login**
- Expected:
  - Toast error: "Please login first"
  - Redirect to login

### Test 25: Wishlist Page
**Navigate: http://localhost:5173/wishlist**
- Add some items to wishlist first
- Expected:
  - All wishlisted products displayed
  - Can Add to Cart from here
  - "Clear Wishlist" button works
  - Empty state shows when no items

### Test 26: Cart Drawer - Empty State
**When cart is empty:**
- Expected:
  - "Your cart is empty" message
  - Shopping suggestion
  - "Continue Shopping" button

---

## 🔐 Authentication Tests

### Test 27: Cart Reset on Logout
**Scenario: Add items to cart, then logout**
- Expected:
  - Cart drawer closes
  - Badge disappears
  - Cart context cleared
  - Next login → fresh empty cart

### Test 28: Cart Persistence on Login
**Scenario: Add item, logout, login again**
- Expected:
  - Item added (before logout)
  - After login with same user → cart restored
  - Item still there from before

---

## 📱 Toast Notification Tests

### Test 29: Success Toasts
- [ ] Item added to cart → "Added to cart successfully"
- [ ] Coupon applied → "Coupon applied successfully"
- [ ] Added to wishlist → "Added to wishlist"

### Test 30: Error Toasts
- [ ] Stock exceeded → "Ordered quantity exceeds available stock"
- [ ] Invalid coupon → "Invalid or expired coupon"
- [ ] Min order not met → "Order value must be at least ₹{minAmount}"
- [ ] Not logged in → "Please login first"

---

## 🚀 End-to-End Flow Tests

### Test 31: Complete Purchase Flow
1. Add multiple products to cart
2. Apply valid coupon (WELCOME10)
3. Verify discount applied
4. Check total calculation is correct
5. Expected: No errors, totals accurate

### Test 32: Stock Validation Flow
1. Add product with quantity greater than stock
2. Expected: 400 error "Ordered quantity exceeds available stock"
3. Auto-fix should reduce to max available stock

### Test 33: Multiple Coupons
1. Apply WELCOME10
2. Apply FLAT100
3. Expected: Only latest coupon applied (previous removed)

---

## ✅ Verification Checklist

**Backend Validation:**
- [ ] All cart endpoints return correct status codes
- [ ] Stock validation works (>stock = 400)
- [ ] All 3 coupons apply correctly with min/max logic
- [ ] Cart auto-clears on invalid products
- [ ] User auth required on all endpoints

**Frontend Validation:**
- [ ] CartDrawer slides smoothly from right
- [ ] Badge updates in real-time
- [ ] Quantity +/− optimistic updates work
- [ ] Wishlist heart toggles with animation
- [ ] All toast messages appear at correct times
- [ ] WishlistPage protected (redirects to login)
- [ ] Empty states display correctly

**Integration Tests:**
- [ ] Add to cart → drawer shows item
- [ ] Apply coupon → total updates
- [ ] Toggle wishlist → heart fills/unfills
- [ ] Logout → cart clears, redirects to home
- [ ] Login again → can access protected features

---

## 🐛 Known Issues (Fixed)
- ✅ HomePage navbar structure (FIXED)
- ✅ Duplicate AuthProvider in main.jsx (FIXED)

---

## 📝 Notes
- Use Postman for API testing with authentication cookie
- Use Browser DevTools for UI/UX verification
- Check Console for any JavaScript errors
- Check Network tab for failed API requests
- All timestamps and expiry validation handled server-side

