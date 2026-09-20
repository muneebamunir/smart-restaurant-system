# Architecture

This document describes the technical architecture, project structure, and data model of the **Smart Restaurant System**.

---

## 1. Overview

Smart Restaurant System is a Next.js 14+ App Router application that handles two audiences:

| Audience | Entry Point | Authentication |
|---|---|---|
| **Customers** | `/` | None — guests only (QR scan or direct visit) |
| **Staff** | `/admin` | JWT in HttpOnly cookie (`tc_staff`) |

Customers never create accounts. They scan a QR code at their table (`/?t=<qr_token>`) or order online directly. Their session is carried by a signed JWT in an HttpOnly cookie. Staff accounts (admin, chef, waiter) are managed exclusively by admins.

**Tech stack**

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (CSS-first `@theme` config)
- **Icons:** `lucide-react` + `simple-icons` for brand logos
- **Database:** MongoDB via Mongoose
- **Auth:** JWT (`jose`) — no NextAuth, no session store
- **Animations:** Tailwind keyframes + CSS

---

## 2. Project Structure

```
smart-restaurant-system/
├── app/
│   ├── layout.tsx                       Root layout + font + providers
│   ├── page.tsx                         Customer landing page
│   ├── globals.css                      Tailwind import + @theme + glass utilities
│   ├── favicon.ico
│   │
│   ├── admin/                           Admin dashboard (auth-gated)
│   │   ├── layout.tsx                   Staff auth check + topbar + sidebar
│   │   ├── page.tsx                     Overview — stats + recent reviews
│   │   ├── items/page.tsx               Food items CRUD
│   │   ├── categories/page.tsx          Categories CRUD (with cascade delete)
│   │   ├── offers/page.tsx              Coupons CRUD
│   │   ├── tables/page.tsx              Dining tables CRUD + QR tokens
│   │   ├── users/page.tsx               Staff users CRUD
│   │   ├── reviews/page.tsx             Read-only review browser
│   │   ├── marketing/page.tsx           Email broadcast composer
│   │   └── settings/page.tsx            Singleton restaurant settings
│   │
│   └── api/                             Route handlers
│       ├── categories/
│       │   ├── route.ts                 GET (list + counts) · POST (create)
│       │   └── [id]/route.ts            GET · PUT · DELETE (?cascade=)
│       ├── items/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       ├── offers/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       ├── tables/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       ├── users/
│       │   ├── route.ts                 POST hashes password with bcrypt
│       │   └── [id]/route.ts
│       ├── orders/
│       │   ├── route.ts                 Guest + table session creation
│       │   └── [id]/route.ts            Status updates (kitchen → served)
│       ├── reviews/route.ts             GET · POST (from confirmed orders)
│       ├── subscribers/route.ts         POST (public signup) · GET (admin list)
│       ├── settings/route.ts            GET · PUT (singleton)
│       └── broadcast/route.ts           POST — fan out marketing email
│
├── components/
│   ├── layout/
│   │   ├── header.tsx                   Customer top nav
│   │   ├── footer.tsx                   Customer footer
│   │   └── newsletterform.tsx           Footer subscribe widget
│   │
│   ├── sections/
│   │   ├── hero.tsx                     Landing hero
│   │   ├── offerbanner.tsx              Promo strip
│   │   └── menusection.tsx              Category tabs + food grid
│   │
│   ├── menu/
│   │   └── foodcard.tsx                 Single dish card with variant picker
│   │
│   ├── cart/
│   │   ├── cartdrawer.tsx               Slide-in cart with "Active Orders" pill
│   │   └── activeordersdrawer.tsx       Slide-in active orders tracker
│   │
│   ├── modals/
│   │   ├── checkputmodal.tsx            Checkout + order confirmation
│   │   ├── customizemodal.tsx           Per-item spice/notes
│   │   └── cameramodal.tsx              Visual search via getUserMedia
│   │
│   ├── orders/
│   │   └── activeorderssection.tsx      Inline active orders section
│   │
│   ├── providers/
│   │   └── appproviders.tsx             Composes all React contexts
│   │
│   ├── icons/
│   │   └── brandicons.tsx               Instagram / Facebook / X (simple-icons)
│   │
│   └── admin/
│       ├── admintopbar.tsx              Fixed header — admin badge + staff chip
│       ├── adminsidebar.tsx             Sectioned nav with usePathname active state
│       ├── statcard.tsx                 Reusable overview stat card
│       ├── itemsclient.tsx              Table + Modal (merged)
│       ├── categoriesclient.tsx         Table + Modal + Cascade-delete modal
│       ├── offersclient.tsx             Table + Modal (merged)
│       ├── tablesclient.tsx             Grid + Modal (merged)
│       ├── usersclient.tsx              Table + Modal (merged)
│       ├── reviewsclient.tsx            Read-only browser with filters + stats
│       ├── marketingclient.tsx          Composer + subscriber list
│       └── settingsclient.tsx           Multi-section form
│
├── context/
│   ├── cartcontext.tsx                  Cart state, promo codes, drawer toggle
│   ├── ordercontext.tsx                 Active + past orders, placeOrder, cancelOrder
│   ├── toastcontext.tsx                 Global toast notifications
│   └── menufiltercontext.tsx            Search query + active category
│
├── models/                              All filenames lowercase
│   ├── user.ts                          Staff only (admin/chef/waiter)
│   ├── category.ts
│   ├── item.ts                          Variants + discountPercent
│   ├── order.ts                         Online + dining (discriminated union)
│   ├── offer.ts                         Time-limited or permanent coupons
│   ├── subscriber.ts                    Promotional email list
│   ├── review.ts                        Per-order, per-item ratings
│   ├── table.ts                         Dining tables + QR tokens
│   └── settings.ts                      Singleton store configuration
│
├── types/
│   └── index.ts                         Shared TypeScript interfaces
│
├── data/
│   └── fooditems.ts                     Seed data for dev/demo
│
├── utils/
│   └── database.ts                      connectDB() + withDB() + disconnectDB()
│
├── scripts/
│   └── migrate.ts                       Bootstrap fresh DB + optional data copy
│
├── docs/
│   ├── ARCHITECTURE.md                  (this file)
│   ├── ROUTES.md                        API + page route reference
│   └── TECHNICAL.md                     Deep dives on auth, sessions, variants
│
├── public/
├── .env                                 MONGO_URL, JWT_SECRET
├── .gitignore
├── next.config.mjs                      Unsplash image whitelist
├── package.json
├── tsconfig.json
└── README.md
```

### Naming conventions

- **Every file is lowercase.** `foodcard.tsx`, not `FoodCard.tsx`. On Linux this matters — a Windows dev's `Header.tsx` will 404 on Vercel if the import says `header.tsx`.
- **Components inside files use PascalCase** (`export default function FoodCard`). Only the *filenames* are lowercased.
- **Admin client components** follow `<resource>client.tsx` — the page, table, and modal for each resource live in one file. Co-location beats file fragmentation at this scale.

---

## 3. Data Models

Nine Mongoose models. Customer guests have **no User document** — they are tracked by JWT session cookies and Order snapshots.

### 3.1 Model Reference

| Model | Purpose | Key Fields |
|---|---|---|
| **User** | Staff only | `name`, `email`, `password { secret, reset_required }`, `type: admin\|chef\|waiter`, `logout` |
| **Category** | Menu grouping | `name`, `slug` (both unique) |
| **Item** | Menu dish | `name`, `category → Category`, `variants[] { name, price, inStock, isDefault }`, `discountPercent`, `image_url` |
| **Order** | Customer order | `orderNumber`, `orderType: online\|dining`, `session` (JWT string), `table → Table` (dining only), `customer`, `items[]`, `status`, `estimatedArrival` |
| **Offer** | Coupon | `coupon` (unique), `discount` (0–1), `start_date`, `expire_date \| null`, `active` |
| **Subscriber** | Email list | `email` (unique), `status: active\|unsubscribed\|bounced`, `unsubscribeToken`, `source` |
| **Review** | Order feedback | `reviewerName`, `order → Order` (unique), `ratings[] { item → Item, rating 1–5, comment }`, `comment` |
| **Table** | Dining table | `table_id` (unique, e.g. "T01"), `capacity`, `location`, `status`, `qr_token` (unique) |
| **Settings** | Singleton config | `currency { code, symbol }`, `taxPercent`, `deliveryFee`, `sessionDays`, `guestSessionHours`, `hours {}`, `paginationSize` |

### 3.2 Relationship Diagram

```
                          ┌─────────────┐
                          │   User      │
                          │ (staff)     │
                          │ admin/chef/ │
                          │  waiter     │
                          └─────────────┘
                                │
                                │ no refs to/from
                                │ customers (guests)
                                ▽
                          ┌─────────────┐
                          │  Settings   │  ── singleton ──
                          └─────────────┘


    ┌──────────────┐                ┌──────────────────────┐
    │  Category    │◁──────┐        │      Item            │
    │              │       │        │                      │
    │  name        │       │   N    │  name                │
    │  slug        │       └────────│  category   (ref)    │
    └──────────────┘                │  variants[] {        │
                                    │    name, price,      │
                                    │    inStock, isDefault│
                                    │  }                   │
                                    │  discountPercent     │
                                    │  image_url           │
                                    └──────────────────────┘
                                            △
                                            │ N
                                            │
                                            │ (embedded in ratings[])
                                            │
                                    ┌───────┴──────┐
                                    │   Review     │
                                    │              │
                                    │ reviewerName │
                                    │ order  (ref) │──┐
                                    │ ratings[] {  │  │ 1
                                    │   item (ref) │  │
                                    │   rating 1-5 │  │
                                    │   comment    │  │
                                    │ }            │  │
                                    │ comment      │  │
                                    └──────────────┘  │
                                                      │
                                                      ▽
    ┌──────────────┐    ┌──────────────────────────────┐
    │   Table      │    │           Order              │
    │              │    │                              │
    │ table_id     │◁───│  orderNumber                 │
    │ capacity     │  N │  orderType: online|dining    │
    │ location     │    │  session  (JWT string)       │
    │ status       │    │  table    (ref, dining only) │
    │ qr_token     │    │  customer { name,            │
    └──────────────┘    │              phone?,         │
                        │              address? }      │
                        │  items[] {                   │
                        │    item (ref),               │
                        │    name, price, qty, note    │
                        │  }                           │
                        │  subtotal / tax / deliveryFee│
                        │  discount / total            │
                        │  couponCode?                 │
                        │  status: pending →           │
                        │          preparing →         │
                        │          on-the-way →        │
                        │          delivered           │
                        │  estimatedArrival            │
                        └──────────────────────────────┘
                                    △
                                    │ N
                                    │ (one review per order)
                                    │
                                    └───── Review.order (unique)


    ┌──────────────┐                ┌──────────────┐
    │   Offer      │                │  Subscriber  │
    │              │                │              │
    │ coupon       │                │ email        │
    │ discount 0-1 │                │ status       │
    │ start_date   │                │ token        │
    │ expire_date? │                │ source       │
    │ active       │                └──────────────┘
    └──────────────┘
       (referenced only by
        Order.couponCode string,
        not by ObjectId ref)
```

### 3.3 Key Relationships

| From | To | Cardinality | Notes |
|---|---|---|---|
| `Item.category` | `Category._id` | N : 1 | Every item belongs to exactly one category |
| `Order.table` | `Table._id` | N : 1 | **Only** for `orderType: 'dining'`; validated in `pre('validate')` |
| `Order.items[].item` | `Item._id` | N : 1 | Snapshot — name, price, image copied in at order time |
| `Review.order` | `Order._id` | 1 : 1 | Unique index — one review per order |
| `Review.ratings[].item` | `Item._id` | N : 1 | Per-dish ratings inside one review |

### 3.4 Deliberate design decisions

**Customer guests have no User document.** Orders carry a `session` string (a JWT `sid` claim) and a `customer` snapshot. This avoids creating thousands of throwaway User rows for one-time diners and lets us drop the entire concept of "sign up to order."

**Order snapshots item data.** `Order.items[].name`, `.price`, and `.image_url` are copies, not references. Editing a dish's price tomorrow does not retroactively change yesterday's invoices.

**Order status is derived, not stored, at the API layer for live tracking.** The `status` field is authoritative for kitchen workflow, but the client-side tracker (cart drawer + active-orders drawer) computes progress from `estimatedArrival` so badges update without polling.

**`Offer.expire_date` is nullable.** `null` means "runs forever." The `isValid()` instance method treats `null` as always-in-range. An offer only expires if a date is explicitly set AND that date has passed.

**`Table.qr_token` is separate from `table_id`.** `table_id` is human-readable ("T01"), `qr_token` is an opaque random string. If a QR code leaks, you rotate just that token without reprinting the sign. The URL is `/?t=<qr_token>`.

**Settings is a singleton.** One document, always. `Settings.get()` creates it with defaults on first call. No `key/value` collection — the set of settings is fixed and known at development time.

---

## 4. Runtime Flows

### 4.1 Customer order (QR scan → delivery/dine-in)

```
1. Customer scans QR at Table 5
   → GET /?t=<qr_token>
   → Server resolves token → Table found
   → Server issues guest JWT with { sid, type:'table', tableId }
   → Sets HttpOnly cookie tc_session

2. Customer browses menu (MenuFilterContext filters client-side)
3. Adds items to cart (CartContext — localStorage backed)
4. Clicks Checkout

5. CheckoutModal POST /api/orders
   → Server verifies JWT
   → Sets orderType='dining', table=Table._id
   → Snapshots customer + items
   → Order.get() → { status:'pending', estimatedArrival: now + 30min }
   → Returns order

6. ActiveOrdersDrawer shows live progress
   → Status advances via deriveOrderStatus(order) each render
   → 15-second tick re-renders the drawer

7. Kitchen staff (admin/chef) update status via /admin
   → POST /api/orders/[id] { status:'preparing' } etc.
```

### 4.2 Online order (no QR)

Identical, except:
- `orderType='online'`
- `customer.phone` and `customer.address` required (validated in pre-hook)
- `deliveryFee` applied
- No `table` reference

### 4.3 Guest session persistence

The JWT lives in an **HttpOnly cookie** (`tc_session`), valid for `Settings.guestSessionHours`. A returning guest's cookie is verified server-side, the `sid` claim is extracted, and it becomes the `Order.session` string. This is how "my active orders" survives a page reload with zero accounts.

---

## 5. Authentication & Authorization

| Layer | Mechanism |
|---|---|
| Customer | None. Guests identified by `tc_session` JWT cookie. |
| Staff login | `POST /api/auth/login` → verifies bcrypt hash → signs JWT with role → sets `tc_staff` HttpOnly cookie |
| Admin layout | `app/admin/layout.tsx` verifies `tc_staff`, redirects to `/login` if invalid |
| API routes | Each handler calls a `requireStaff(req, roles)` helper (see `docs/TECHNICAL.md`) |

Staff JWT payload includes `sub` (user ID), `role`, `name`, `email`. The `User.logout` field allows immediate revocation — sessions issued before `logout` are rejected even if the JWT has not expired.

---

## 6. Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run migrate` | Bootstrap collections + indexes + Settings singleton (see `scripts/migrate.ts`) |

---

## 7. Further Reading

- **`docs/ROUTES.md`** — every page route and API endpoint with request/response shapes
- **`docs/TECHNICAL.md`** — deep dives: JWT session handling, variant pricing math, cascade delete flow, image remote patterns
