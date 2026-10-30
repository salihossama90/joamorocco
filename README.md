# JOA Morocco

A booking website for JOA Morocco — a private-tour travel agency. Visitors explore two multi-day private tours, read day-by-day itineraries and verified reviews, and book through a six-step wizard with a real availability calendar, tiered pricing, and downloadable PDF confirmations.

---

## Tours

### The Kingdom of Morocco Tour
**11 days / 10 nights · from $1,200 pp · Casablanca → Tangier**

The full Kingdom, coast to Sahara to the blue north: Hassan II Mosque, Marrakech, the High Atlas and Ait Ben Haddou, two nights in a luxury Sahara camp, Fes, Chefchaouen, and Tangier.

### Sahara Dreams
**8 days / 7 nights · from $1,000 pp · Casablanca → Casablanca**

From imperial cities to the golden dunes: Casablanca, Fes, the Middle Atlas, two nights at Erg Chebbi, and two full days in Marrakech.

Every tour is **completely private** — reserved exclusively for one group at a time — with Mercedes-Benz Vito transport, handpicked hotels, and an optional 5★ luxury upgrade.

---

## How booking works

A six-step wizard (`/book`): **Tour → Start date → Guests → Requests → Payment → Confirmation.**

- **One shared availability calendar.** Because tours are private (one vehicle, one group), any confirmed booking blocks its full date span for *both* tours. The calendar also disables start dates whose tour would *run into* an existing booking, and enforces a **14-day minimum advance**. Blocked days show a reason on hover.
- **Tiered per-person pricing** (per tour): 2 guests / 3–5 / 6+. Kingdom is $1,700 / $1,500 / $1,200; Sahara Dreams is $1,500 / $1,200 / $1,000. Children (3–11) pay 50%; toddlers (0–2) are free. The tier is set by the paying-guest count and the total updates live.
- **Guest checkout, no accounts.** Every booking is a one-time guest purchase; everything is emailed. Guests reopen a trip with their confirmation code + email at `/find-booking` to download the PDF, add seats, or leave a review.
- **Simulated payments, Stripe-ready.** Card fields are validated (Luhn/expiry) and a transaction is recorded, but no money moves. PayPal/Zelle show manual instructions. Search the code for `STRIPE-INTEGRATION-POINT` to see exactly where to drop in Stripe.

Confirmations produce a `JOA-XXXX-XXXX` reference, a downloadable PDF itinerary, and (if EmailJS is configured) a confirmation email.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, plain CSS |
| Build | Vite 6 |
| Hosting / Functions | Netlify (serverless functions, ESM) |
| Database | Turso (libSQL) via `@libsql/client` |
| PDF | jsPDF (lazy-loaded) |
| Email | EmailJS (client-side) |

Shared logic (pricing, dates, tour metadata) lives in `shared/*.mjs` and is imported by **both** the browser (via the `@shared` alias) and the serverless functions, so the client preview and the server's authoritative recompute can never drift.

---

## Local development

```bash
npm install
npm run db:setup   # creates the schema
npm run dev        # netlify dev — Vite + functions together
```

**No Turso account needed to start.** With the placeholder values in `.env`, the app automatically falls back to a local SQLite file at `.data/local.db` (and dev-only crypto keys), so the entire booking engine runs offline. Fill in real values when you're ready to go live.

`npm run dev:vite` runs the frontend alone (no `/api` functions).

---

## Environment variables

Copy `.env.example` to `.env` and fill in:

```
TURSO_URL=libsql://YOUR-DATABASE-NAME.turso.io
TURSO_TOKEN=YOUR_TURSO_AUTH_TOKEN
ENCRYPTION_KEY=<64 hex chars>     # AES-256 key for guest PII at rest
SESSION_SECRET=<64 hex chars>     # keys the email hash for guest booking lookup

# EmailJS (optional — confirmation + contact emails)
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_PUBLIC_KEY=...
VITE_EMAILJS_TEMPLATE_BOOKING=...
VITE_EMAILJS_TEMPLATE_CONTACT=...
```

Generate a key: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

> ⚠️ **Security note:** an earlier commit checked a **live Turso token** into `.env`. It has been replaced with a placeholder here, but it still exists in git history — **rotate that token in the Turso dashboard** (Databases → your DB → Tokens) so the old one stops working.

---

## Database schema

Four tables (see `scripts/setup-db.mjs`), created idempotently by `npm run db:setup`:

- **`users`** — unused since customer accounts were removed (29 Oct 2026); left in place, not dropped.
- **`bookings`** — reference, tour, start/end dates (`YYYY-MM-DD`), guest counts, total (cents), price breakdown (JSON snapshot), status, `user_id` (always null since accounts were removed), AES-256-GCM-encrypted contact fields + an HMAC of the email for guest lookup.
- **`transactions`** — one per payment (initial or add-seats), amount, method, status, provider (`simulated` → later `stripe`), card last4 only.
- **`reviews`** — one per booking, tied to real ownership (replaces the old shared-secret gate).

The overlap check and insert happen in a **single atomic SQL statement** (`INSERT … SELECT … WHERE NOT EXISTS`), so concurrent bookings can't double-book the same dates.

---

## Build & deploy

```bash
npm run build      # outputs to dist/
```

Deploy by pushing to the connected Netlify site; `netlify.toml` supplies the build command, publish dir, function bundler settings, and the `/api/*` → functions rewrite. Set the environment variables in the Netlify dashboard, and run the schema once against your Turso database (`TURSO_URL`/`TURSO_TOKEN` set locally, then `npm run db:setup`).

---

## Contact

**JOA Morocco** · hello@joamorocco.com · Marrakech, Morocco
