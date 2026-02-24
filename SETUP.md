# KalaBazzer - Complete Setup Guide

Welcome to KalaBazzer! This guide will help you set up and run the complete ecommerce application (Admin Panel + Client Application + Backend API).

## 📋 Prerequisites

Before starting, ensure you have installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/)
- **pgAdmin 4** - [Download](https://www.pgadmin.org/) (for database management)
- **Git** (optional) - [Download](https://git-scm.com/)

## 🗄️ Database Setup

### Step 1: Create PostgreSQL Database

1. Open **pgAdmin 4** in your browser (usually at `http://localhost:5050`)
2. Connect to your local PostgreSQL server
3. Right-click on "Databases" → "Create" → "Database"
4. Name it: `kala_bazzer` (or your preferred name)
5. Click "Save"

### Step 2: Verify Connection

The backend will automatically create all tables and seed initial data when started.

---

## 🚀 Running the Application

### Terminal 1: Backend API (Port 4000)

```bash
# Navigate to Backend folder
cd Backend

# Install dependencies
npm install

# Create .env file with database configuration (if needed)
# DATABASE_URL=postgresql://user:password@localhost:5432/kala_bazzer

# Start the server
npm start
```

**Expected Output:**

```
Server running on port 4000
Database connected successfully
```

### Terminal 2: Admin Panel (Port 5173)

```bash
# Navigate to Admin folder
cd Admin

# Install dependencies
npm install

# Start development server
npm run dev
```

**Expected Output:**

```
  L VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

### Terminal 3: Client Application (Port 3000)

```bash
# Navigate to Client folder
cd Client

# Install dependencies
npm install

# Start development server
npm run dev
```

**Expected Output:**

```
  L VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
```

---

## 🌐 Accessing the Applications

After all three servers are running, you can access:

### Admin Panel

- **URL:** http://localhost:5173
- **Purpose:** Manage products, orders, inventory
- **Features:**
  - Admin login
  - Dashboard with statistics
  - Product management (CRUD)
  - Order tracking
  - Inventory management

### Client Application

- **URL:** http://localhost:3000
- **Purpose:** Browse and purchase products
- **Features:**
  - Home page with featured products
  - Product catalog with category filtering
  - Shopping cart
  - Checkout process
  - Order confirmation
  - About page
  - Responsive design for all devices

### Backend API

- **URL:** http://localhost:4000
- **API Documentation:** Check Backend README for endpoints
- **Main Endpoints:**
  - `GET /api/product` - Get all products
  - `POST /api/product/upload` - Upload new product
  - `DELETE /api/product/:id` - Delete product
  - `POST /api/auth/login` - Admin login

---

## 📱 Admin Panel Usage

### First Login

1. Navigate to http://localhost:5173
2. Use test credentials:
   - **Email:** admin@craftwork.com (or your registered admin email)
   - **Password:** Your admin password

3. If no account exists, create one through the authentication flow

### Key Features

- **Dashboard:** View sales statistics, orders, and inventory
- **Products:** Add, edit, delete, or view product listings
- **Orders:** Track and manage customer orders
- **Inventory:** Monitor stock levels across all products
- **Settings:** Manage admin preferences

---

## 🛍️ Client Application Usage

### User Flow

1. **Landing Page** (http://localhost:3000)
   - View featured products
   - Browse categories
   - Read customer testimonials
   - Learn about the company

2. **Browse Products** (http://localhost:3000/products)
   - Search for specific products
   - Filter by category (Wooden, Handmade, Traditional)
   - View product details
   - Add items to cart

3. **Shopping Cart** (http://localhost:3000/cart)
   - Review cart items
   - Adjust quantities
   - View order summary
   - Proceed to checkout

4. **Checkout** (http://localhost:3000/checkout)
   - Enter shipping information
   - Review final order
   - Place order

5. **Order Confirmation** (http://localhost:3000/order-confirmation)
   - View unique Order ID
   - See delivery timeline
   - Print order details
   - Continue shopping

### Additional Pages

- **About** (http://localhost:3000/about)
  - Company story and mission
  - Meet our artisans
  - Why choose us
  - Contact information

---

## 🎨 Color Scheme

The entire application uses a consistent CraftWork Nepal branded color palette:

```
Primary Dark:   #6B4423 (Deep Brown)
Primary Medium: #8B5A3C (Medium Brown)
Primary Light:  #D4A574 (Tan/Beige)
Accent Cream:   #F5F1E8 (Off-white)
```

---

## 📊 Project Structure

```
KalaBazzer/
├── Backend/
│   ├── src/
│   │   ├── controller/        # API controllers
│   │   ├── models/            # Sequelize models
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Authentication, file upload
│   │   ├── database/          # DB initialization
│   │   ├── security/          # JWT utilities
│   │   └── index.js           # Server entry point
│   ├── package.json
│   └── README.md
│
├── Admin/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API calls
│   │   ├── Styles/            # CSS files
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── README.md
│
├── Client/
│   ├── src/
│   │   ├── components/        # Header, Footer, etc.
│   │   ├── pages/             # Page components
│   │   ├── styles/            # CSS files
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── README.md
│
└── SETUP.md (this file)
```

---

## 🔧 Troubleshooting

### Issue: Backend Won't Connect to Database

**Solution:**

1. Verify PostgreSQL is running
2. Ensure database exists in pgAdmin
3. Check database credentials in Backend configuration
4. Look for error messages in backend terminal

### Issue: "Port Already in Use"

**Solution:**

```bash
# Kill process using the port
# On Windows:
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -i :4000
kill -9 <PID>
```

### Issue: CORS Errors in Browser Console

**Solution:**

- Ensure backend is running on port 4000
- Check backend CORS configuration
- Clear browser cache
- Try in an incognito window

### Issue: Products Not Showing in Admin/Client

**Solution:**

1. Check if backend is running
2. Verify database has products (check backend logs)
3. Ensure categories are seeded
4. Clear browser console for API errors

### Issue: Cart Not Saving

**Solution:**

- Enable LocalStorage in browser
- Check browser developer tools → Application → LocalStorage
- Verify no errors in console
- Try a different browser

### Issue: Admin Login Failing

**Solution:**

1. Check if backend auth endpoint is working
2. Verify admin account exists in database
3. Clear browser cache and cookies
4. Check admin credentials

---

## 📚 Additional Resources

### Backend README

See `Backend/README.md` for:

- API endpoint documentation
- Database schema details
- Authentication flow
- Testing information

### Admin Panel README

See `Admin/README.md` for:

- Admin features
- Dashboard usage
- Product management
- Styling configuration

### Client Application README

See `Client/README.md` for:

- Client features
- User workflows
- Component structure
- Customization guide

---

## 🚀 Production Deployment

### Build for Production

```bash
# Admin Panel
cd Admin
npm run build
# Output: dist/ folder

# Client
cd Client
npm run build
# Output: dist/ folder

# Backend (already ready for production)
# Just set NODE_ENV=production
```

### Deployment Steps

1. **Backend:** Deploy to cloud server (Heroku, AWS, etc.)
2. **Admin Panel:** Deploy dist/ to static hosting (Vercel, Netlify)
3. **Client Application:** Deploy dist/ to static hosting
4. **Database:** Set up database on managed service (AWS RDS, Azure DB)

---

## 🔐 Security Notes

- Never commit `.env` files with credentials
- Use environment variables for sensitive data
- Enable HTTPS in production
- Keep dependencies updated
- Use strong passwords for admin accounts
- Regularly backup database

---

## 📞 Support

If you encounter any issues:

1. **Check the individual project READMEs** for specific documentation
2. **Review error messages** in browser console and terminal
3. **Verify all prerequisites** are installed correctly
4. **Ensure all servers** are running on correct ports

---

## ✨ Features Overview

### For Customers (Client App)

- ✅ Browse beautiful product catalog
- ✅ Search and filter by category
- ✅ Add products to cart
- ✅ Complete checkout process
- ✅ View order confirmation
- ✅ Learn about company
- ✅ Fully responsive on all devices

### For Admins (Admin Panel)

- ✅ Secure login system
- ✅ Dashboard with sales analytics
- ✅ Full product management
- ✅ Order tracking
- ✅ Inventory management
- ✅ Responsive admin interface

### For Backend

- ✅ RESTful API architecture
- ✅ Database with Sequelize ORM
- ✅ JWT authentication
- ✅ File upload handling
- ✅ CORS enabled
- ✅ Error handling

---

## 🎉 You're All Set!

Your KalaBazzer ecommerce platform is now ready to use!

Start with the client app at **http://localhost:3000** and explore the complete platform.

**Happy selling! 🎨**

---

**Made with ❤️ for CraftWork Nepal**
