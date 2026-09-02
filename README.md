# Durrani Harvest

Storefront (React + Vite) + admin panel + REST API (Express).

## Run locally

Two processes — start both.

### 1. Backend API

```bash
cd backend
npm install
npm run dev        # http://localhost:5000  (nodemon-style watch via node --watch)
```

On first boot it seeds an admin account from `backend/.env`:

| | |
|---|---|
| Email | `admin@durraniharvest.com` |
| Password | `admin12345` |

Data is stored as JSON files in `backend/data/` (git-ignored). Delete that
folder to reset products, orders and the admin account.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

`frontend/.env` points the app at the API:

```
VITE_API_URL=http://localhost:5000
```

## Admin panel

Visit `/admin` (redirects to `/admin/login`). After signing in:

- **Dashboard** – revenue, order counts, 7-day revenue chart, recent orders
- **Products** – create / edit / delete products; they appear on the storefront
  home page and their collection page immediately
- **Orders** – every checkout lands here; open an order to see the full
  breakdown and change its status (pending → confirmed → shipped → delivered /
  cancelled)
- **Settings** – change the admin password

## API overview

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/login` | – | email + password → JWT |
| GET | `/api/auth/me` | ✅ | current admin |
| POST | `/api/auth/change-password` | ✅ | rotate password |
| GET | `/api/products` | – | admin-managed catalogue |
| POST | `/api/products` | ✅ | create |
| PUT | `/api/products/:id` | ✅ | update |
| DELETE | `/api/products/:id` | ✅ | delete |
| POST | `/api/orders` | – | place order (checkout) |
| GET | `/api/orders` | ✅ | list (filter `?status=`, `?q=`) |
| GET | `/api/orders/:id` | ✅ | one order |
| PATCH | `/api/orders/:id` | ✅ | `{ status }` |
| GET | `/api/stats` | ✅ | dashboard summary |

Auth = `Authorization: Bearer <token>`.

## Production notes

- Set a strong `JWT_SECRET` and change `ADMIN_PASSWORD` in `backend/.env`.
- The JSON file store is fine for a single instance; swap `backend/src/store.js`
  for a real database to scale out.
- Payments are UI-only (Cash on Delivery / Bank Deposit) — no gateway is wired.
