# Smart Restaurant System

A full-stack restaurant management application that lets customers browse the menu, place orders, and track their food in real time — while giving staff dedicated dashboards for kitchen, waiter, and admin workflows.

## Overview

Smart Restaurant System is designed for dine-in restaurants that want a digital ordering experience. Customers scan a table QR code to open the menu on their phone, add items to a cart, and submit an order. Kitchen staff receive orders instantly over WebSockets, update preparation status, and customers can follow progress on a live tracking page. Waiters get real-time alerts when a table calls for assistance.

## Features

### Customer
- Browse menu with search, category filters, and food images
- Scan table QR codes to associate orders with a table number
- Shopping cart with quantity management
- Checkout with customer name and phone
- Real-time order tracking (Pending → Preparing → Ready → Served)
- Call waiter button for table assistance

### Admin
- Add and delete menu items with image uploads
- View incoming orders in real time
- Generate QR codes for restaurant tables
- Role-protected access via JWT authentication

### Kitchen
- Live order feed with sound notifications for new orders
- Update order status as food is prepared
- Real-time sync across all connected clients

### Waiter
- Live dashboard for table assistance requests
- Clear calls once a table has been served

## Tech Stack

| Layer      | Technologies                                         |
| ---------- | ---------------------------------------------------- |
| Frontend   | React, React Router, Axios, Socket.IO Client, QRCode |
| Backend    | Node.js, Express, Socket.IO, JWT, Multer             |
| Database   | MongoDB (Atlas) with Mongoose                        |


## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (or local MongoDB instance)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/muneebamunir/smart-restaurant-system.git
cd smart-restaurant-system
```

### 2. Install Dependecies

```bash
.\install.bat    # For Windows
./install.sh     # For UNIX or Linux
```
### 3. Initialize New Database

```bash
cd server
npm run migrate
```

### 2. Configure the backend

Create a `.env` file inside the `server/` folder:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
JWT_SECRET=your_secret_key_here
PORT=5000
```

Start the server:

```bash
.\run-server.bat   # For Windows
./run-server.sh    # For UNIX or Linux
```

The API runs at **http://localhost:5000**.

### 3. Start the frontend

In a separate terminal:

```bash
.\run-client.bat    # For Windows
./run-client.sh     # For UNIX or Linux
```

The React app runs at **http://localhost:3000**.

## Default Staff Accounts

| Username | Password | Role    |
| -------- | -------- | ------- |
| admin    | 1234     | Admin   |
| waiter   | 1234     | Waiter  |
| kitchen  | 1234     | Kitchen |

Log in at **http://localhost:3000/login** to access role-specific dashboards.
