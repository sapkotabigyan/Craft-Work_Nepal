# KalaBazzer - Testing Guide

Complete testing guide for the KalaBazzer ecommerce platform.

## 🧪 Pre-Test Checklist

Before testing, ensure:

- ✅ Backend API is running on port 4000
- ✅ Admin Panel is running on port 5173
- ✅ Client Application is running on port 3000
- ✅ PostgreSQL database is running
- ✅ Database has products seeded
- ✅ Browser console is open for error checking

---

## 📱 Client Application Testing

### Test 1: Home Page Navigation

1. Open http://localhost:3000 in your browser
2. **Verify:**
   - ✓ Page loads without errors
   - ✓ CraftWork Nepal logo is visible
   - ✓ Hero section displays properly
   - ✓ Features section shows 3 cards
   - ✓ Categories section shows wooden, handmade, traditional
   - ✓ Testimonials section displays reviews with star ratings
   - ✓ CTA button is visible and clickable

**Expected Result:** Home page displays all sections with proper styling and no console errors

---

### Test 2: Navigation Functionality

1. Click on different navigation links
2. **Verify each link:**
   - ✓ "Home" → Redirects to http://localhost:3000/
   - ✓ "Products" → Redirects to http://localhost:3000/products
   - ✓ "About" → Redirects to http://localhost:3000/about
   - ✓ Shopping cart icon appears in header
   - ✓ Mobile menu toggle works (on mobile/tablet)

**Expected Result:** All navigation links work correctly and routes are updated

---

### Test 3: Products Page - Display

1. Click "Products" in navigation or "Shop Now" button
2. Navigate to http://localhost:3000/products
3. **Verify:**
   - ✓ Page loads from backend API
   - ✓ Products display in grid layout
   - ✓ Each product card shows:
     - Image (or placeholder)
     - Product name
     - Description
     - Price in NPR
     - Category badge
     - "Add to Cart" button
   - ✓ No console errors
   - ✓ Loading state briefly appears if backend is slow

**Expected Result:** Product grid displays with all expected information

---

### Test 4: Products Page - Filtering

1. On Products page, use the filter sidebar
2. **Test Category Filters:**
   - ✓ Click "All Products" - shows all items
   - ✓ Click "Wooden Crafts" - filters to wooden products only
   - ✓ Click "Handmade" - filters to handmade products only
   - ✓ Click "Traditional" - filters to traditional products only
3. **Test Search:**
   - ✓ Type in search box - filters products by name/description
   - ✓ Clear search - shows filtered category results
4. **Verify:**
   - ✓ Product count updates
   - ✓ Grid animates smoothly
   - ✓ No console errors

**Expected Result:** Filters work correctly and update product display

---

### Test 5: Add to Cart

1. On Products page, click "Add to Cart" button on any product
2. **Verify:**
   - ✓ Button shows "Added! ✓" feedback
   - ✓ Cart badge in header updates (shows item count)
   - ✓ Product is added to cart state
   - ✓ No console errors

3. Add multiple products from different categories
4. **Verify:**
   - ✓ Cart count increases correctly
   - ✓ Cart shows total item count

**Expected Result:** Products add to cart successfully and cart badge updates

---

### Test 6: Shopping Cart

1. Click shopping cart icon in header
2. Navigate to http://localhost:3000/cart
3. **Verify:**
   - ✓ All added products display
   - ✓ Each item shows:
     - Product image
     - Product name
     - Category
     - Price
     - Quantity controls (-, qty, +)
     - Total for that item
     - Remove button
4. **Test Quantity Controls:**
   - ✓ Click "+" button - increases quantity
   - ✓ Click "-" button - decreases quantity
   - ✓ "-" button disables when quantity is 1
   - ✓ Item total updates correctly
5. **Test Remove:**
   - ✓ Click remove button - item disappears from cart
   - ✓ Cart count updates in header
6. **Verify Totals:**
   - ✓ Subtotal is correct
   - ✓ Shipping cost shows (NPR 100)
   - ✓ Total is accurate (subtotal + shipping)

**Expected Result:** Cart displays correctly with all functionality working

---

### Test 7: Clear Cart

1. On Cart page, click "Clear Cart" button
2. **Verify:**
   - ✓ All items removed from cart
   - ✓ Cart count becomes 0 in header
   - ✓ Empty cart message displays
   - ✓ "Continue Shopping" button appears

**Expected Result:** Cart clears completely

---

### Test 8: Checkout Process

1. Add products to cart
2. Go to Cart page
3. Click "Proceed to Checkout" button
4. Navigate to http://localhost:3000/checkout
5. **Verify Page Displays:**
   - ✓ Form for shipping information
   - ✓ Order summary on sidebar

**Test Form Validation:**

1. Leave all fields empty and click "Place Order"
2. **Verify:**
   - ✓ Error messages appear for required fields
   - ✓ Fields highlight in red
   - ✓ Form doesn't submit

3. Fill in partial information
4. **Verify:**
   - ✓ Individual field errors appear as needed

**Fill Complete Form:**

1. Enter valid information:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Phone: 9841234567
   - Address: 123 Main Street
   - City: Kathmandu
   - Zip Code: 44600
2. Click "Place Order"
3. **Verify:**
   - ✓ Form is submitted
   - ✓ You're redirected to order confirmation page
   - ✓ No console errors

**Expected Result:** Checkout process works with validation and order submission

---

### Test 9: Order Confirmation

1. After successful checkout, page shows http://localhost:3000/order-confirmation
2. **Verify Confirmation Page Shows:**
   - ✓ Success message with checkmark icon
   - ✓ Order ID (unique identifier)
   - ✓ Order date
   - ✓ Order status (pending)
   - ✓ Customer information (name, address, email, phone)
   - ✓ All ordered items with quantities and prices
   - ✓ Correct order total
   - ✓ Order timeline (placed → processing → shipped → delivered)
   - ✓ Estimated delivery date
   - ✓ Next steps section
   - ✓ "Continue Shopping" and "Print Order" buttons

3. Click "Print Order"
4. **Verify:**
   - ✓ Print dialog opens
   - ✓ Page formats correctly for printing

5. Click "Continue Shopping"
6. **Verify:**
   - ✓ Redirects to Products page
   - ✓ Cart is empty

**Expected Result:** Order confirmation displays all information and buttons work

---

### Test 10: About Page

1. Click "About" in navigation or scroll to About page
2. Navigate to http://localhost:3000/about
3. **Verify Page Sections:**
   - ✓ About header displays properly
   - ✓ Story section with company narrative
   - ✓ Statistics cards (500+ Artisans, 10,000+ Customers, etc.)
   - ✓ Mission & Values section with 4 value cards
   - ✓ Product Categories section
   - ✓ Artisans section with 3 artisan types
   - ✓ Why Choose Us section with benefits list
   - ✓ Contact CTA section
4. Click contact buttons
5. **Verify:**
   - ✓ Buttons are interactive
   - ✓ Hover effects work

**Expected Result:** About page displays all content properly

---

### Test 11: Responsive Design

1. Open Client app in browser
2. **Test on Desktop (1400px+):**
   - ✓ Full-width layout displays properly
   - ✓ Sidebar on products page is visible
   - ✓ All elements align correctly

3. **Test on Tablet (768px-1024px):**
   - ✓ Resize browser window to tablet size
   - ✓ Products grid adjusts (2 columns)
   - ✓ Sidebar converts to horizontal filters
   - ✓ Navigation still accessible
   - ✓ Cart page stacks vertically

4. **Test on Mobile (below 768px):**
   - ✓ Use mobile device or resize to mobile size
   - ✓ Navigation menu becomes hamburger (M icon)
   - ✓ Products grid shows 2-3 items per row
   - ✓ Sidebar filters are 1 column
   - ✓ Form inputs are full width
   - ✓ All buttons are touch-friendly
   - ✓ Font sizes are readable
   - ✓ Images scale properly

**Expected Result:** Application is fully responsive across all devices

---

### Test 12: LocalStorage Persistence

1. Add products to cart
2. Refresh the page (F5 or Cmd+R)
3. **Verify:**
   - ✓ Cart items persist after refresh
   - ✓ Cart count shows correct number
4. Close and reopen the browser
5. **Verify:**
   - ✓ Cart still contains the items
6. Clear browser data
7. **Verify:**
   - ✓ Cart becomes empty

**Expected Result:** Cart persists with LocalStorage and clears with browser data

---

## 🛠️ Admin Panel Testing

### Test 1: Admin Login

1. Open http://localhost:5173 in browser
2. **Verify Login Page:**
   - ✓ Login form displays properly
   - ✓ Email and password fields
   - ✓ "Remember me" checkbox
   - ✓ Login button
3. Enter invalid credentials
4. **Verify:**
   - ✓ Error message appears
5. Enter valid admin credentials
6. **Verify:**
   - ✓ Login successful
   - ✓ Redirected to dashboard

**Expected Result:** Login page works and credentials are validated

---

### Test 2: Admin Dashboard

1. After login, dashboard displays
2. **Verify Dashboard Shows:**
   - ✓ Sidebar with navigation menu
   - ✓ Dashboard with statistics cards
   - ✓ Total Products count
   - ✓ Total Orders count
   - ✓ Total Users count
   - ✓ Revenue information
   - ✓ Recent orders/activity section
   - ✓ Welcome message

**Expected Result:** Dashboard displays admin information correctly

---

### Test 3: Product Management

1. Click "Products" or "Inventory" in sidebar
2. **Verify Product List:**
   - ✓ Products display in table/grid
   - ✓ Product names, prices, categories visible
   - ✓ Edit and Delete buttons for each
   - ✓ Add New Product button
3. Click "Add New Product"
4. **Verify Form:**
   - ✓ Form for product details
   - ✓ File upload for image
   - ✓ Category dropdown
   - ✓ Price input
5. Fill form and submit
6. **Verify:**
   - ✓ Product added to list
   - ✓ Success message appears
7. Click Edit on a product
8. **Verify:**
   - ✓ Product details load in form
   - ✓ Can modify details
   - ✓ Changes save successfully
9. Click Delete on a product
10. **Verify:**
    - ✓ Confirmation dialog appears
    - ✓ Product deletes after confirmation

**Expected Result:** Product management works (CRUD operations)

---

### Test 4: Orders Page

1. Click "Orders" in sidebar
2. **Verify Orders:**
   - ✓ Pending orders display
   - ✓ Customer information visible
   - ✓ Order total amounts
   - ✓ Order dates
   - ✓ Status indicators
3. Click on order details
4. **Verify:**
   - ✓ Full order details display
   - ✓ Items in order
   - ✓ Shipping information
   - ✓ Can update order status

**Expected Result:** Orders page displays customer orders

---

### Test 5: Sidebar Navigation

1. Test each menu item in sidebar
2. **Verify:**
   - ✓ All pages load without errors
   - ✓ Sidebar highlights active page
   - ✓ Navigation is responsive
   - ✓ Mobile menu works (on smaller screens)

**Expected Result:** Navigation works across all admin pages

---

## 🔌 Backend API Testing

### Test 1: API Endpoints

1. Open API testing tool (Postman, Insomnia, or curl)
2. **Test GET /api/product:**

   ```
   GET http://localhost:4000/api/product
   ```

   - ✓ Returns products array
   - ✓ Each product has id, name, price, category
   - ✓ Status 200

3. **Test Category Filter:**
   ```
   GET http://localhost:4000/api/product?category=wooden
   ```

   - ✓ Returns filtered products
   - ✓ Only timber products returned

**Expected Result:** API endpoints return correct data

---

### Test 2: Database

1. Open pgAdmin
2. Connect to database
3. **Verify Tables Exist:**
   - ✓ users table
   - ✓ products table
   - ✓ categories table
   - ✓ images table
4. Check data:
   - ✓ Categories are seeded (wooden, handmade, traditional)
   - ✓ Products are present

**Expected Result:** Database structure and data are correct

---

## 🐛 Error Handling Tests

### Test 1: Network Errors

1. Stop backend server
2. Try to load Products page in Client app
3. **Verify:**
   - ✓ Error message displays
   - ✓ "Retry" button appears
   - ✓ Console shows network error
4. Restart backend
5. Click "Retry"
6. **Verify:**
   - ✓ Products load successfully

**Expected Result:** Network errors are handled gracefully

---

### Test 2: Form Validation

1. On Checkout page, try to submit empty form
2. **Verify:**
   - ✓ All required fields show errors
   - ✓ Form doesn't submit
3. Fill email field with invalid email
4. **Verify:**
   - ✓ Email validation error appears
5. Fill phone with invalid format
6. **Verify:**
   - ✓ Phone validation error appears

**Expected Result:** Form validation works correctly

---

### Test 3: Empty State

1. Go to Cart page with empty cart
2. **Verify:**
   - ✓ Empty cart message displays
   - ✓ "Continue Shopping" button available
3. Go to Products page with no results filter
4. **Verify:**
   - ✓ "No products found" message displays
   - ✓ "Reset filters" button available

**Expected Result:** Empty states display helpful messages

---

## 📊 Performance Tests

### Test 1: Loading Speed

1. Open browser DevTools → Network tab
2. Load Client app home page
3. **Verify:**
   - ✓ Page loads in under 3 seconds
   - ✓ No failed requests

4. Go to Products page
5. **Verify:**
   - ✓ Products load quickly
   - ✓ Images load smoothly

**Expected Result:** Application loads quickly

---

### Test 2: Animations

1. Navigate between pages
2. **Verify:**
   - ✓ Smooth page transitions
   - ✓ No jank or stuttering
3. Interact with buttons and links
4. **Verify:**
   - ✓ Hover effects are smooth
   - ✓ Animations are fluid

**Expected Result:** Animations perform smoothly

---

## ✅ Complete Test Checklist

### Client App

- [ ] Home page displays and navigates correctly
- [ ] Products load from API without errors
- [ ] Search and filter functionality works
- [ ] Add to cart works and updates cart count
- [ ] Cart persists with LocalStorage
- [ ] Checkout form validates correctly
- [ ] Orders submit successfully
- [ ] Order confirmation displays all info
- [ ] About page content displays
- [ ] Mobile responsive design works
- [ ] Navigation menu works on all devices
- [ ] Icons and images load properly
- [ ] Color scheme is consistent
- [ ] No console errors appear

### Admin Panel

- [ ] Login page works with validation
- [ ] Dashboard displays statistics
- [ ] Products CRUD operations work
- [ ] Orders display correctly
- [ ] Sidebar navigation works
- [ ] Responsive design works on admin panel
- [ ] No console errors appear

### Backend API

- [ ] GET /api/product returns products
- [ ] Category filtering works
- [ ] Database tables are created and seeded
- [ ] CORS is enabled for client origins
- [ ] API errors are handled appropriately

### Integration

- [ ] Frontend connects to backend API
- [ ] Admin to backend connection works
- [ ] Database operations are consistent
- [ ] Email/phone formats validate correctly
- [ ] Image uploads work (if implemented)

### Performance & Cross-Browser

- [ ] App loads quickly on all pages
- [ ] Works on Chrome, Firefox, Safari, Edge
- [ ] Mobile design is responsive
- [ ] No memory leaks in console
- [ ] Animations are smooth

---

## 🎯 Test Scenarios

### Scenario 1: Complete Purchase Flow

1. User browses products
2. Searches for specific item
3. Adds multiple items to cart
4. Updates quantities
5. Proceeds to checkout
6. Fills shipping info
7. Submits order
8. Views confirmation
9. Prints order
10. Returns to shopping

**Expected Result:** Complete flow works without errors

---

### Scenario 2: Admin Product Management

1. Admin logs in
2. Views products
3. Adds new product with image
4. Edits product details
5. Deletes a product
6. Reviews created orders
7. Logs out

**Expected Result:** All admin tasks complete successfully

---

## 📝 Known Issues & Workarounds

If you encounter issues, check:

1. Backend is running on port 4000
2. Database is seeded with data
3. CORS is properly configured
4. Browser cache is cleared
5. All dependencies are installed

---

## 🎉 Testing Complete!

If all tests pass, your KalaBazzer platform is ready for use!

For any issues found during testing, refer to the SETUP.md troubleshooting guide.

---

**Happy Testing! ✨**
