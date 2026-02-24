# CraftWork Nepal - Client Application

A beautiful, fully functional ecommerce frontend built with React and Vite for purchasing authentic handmade crafts from Nepal.

## Features

✨ **Complete Ecommerce Experience**

- Home page with hero section, features, categories, testimonials, and CTAs
- Product listing with category filtering and search functionality
- Product detail views with images and descriptions
- Shopping cart with quantity management
- Secure checkout process with form validation
- Order confirmation page with order details and timeline
- About page with company information and artisan stories
- Responsive design for all devices

🎨 **Beautiful UI/UX**

- CraftWork Nepal branded color scheme (brown/tan palette)
- Smooth animations and transitions
- Modern glassmorphism effects
- Mobile-first responsive design
- Sticky navigation with cart badge

🛠️ **Modern Tech Stack**

- React 18 with React Router v6
- Vite for fast development and production builds
- Lucide React icons
- Axios for API calls
- LocalStorage for cart persistence

## Prerequisites

Before running the application, ensure you have:

- Node.js (v14 or higher)
- npm or yarn package manager
- Backend API running on `localhost:4000` (KalaBazzer Backend)

## Installation

1. **Navigate to the Client folder:**

```bash
cd Client
```

2. **Install dependencies:**

```bash
npm install
```

## Running the Application

### Development Mode

Start the Vite development server:

```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

### Production Build

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Project Structure

```
Client/
├── src/
│   ├── components/
│   │   ├── Header.jsx           # Navigation header with cart
│   │   ├── Footer.jsx           # Site footer
│   │   ├── styles/
│   │   │   ├── header.css
│   │   │   └── footer.css
│   │
│   ├── pages/
│   │   ├── Home.jsx             # Landing page
│   │   ├── Products.jsx         # Product listing & filtering
│   │   ├── Cart.jsx             # Shopping cart
│   │   ├── Checkout.jsx         # Order form
│   │   ├── OrderConfirmation.jsx # Order success page
│   │   ├── About.jsx            # Company info
│   │   └── styles/
│   │       ├── home.css
│   │       ├── products.css
│   │       ├── cart.css
│   │       ├── checkout.css
│   │       ├── order-confirmation.css
│   │       └── about.css
│   │
│   ├── services/
│   │   └── productApi.js        # API integration
│   │
│   ├── App.jsx                  # Main app with routing
│   ├── App.css                  # App styles
│   ├── main.jsx                 # React DOM render
│   └── index.css                # Global styles
│
├── public/                       # Static assets
├── package.json
├── vite.config.js
└── index.html
```

## Color Scheme

The application uses the CraftWork Nepal branded color palette:

```css
--primary-dark: #6b4423; /* Deep brown */
--primary-medium: #8b5a3c; /* Medium brown */
--primary-light: #d4a574; /* Tan/beige */
--accent-cream: #f5f1e8; /* Off-white background */
```

## Usage

### Home Page

- View featured products and categories
- Browse testimonials from satisfied customers
- Navigate to products or learn more about the company

### Products Page

- Browse all available products in a responsive grid
- Filter by category: Wooden, Handmade, Traditional
- Search for specific products
- Add items to cart with one click

### Shopping Cart

- View all items in your cart
- Adjust quantities with +/- buttons
- Remove items as needed
- View subtotal, shipping costs, and total
- Proceed to checkout

### Checkout

- Enter shipping information (name, email, phone, address)
- View order summary
- Submit order with form validation
- Automatic order confirmation

### Order Confirmation

- View complete order details with unique Order ID
- See order timeline with delivery estimates
- Print order details
- Continue shopping or view products

### About Page

- Learn the company's story and mission
- Discover values and product categories
- Meet our artisans
- Understand why to choose us

## API Integration

The application communicates with the backend API at `http://localhost:4000`:

### Endpoints Used:

- `GET /api/product` - Fetch all products
- `GET /api/product/:category` - Fetch products by category

### Example:

```javascript
// Fetching products
const response = await axios.get("http://localhost:4000/api/product");
const products = response.data.data;
```

## Cart State Management

The cart is managed using React hooks and persisted to LocalStorage:

```javascript
const [cart, setCart] = useState(() => {
  const savedCart = localStorage.getItem("cart");
  return savedCart ? JSON.parse(savedCart) : [];
});

// Cart is automatically saved to localStorage on changes
useEffect(() => {
  localStorage.setItem("cart", JSON.stringify(cart));
}, [cart]);
```

## Order Management

Orders are saved to LocalStorage with the following structure:

```javascript
{
  customer: {
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    address: string,
    city: string,
    zipCode: string,
    country: string
  },
  items: [
    {
      id: number,
      name: string,
      price: number,
      quantity: number,
      category: string
    }
  ],
  total: number,
  status: string,
  orderDate: ISO date string
}
```

## Responsive Design

The application is fully responsive with breakpoints at:

- **Desktop**: 1024px and above
- **Tablet**: 768px to 1023px
- **Mobile**: Below 768px

All pages adapt gracefully to different screen sizes with optimized layouts and touch-friendly interactions.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Port 3000 Already in Use

```bash
# Use a different port
npm run dev -- --port 3001
```

### Backend API Not Connecting

- Ensure backend is running on `localhost:4000`
- Check backend CORS settings to allow requests from `localhost:3000`
- Verify network connectivity

### Products Not Loading

- Check browser console for API errors
- Ensure backend is running and database is seeded with products
- Clear browser cache and refresh

### Cart Not Persisting

- Check if LocalStorage is enabled in browser
- Clear browser storage and try again
- Check browser console for errors

## Development

### Adding New Pages

1. Create page component in `src/pages/`
2. Create corresponding styles in `src/styles/`
3. Add route in `src/App.jsx`
4. Update navigation in `src/components/Header.jsx`

### Customizing Colors

Edit `src/index.css` CSS variables:

```css
:root {
  --primary-dark: #6b4423;
  --primary-medium: #8b5a3c;
  --primary-light: #d4a574;
  --accent-cream: #f5f1e8;
  /* ... other variables */
}
```

## Environment Variables

If needed, create a `.env` file:

```
VITE_API_URL=http://localhost:4000
```

## Performance Optimization

- Images are optimized and lazy-loaded
- CSS is minified in production builds
- JavaScript is bundled and optimized by Vite
- Smooth animations use GPU acceleration

## Contributing

To contribute to this project:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

All code and designs are property of CraftWork Nepal.

## Support

For issues or questions, please contact:

- Email: support@craftworknepal.com
- Phone: +977-XXXXXXXXX

---

**Made with ❤️ for CraftWork Nepal**

Celebrating authentic handcrafted traditions from Nepal.
