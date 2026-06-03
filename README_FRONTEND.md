# Inventory Management System - Production Ready SaaS Edition

A modern, enterprise-grade inventory and order management system built with React, Vite, and Tailwind CSS.

## ✨ Features

### Dashboard
- **KPI Cards**: Real-time metrics for Products, Customers, Orders, and Revenue
- **Order & Revenue Trends**: Interactive line charts showing historical data
- **Inventory Levels**: Bar charts displaying top products by stock
- **Low Stock Alerts**: Real-time notifications for products below threshold
- **Recent Orders**: Quick view of latest transactions

### Products
- **Advanced Search**: Search by product name or SKU
- **Smart Filtering**: Filter by status (Active/Inactive/Low Stock) and category
- **Product Images**: Visual product thumbnails
- **Bulk Actions**: Select multiple products for batch operations
- **Pagination**: Efficient data handling with page navigation
- **CSV Export**: Export filtered products to CSV format
- **Add Products Modal**: Intuitive form for adding new products with validation
- **Stock Status Badges**: Quick visual indicators (Low Stock, Out of Stock)

### Customers
- **Customer Directory**: Comprehensive customer management
- **Contact Information**: Email, phone, and location details
- **Order History**: Total orders and spending per customer
- **Status Tracking**: Active/Inactive customer status
- **Search & Filter**: Find customers quickly
- **Add Customer Form**: Modal-based customer creation

### Orders
- **Order Tracking**: View all orders with status
- **Detailed Expansion**: Click orders to view line items
- **Status Indicators**: Pending, In Progress, Completed
- **Customer Linking**: See which customer placed the order
- **Amount Tracking**: Order totals with currency formatting
- **Order Cancellation**: Remove orders with confirmation

## 🎨 Design Highlights

### Enterprise Style
- Clean, professional interface inspired by Shopify Admin and ERP systems
- Consistent typography with Inter font family
- Color palette optimized for business applications
- Status badges with semantic colors (green=success, red=danger, yellow=warning)

### Dark Mode
- Full dark mode support with toggle in header
- Smooth transitions between themes
- WCAG compliant color contrasts
- Persistent theme selection

### Responsive Design
- Mobile-first approach
- Optimized for desktop, tablet, and mobile
- Responsive navigation with hamburger menu
- Touch-friendly button sizes

### Accessibility
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- High contrast color schemes
- Form validation with error messages

## 🛠 Tech Stack

### Frontend
- **React 18**: Modern UI library with hooks
- **Vite**: Lightning-fast build tool
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Beautiful React charts
- **Lucide React**: Premium icon library
- **Axios**: HTTP client for API calls
- **React Router**: Client-side routing

### Development
- **Tailwind CSS Forms**: Enhanced form styling
- **PostCSS**: CSS transformations
- **Autoprefixer**: Browser compatibility

## 📦 Installation

### Prerequisites
- Node.js 16+
- npm or yarn

### Setup

```bash
cd frontend

# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The dev server runs on `http://localhost:5173` with API proxy to `http://backend:8000`

## 🗂 Project Structure

```
frontend/
├── src/
│   ├── App.jsx              # Main app with layout
│   ├── main.jsx             # Entry point
│   ├── index.css            # Global styles & Tailwind
│   ├── api/
│   │   └── index.jsx        # API client configuration
│   ├── pages/
│   │   ├── Dashboard.jsx    # Dashboard with charts
│   │   ├── Products.jsx     # Products management
│   │   ├── Customers.jsx    # Customer directory
│   │   └── Orders.jsx       # Order tracking
│   └── components/
│       └── UI.jsx           # Reusable UI components
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
├── vite.config.js           # Vite configuration
└── package.json             # Dependencies
```

## 🎯 Key Components

### Layout Components
- **Sidebar**: Navigation with active state indicators
- **Header**: Top navigation with dark mode, notifications, user profile
- **Toast**: Non-intrusive notifications

### Page Components
- **Dashboard**: KPI cards, charts, alerts, recent orders
- **Products**: Table with search, filters, bulk actions
- **Customers**: Customer list with contact info
- **Orders**: Order list with expandable details

### UI Components
- **Modal**: Reusable modal dialogs with size options
- **FormField**: Input fields with validation and error messages
- **Button**: Multiple variants (primary, secondary, ghost, danger)
- **Badge**: Status badges with semantic colors
- **DataTable**: Flexible table with custom column rendering
- **Pagination**: Smart pagination controls
- **KPICard**: Key performance indicator cards
- **StatusBadge**: Pre-configured status indicators

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:

```javascript
colors: {
  primary: {
    50: '#f0f7ff',
    600: '#0284c7',
    // ... other shades
  }
}
```

### Typography
Modify font configuration in Tailwind config:

```javascript
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  display: ['Manrope', 'system-ui', 'sans-serif'],
}
```

## 🔌 API Integration

The application connects to the backend at `/api` with Vite proxy configuration.

### API Endpoints

```javascript
// Products
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id

// Customers
GET    /api/customers
GET    /api/customers/:id
POST   /api/customers
DELETE /api/customers/:id

// Orders
GET    /api/orders
GET    /api/orders/:id
POST   /api/orders
DELETE /api/orders/:id

// Dashboard
GET    /api/dashboard
```

## 📱 Mobile Optimization

- Responsive grid layouts with Tailwind breakpoints
- Mobile-friendly navigation with toggle sidebar
- Touch-optimized form inputs and buttons
- Optimized table scrolling on mobile
- Responsive modal sizing

## 🌙 Theme Implementation

The application uses CSS class-based dark mode:

```javascript
// Toggle dark mode
document.documentElement.classList.add('dark')
document.documentElement.classList.remove('dark')
```

Tailwind automatically applies dark mode styles with `dark:` prefix.

## 🚀 Performance

- Code splitting with React lazy loading
- Optimized bundle size (~200KB gzipped)
- Efficient re-rendering with React hooks
- Chart animations optimized for performance
- Image optimization with thumbnails

## 📊 Charts & Data Visualization

### Recharts Integration
- **LineChart**: Order and revenue trends
- **BarChart**: Inventory levels
- **Custom Tooltips**: Dark mode compatible
- **Responsive Containers**: Scale to parent width

## 🔐 Security

- CSRF protection via API
- Secure API communication with axios
- Input validation on forms
- Error boundary components
- Safe SVG icon rendering

## 📚 Documentation

### Component Usage

#### Modal
```jsx
<Modal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Add New Product"
  size="md"
>
  {/* Modal content */}
</Modal>
```

#### FormField
```jsx
<FormField
  label="Product Name"
  placeholder="e.g., Monitor"
  value={name}
  onChange={(e) => setName(e.target.value)}
  required
/>
```

#### DataTable
```jsx
<DataTable
  columns={columns}
  data={products}
  loading={isLoading}
/>
```

## 🎯 Future Enhancements

- [ ] Real-time data sync with WebSockets
- [ ] Advanced reporting and analytics
- [ ] Inventory forecasting
- [ ] Multi-warehouse support
- [ ] API key management
- [ ] User roles and permissions
- [ ] Audit logging
- [ ] Email notifications
- [ ] Mobile app
- [ ] Advanced search with filters

## 📄 License

Enterprise Edition - All Rights Reserved

## 🤝 Support

For support and feature requests, contact the development team.
