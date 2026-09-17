# Architecture
This document explains the detail of architecture and project structure.

## Project Structure

```
smart-restaurant-system/
├── app/
│   ├── favicon.ico
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── FoodCard.tsx
│   │   ├── CategoryTabs.tsx
│   │   ├── CartDrawer.tsx
│   │   ├── CustomizeModal.tsx
│   │   ├── CheckoutModal.tsx
│   │   ├── CameraModal.tsx
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── OfferBanner.tsx
│   │   ├── MenuSection.tsx
├── context/
│   ├── CartContext.tsx
│   ├── ToastContext.tsx
├── data/
│   ├── foodItems.ts
├── docs/
│   ├── ARCHITECTURE.md
│   ├── ROUTES.md
│   ├── TECHNICAL.md
├── data/
│   ├── foodItems.ts
├── types/
│   ├── index.ts
├── utils/
│   ├── foodItems.ts
├── public/
└── README.md
```
