# Architecture
This document explains the detail of architecture and project structure.

## Project Structure

```
smart-restaurant-system/
├── Backend/
│   ├── server.js          # Express API + Socket.IO server
│   ├── Models/            # Mongoose schemas (Menu, Order, User)
│   └── uploads/           # Menu item images
├── client/
│   └── src/
│       ├── App.js         # Routes and navigation
│       ├── Menu.js        # Customer menu
│       ├── Cart.js        # Shopping cart
│       ├── Checkout.js    # Order placement
│       ├── TrackOrder.js  # Live order status
│       ├── Admin.js       # Menu & order management
│       ├── Kitchen.js     # Kitchen display
│       ├── Waiter.js      # Waiter alerts
│       ├── TableQR.js     # QR code generator
│       └── Login.js       # Staff authentication
└── README.md
```