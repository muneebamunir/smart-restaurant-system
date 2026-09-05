# Architecture
This document explains the detail of architecture and project structure.

## Project Structure

```
smart-restaurant-system/
├── docs/
├── server/
│   ├── server.js                 # App entry — wires config, routes, socket, DB
│   ├── config.js                 # Shared server configuration
│   ├── middleware/
│   │   ├── auth.js               # JWT authentication middleware
│   │   └── upload.js             # Image upload middleware (Multer)
│   ├── routes/
│   │   ├── auth.js               # Staff login
│   │   ├── menu.js               # Menu CRUD
│   │   ├── orders.js             # Order management + real-time emit
│   │   └── socket.js             # WebSocket event handlers
│   ├── models/                   # Mongoose schemas (Menu, Order, User)
│   └── uploads/                  # Menu item images
├── client/
│   └── src/
│       ├── main.tsx              # React entry point
│       ├── App.tsx               # Routes and app state
│       ├── socket.js             # Socket.IO client instance
│       ├── components/
│       │   ├── navbar.jsx        # Top navigation bar
│       │   └── privateroute.jsx  # Role-based route guard
│       └── pages/
│           ├── Menu.jsx          # Customer menu
│           ├── Cart.jsx          # Shopping cart
│           ├── Checkout.jsx      # Order placement
│           ├── TrackOrder.jsx    # Live order status
│           ├── Login.jsx         # Staff authentication
│           ├── Admin.jsx         # Menu & order management
│           ├── Kitchen.jsx       # Kitchen display
│           ├── Waiter.jsx        # Waiter alerts
│           └── TableQR.jsx       # QR code generator
└── README.md
```
