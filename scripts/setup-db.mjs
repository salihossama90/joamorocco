// Idempotent schema setup. Run with:  npm run db:setup
//
// Works against Turso when TURSO_URL/TOKEN are set to real values, otherwise
// against the local .data/local.db file (same resolution as the functions), so
// you can develop and test the entire booking engine with no cloud account.
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@libsql/client";

// ── Minimal .env loader (avoids depending on Node 20's loadEnvFile) ──
function loadEnv() {
  const file = path.join(process.cwd(), ".env");
  if (!fs.existsSync(file)) return;
  for (const raw of fs.readFileSync(file, "utf8").split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
}

function resolveClient() {
  const url = process.env.TURSO_URL || "";
  const token = process.env.TURSO_TOKEN || "";
  const real =
    url.startsWith("libsql://") && !/YOUR/i.test(url) && token && !/YOUR/i.test(token);
  if (real) {
    console.log("→ Using Turso:", url);
    return createClient({ url, authToken: token });
  }
  const dir = path.join(process.cwd(), ".data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const fileUrl = "file:" + path.join(dir, "local.db");
  console.log("→ Turso not configured; using local file:", fileUrl);
  return createClient({ url: fileUrl });
}

const STATEMENTS = [
  // users + bookings.user_id are unused since customer accounts were removed
  // (29 Oct 2026); kept so existing databases need no migration.
  `CREATE TABLE IF NOT EXISTS users (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     email TEXT NOT NULL UNIQUE,
     password_hash TEXT NOT NULL,
     name TEXT NOT NULL,
     created_at TEXT NOT NULL DEFAULT (datetime('now'))
   )`,

  `CREATE TABLE IF NOT EXISTS bookings (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     reference TEXT NOT NULL UNIQUE,
     tour_key TEXT NOT NULL CHECK (tour_key IN ('kingdom','desert')),
     start_date TEXT NOT NULL,
     end_date TEXT NOT NULL,
     adults INTEGER NOT NULL,
     children INTEGER NOT NULL DEFAULT 0,
     toddlers INTEGER NOT NULL DEFAULT 0,
     total_cents INTEGER NOT NULL,
     price_breakdown TEXT NOT NULL,
     special_requests TEXT,
     status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending','confirmed','cancelled')),
     user_id INTEGER REFERENCES users(id),
     contact_name TEXT NOT NULL,
     contact_email TEXT NOT NULL,
     contact_email_hmac TEXT NOT NULL,
     contact_phone TEXT,
     created_at TEXT NOT NULL DEFAULT (datetime('now'))
   )`,

  `CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(start_date, end_date)`,
  `CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(contact_email_hmac)`,

  `CREATE TABLE IF NOT EXISTS transactions (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     booking_id INTEGER NOT NULL REFERENCES bookings(id),
     amount_cents INTEGER NOT NULL,
     currency TEXT NOT NULL DEFAULT 'USD',
     method TEXT NOT NULL CHECK (method IN ('card','apple_pay','paypal','zelle')),
     status TEXT NOT NULL DEFAULT 'test',
     provider TEXT NOT NULL DEFAULT 'simulated',
     provider_ref TEXT,
     card_last4 TEXT,
     kind TEXT NOT NULL DEFAULT 'initial',
     created_at TEXT NOT NULL DEFAULT (datetime('now'))
   )`,

  `CREATE INDEX IF NOT EXISTS idx_transactions_booking ON transactions(booking_id)`,

  `CREATE TABLE IF NOT EXISTS reviews (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     booking_id INTEGER NOT NULL UNIQUE REFERENCES bookings(id),
     tour_key TEXT NOT NULL,
     name TEXT NOT NULL,
     stars INTEGER NOT NULL CHECK (stars BETWEEN 1 AND 5),
     review TEXT NOT NULL,
     created_at TEXT NOT NULL DEFAULT (datetime('now'))
   )`,

  `CREATE INDEX IF NOT EXISTS idx_reviews_tour ON reviews(tour_key)`,
];

// Added for Stripe (Nov 2026): the PaymentIntent a booking was paid with, so
// a payment can only ever create one booking. ADD COLUMN isn't idempotent in
// SQLite, so it runs only when the column is missing.
async function migrate(db) {
  const cols = await db.execute(`PRAGMA table_info(bookings)`);
  if (!cols.rows.some((c) => c.name === "stripe_intent")) {
    await db.execute(`ALTER TABLE bookings ADD COLUMN stripe_intent TEXT`);
  }
  await db.execute(
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_stripe_intent ON bookings(stripe_intent) WHERE stripe_intent IS NOT NULL`
  );
  // One transaction per Stripe payment (balance payments, added seats)
  await db.execute(
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_transactions_provider_ref ON transactions(provider_ref) WHERE provider_ref IS NOT NULL`
  );
}

async function main() {
  loadEnv();
  const db = resolveClient();
  for (const sql of STATEMENTS) {
    await db.execute(sql);
  }
  await migrate(db);
  console.log("✓ Schema ready (users, bookings, transactions, reviews; Stripe columns).");
}

main().catch((err) => {
  console.error("✗ Setup failed:", err.message);
  process.exit(1);
});
