# Routes
This document describes all the routes and URLs of the project.

## Key Routes

| URL                        | Description                    |
| -------------------------- | ------------------------------ |
| `/`                        | Customer menu                  |
| `/cart`                    | Shopping cart                  |
| `/checkout`                | Place an order                 |
| `/track/:id`               | Track order status             |
| `/login`                   | Staff login                    |
| `/admin`                   | Admin panel                    |
| `/kitchen`                 | Kitchen display                |
| `/waiter`                  | Waiter alerts                  |
| `/tables`                  | Table QR code generator        |
| `/?table=<number>`         | Menu linked to a table (via QR)|

## API Endpoints

| Method | Endpoint              | Access                 | Description              |
| ------ | --------------------- | ---------------------- | ------------------------ |
| POST   | `/auth/login`         | Public                 | Staff login              |
| GET    | `/menu`               | Public                 | List menu items          |
| POST   | `/menu`               | Admin                  | Add menu item            |
| DELETE | `/menu/:id`           | Admin                  | Delete menu item         |
| GET    | `/orders`             | Admin, Waiter, Kitchen | List all orders          |
| POST   | `/orders`             | Public                 | Create a new order       |
| GET    | `/orders/:id`         | Public                 | Get order by ID          |
| PUT    | `/orders/:id/status`  | Admin, Kitchen         | Update order status      |

## Real-Time Events (Socket.IO)

| Event               | Description                               |
| ------------------- | ----------------------------------------- |
| `newOrder`          | Broadcast when a customer places an order |
| `orderUpdated`      | Broadcast when order status changes       |
| `callWaiter`        | Customer requests table assistance        |
| `waiterAlert`       | Notifies waiter dashboard                 |
| `waiterCallCleared` | Clears a resolved waiter call             |
