// SIMULATED payment validation. No real money moves — this validates the shape
// of the input, records a transaction, and returns a status.
//
// STRIPE-INTEGRATION-POINT: replace validateCardPayment() with a Stripe
// PaymentIntent confirmation and set provider='stripe' / status='paid'. Never
// store PAN or CVC — only the last 4 digits are persisted anywhere.

const ZELLE_HANDLE = "payments@joamorocco.com";
const PAYPAL_HANDLE = "paypal.me/joamorocco";

function luhnValid(num) {
  const digits = String(num).replace(/\D/g, "");
  if (digits.length < 12 || digits.length > 19) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i]);
    if (alt) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    alt = !alt;
  }
  return sum % 10 === 0;
}

function expiryInFuture(expiry) {
  const m = /^(\d{2})\s*\/\s*(\d{2})$/.exec(String(expiry).trim());
  if (!m) return false;
  const month = Number(m[1]);
  const year = 2000 + Number(m[2]);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const curY = now.getFullYear();
  const curM = now.getMonth() + 1;
  return year > curY || (year === curY && month >= curM);
}

// Returns { ok, error, method, txStatus, last4, instructions }.
export function processPayment(payment = {}) {
  const method = payment.method;

  // Apple Pay sends no card fields — the wallet sheet handles the card.
  // STRIPE-INTEGRATION-POINT: confirm the Apple Pay PaymentIntent here.
  if (method === "apple_pay") {
    return { ok: true, method, txStatus: "test", last4: null, instructions: "" };
  }

  if (method === "card") {
    const number = String(payment.cardNumber || "").replace(/\s/g, "");
    if (!luhnValid(number)) {
      return { ok: false, error: "That card number doesn't look valid." };
    }
    if (!expiryInFuture(payment.expiry)) {
      return { ok: false, error: "Card expiry must be a valid future date (MM/YY)." };
    }
    if (!/^\d{3,4}$/.test(String(payment.cvc || ""))) {
      return { ok: false, error: "Enter a valid 3 or 4 digit security code." };
    }
    return {
      ok: true,
      method,
      txStatus: "test", // simulated authorization
      last4: number.slice(-4),
      instructions: "",
    };
  }

  if (method === "paypal") {
    return {
      ok: true,
      method,
      txStatus: "pending",
      last4: null,
      instructions: `We'll email you a PayPal request. You can also send payment to ${PAYPAL_HANDLE}. Your dates are held on our private calendar in the meantime.`,
    };
  }

  if (method === "zelle") {
    return {
      ok: true,
      method,
      txStatus: "pending",
      last4: null,
      instructions: `Send your Zelle payment to ${ZELLE_HANDLE} using your confirmation code as the memo. Your dates are held on our private calendar in the meantime.`,
    };
  }

  return { ok: false, error: "Choose a payment method." };
}
