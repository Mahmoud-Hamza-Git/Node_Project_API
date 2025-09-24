# E-commerce API (Node.js, Express, MongoDB)

A simple e-commerce REST API where users can register/login, browse products, manage their profile, create carts and orders, and where sellers can CRUD their products. Built with Express + Mongoose + JWT.

## Features

- Users: register, login, forgot/reset password; view/update/delete own profile
- Products: public browse and detail; authenticated search by product name or seller name
- Sellers: create/list/get/update/delete only their own products (role-restricted)
- Cart: create/replace my cart, get my cart, update/delete cart (only owner or admin)
- Orders: create order (Cash on Delivery), list my orders, get specific order (owner or admin)
- Roles: `user`, `seller`, `admin` (admin not creatable via register; set in DB manually)

Anonymous users can browse product list and product details but cannot search or create orders.

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT auth (`jsonwebtoken`), password hashing (`bcryptjs`)
- Environment config via `dotenv`

## Quick Start

1. Install dependencies
   ```bash
   npm install
   ```
2. Create your environment file and update it with your own values
   ```powershell
   .env
   ```
3. Run the server
   ```bash
   npm run dev
   ```
   The API will run on `http://localhost:5000` by default.

## API Endpoints

### Auth

- POST `/api/auth/register`
  - body: `{ name, email, password, role? }` (role is optional: `user` or `seller`)
- POST `/api/auth/login`
  - body: `{ email, password }`
- POST `/api/auth/forgot-password`
  - body: `{ email }` → returns a `resetToken` for demo/testing
- POST `/api/auth/reset-password`
  - body: `{ token, password }`

### Users (Auth required)

- GET `/api/users/me` → current user profile
- PUT `/api/users/me` → update fields: `name`, `email`, `password`
- DELETE `/api/users/me` → delete my account

### Products

- GET `/api/products` → public list (pagination: `page`, `limit`)
- GET `/api/products/:id` → public product detail
- GET `/api/products/search?q=...` → requires auth; search by product name or seller name

### Seller Products (Auth: seller or admin)

- POST `/api/seller/products` → create `{ name, price, description?, photo? }`
- GET `/api/seller/products` → list my products
- GET `/api/seller/products/:id` → get my product
- PUT `/api/seller/products/:id` → update my product (you can update `name`, `price`, `description`, `photo`)
- DELETE `/api/seller/products/:id` → delete my product

### Cart (Auth required)

- POST `/api/cart` → create/replace my cart `{ items: [{ product, quantity }] }`
- GET `/api/cart` → get my cart; admin can pass `?userId=<id>` to view others
- PUT `/api/cart/:id` → update a cart (only owner or admin)
- DELETE `/api/cart/:id` → delete a cart (only owner or admin)

### Orders (Auth required)

- POST `/api/orders` → create COD order
  - body either `{ items: [{ product, quantity }] }` or `{ fromCart: true }`
- GET `/api/orders` → list my orders; admin can pass `?userId=<id>` to filter
  - GET `/api/orders/:id` → get order (owner or admin)

### Uploads (Auth required)

- POST `/api/uploads/image` → upload a single image file
  - Content-Type: `multipart/form-data`
  - Field name: `photo`
  - Response: `{ filename, url }`
  - Use returned `url` as the product `photo` if you prefer
