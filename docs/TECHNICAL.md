# Technical Documentation

## Overview

Smart Restaurant System is a Next.js restaurant application for customer
ordering and staff management. Customers can browse the menu and place orders;
staff can manage menu data, tables, orders, reviews, users, and settings.

## Technology

- **Next.js** with the App Router
- **TypeScript** and React
- **Tailwind CSS** for styling
- **MongoDB** with Mongoose
- **JWT** cookies for guest and staff sessions
- **Lucide React** for icons

## Main Routes

| Route | Purpose |
|---|---|
| `/` | Customer menu and landing page |
| `/login` | Staff login |
| `/order` | Order management panel |
| `/profile` | Staff profile |
| `/admin` | Staff dashboard |
| `/admin/items` | Manage menu items |
| `/admin/categories` | Manage categories |
| `/admin/offers` | Manage offers |
| `/admin/tables` | Manage tables and QR codes |
| `/admin/users` | Manage staff users |
| `/admin/reviews` | View customer reviews |
| `/admin/marketing` | Manage marketing subscribers |
| `/admin/settings` | Manage restaurant settings |

API endpoints are organized under `app/api/`.

## Project Structure

Folders are shown without listing files inside them. Root-level files are
listed because they configure or document the whole project.

```text
smart-restaurant-system/
├── .vscode/
├── app/
│   ├── admin/
│   │   ├── categories/
│   │   ├── items/
│   │   ├── marketng/
│   │   ├── offers/
│   │   ├── reviews/
│   │   ├── settings/
│   │   ├── tables/
│   │   ├── users/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   ├── api/
│   ├── login/
│   ├── order/
│   ├── profile/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
├── components/
│   ├── admin/
│   ├── layout/
│   ├── order/
│   ├── providers/
│   ├── sections/
├── context/
├── data/
├── docs/
├── models/
├── public/
├── types/
├── utils/
├── .env
├── .gitignore
├── eslint.config.mjs
├── LICENSE.md
├── migrate.ts
├── next-env.d.ts
├── next.config.mjs
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── tsconfig.json
└── tsconfig.tsbuildinfo
```

## Data Models

The main MongoDB models are:

- **User:** Staff accounts and roles such as admin, chef, and waiter.
- **Category:** Groups menu items.
- **Item:** Menu dishes, variants, prices, stock, and images.
- **Order:** Customer details, ordered items, totals, table, and status.
- **Offer:** Discount and coupon information.
- **Subscriber:** Marketing email subscribers.
- **Review:** Customer ratings and comments linked to an order.
- **Table:** Dining table details and QR tokens.
- **Settings:** Restaurant-wide configuration stored as a singleton.

Orders keep snapshots of item names and prices so old orders do not change
when menu items are edited.

## Authentication and Ordering

- Guests are identified by the `tc_session` HttpOnly JWT cookie.
- Staff login uses the `tc_staff` HttpOnly JWT cookie.
- Protected admin pages and APIs verify the staff session and role.
- A QR code identifies a dining table using an opaque QR token.
- During checkout, the server validates the session, snapshots the order data,
  calculates totals, and stores the order.
- Staff update order status through the admin panel.

## Development Commands

```bash
npm install
npm run dev
npm run lint
npm run build
npm run migrate
```
