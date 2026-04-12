# Module 5: Cart & Wishlist - Postman Testing Examples

## 🔑 Authentication Setup
1. Login first at: `POST http://localhost:5000/api/auth/login`
   ```json
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```
2. Cookie will be automatically set by browser (httpOnly)
3. Postman: Set `Cookie` header manually if testing in Postman

---

## 🛒 Cart API Examples

### Example 1: Add Item to Cart
```
Method: POST
URL: http://localhost:5000/api/cart/add
Headers: 
  Content-Type: application/json
  Cookie: connect.sid=your_session_id

Body:
{
  "productId": "67a1b2c3d4e5f6g7h8i9j0k1",
  "quantity": 2,
  "price": 799
}

Expected Response (200):
{
  "success": true,
  "data": {
    "_id": "cart_id",
    "userId": "user_id",
    "items": [
      {
        "_id": "item_id",
        "productId": "67a1b2c3d4e5f6g7h8i9j0k1",
        "quantity": 2,
        "price": 799,
        "subtotal": 1598
      }
    ],
    "subtotal": 1598,
    "discountAmount": 0,
    "total": 1598,
    "itemCount": 2
  }
}
```

### Example 2: Fetch Cart
```
Method: GET
URL: http://localhost:5000/api/cart
Headers:
  Cookie: connect.sid=your_session_id

Expected Response (200):
{
  "success": true,
  "data": {
    "_id": "cart_id",
    "userId": "user_id",
    "items": [
      {
        "_id": "item_id",
        "productId": {
          "_id": "67a1b2c3d4e5f6g7h8i9j0k1",
          "name": "Product Name",
          "price": 799,
          "image": "url",
          "stock": 50
        },
        "quantity": 2,
        "price": 799,
        "subtotal": 1598
      }
    ],
    "subtotal": 1598,
    "discountAmount": 0,
    "total": 1598,
    "itemCount": 2
  }
}
```

### Example 3: Update Item Quantity
```
Method: PUT
URL: http://localhost:5000/api/cart/update/67a1b2c3d4e5f6g7h8i9j0k1
Headers:
  Content-Type: application/json
  Cookie: connect.sid=your_session_id

Body:
{
  "quantity": 3
}

Expected Response (200):
{
  "success": true,
  "message": "Cart updated",
  "data": { ... updated cart ... }
}

Error Response (400 - Exceeds Stock):
{
  "success": false,
  "message": "Ordered quantity exceeds available stock",
  "availableStock": 20
}
```

### Example 4: Remove Item from Cart
```
Method: DELETE
URL: http://localhost:5000/api/cart/remove/67a1b2c3d4e5f6g7h8i9j0k1
Headers:
  Cookie: connect.sid=your_session_id

Expected Response (200):
{
  "success": true,
  "message": "Item removed from cart",
  "data": { ... updated cart ... }
}
```

### Example 5: Clear Entire Cart
```
Method: DELETE
URL: http://localhost:5000/api/cart/clear
Headers:
  Cookie: connect.sid=your_session_id

Expected Response (200):
{
  "success": true,
  "message": "Cart cleared",
  "data": {
    "items": [],
    "subtotal": 0,
    "discountAmount": 0,
    "total": 0,
    "itemCount": 0
  }
}
```

---

## 💳 Coupon API Examples

### Example 6: Apply WELCOME10 Coupon
```
Method: POST
URL: http://localhost:5000/api/cart/coupon
Headers:
  Content-Type: application/json
  Cookie: connect.sid=your_session_id

Body:
{
  "couponCode": "WELCOME10"
}

Success Response (200) - Order ₹1000:
{
  "success": true,
  "message": "Coupon applied successfully",
  "data": {
    "couponCode": "WELCOME10",
    "discountType": "percent",
    "discountValue": 10,
    "discountAmount": 100,
    "subtotal": 1000,
    "total": 900
  }
}

Error Response (400) - Below min order:
{
  "success": false,
  "message": "Order value must be at least ₹500"
}

Error Response (400) - Invalid coupon:
{
  "success": false,
  "message": "Invalid or expired coupon"
}
```

### Example 7: Apply FLAT100 Coupon
```
Method: POST
URL: http://localhost:5000/api/cart/coupon
Headers:
  Content-Type: application/json
  Cookie: connect.sid=your_session_id

Body:
{
  "couponCode": "FLAT100"
}

Success Response (200) - Order ₹2000:
{
  "success": true,
  "message": "Coupon applied successfully",
  "data": {
    "couponCode": "FLAT100",
    "discountType": "flat",
    "discountValue": 100,
    "discountAmount": 100,
    "subtotal": 2000,
    "total": 1900
  }
}

Error Response (400) - Below min order ₹1000:
{
  "success": false,
  "message": "Order value must be at least ₹1000"
}
```

### Example 8: Apply SAVE20 Coupon with Max Discount
```
Method: POST
URL: http://localhost:5000/api/cart/coupon
Headers:
  Content-Type: application/json
  Cookie: connect.sid=your_session_id

Body:
{
  "couponCode": "SAVE20"
}

Success Response (200) - Order ₹3000 (20% = ₹600, but capped at ₹500):
{
  "success": true,
  "message": "Coupon applied successfully",
  "data": {
    "couponCode": "SAVE20",
    "discountType": "percent",
    "discountValue": 20,
    "maxDiscount": 500,
    "discountAmount": 500,
    "subtotal": 3000,
    "total": 2500
  }
}
```

### Example 9: Remove Coupon
```
Method: DELETE
URL: http://localhost:5000/api/cart/coupon
Headers:
  Cookie: connect.sid=your_session_id

Expected Response (200):
{
  "success": true,
  "message": "Coupon removed",
  "data": {
    "subtotal": 1000,
    "discountAmount": 0,
    "total": 1000,
    "couponCode": null
  }
}
```

---

## ❤️ Wishlist API Examples

### Example 10: Toggle Product to Wishlist
```
Method: POST
URL: http://localhost:5000/api/wishlist/toggle
Headers:
  Content-Type: application/json
  Cookie: connect.sid=your_session_id

Body:
{
  "productId": "67a1b2c3d4e5f6g7h8i9j0k1"
}

Success Response (200) - Added:
{
  "success": true,
  "message": "Added to wishlist",
  "data": {
    "isWishlisted": true,
    "wishlistCount": 5
  }
}

Success Response (200) - Removed (toggled again):
{
  "success": true,
  "message": "Removed from wishlist",
  "data": {
    "isWishlisted": false,
    "wishlistCount": 4
  }
}
```

### Example 11: Fetch Wishlist
```
Method: GET
URL: http://localhost:5000/api/wishlist
Headers:
  Cookie: connect.sid=your_session_id

Expected Response (200):
{
  "success": true,
  "data": [
    {
      "_id": "67a1b2c3d4e5f6g7h8i9j0k1",
      "name": "Product Name",
      "price": 799,
      "category": "Electronics",
      "image": "url",
      "stock": 50,
      "rating": 4.5,
      "reviews": 25
    },
    {
      "_id": "67a1b2c3d4e5f6g7h8i9j0k2",
      "name": "Another Product",
      "price": 1299,
      "category": "Gadgets",
      "image": "url",
      "stock": 30,
      "rating": 4.2,
      "reviews": 18
    }
  ]
}

Empty Response:
{
  "success": true,
  "data": []
}
```

### Example 12: Clear Wishlist
```
Method: DELETE
URL: http://localhost:5000/api/wishlist/clear
Headers:
  Cookie: connect.sid=your_session_id

Expected Response (200):
{
  "success": true,
  "message": "Wishlist cleared",
  "data": []
}
```

---

## 🧪 Test Scenarios

### Scenario 1: Complete Cart Flow
```
1. POST /api/cart/add → Add product with quantity 2, price 799 ✓
2. GET /api/cart → Verify subtotal = 1598 ✓
3. PUT /api/cart/update/productId → Update to quantity 3 ✓
4. GET /api/cart → Verify subtotal = 2397 ✓
5. POST /api/cart/coupon → Apply WELCOME10 ✓
6. GET /api/cart → Verify discount = 239.7, total = 2157.3 ✓
7. DELETE /api/cart/coupon → Remove coupon ✓
8. GET /api/cart → Verify discount = 0, total = 2397 ✓
9. DELETE /api/cart/remove/productId → Remove 1 item ✓
10. DELETE /api/cart/clear → Clear cart ✓
```

### Scenario 2: Coupon Validation Flow
```
1. Add item with price 300
2. POST /api/cart/coupon (WELCOME10) → 400 error "min ₹500" ✓
3. Add more items to reach 600 total
4. POST /api/cart/coupon (WELCOME10) → 200 OK, discount = 60 ✓
5. Update to reach 1200 total pre-coupon
6. Discount should now = 120 (capped at 200) ✓
```

### Scenario 3: Wishlist + Cart Combo
```
1. POST /api/wishlist/toggle → Add to wishlist ✓
2. GET /api/wishlist → Verify item in wishlist ✓
3. POST /api/cart/add → Add same item to cart ✓
4. GET /api/cart → Verify in cart ✓
5. DELETE /api/wishlist/clear → Clear wishlist ✓
6. GET /api/cart → Item still in cart ✓
```

---

## 🔍 Debugging Tips

### Check Auth Flow
- Login at `/api/auth/login`
- Cookie should be set in browser
- Each cart/wishlist request includes cookie
- If error 401: Cookie not sent or expired

### Check Stock Validation
- Get product stock from `/api/products`
- Try updating cart with quantity > stock
- Should get 400: "Ordered quantity exceeds available stock"

### Check Coupon Logic
- WELCOME10: 10% off, min ₹500, max discount ₹200
- FLAT100: ₹100 off, min ₹1000
- SAVE20: 20% off, min ₹2000, max discount ₹500
- If error: Check subtotal is >= minAmount

### Network Debugging
- Open Browser DevTools → Network tab
- Look for failed requests (red status codes)
- Check request headers have Cookie
- Check response includes proper success/error message

### Console Debugging
- Check for JavaScript errors
- Check for axios/fetch errors
- Cart/Wishlist contexts should log operations
- Toast messages should appear

---

## ✅ Success Criteria
- [ ] All cart API endpoints return 200 OK
- [ ] All coupon validations work correctly
- [ ] All wishlist operations work
- [ ] Toast notifications appear
- [ ] UI updates in real-time (optimistic updates)
- [ ] Stock validation works (400 on overflow)
- [ ] Auth required on all endpoints (401 if no cookie)

