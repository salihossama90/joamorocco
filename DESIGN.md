# Design System — Homepage

The homepage (`/`) follows an editorial luxury-travel layout: full-bleed video
hero, a quiet white storytelling column, a single-quote testimonial, a dark
trip carousel and a black footer. The layout, typography, spacing and mood were
studied from a reference luxury travel site. Only the *system* was taken: no
text, logos, images, reviews or contact details from it. All content is
JOA Morocco's own.

Scope: homepage only. Inner pages keep the existing Playfair/sand look
described in `PRODUCT.md`. Note that `PRODUCT.md` lists "dark and moody themes"
as an anti-reference. The homepage's dark trip section and black footer are a
deliberate, owner-requested exception; everything above them stays bright.

All tokens live on `.home` in `src/Pages/Home/Home.css`.

## Color

| Token | Value | Use |
|---|---|---|
| `--home-ink` | `#111111` | Headings on white, solid-dark button, footer base |
| `--home-charcoal` | `#1f1f1f` | "Explore Our Trips" section |
| `--home-charcoal-2` | `#2c2c2c` | Gradient partner for the charcoal section |
| `--home-footer` | `#0d0d0d` | Footer |
| `--home-white` | `#ffffff` | Page background, text on dark/imagery |
| `--home-body` | `#4a4a4a` | Body copy on white |
| `--home-muted` | `#8a8a8a` | Inactive dots, captions |
| `--home-accent` | `var(--primary-color)` = `#ff681a` | JOA orange: the one accent. Header CTA, reviewer names, stars, focus |

Rules: one accent only (JOA orange replaces the reference's pink). Imagery
always carries a dark gradient scrim so white text stays ≥ WCAG AA.

## Typography

Loaded from Google Fonts in `src/index.css`.

| Role | Family | Style |
|---|---|---|
| Display (hero headline, section titles) | **Bebas Neue** | Condensed, uppercase, `letter-spacing: 0.02em`, `line-height: 0.95` |
| Everything else | **Josefin Sans** (geometric sans; free stand-in for Brandon Grotesque, which needs a paid license) | 300–700, upright and italic |

| Style | Spec |
|---|---|
| Hero headline | Bebas Neue, `clamp(3.25rem, 13vw, 8rem)`, white |
| Section title (dark) | Bebas Neue, `clamp(2.75rem, 10vw, 5rem)`, white |
| Eyebrow | Josefin Sans 500, uppercase, `letter-spacing: 0.18em`, `0.8–1rem` |
| Text-section heading | See **Text sections** below (values from the reference CSS) |
| Text-section body | See **Text sections** below |
| Emphasis | Josefin Sans italic, same size, a few words per section only |
| Subtitle (dark) | Josefin Sans italic 400, `clamp(1.05rem, 3.6vw, 1.35rem)` |
| Review quote | Josefin Sans 600, uppercase, `letter-spacing: 0.12em`, `1.05–1.2rem` |
| Reviewer | Josefin Sans italic 500, accent color, `letter-spacing: 0.06em` |

## Text sections (standard)

The standard for every light text section on the homepage (About is the
first). These are exact values, not ranges.

| Property | Mobile (< 768px) | Desktop (≥ 768px) |
|---|---|---|
| Background | `#ffffff` | `#ffffff` |
| Section padding (top / bottom) | `56px / 56px` | `90px / 90px` |
| Heading font | Josefin Sans (sans-serif), `font-weight: 700`, uppercase | same |
| Heading size | `18px` (`1.125rem`) | `18px` |
| Heading line-height | `1.28` | `1.28` |
| Heading letter-spacing | `1.8px` (plus `padding-left: 1.8px` so the trailing space doesn't push it off-center) | same |
| Heading color | `#2f2f2f`, centered (from the reference CSS: `section.section--content h2:first-of-type`) | same |
| Heading → first paragraph | `6.375px` | `6.375px` |
| Body font | Josefin Sans, **same family as the heading** (never serif), `font-weight: 400` | same |
| Body size / line-height | `17px` (`1.0625rem`) / `1.5` | same |
| Body letter-spacing | `0.85px` | same |
| Body color | `#52575c`, centered | same |
| Body max-width | `820px` | `820px` |
| Between paragraphs | `25.5px` | `25.5px` |
| Last paragraph → button | `20px` (reference "Get in Touch" margin-top) | `20px` |
| Button | Reference computed "Get in Touch": `#000` fill, `1px solid #000`, `border-radius: 3px`, `height: 40px`, `padding: 10px 20px`, `12px` / `700` / letter-spacing `1.2px` / line-height `12px`, uppercase, `#fff`, `transition .5s ease` | same |
| Emphasis | Italic (`<em>`), a few words only | same |

## Buttons

Rectangular, **sharp corners** (`border-radius: 0`), Josefin Sans 600 uppercase,
`letter-spacing: 0.16em`, `font-size: 0.8–0.85rem`, `padding: 1rem 1.6rem`,
`min-height: 48px`. Visible focus ring in accent.

| Variant | Look | Used for |
|---|---|---|
| `.hbtn--accent` | Orange fill, white text | Header "Free Consultation" |
| `.hbtn--outline-light` | Transparent, 1.5px white border | Hero "Explore Our Trips", trip cards |
| `.hbtn--solid-dark` | Black fill, white text (1.5px white border on imagery) | Hero "Plan My Trip", "Get in Touch" |

Hover: outline buttons fill white with ink text; solid buttons lift to
accent; transitions 0.2s, disabled under reduced motion.

## Spacing & rhythm

- Side gutter: `1.5rem` mobile → `2.5rem` tablet → `4rem` desktop.
- Section padding: text sections use the exact values above. Other
  sections: `5rem` mobile → `7rem` tablet → `8.5rem` desktop.
- Text column: `max-width: 820px`, centered.
- Hero content has `padding-top: 7.5rem`, so it always clears the fixed
  header (76px phone / 88px desktop). On short screens the hero grows taller
  instead of letting the headline slide under the header.
- Rhythm: bright → bright → bright → dark → black. Hero (video, full screen) →
  About (white, airy) → Reviews (white, single quote) → Explore (charcoal) →
  Footer (black).

## Cards (Explore Our Trips)

From the reference CSS: gutter `15px` (≤ 768px) / `25.5px`, max-width
`1369px`, card gap `25.5px`, title letter-spacing `2px` / weight `700`
(h1–h6 rule), description `17px`, headline font League Gothic. Everything
else is matched to the reference screenshot until that section's CSS is sent.

| Element | Value |
|---|---|
| Section background | `linear-gradient(#4b4b4b → #363636 → #2a2a2a)`. Reference CSS: the section's inline style is `background-image: url(…/Itineraries-Home-scaled.jpg)`, a photo of a dark contour-map texture. It's the reference's own artwork, so it isn't used; a JOA image or our own texture can replace it |
| Section padding | `60px` top / `85.5px` bottom on all screens (reference CSS: `.section { padding: 60px 0 }`, overridden at the bottom by `.section.layout-carousel { padding-bottom: 85.5px }`) |
| Background | `background-size: cover; background-repeat: no-repeat; background-attachment: scroll` (`.section` sets `fixed`, `.section.layout-carousel` overrides to `scroll`) |
| Section box | `position: relative; overflow: hidden` (reference `.section`) |
| Title | Reference computed: font `AlternateGotNo1D, "League Gothic", sans-serif` (we use League Gothic), `45px`, line-height `45px`, letter-spacing `2.25px`, weight `400`, uppercase, `#fff`. Captured at one screen size; phone value still to confirm |
| Subtitle | Reference computed: Brandon Grotesque (we use Josefin Sans), italic, `400`, `17px`, letter-spacing `0.85px`, line-height `25.5px`, no transform, `#fff` |
| Card | Reference computed (card content layer): `310px` × `460px`, `display: flex; flex-direction: column; justify-content: space-between; align-items: flex-start; overflow: hidden`; no radius. Same size on all screens; cards scroll sideways when they don't fit. Text side padding `24px` (reference text is `262px` wide in the `310px` card); bottom padding `24px` assumed equal |
| Card overlay | whole photo dimmed: `rgba(0,0,0,.4)` → `.45` → `.75` at the bottom |
| Meta (top-right) | e.g. "11 Days · Private". Reference computed ("12 NIGHTS"): `12px`, `700`, letter-spacing `0.6px`, line-height `19.55px`, uppercase, `#fff`, `text-shadow: rgba(0,0,0,.6) 1px 1px 1px`. Position (`25.5px` from top and right) still eyeballed |
| Place eyebrow | e.g. "Casablanca → Tangier". Reference computed ("FRANCE"): `11px`, `700`, letter-spacing `1.1px`, line-height `19.55px`, uppercase, `#fff`, margin-bottom `5.667px` |
| Card title | Reference computed: `16px`, `700`, letter-spacing `1.5px`, line-height `22.4px`, uppercase, `#fff`. Gap below (`0.5rem`) still eyeballed: the computed values were for the title link, whose own margin is 0 |
| Description | Reference computed: `17px`, `400`, letter-spacing `0.85px`, line-height `19.55px`, margin `0`, `#fff` (text width there: `262px`) |
| Description + price reveal | Like the reference, both hidden until the card is hovered (`max-height`/`opacity` animate open). Only on devices that can hover; touch screens always show it; keyboard focus inside the card also opens it. Timing `0.5s ease` borrowed from the reference buttons, since the hover rule itself wasn't captured |
| Price line | Reference computed: italic, `400`, `14px`, letter-spacing `0.85px`, line-height `19.55px`, margin-top `6.375px`, margin-bottom `0`, `#fff` |
| Button | Reference computed: `height`/`min-height: 40px`, `padding: 10px 20px`, `1px solid #fff` border, `border-radius: 3px`, `12px` / `700` / letter-spacing `1.2px` / line-height `12px`, uppercase, transparent background, `transition: color, background-color, border-color, opacity .5s ease`. Own margin is `0`; the gap above (`1.25rem`) is eyeballed. Note: `3px` corners here override the sharp-corner rule for this one button |
| Arrows | Reference computed: `position: absolute; left: 25.5px; bottom: 25.5px` inside the section (so it sits in the `85.5px` bottom padding), `43px` circle (`border-radius: 100%`), `background: rgba(0,0,0,.3)`, `backdrop-filter: blur(5.41667px)`, `1px solid rgba(255,255,255,.25)`, `#fff` icon, `transition: opacity, background .5s ease`. Each shows only when it can move; gap between two arrows (`12.75px`) and hover fill are ours |
| Desktop layout (≥ 1024px) | Matched by eye to the reference's desktop view: two columns, title + subtitle at the right of the left `30%` column with `padding-right: 25.5px` (from the reference title wrapper) so it sits close to the first card, cards in a row in the right column running to the screen edge (`25.5px` end padding), arrows over the cards, vertically centred on them (next on the right, previous on the left), bottom padding `60px`. Card size and text styles stay at the reference CSS values |
| Measured at | `534px` window width (the reference section was 534px wide when these were captured) |

## Header

No background at any scroll position (owner's choice: seamless, no white
bar). Logo left, "Free Consultation" (accent button) and menu right, fixed on
screen. Over light sections (`data-tone="light"`: About, reviews) the menu
icon and desktop links turn dark; over the video, Explore Our Trips and the
footer they stay white.

### Menu bar (reference computed, captured at a 534px window)

Bar height, logo and button apply at every width (the reference desktop bar
uses the same small logo and slim button). Below 780px: 17px side padding and
the menu icon. 780px and up: button on the right, links just before it; from 1100px
the links are centred in the bar (as on the reference), `3rem` side padding (by eye).

| Property | Value |
|---|---|
| Height | `65px`, no background at any scroll position |
| Side padding | `17px` |
| Layout | `display: flex; align-items: center` |
| Text | `15px`, line-height `22.5px`, letter-spacing `0.85px`, `#fff` |
| Transition | `transform 0.5s ease 0.15s` (the reference bar slides; not implemented here) |
| Free Consultation button | Reference computed ("Enquire Now"): `height`/`min-height: 32px`, `padding: 10px 20px`, `1px solid transparent` border, `border-radius: 3px`, `10px` / `700` / letter-spacing `0.5px` / line-height `10px`, uppercase, `#fff` text, `transition .5s ease`. Background kept JOA orange (reference is `#e7247a`) |
| Menu icon line | Reference computed (one line): `2px` tall, `14px` wide, `#fff`, `position: absolute; bottom: 0; right: 0`, `transition: all .25s ease-in-out`. Applied: all three lines `2px` with no border, bottom line `14px`. Other lines and the icon box still to capture |
| Logo | `height: 30px; width: auto` (reference computed). JOA's logo is about 2:1, so it renders ~62px wide |
| Menu links (desktop) | Reference computed ("Destinations"): `12px`, `600`, letter-spacing `0.85px`, line-height `18px`, uppercase, `#fff`, `transition: color .25s ease`. Gap between links `21px` (measured on the reference at 1062px: Destinations 283–377, Experiences 398–486, About 507–551) |
| Phone number | `+1 614 601 7897` (tel link) before the button. Reference computed: `13px`, `700`, letter-spacing `0.85px`, line-height `19.5px`, uppercase, `#fff`, `margin-right: 25.5px`. Hidden below 1200px, where it would collide with the centred links (the reference also hides it on narrower screens); dark over light sections |
| Ours | logo `17px` from the left, menu icon `17px` from the right, Free Consultation button `12.75px` before the icon, all centred on the 65px bar |

## Hero slideshow

Eyebrow (e.g. "11 Days · Private"), reference computed: `14px`, `700`,
letter-spacing `1.4px`, line-height `21px`, uppercase, `#fff`, margin-bottom
`12.75px`.

Headline, reference computed: League Gothic (reference: AlternateGotNo1D →
League Gothic), `45px`, line-height `40.5px`, letter-spacing `2.5px`, `400`,
uppercase, `#fff`, margin-bottom `12.75px`, text block `504px` wide. Same at
every width (the old size grew from ~50px to 128px).

Buttons, reference computed ("Explore Our Trips"): `height`/`min-height: 40px`,
`padding: 10px 20px`, `1px solid #fff`, `border-radius: 3px`, `12px` / `700` /
letter-spacing `1.2px` / line-height `12px`, uppercase, `transition .5s ease`.
Applied to both hero buttons (Plan My Trip keeps its black fill until
captured). They size to their text; gap between them `12.75px` by eye.

"NEXT" label, reference computed: `12px`, `700`, letter-spacing `1.5px`,
line-height `12px`, uppercase.

Text container, reference computed: `display: flex; align-items: center`
(text centred vertically in the full-height hero), `max-width: 1369px`, side
padding `15px` (≤ 768px) / `25.5px`, no vertical padding, `z-index: 2`. Next
controls and arrows line up with the same edges. Screens under 600px tall get
80px / 140px top/bottom room so the text clears the bar and controls.

Next-slide name, reference computed ("Home"): `16px` italic, `400`,
letter-spacing `1.2px`, line-height `21.6px`, `min-height: 22px`,
`margin-top: 6px`.

Three slides, one per trip: The Kingdom of Morocco Tour (palace video),
Sahara Dreams (desert-sand video), Your Custom Journey (Chefchaouen video).
Each slide has its own eyebrow (`11 Days · Private`), headline and buttons
(trip button + Plan My Trip; on Custom: Plan My Trip + Explore Our Trips).

- Advances every `8s`; any click restarts the countdown. Videos crossfade
  (`opacity 1000ms`, from the reference hero slides); only the visible one plays, the others don't preload.
- Bottom-left: "NEXT" + next trip name in italics, then one bar per slide;
  the active bar fills over the 8s. Clicking "Next" or a bar changes slide.
- Bottom-right: round frosted arrows (same style as Explore Our Trips).
- Reduced motion: no auto-advance, no video (posters only), bars static.
- Reference computed: progress bar `36px × 3px`, track `rgba(255,255,255,.35)`;
  arrows `40px` circles, `background: rgba(0,0,0,.3)`, `1px solid
  rgba(255,255,255,.1)`, no blur, `transition: color, background-color .25s
  ease-in-out`, with a `16 × 16px` chevron icon. Gaps between bars and
  between arrows are by eye.

## Motion

Calm only: hero video loop, 0.2s button transitions, fade between reviews.
Everything respects `prefers-reduced-motion` (the hero video does not
autoplay; the poster image shows instead).

## Reference CSS values (from the reference site's stylesheets)

Raw values copied from the reference site's own CSS, pasted in by the owner.
Recorded here as found. Section-specific rules (hero, text section, reviews,
trips, footer) are still to come; values below are site-wide. Not yet
applied unless a section above says so.

### Section-specific rules found
| Section | Selector | Property | Value |
|---|---|---|---|
| Text section heading | `section.section--content h2:first-of-type` | color | `#2f2f2f` |
| Text section heading | `.h5` (applies to the heading) | font-size / weight / letter-spacing / line-height / transform / margin-bottom | `18px` / `700` / `1.8px` / `1.28` / uppercase / `6.375px` (its `#000` color is overridden by the rule above) |
| All headings | `h1–h6, .h1–.h6` | weight / letter-spacing / transform | `700` / `2px` / uppercase (letter-spacing overridden to `1.8px` by `.h5`) |
| Everything | `*` | reset | `background-color: transparent; border: 0; box-sizing: border-box; font: inherit; margin: 0; padding: 0`. Applied as `.home *` (homepage only, so other pages' forms and booking wizard keep their styling), placed before all section rules |

| Text section | `.text--base` (on the section) | color | `#52575c !important`; inside it `h1–h6`, `a`, `small` use `color: inherit`. The heading keeps `#2f2f2f` because `section.section--content h2:first-of-type` is more specific; paragraphs get `#52575c` |
| Everything | `*` | rendering | `font-smoothing: antialiased; -webkit-font-smoothing: antialiased; -webkit-tap-highlight-color: transparent; text-rendering: optimizeLegibility`. Applied in the same `.home *` rule |
| Page | `html` | rendering | `-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; text-rendering: optimizeLegibility; background-color: #fff; font-size: 100%; text-size-adjust: 100%` (size and size-adjust are browser defaults). `grayscale` smoothing added to `.home *` |
| Page | `html` (second rule) | text | `color: #2f2f2f; font: 106.25%/1.5 Brandon Grotesque, …` (= 17px / 1.5); overridden by `.p, body`, so nothing visible to apply |
| Everything | `*, :after, :before` | box-sizing | `border-box` (already set site-wide in `src/index.css`) |

None of these heading rules change with screen width, so phone and desktop use the same values.

### Fonts loaded
| Family | Source | Weights |
|---|---|---|
| Brandon Grotesque | self-hosted (paid) | 400, 500, 700 |
| Chronicle Display | self-hosted (paid, serif) | 400 |
| AlternateGotNo1D (Alternate Gothic No.1) | self-hosted (paid, condensed) | 400 |
| Cabin | Google Fonts | 400, 500, 700 + italics |
| Josefin Sans | Google Fonts | 400, 500, 700 + italics |
| League Gothic | Google Fonts | 400 |

Body stack: `Brandon Grotesque, Cabin, Josefin Sans, Helvetica Neue, Helvetica, Arial, sans-serif`.

### Base text

The `.p, body` rule sets color `#52575c` (an older `body` rule in another file sets `#444`; `.p, body` is the one that applies), plus `text-size-adjust: none`. Applied as the base text style on the homepage root (`.home`).

| Property | Value |
|---|---|
| Body color | `#52575c` |
| Text size adjust | `none` |
| Body size | `17px` (`1.0625rem`) |
| Body letter-spacing | `0.85px` |
| Body line-height | `1.5` |
| `p`, `h1–h6`, lists, `hr` margin-bottom | `25.5px` (`0` when last child) |
| Link color | `#e7247a` (hover `#444` + underline) |

### Color palette (utility classes)
| Name | Value |
|---|---|
| brand | `#444` |
| base | `#52575c` |
| base-dk | `#2f2f2f` |
| base-bg | `#fff` |
| headings | `#000` |
| bright | `#e7247a` |
| light | `#f9f9f9` |
| white (`.text--white`, `.text-white`) | `#fff !important`  Applied to all white text on the homepage: hero, Explore Our Trips title, subtitle and trip cards. |
| success | `#379c8a` (the teal used for reviewer names) |
| success-dull | `#6a9f99` |
| danger | `#cc5426` |
| info | `#1e6e9f` |
| mid | `#ccc` |
| purple-dk | `#342c3f` |
| mid-blue | `#023b66` |

### Layout
| Property | Desktop | ≤ 768px |
|---|---|---|
| `.container` max-width | `1369px` | `1369px` |
| `.container` side padding | `25.5px` | `15px` |
| `.container--large` max-width | `1720px` | — |
| Column gutter (`.row` / `.col`) | `25.5px` | `15px` |
| Grid gap (`.grid`) | `25.5px` | `12.75px` (≤ 640px) |

Breakpoints used: `480/481`, `500`, `640`, `768/769`, `800`, `1024/1025`, `1127/1128`.

### Spacing scale (padding/margin utilities)
| Token | Value |
|---|---|
| xxs | `5.667px` |
| xs | `6.375px` |
| sm | `12.75px` |
| mob-gutter | `15px` |
| md-sm | `25px` |
| base | `25.5px` |
| md | `30.6px` |
| lg | `40.8px` |
| xlg | `43.35px` |
| xl | `50.235px` |
| xl-xxl | `70px` |
| xxl | `80.325px` |
| big | `114.75px` |
| xxxl | `192.78px` |
| jumbo | `321.3px` |
