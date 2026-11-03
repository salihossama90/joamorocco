# Design System

The homepage (`/`) is finalized. Every value below is what the homepage ships
with today, taken from `src/Pages/Home/Home.css`, the `navbar--home` rules in
`src/Nav-Logo-Footer/Navbar/Navbar.css` and the `footer--home` rules in
`src/Nav-Logo-Footer/Footer/Footer.css`. Other pages adopt this system one at a
time; until a page is converted it keeps its older Playfair/sand styling.

Most values were measured from a reference luxury-travel site's computed CSS.
Only its *system* was used (sizes, spacing, weights): no text, logos, images,
reviews, artwork or contact details. Where a value was set by eye rather than
measured it says so.

## 1. Fonts

Loaded from Google Fonts in `src/index.css`.

| Role | Family | Weights |
|---|---|---|
| Display (big condensed headings) | **League Gothic** | 400 |
| Everything else | **Josefin Sans** | 300, 400, 500, 600, 700 + italic 400/500 |

Stacks:
- Display: `"League Gothic", "Oswald", Impact, sans-serif`
- Sans: `"Josefin Sans", "Helvetica Neue", Helvetica, Arial, sans-serif`

Base text on every converted page (the page root):

| Property | Value |
|---|---|
| Font | Josefin Sans |
| Size / line-height | `17px` / `1.5` (25.5px) |
| Letter-spacing | `0.85px` |
| Color | `#52575c` |
| Text size adjust | `none` |

Rendering on every element: `-webkit-font-smoothing: antialiased`,
`-moz-osx-font-smoothing: grayscale`, `text-rendering: optimizeLegibility`,
`-webkit-tap-highlight-color: transparent`.

Page reset (scoped to the page root, placed before all section rules):
`background-color: transparent; border: 0; box-sizing: border-box; font: inherit; margin: 0; padding: 0`.

## 2. Colors

| Token | Value | Use |
|---|---|---|
| Accent | `#ff681a` (`--primary-color`) | Header button, reviewer names, quote mark, stars, hover on links/icons, focus rings |
| Accent hover | `#e85a10` | Accent button hover |
| Heading on white | `#2f2f2f` | Text-section headings, active review dot |
| Body | `#52575c` | Body copy, review quotes |
| Black | `#000` | Get in Touch button |
| Ink | `#111111` | Solid-dark buttons, menu icon on light sections |
| Link dark | `#222` | Menu links / phone over light sections |
| White | `#ffffff` | Page background, all text on video, photos and dark sections |
| Dot grey | `#cacccf` | Inactive review dots |
| Footer grey | `#adadad` | All footer text and icons |
| Trips section | `linear-gradient(180deg, #4b4b4b 0%, #363636 45%, #2a2a2a 100%)` | Explore Our Trips background |
| Footer social band | `#141414` | |
| Footer | `#0d0d0d` | |

## 3. Type styles

| Style | Font | Size / line-height | Weight | Letter-spacing | Case | Color |
|---|---|---|---|---|---|---|
| Hero eyebrow | Sans | 14px / 21px | 700 | 1.4px | upper | #fff |
| Hero headline | Display | 45px / 40.5px | 400 | 2.5px | upper | #fff (max-width 504px) |
| Section title (dark) | Display | 45px / 45px | 400 | 2.25px | upper | #fff |
| Section subtitle (dark) | Sans italic | 17px / 25.5px | 400 | 0.85px | none | #fff |
| Text-section heading | Sans | 18px / 1.28 | 700 | 1.8px | upper | #2f2f2f |
| Body | Sans | 17px / 25.5px | 400 | 0.85px | none | #52575c |
| Emphasis | Sans italic | inherits | — | — | — | inherits |
| Review quote | Sans | 13px / 19.5px | 700 | 1.5px | upper | #52575c |
| Reviewer | Sans italic | 13px / 19.5px | 700 | 1.5px | none | accent |
| Card meta ("11 Days · Private") | Sans | 12px / 19.55px | 700 | 0.6px | upper | #fff + `text-shadow: rgba(0,0,0,.6) 1px 1px 1px` |
| Card place ("Casablanca → Tangier") | Sans | 11px / 19.55px | 700 | 1.1px | upper | #fff |
| Card title | Sans | 16px / 22.4px | 700 | 1.5px | upper | #fff |
| Card description | Sans | 17px / 19.55px | 400 | 0.85px | none | #fff |
| Card price line | Sans italic | 14px / 19.55px | 400 | 0.85px | none | #fff |
| Slideshow "NEXT" | Sans | 12px / 12px | 700 | 1.5px | upper | #fff |
| Slideshow next name | Sans italic | 16px / 21.6px | 400 | 1.2px | none | #fff |
| Menu link | Sans | 12px / 18px | 600 | 0.85px | upper | #fff (#222 on light) |
| Header phone | Sans | 13px / 19.5px | 700 | 0.85px | upper | #fff (#222 on light) |
| Footer contact | Sans | 14px / 21px | 400 | 0.85px | none | #adadad |
| Footer copyright | Sans | 11px / 16.5px | 700 | 0.6px | upper | #adadad |
| Footer link | Sans | 12px / 18px | 400 | 0.6px | upper | #adadad |

Numbers always use Josefin Sans with letter-spacing from the scale above
(0.6px, 0.85px, 1.2px, 1.5px, 2.25px); League Gothic is for headlines only.

Uppercase headings with letter-spacing get `padding-left` equal to their
letter-spacing so the trailing space doesn't push them off-centre.

## 4. Buttons

All buttons: Josefin Sans, uppercase, `display: inline-flex`, centred text,
`border-radius: 3px`, `1px` border.

| Button | Height | Padding | Text | Fill / border | Transition |
|---|---|---|---|---|---|
| Standard (hero, trip cards, Get in Touch) | 40px | 10px 20px | 12px / 700 / 1.2px / line-height 12px | see variants | color, background-color, border-color, opacity `0.5s ease` |
| Header "Free Consultation" | 32px | 10px 20px | 10px / 700 / 0.5px / line-height 10px | accent fill, transparent border | same |

Variants:
- **Outline light** (on video/photos): transparent, `#fff` text and border; hover fills white with ink text.
- **Solid dark on image**: `#111` fill, `#fff` border.
- **Black** (Get in Touch): `#000` fill and border, `#fff` text.
- **Accent**: `#ff681a` fill, hover `#e85a10`.

Buttons size to their text. Side-by-side buttons sit `12.75px` apart and wrap
on narrow screens. Focus ring: `2px solid` accent, offset 2–3px.

## 5. Spacing and layout

Spacing steps used: `6.375px`, `12.75px`, `25.5px`, `60px`, `85.5px`, `90px`.

| Item | Phone (≤ 768px) | Desktop |
|---|---|---|
| Content max-width | 1369px | 1369px |
| Side padding (hero, trips) | 15px | 25.5px |
| Text-section padding (top / bottom) | 60px / 56px | 60px / 90px (≥ 768px) |
| Text column | 820px max | 820px max |
| Dark/card section padding | 60px top / 85.5px bottom | 60px / 60px (≥ 1024px) |

Text sections (About):
- Space under the hero/video: `60px` at every width (the reference's
  `.section { padding: 60px 0 }`); same on tour pages between the video and
  the title.
- Space after the review dots before the next section: also `60px`, on the
  homepage and tour pages.
- Heading → first paragraph: `6.375px`
- Between paragraphs: `25.5px`
- Last paragraph → button: `20px`
- Everything centred.

## 6. Header (menu bar)

- **Height** `65px`, fixed, at every width.
- **No background colour** at any scroll position. After 60px of scrolling a
  colourless frosted band fades in behind it (`backdrop-filter: blur(12px)`,
  lower edge faded with a `#000 60% → transparent` mask, `0.3s`). It's a
  `::before` layer, so the full-screen phone menu still works.
- **Logo**: `30px` tall, width from its proportions (~62px), vertically centred.
- **Over light sections** (`data-tone="light"`: About, reviews) the menu icon,
  links and phone turn dark (`#111` / `#222`); over the video, trips and
  footer they stay white. The switch fades over `0.25s`.
- **Phone (< 780px)**: `17px` side padding. Logo left; Free Consultation `32px`
  button `12.75px` before the menu icon; icon at the right edge. Menu-icon lines
  are `2px` thick with no border, bottom line `14px`; open state is an even X
  (two 24px arms). The full-screen menu hides the header button.
- **Desktop (≥ 780px)**: `3rem` side padding; links `21px` apart.
  780–1099px: links sit just before the button (`1.5rem` gap).
  ≥ 1100px: links centred in the bar.
  ≥ 1200px: phone number `+1 614 601 7897` shown `25.5px` before the button.
- The floating "Free Consultation" button used on other pages is hidden on
  converted pages, since the header carries it.

## 7. Hero (homepage)

- Full-screen (`100svh`) slideshow of the three trips, one video each, with
  the trip photo as poster. Videos crossfade with `opacity 1000ms`; only the
  visible one plays, the others don't preload. Advances every `8s`; any click
  restarts the timer. Reduced motion: no video, no auto-advance.
- Scrim: `linear-gradient(to bottom, rgba(0,0,0,.45) 0%, transparent 22%)` over
  `linear-gradient(to top, rgba(0,0,0,.78) 0%, rgba(0,0,0,.35) 45%, rgba(0,0,0,.1) 75%)`.
- Text block vertically centred, left-aligned, max-width 1369px, side
  padding 15px / 25.5px. Eyebrow → headline → buttons, each `12.75px` apart.
  Screens under 600px tall add 80px / 140px top/bottom room.
- Bottom-left, `25.5px` from the bottom: "NEXT" + next trip name (`6px`
  apart), then one progress bar per slide (`36px × 3px`, track
  `rgba(255,255,255,.35)`, fills white over the slide's 8s, `8px` gap).
- Social icons: the footer's see-through rings (`43px`, transparent inside,
  `1px rgba(255,255,255,.25)`, white `22px` icon with a soft
  `drop-shadow(0 1px 2px rgba(0,0,0,.45))` for legibility on video, `25.5px`
  apart). Desktop: centred on the bottom row, `25.5px` up, between NEXT and
  the arrows. Phones (< 780px): centred `125px` up, above that row. Hidden on
  screens under 600px tall.
- Bottom-right: round arrows, `40px`, `rgba(0,0,0,.3)` fill, `1px
  rgba(255,255,255,.1)` border, `16px` chevron icons, `12.75px` apart,
  `0.25s ease-in-out`.

## 8. Image treatment

- Photos and video always carry a dark scrim so white text reads (≥ WCAG AA).
- **Trip cards**: `310 × 460px`, no radius, photo `cover`; overlay
  `linear-gradient(to bottom, rgba(0,0,0,.4) 0%, rgba(0,0,0,.45) 50%, rgba(0,0,0,.75) 100%)`.
- No rounded corners on images; no borders; no shadows.

## 9. Components

### Trip cards (Explore Our Trips)
- Card `310 × 460px`, cards `25.5px` apart in a sideways scroll-snap row.
- Meta label top-right, `25.5px` in. Bottom block `24px` padding (text 262px
  wide): place → title (`5.667px` gap) → description → price (`6.375px` above)
  → button (`1.25rem` above, by eye).
- **Hover reveal** (mouse/trackpad only): description and price stay hidden
  until the card is hovered or focused, then open over `0.5s`. Touch screens
  always show them.
- Arrows: `43px` frosted circles (`rgba(0,0,0,.3)`, `blur(5.41667px)`,
  `1px rgba(255,255,255,.25)`), each shown only when it can move.
  Phone: bottom-left, `25.5px` in, inside the 85.5px bottom padding.
  Desktop (≥ 1024px): two columns — title block at the right of the left `30%`
  column (`25.5px` before the cards, title on one line), cards on the right
  running to the screen edge, arrows centred on the cards (next right,
  previous left), arrows above the card text layer.

### Reviews
- A sliding row of reviews across the content width (max 1369px, side
  padding 15px / 25.5px), clipped at the content edge. How many show at once
  depends on the carousel's width: **4** at ≥ 980px and **1** below 560px
  (measured on the reference: 4 × 253px with no gap at a 1062px window, one
  476px review at 534px); 3 at 720–979px and 2 at 560–719px are by eye.
- Each review: quote mark (JOA orange, ~14px wide), uppercase quote, italic
  accent name, stars in accent; centred; text column max `343px`; `12.75px`
  inner side padding; min-height `140px`.
- Moves one review every `5s` for everyone (including while hovered), slides
  over `0.5s`, loops back to the start. Swipe on touch screens; any dot click
  or swipe restarts the timer. Reduced motion: jumps instead of sliding.
- Dots, one per stop (reviews − shown + 1; e.g. 8 reviews, 4 shown → 5 dots):
  `10px` circles, `1px #fff` border, `#cacccf`; active `#2f2f2f`. No arrows.

## 10. Footer

Single centred column at every width.

| Part | Value |
|---|---|
| Social icons | No band of their own: centred between the contact lines and the small italic line (`25.5px` above and below). Each is a see-through ring: `43px` circle, **transparent inside** (no fill, no blur), `1px rgba(255,255,255,.25)` border, `22px` white icon, `25.5px` apart; hover: icon and ring turn accent |
| Body | `#0d0d0d`; padding `60px 1.5rem 25.5px` (≥ 780px: side padding `4rem`). Order: address, email, phone → social icons → small italic line |
| Rhythm | Top → address `60px`; phone → icons `25.5px`; icons → italic line `25.5px`; italic line → divider `25.5px`; divider → copyright `25.5px`; copyright → links `12.75px`; links → page bottom `25.5px` (links keep a 6px tap padding) |
| Contact | Address, then email, then phone; centred in an `800px` column, `1.1rem` apart; links underlined `1px rgba(255,255,255,.45)` |
| Small italic line | centred, `800px` max, Josefin Sans italic 300, `0.95rem` / 1.75, `rgba(255,255,255,.6)` (by eye) |
| Divider | `1px solid rgba(255,255,255,.06)` |
| Copyright | "© JOA Morocco {year}", `12.75px` below |
| Links | Terms & Conditions, Privacy Policy only; centred, `2.25rem` apart, hover accent |

## 11. Mobile behaviour and breakpoints

| Breakpoint | What changes |
|---|---|
| < 600px tall | Hero text gets extra top/bottom room |
| ≤ 768px | Side padding 15px; text sections 56px bottom padding |
| < 780px | Phone header (icon menu) |
| ≥ 768/769px | Side padding 25.5px; text sections 90px bottom padding |
| ≥ 780px | Desktop header (inline links) |
| ≥ 1024px | Trips switch to the two-column layout |
| ≥ 1100px | Header links centred |
| ≥ 1200px | Header phone number shown |
| hover-capable devices | Trip description/price revealed on hover |

No sideways page scroll at any width. Every tap target is at least 40px
(dots and icons use 44px hit areas).

## 12. Motion

- Button fades `0.5s ease`; header colour switch `0.25s`; blur band `0.3s`.
- Hero crossfade `1000ms`, hero text fade-in `0.6s`, review fade `0.45s`.
- Reduced motion: hero holds still on posters, fades and transitions are
  removed. Reviews still rotate (owner's choice).

## 13. Tour pages (converted: The Kingdom of Morocco Tour)

Converted tour pages use everything above, scoped under `.ds-page`
(`src/Components/DestinationPageConstructor/TourDesign.css`), so tours not
yet converted keep their old look. A tour opts in with the `design` prop on
`DestinationPage`; `src/App.js` lists converted routes in `isDesignTour`.

- **Header and footer**: identical to the homepage (same components and
  settings). The content area is `data-tone="light"`, so the menu icon and
  links turn dark over it.
- **Trips section**: the homepage's Explore Our Trips component, with this
  page's own heading ("Choose Your Morocco"), subtitle and intro paragraph
  (`17px / 25.5px`, `#fff`, `12.75px` above). Titles longer than 18
  characters may wrap on desktop.
- **Top of the page**: one looping video instead of the photo gallery
  (Kingdom: the palace video, palace photo as poster), set up like the
  homepage hero — muted, looping, inline, poster only for reduced motion —
  under the homepage hero scrim. Same height as the gallery it replaces
  (`60vh`, `65vh` from 780px; min 320px, max 620px). No arrows or dots.
  Social icons are the footer's see-through rings (see §10), centred
  `25.5px` from the bottom.
  (Tours still using the photo gallery style its arrows like the hero arrows
  and its dots like the review dots.)
- **Content area**: max-width `1369px`, side padding `15px` / `25.5px`,
  `60px` above the title and `60px` after the review dots (same as the
  homepage); `51px` between the
  content column and the booking panel on desktop.

| Element | Style |
|---|---|
| Tour title | The homepage "About JOA" heading: Josefin Sans `18px` / `1.28`, `700`, `1.8px`, uppercase, `#2f2f2f`, `6.375px` below. Left-aligned (About JOA is centred) |
| Title stars | `16px`, accent (empty `#cacccf`) |
| Price line | Homepage card price style, one step up: Josefin Sans italic `17px` / `25.5px`, `400`, `0.85px`, normal case, `#2f2f2f`, `25.5px` below |
| Description | Identical to the About JOA paragraphs: `17px` / `25.5px`, `0.85px`, `#52575c`, `25.5px` between paragraphs; left-aligned |
| Info labels (Destination…) | Card meta style in `#2f2f2f`: `12px`, `700`, `0.6px`, uppercase |
| Info text | `14px` / `21px`, `0.85px`, `#52575c` (the homepage footer-contact size; one step under the description) |
| Dividers | `1px solid rgba(0,0,0,.08)` |
| Section headings (Tour Plan, Reviews) | Text-section heading, `90px` above (`56px` on phones), `25.5px` below |
| Day number | `32px` circle, `#2f2f2f`, white `12px` / `700` / `0.6px` (homepage card-label numbers) |
| Day title | Card title style in `#2f2f2f`: `16px` / `22.4px`, `700`, `1.5px`, uppercase |
| Day details | Body; ✔ bullets in accent |
| "Expand all days" | `12px`, `700`, `1.2px`, uppercase, `#2f2f2f`, underlined; hover accent |
| Rating average | Josefin Sans `45px` / `45px`, `700`, `2.25px`, `#2f2f2f` (League Gothic stays headline-only) |
| Rating bars | `3px`, track `#cacccf`, fill `#2f2f2f`; labels `12px` / `700` uppercase |
| Review stars | `14px`, accent |
| Review form ("Share your experience") | Same content, laid out as a centred text section: white, `820px` column, `56px` / `90px` padding, divider below; heading and intro centred (heading = text-section heading, intro = body); fields `25.5px` apart, two per row from 600px; black button centred |
| Form labels | `12px`, `700`, `0.6px`, uppercase, `#2f2f2f` |
| Form inputs | `40px` tall (review box `120px` min), `1px solid #cacccf`, `border-radius: 3px`, `10px 12.75px` padding, `15px` text; focus border `#2f2f2f`; rating stars `26px`, accent / `#cacccf` |
| Reviews carousel | The homepage reviews component itself (§9 Reviews): several side by side by width (3 in the desktop content column, 2 at ~1062px, 1 on phones), quote mark, uppercase quote, italic accent name (name only, no tour), stars, dots, moves every `5s`; no extra side padding inside the content column. Features the newest 8 five-star reviews (guest-posted first, then the page's own); the rating summary still counts every review |
| Booking panel | `#f9f9f9`, `25.5px` padding, no border/radius/shadow; sticky `90px` from top on desktop; on phones it stacks under the reviews, `60px` after the dots and `60px` before the trips section |
| Price tiers | rows `14px` / `21px`; prices `18px` / `700` / `0.85px`, `#2f2f2f`; row dividers as above |
| Family deal badge | Accent fill, `10px` / `700` / `0.5px`, uppercase, `border-radius: 3px` |
| Start booking / Post review / Book Now | Standard `40px` black button; hover accent |
| "Find an existing booking" | `12px`, `0.6px`, uppercase, underlined, `#52575c` |
| Floating Book Now | Phones only (< 780px), `25.5px` from the bottom and side padding from the right |

