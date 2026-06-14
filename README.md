# 🛒 Full-Stack E-Commerce Web Application (Amazon Clone)

A full-stack e-commerce platform built with the **MERN stack** (MongoDB, Express, React, Node.js), featuring product browsing, cart management, JWT-based authentication, and an admin dashboard for managing products and orders.

---

## 📁 Project Structure

```
ECommerce Website/
├── backend/                    # Node.js + Express REST API
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/                 # API route handlers
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   └── orderRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT auth (protect) + admin guard (adminOnly)
│   ├── server.js               # Express app entry point
│   ├── seed.js                 # Database seeder (12 products + 2 demo users)
│   ├── .env.example             # Environment variable template
│   └── package.json
│
└── frontend/                    # React (Vite) SPA
    ├── src/
    │   ├── context/             # AuthContext, CartContext
    │   ├── components/          # Navbar, shared UI components
    │   ├── pages/                # Home, ProductDetail, Cart, Login, Register,
    │   │                          # OrderHistory, AdminDashboard, AdminProduct
    │   ├── utils/api.js          # Axios instance with JWT interceptor
    │   ├── App.jsx                # Router + context providers
    │   └── index.css              # Global styles
    └── package.json
```

> **Note:** The repo previously contained duplicate/legacy files (`routes/auth.js`, `routes/products.js`, `routes/orders.js`, `routes/order.js`, `middleware/auth.js`, `middleware/admin.js`, `scripts/seed.js`). These are unused leftovers from an earlier draft and can be safely deleted — only the files listed above are referenced by `server.js`.

---

## ⚙️ Tech Stack

| Layer     | Technology                          |
|-----------|--------------------------------------|
| Frontend  | React 18, React Router v6, Axios     |
| Backend   | Node.js, Express.js                  |
| Database  | MongoDB + Mongoose                   |
| Auth      | JWT (jsonwebtoken) + bcryptjs        |
| Dev Tool  | Vite                                  |

---

## 🚀 Setup & Running Locally

### Prerequisites
- Node.js v18+
- MongoDB running locally (`mongodb://localhost:27017`) **or** a MongoDB Atlas connection string

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` (do **not** commit this file):

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=replace_with_a_long_random_secret
NODE_ENV=development
```

Seed the database (creates 12 sample products + admin & customer accounts):

```bash
npm run seed
```

Start the backend:

```bash
npm run dev     # development (nodemon)
# or
npm start       # production
```

Backend runs at: **http://localhost:5000**

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## 👤 Demo Credentials

| Role     | Email               | Password     |
|----------|---------------------|---------------|
| Admin    | admin@amazon.com    | admin123      |
| Customer | john@example.com    | customer123   |

> ⚠️ Change or remove these demo accounts before deploying to a public environment.

---

## 📡 API Endpoints

### Auth — `/api/auth`

| Method | Endpoint   | Access     | Description                |
|--------|------------|------------|------------------------------|
| POST   | /register  | Public     | Register a new user, returns JWT |
| POST   | /login     | Public     | Login, returns JWT          |
| GET    | /me        | Protected  | Get current user's profile  |

### Products — `/api/products`

| Method | Endpoint | Access     | Description                              |
|--------|----------|------------|--------------------------------------------|
| GET    | /        | Public     | List products (supports `?search=` and `?category=`) |
| GET    | /:id     | Public     | Get a single product                     |
| POST   | /        | Admin only | Create a new product                     |
| PUT    | /:id     | Admin only | Update a product                          |
| DELETE | /:id     | Admin only | Delete a product                          |

### Orders — `/api/orders`

| Method | Endpoint | Access     | Description                              |
|--------|----------|------------|--------------------------------------------|
| POST   | /        | Protected  | Place a new order (validates & decrements stock) |
| GET    | /my      | Protected  | Get the logged-in user's order history   |
| GET    | /        | Admin only | Get all orders (with user & product details) |
| PUT    | /:id     | Admin only | Update an order's status                 |

---

## 🖥️ Pages & Routes

| Page             | Route           | Access     |
|------------------|-----------------|------------|
| Home / Products  | `/`             | Public     |
| Product Detail   | `/products/:id` | Public     |
| Shopping Cart    | `/cart`         | Public     |
| Register         | `/register`     | Public     |
| Login            | `/login`        | Public     |
| Order History    | `/orders`       | Logged in  |
| Admin Dashboard  | `/admin`        | Admin only |
| Add/Edit Product | `/admin/product`| Admin only |

---

## ✅ Features

- Product listing with images, prices, and star ratings
- Search by keyword and filter by category
- Product detail page with quantity selector and stock status
- Shopping cart with quantity controls, subtotal, and item removal
- Cart persisted across sessions
- User registration with bcrypt password hashing
- JWT-based login and protected routes
- Role-based access control (customer vs. admin)
- Admin dashboard for managing products (add, edit, delete)
- Admin order management with status updates
- Order placement with automatic stock validation and decrement
- Order history with status badges

---

## 🗄️ Data Models

### User
```js
{ name, email, password (hashed), role: 'customer' | 'admin', createdAt }
```

### Product
```js
{ name, description, price, category, imageUrl, stock, rating, createdAt }
```

### Order
```js
{
  user: ObjectId (ref User),
  items: [{ product: ObjectId (ref Product), quantity, price }],
  total,
  status: 'pending' | 'processing' | 'shipped' | 'delivered',
  createdAt
}
```

---

## 🔐 Security Notes Before Deploying

- **Never commit `.env`** — use `.env.example` as a template and add `.env` to `.gitignore`.
- **Use a strong, random `JWT_SECRET`** in production (not a simple word/phrase).
- If this project's git history previously contained real database credentials, **rotate those credentials** and scrub them from history (e.g., with `git filter-repo`) before making the repo public.
- Restrict CORS (`app.use(cors())`) to your deployed frontend's domain instead of allowing all origins.
- Add `node_modules/` to `.gitignore` — it should not be committed.

---

## 📦 Deployment Notes

- The **backend** is a long-running Express server with a persistent MongoDB connection — deploy it on a platform that supports Node servers (e.g., Render, Railway, Fly.io, or a VM), rather than a serverless-only platform.
- The **frontend** (Vite + React) builds to static files and can be deployed on Vercel, Netlify, or any static host. Update the Axios `baseURL` in `frontend/src/utils/api.js` to point to your deployed backend URL.
- Set `MONGO_URI`, `JWT_SECRET`, `PORT`, and `NODE_ENV` as environment variables on your hosting platform — do not hardcode them.
