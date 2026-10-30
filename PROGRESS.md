# JOA Morocco — Progress Ledger

Owner requests, in the order received. Newest batch at the bottom.

## Done

### 28 Sep 2026 — tour page redesign batch (owner phone screenshots 1–3)
- [x] Social icons: X, Facebook, Instagram, TikTok, YouTube (menu + contact page)
- [x] Tour page stars in luxury gold (hero + reviews)
- [x] "pp" replaced with "/ person" everywhere (owner disliked "pp"; asked us to pick)
- [x] Still hero image replaced by a swipeable photo gallery (arrows, dots, swipe)
- [x] Gallery photos carry no captions; gold stars sit directly on the photos, bottom centre (no black bar)
- [x] Top gallery shorter (60vh, max 620px) than old 88vh hero
- [x] Price removed from the top photos; shown only under the title before the description, no duplicate "pp / per person"
- [x] Tent/kasbah mid-page gallery removed
- [x] Information / Tour Plan / Gallery / Reviews tabs removed — one continuous page
- [x] "Free Consultation" floating button on every page (opens contact form with subject pre-filled)
- [x] Terms & Conditions (/terms) and Privacy Policy (/privacy) pages with owner's text; links above the footer copyright

### 29 Oct 2026 — owner phone screenshots
- [x] Home showcase split into three panels, not two: third is "Custom" — no fixed itinerary; it sends the visitor to the contact form (subject "Custom trip") so JOA can build the trip around them
- [x] Tour page reviews read sideways (swipe, arrows, dots) instead of an endless vertical list
- [x] Booking card line "Free date changes before payment" now reads "Free date changes up to 2 weeks before your trip, subject to availability" (owner: dates may change only if the new dates are open)
- [x] Footer on every page: Facebook, Instagram, TikTok, YouTube icons under the address (owner circled the gap)
- [x] Tour pages: gold stars on the top photos replaced by Facebook/Instagram/TikTok/YouTube icons; gold stars move next to the tour title (all tour pages)
- [x] Contact page: heading "Send a postcard" becomes "Contact us"
- [x] Contact page: "About" becomes a choice — Free consultation / Ask a question / Other
- [x] Contact page, Free consultation chosen: visitor picks a day and time slot for the call
- [x] Contact page, Free consultation chosen: visitor picks how to meet — WhatsApp video call, WhatsApp audio call, phone call (US only), Google Meet, Zoom
- [x] Contact page: no floating Free Consultation button (redundant there)
- [x] Contact page "Find us" card: Replies "Within a day, Morocco time" becomes "Within 24 hours"
- [x] No customer accounts: remove Log in / Create account everywhere. One-time purchase; everything the guest needs is emailed. "Find your booking" (confirmation code + email) stays as the way back to a trip; menu shows "Find booking"; old /login and /account links forward there. Database users table left in place, unused
- [x] About page redone, simple: a title, one photo, and the owner's story text (polished, keeping: American-born founder with Moroccan roots; tours built by guides who lived those streets — knowledge from living, not memorizing; every journey shaped around the traveller)
- [x] Found while doing the About page: phone menu icon is white, nearly invisible on light-topped pages (About, legal, contact form area) — make it dark there
- [x] Owner asked for a visual design check of all of the above (29 Oct): review cards now name/stars on one row with the text full width and equal card heights; footer contact list lost its bullets so it lines up with the icons; home phone panels drop the italic subtitle so the first title clears the logo; About and Find booking titles match the other page titles; contact postcard gives the choices the wider half on desktop and sits the Find us card beside it only on wide screens; the jump to the contact form lands below the top bar

## Deploys
- 29 Sep 2026 — tag `deployed/2026-09-29-1`: the 28 Sep tour page redesign batch above, plus contact details restored. Netlify CLI from the sohaile.salih1994 account (the JOA site is not on supersimpleschool). Live check: tour page, legal pages, contact page OK, no page errors.
- 30 Oct 2026 — tag `deployed/2026-10-30-1`: the 29 Oct batch above (custom trip panel, sideways reviews, consultation booking on contact, customer accounts removed, new About page, design pass). Owner switched Netlify accounts first. Live check: home, about, contact, find-booking, terms load; old auth endpoint gone (404); 6 functions live, matching the repo.

## Open questions for owner
- Legal pages + footer + contact now use the original contact details from the old site footer (580 Riverview Dr, Columbus, OH · +1 614-380-9363 · joamorocco@gmail.com), per owner 28 Sep 2026.
- Consultation time slots: offered 9:00 AM–5:30 PM in the visitor's own time zone, next 14 days (zone is written into the email). Owner to confirm the hours JOA actually takes calls.
- Social icon links point to each platform's home page until JOA's real profile URLs are given.
