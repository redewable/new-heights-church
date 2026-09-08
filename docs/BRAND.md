# New Heights Church — Brand Guide

> The canvas is calm. The accents preach.

Staff and developer reference for the New Heights visual and verbal system. If
something on the site looks wrong, it drifted from this document. Fix the
drift. Don't fork the system.

- Project: `new-heights-church` (Next.js 16, React 19, Tailwind v4, Supabase)
- Surface: site, email, slides, print, social
- Tokens: [`app/globals.css`](../app/globals.css)
- Facts: [`lib/constants/church.ts`](../lib/constants/church.ts)

New Heights is a Spirit-filled, multigenerational house in College Station, TX,
pastored by Apostle Brian Hallam (Senior Pastor) and Crystal Hallam. The brand
is scriptural, bold, and prophetic. The canvas is cream and ink navy. The
accent palette is the colors of Scripture — blue (tekhelet), white (laban),
scarlet (tola'ath shani), purple (argaman), gold, and silver — with bronze as a
sparing outer-court support. Everything points back to the three things the
house is about right now: **Endtime Harvest • Preparation • Habitation**.

The logo is **three bars ascending** — those three, in that order. Never four.

---

## 1. Voice and tone

### 1.1 Audiences, in order

Three readers. When they conflict, the earlier one wins.

1. **First-time guest.** Hasn't been to church in a decade, or ever. Needs
   clarity, warmth, no jargon.
2. **Family / regular attender.** Logistics — next steps, dates, check-in,
   giving, serving.
3. **Staff / ministry leader.** Needs the system stable enough to stop
   relitigating design every week.

A headline that works for a nervous guest works for a staff member. The reverse
is not true.

### 1.2 The voice

Every line should sound like it could be spoken from the altar. Short
sentences. Verbs carry the weight. Scripture earns its place.

**Yes:**

- "Sundays, 10 AM. Come expectant."
- "We are family. Welcome home."
- "You were not built for less."
- "Lost people are the agenda."
- "Not a visitation. A habitation."
- "Saved. Baptized. Filled. Planted. Sent."

**No:**

- "Join us at 10 AM for an exciting service!"
- "We would love to have you visit our community of believers."
- "New Heights is a welcoming and inclusive space where you can be yourself."
- "Don't miss this amazing opportunity!"

The No column isn't wrong. It's generic. Our voice is specific, grounded, and
willing to say what it means.

### 1.3 Do

- **Honor the office.** It is _Apostle Brian Hallam_ and _Pastor Crystal
  Hallam_ — the full title, every time, in every sentence. Leaders in this
  house are "worthy of double honor" (1 Timothy 5:17). Never a first name
  alone, never "Pastor Brian & Crystal", never copy that makes leadership
  sound casually available ("stay after every service", "they'll walk you
  over", "on the floor after service"). Pastoral care, prayer, and
  introductions flow through the First Touch Team and the Connect Card.
- **Name the Word.** It is _the Word of God_, _the Holy Bible_, _the Word_ —
  never "the Book" as a nickname for Scripture.
- **Write like a move of God.** Fire, consecration, cost, expectancy. "To
  stay on fire you must have oil, and the oil comes at a cost." Warm to the
  guest, serious about God. If a line could be read as casual, hypocritical,
  or dead, it isn't ours.
- **Family, not dress code.** Scrubs are fine; say _we are family_, not
  "nobody gets a second look".
- Use imperative verbs. _Come. Sit. Stand. Answer._
- Name the altar. We are altar-call people; don't soften it to "response
  moments."
- Cite scripture when it's load-bearing (John 4:35, Ephesians 5:27,
  Psalm 132:13–14). Not as decoration.
- Call kids ministry **Young Lions** and youth ministry **Youth Army** on every
  user-facing surface. Those are the names.
- Use "family." It's our tagline, not a filler word.
- Import times, dates, address from `lib/constants/church.ts`. Never hand-retype
  "10am" or "10 a.m."

### 1.4 Don't

- No emoji in body copy. Admin UI and off-site social are exceptions.
- No lorem ipsum. Ship one honest sentence and a TODO, not Latin.
- No "amazing," "incredible," "awesome," "exciting" as the lead adjective.
- No corporate hedging. Not "We strive to…" Say the thing.
- No stock photos of bright teeth against brick walls. If we don't have a real
  photo, use type and motif.
- No rainbow gradients. No fifth-color surprises.
- No "Click here." Write the verb — "Plan a visit," "Give online," "Watch last
  Sunday."
- No flippancy. Not "the coffee is free," not "pass the basket," not "drop it
  in the basket," not "stay five minutes or five hours." The offering is an
  act of worship; the altar is where the work happens.
- No fabricated fruit. No invented testimonies or quotes. If the Church
  hasn't supplied it with consent, it doesn't ship.

### 1.5 Headline shapes that work

- **Imperative + period.** _"Come expectant." "Bring a friend." "Answer the call."_
- **Noun : noun.** _"Sundays: the altar." "Wednesday: the refill."_
- **Negation + correction.** _"Not a visitation. A habitation."_
- **List of three.** _"Saved. Baptized. Filled."_ Always three. Four reads like
  a sermon outline; two feels thin.

### 1.6 Length budget

- Hero sub-headline: one sentence, 12–20 words.
- Pillar card: 2–3 sentences, 30–50 words.
- Event card: 2 paragraphs max. Full copy lives on the detail page.
- Read every draft aloud. If you'd flinch saying it into a Sunday mic, it's not
  our voice.

---

## 2. The three pillars

The church is about three things right now. They are the editorial and
navigational backbone, the three bars of the logo, and a discipleship
progression — not a taste preference. The order is fixed:

> **Endtime Harvest • Preparation • Habitation**

Don't reorder. Don't add a fourth. Don't split one. Canonical definitions live
in `CHURCH.pillars`; import from there. The strip under the mark is
`PILLAR_STRIP` (labels joined with `•`). Route slugs and database tags stay
`harvest` / `bride` / `habitation` — those are identifiers, not copy.

### 2.1 Endtime Harvest — scarlet

- **Full name:** _The Endtime Harvest of Souls._
- **Scripture:** John 4:35 — _"Lift up your eyes and look on the fields; they
  are white already to harvest."_
- **Color:** scarlet — the blood, the crimson thread.
- **CSS token:** `--nh-harvest` (alias of `--nh-scarlet`).
- **When to invoke:** evangelism, altar calls, salvation stories, outreach,
  missions, invite-a-friend.

### 2.2 Preparation — purple

- **Full name:** _Preparing the Bride for the Return of the Lord._
- **Scripture:** Ephesians 5:27 — _"…a glorious church, not having spot or
  wrinkle."_ Also Judges 8:26.
- **Color:** purple — royalty, the Bride's covenant.
- **CSS token:** `--nh-bride` (alias of `--nh-purple`).
- **When to invoke:** discipleship, water baptism, Spirit baptism, membership,
  serving, sending. Saved, baptized, filled, planted, sent.

### 2.3 Habitation — blue

- **Full name:** _A Habitation — a Carrier of Revival._
- **Scripture:** Psalm 132:13–14 — _"For the Lord has chosen Zion… this is my
  resting place forever."_ Also Exodus 26:31.
- **Color:** blue — the veil, heaven touching earth.
- **CSS token:** `--nh-habitation` (alias of `--nh-blue`).
- **When to invoke:** worship, prayer, prophetic, altar culture, Wednesday
  nights, encounter services, carrying revival out the doors.

### 2.4 Pillar rules

- One pillar leads per page. Others can appear; only one is the home key.
- Mark the lead pillar with pillar-tinted section chrome or the `PillarSpread`
  row — don't reinvent a chip inline.
- Harvest is always scarlet. Preparation is always purple. Habitation is always
  blue. `<AscendingBars tone="pillars" />` paints the three in that order.

### 2.5 Convictions

Three things the house says out loud, kept in `CHURCH.convictions` and rendered
as the "We believe" band on the home page and in the Beliefs page:

- **Miracles, signs, and wonders.** 2 Corinthians 12:12
- **God is the same — yesterday, today, and forever.** Hebrews 13:8
- **The transfer of wealth.** Proverbs 13:22

Keep the verse load-bearing. These are a creed, not a feature grid — no cards,
no icons.

---

## 3. The colors of Scripture

### 3.1 The palette, by the Book

Our colors are the main colors of the Bible — the ones Scripture names by
Hebrew word and loads with meaning. Each one has a job on the site.

| Color       | Hebrew                  | In Scripture                                                                                        | On the site                                               |
| ----------- | ----------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| **Blue**    | _tekhelet_ (תְּכֵלֶת)   | 50+ times — the sky, the tabernacle curtains, the high priest's robe. Heaven, holiness, divine law. | Habitation pillar. Worship and prayer surfaces.           |
| **White**   | _laban_ (לָבָן)         | Light, purity, righteousness. Clean garments, unblemished holiness.                                 | The canvas — `--nh-cream`, `--nh-paper`, `--nh-bone`.     |
| **Scarlet** | _tola'ath shani_ / adom | Sacrificial ritual and temple decoration. Blood, life, atonement.                                   | Endtime Harvest pillar. Altar calls. Salvation.           |
| **Purple**  | _argaman_ (אַרְגָּמָן)  | Costly dye from sea snails. Royalty, wealth, high authority; priestly garments.                     | Preparation pillar. Discipleship, membership, the Bride.  |
| **Gold**    | _zahav_                 | God's glory and divine splendor. The mercy seat, the lampstand.                                     | Decision. CTA accent, focus ring, altar-glow.             |
| **Silver**  | _kesef_                 | Redemption and purity. The redemption price (Exodus 30:11–16).                                      | Worth, price, giving emphasis.                            |
| Bronze      | _nechoshet_             | Outer court — the altar of sacrifice, the laver. Judgment met and cleansed.                         | Supporting only. Archive borders, iconography. Sparingly. |

Cream is the wilderness canvas — the white of the Book, warmed. Ink navy is the
night sky over the camp.

### 3.2 Canvas

| Token         | Hex       | Role                                        |
| ------------- | --------- | ------------------------------------------- |
| `--nh-cream`  | `#FAF7F1` | Default page background. Warm, not paper.   |
| `--nh-paper`  | `#FFFFFF` | Card surfaces and pure-white image backs.   |
| `--nh-bone`   | `#EEE8DC` | Subtle fills, section dividers.             |
| `--nh-border` | `#E5DED0` | Default 1px border on cards, inputs, rules. |
| `--nh-ink`    | `#0B1B2B` | Primary body text. Inverse canvas.          |
| `--nh-ink-2`  | `#13293F` | Ink canvas with a lift (hero sections).     |
| `--nh-stone`  | `#3A4654` | Secondary body copy, captions.              |
| `--nh-fog`    | `#7E8A99` | Tertiary. Metadata. Timestamps.             |

Semantic aliases: `--bg`, `--fg`, `--muted`, `--accent` (gold), `--border`.

### 3.3 Accents — base, `-ink`, `-soft`

Every accent ships in three variants: **base** (the poster color), **`-ink`**
(for text on soft fills and small accents on cream), and **`-soft`** (a tinted
fill for badges, callouts, section backgrounds).

| Token               | Hex       | Use                                               |
| ------------------- | --------- | ------------------------------------------------- |
| `--nh-blue`         | `#1D4F8B` | Habitation pillar. Worship and prayer surfaces.   |
| `--nh-blue-ink`     | `#0F2D55` | Text on blue-soft fills. Accent underlines.       |
| `--nh-blue-soft`    | `#D9E4F2` | Section backgrounds. Habitation-tinted cards.     |
| `--nh-purple`       | `#5B2A86` | Bride pillar. Discipleship and membership.        |
| `--nh-purple-ink`   | `#36175A` | Text on purple-soft fills.                        |
| `--nh-purple-soft`  | `#E4D8EF` | Section backgrounds for Bride-led pages.          |
| `--nh-scarlet`      | `#9B1C2E` | Harvest pillar. Salvation stories. Altar.         |
| `--nh-scarlet-ink`  | `#6A101F` | Text on scarlet-soft fills. Never run body in it. |
| `--nh-scarlet-soft` | `#F1D6DB` | Harvest-led card backgrounds.                     |
| `--nh-gold`         | `#C9A227` | CTA accent. Focus ring. Altar-glow.               |
| `--nh-gold-ink`     | `#8F7115` | Text on gold-soft. Small gold on cream.           |
| `--nh-gold-soft`    | `#F2E7C1` | Decision callouts — plan a visit, give, respond.  |
| `--nh-silver`       | `#9AA4AD` | Rare. Metadata emphasis. Giving-page price ticks. |
| `--nh-silver-ink`   | `#5B6770` | Text on silver-soft.                              |
| `--nh-silver-soft`  | `#E7EBEE` | Pricing tables. "What to expect" strips.          |
| `--nh-bronze`       | `#8A5A2B` | Iconography. Editorial borders. Archive.          |
| `--nh-bronze-ink`   | `#5A3818` | Text on bronze-soft.                              |
| `--nh-bronze-soft`  | `#EADAC3` | Sermon archive backgrounds. Footnotes sections.   |

Gold is the decision color. One gold element per viewport is almost always
enough. When in doubt, it is not gold's turn.

### 3.4 Pillar mapping (canonical)

| Pillar          | Color token       | Scripture color | Lead scripture  |
| --------------- | ----------------- | --------------- | --------------- |
| Endtime Harvest | `--nh-harvest`    | Scarlet         | John 4:35       |
| Preparation     | `--nh-bride`      | Purple          | Ephesians 5:27  |
| Habitation      | `--nh-habitation` | Blue            | Psalm 132:13–14 |

Gold, silver, and bronze are functional. They don't map to a pillar. They map
to actions — decision, redemption, sacrifice.

### 3.5 Accessibility

Targets: **WCAG AA** for body (4.5:1) and **AA Large** (3:1) for display ≥ 24px
bold. Run every new pairing through a contrast checker. Don't eyeball it.

**Body-safe on cream (`#FAF7F1`):** `--nh-ink`, `--nh-ink-2`, `--nh-stone`,
`--nh-blue`, `--nh-blue-ink`, `--nh-purple`, `--nh-purple-ink`, `--nh-scarlet`,
`--nh-scarlet-ink`, `--nh-gold-ink` (not `--nh-gold` — gold base is
display-only on cream), `--nh-silver-ink` (not `--nh-silver`), `--nh-bronze`,
`--nh-bronze-ink`.

**Body-safe on ink (`#0B1B2B`):** `--nh-cream`, `--nh-paper`, `--nh-bone`,
`--nh-gold`, `--nh-gold-soft` (gold sings on ink), `--nh-blue-soft`,
`--nh-purple-soft`, `--nh-scarlet-soft`, `--nh-silver-soft`, `--nh-bronze-soft`.
`--nh-silver` is borderline — UI chrome only, not long paragraphs.

**Handle with care:**

- `--nh-gold` on cream — display and UI chrome only. Never body.
- `--nh-silver` on cream — dividers and muted icons only. Fails 4.5:1 for body.
- `--nh-fog` on cream — captions and metadata only.
- `-soft` tokens are **fills**, not text colors. Put `-ink` text on them.

**Focus ring:** `--nh-gold`, 2px solid, 3px offset. Don't remove it. Customize
offset or radius if needed, never visibility.

### 3.6 Color heuristic

Ask, in order:

1. **What pillar?** Harvest → scarlet. Bride → purple. Habitation → blue. This
   decides it 70% of the time.
2. **Decision moment?** (CTA, altar call, respond.) Gold.
3. **Worth, price, giving?** Silver.
4. **Historical, archival, outer-court supporting?** Bronze.
5. **None of the above?** Ink on cream. No color needed.

---

## 4. Typography

### 4.1 The three faces

| Face               | Role                             | Loaded via                                  |
| ------------------ | -------------------------------- | ------------------------------------------- |
| **Fraunces**       | Display — headlines, pull quotes | `next/font`, variable, axes `opsz` + `SOFT` |
| **Inter**          | Body — UI, paragraph, forms      | `next/font`, variable                       |
| **JetBrains Mono** | Admin and inline code only       | `next/font`, variable                       |

CSS tokens:

```css
--font-display: var(--font-fraunces), ui-serif, Georgia, serif;
--font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
--font-mono: var(--font-jetbrains), ui-monospace, "SFMono-Regular", monospace;
```

Loaded in `app/layout.tsx`, self-hosted, `font-display: swap`, zero layout
shift.

### 4.2 Fraunces axes

Fraunces is a variable serif with two axes we use:

- **`opsz` (9–144):** larger at display sizes so the serifs sing; smaller at
  small sizes so it stays readable.
- **`SOFT` (0–100):** higher is warmer. ~60 for most headlines, 100 for pull
  quotes and editorial warmth.

Utility classes in `globals.css` (all in `@layer components`, so a Tailwind
utility can still override one property):

| Class                 | What it sets                             | Use                                                      |
| --------------------- | ---------------------------------------- | -------------------------------------------------------- |
| `.u-eyebrow`          | Inter · 12px · 600 · uppercase · +0.16em | **Every label.** Section kickers, metadata, chip text.   |
| `.u-display-soft`     | Fraunces · opsz 144, SOFT 100            | Warm display headlines and pull quotes.                  |
| `.u-display-dramatic` | Fraunces · opsz 144, SOFT 60 · lh 0.98   | Hero titles, sermon series, cinematic display.           |
| `.u-numeral`          | Fraunces · opsz 144 · old-style figures  | Numerals — 10 AM, dates, "10.26.25."                     |
| `.u-smallcaps`        | Fraunces · c2sc + smcp · +0.16em         | Rare. True small caps at display size. Never for labels. |

`.u-rule-gold` is a 1px gold hairline for chapter markers. `.u-grain-ink` adds
paper grain to ink sections when a full-bleed ink block reads flat.
`.u-break-anywhere` lets an email address wrap inside a narrow grid cell.

**Never hand-roll an eyebrow.** `text-[11px] font-semibold tracking-[…]
uppercase` is the shape `.u-eyebrow` exists to replace. One class, one size.

Fraunces for `h1`–`h5`, pull quotes, pillar titles, sermon series names. Never
UI chrome. Never buttons. Never under 18px except occasional italic captions.

### 4.3 Inter

The workhorse. Weights 400, 500, 600 (rarely 700). Paragraph copy, nav, forms,
metadata, button labels.

### 4.4 JetBrains Mono

Inside `/admin` and for inline code. Never on marketing surfaces.

### 4.5 Fluid scale

```css
h1 {
  font-size: clamp(2.25rem, 1.2rem + 4vw, 4.75rem);
}
h2 {
  font-size: clamp(1.75rem, 1rem + 2.6vw, 3rem);
}
h3 {
  font-size: clamp(1.25rem, 0.9rem + 1.2vw, 1.875rem);
}
```

Body stays 16–18px across breakpoints. Predictable read length.

### 4.6 Rules

- **Don't stack display on display.** A Fraunces eyebrow over a Fraunces
  headline reads like a wedding invitation. Eyebrow is `.u-eyebrow` (Inter
  uppercase, +0.16em); headline is Fraunces.
- **Element defaults live in `@layer base`.** Never write an unlayered `h1 {}`
  or `a {}` rule in `globals.css` — it silently beats every Tailwind color and
  size utility on the site. (This once made every hero title on ink invisible.)
- **One hero-size headline per page.** Everything else is `h2` or smaller.
- **Line-height:** 1.08 display, 1.55 body. Set in `globals.css`; don't fight
  it.
- **Letter-spacing:** display −0.01 to −0.02em. Body default. Inter uppercase
  eyebrows +0.08em.
- **Features:** use `.u-smallcaps` for rare Fraunces eyebrows. Don't sprinkle
  `font-feature-settings` for decoration.

---

## 5. Spacing and layout

### 5.1 4px base

Tailwind's 4px scale is the grid. Round everything to a multiple of 4. If a
value isn't on the scale (2px, 6px, 10px), you probably don't need it.

### 5.2 Containers

Use `<Container>` from
[`components/ui/Container.tsx`](../components/ui/Container.tsx). Never hand-roll
`max-w-*` + `mx-auto`.

| Size    | Max width | When                                                   |
| ------- | --------- | ------------------------------------------------------ |
| `prose` | 720px     | Long-form — sermon notes, articles, legal.             |
| `md`    | 1072px    | Default marketing sections. Card grids up to 3 across. |
| `lg`    | 1200px    | Hero blocks. Wide grids. Event schedules.              |
| `xl`    | 1320px    | Rare. Full-bleed editorial with generous margins.      |

Gutter is responsive: 20px mobile, 32px tablet, 48px desktop. Set in
`Container`. Don't override per page.

### 5.3 Vertical rhythm

- **Section padding:** `py-16` mobile → `py-24` desktop.
- **Inside a section, between blocks:** `space-y-10` (40px).
- **Heading to copy:** `mt-4`. Copy to CTA: `mt-6` or `mt-8`.
- **No arbitrary pixel values in class lists.** If the value isn't on the
  scale, the shape is probably wrong.

### 5.4 Radii

| Token         | Value | Use                                           |
| ------------- | ----- | --------------------------------------------- |
| `--radius-sm` | 4px   | Buttons, inputs, badges, focus-ring fallback. |
| `--radius`    | 8px   | Inline pills, small cards, toasts.            |
| `--radius-lg` | 14px  | **Cards.** The house default.                 |
| `--radius-xl` | 22px  | Hero cards. Image frames. Decision callouts.  |

Cards use `lg`, buttons use `sm`. Anything else, check in.

### 5.5 Elevation

Flat system. No default drop shadows — borders carry the weight. Shadows
appear only on:

- Hover state for interactive cards (`shadow-md` + 4px lift).
- Modal / dialog overlays.
- Floating admin menus.

If a section needs a shadow to read, it probably needs a different background.

---

## 6. Motion

### 6.1 Durations and easings

| Token         | Value                            | Use                                       |
| ------------- | -------------------------------- | ----------------------------------------- |
| `--dur-fast`  | 150ms                            | Hover, focus, small state flips.          |
| `--dur`       | 250ms                            | Default — buttons, underlines, card lift. |
| `--dur-slow`  | 400ms                            | Entries, modal open, hero text rise.      |
| `--ease-rise` | `cubic-bezier(0.22, 1, 0.36, 1)` | Entries. Things coming onto the page.     |
| `ease-out`    | native                           | Hover and exit. Things the user pushes.   |

`--ease-rise` is the signature — decelerating with a gentle lift. Use it on
appearances (page mount, scroll reveal, modal open). Use `ease-out` for
anything the user is pushing.

### 6.2 Rules

- **`prefers-reduced-motion` is respected globally** — `globals.css` flattens
  durations to 0.01ms and cancels scroll-behavior. Don't animate around it.
- **Nothing autoplays.** No audio. No auto-advancing carousel that steals
  reading time.
- **No gratuitous parallax.** ≤ 8px on hero is fine. Full parallax is nausea.
- **Motion serves meaning.** A rise says "this just arrived." A hover lift says
  "this is clickable." Otherwise, cut it.

### 6.3 Scroll-reveal defaults

Sparingly — mostly hero and pillar row.

- **Distance:** 16–24px upward.
- **Duration:** `--dur-slow`.
- **Easing:** `--ease-rise`.
- **Stagger:** 60ms per sibling. No more.

---

## 7. Motifs

Three recurring motifs. A signature, not wallpaper.

### 7.1 Ascending bars — the mark

Three vertical bars, each rising and widening to the right — traced from the
Church's logo. The three bars are the three pillars, left to right: Endtime
Harvest, Preparation, Habitation.

```tsx
import { AscendingBars } from "@/components/brand/AscendingBars";

<AscendingBars size={28} />                 {/* inherits currentColor */}
<AscendingBars size={22} tone="pillars" />  {/* scarlet · purple · blue */}
```

- **Always three bars.** Not four. Not five. A unit test enforces it.
- Inline SVG; color comes from `currentColor` so wrap it in a text-color class
  (`text-[color:var(--nh-gold)]` on ink, `text-[color:var(--nh-gold-ink)]` on
  cream). `tone="pillars"` paints the three pillar colors in canonical order —
  use it where the strip "Endtime Harvest • Preparation • Habitation" appears.
- Decorative by default (`aria-hidden`); pass `aria-label` only when it's the
  logo itself.

### 7.2 Altar glow

A radial gold gradient (`--nh-gold` at 35% opacity) behind decision and
testimony blocks. Implemented as `::before` so content sits on top.

```tsx
<section className="motif-altar-glow">
  <Container>
    <h2>Respond at the altar.</h2>
  </Container>
</section>
```

- Altar calls. Testimony pulls. Plan-a-visit hero. Giving CTA.
- **Once per page.** Twice, and it stops being sacred.
- Don't pair with a gold CTA and a gold headline accent in the same frame. The
  glow is already the gold note.

### 7.3 Three-pillar row

Three rows, top to bottom, in pillar order (Endtime Harvest → Preparation →
Habitation). Canonical on the home page as `PillarSpread`; the compact form is
the pillar-toned mark + `PILLAR_STRIP` in the footer and mobile nav. Pull data
from `CHURCH.pillars`.

- Always in pillar order. `CHURCH.pillars` is already sorted. `.map()` it.
  Don't sort, shuffle, or filter.
- Equal visual weight on all three. No "featured" pillar.
- Accents follow the pillar, never a uniform color across the three.

---

## 8. Component inventory

Typed and exported by name. Paths relative to the project root.

### 8.1 `components/ui/`

| Component        | Purpose                                                                     |
| ---------------- | --------------------------------------------------------------------------- |
| `Button`         | All clickable actions. Variants: primary, secondary, ghost, gold, scarlet.  |
| `Card`           | Content container. `--radius-lg`, bordered. Tones: paper / cream / ink.     |
| `Badge`          | Inline pill — status, metadata. Tones follow the palette.                   |
| `Container`      | Centered max-width wrapper. Sizes: prose / md / lg / xl. Owns the gutter.   |
| `SectionHeading` | `kicker` (eyebrow) + display `title` + optional `lead`. Tones: ink / cream. |

```tsx
import { Button } from "@/components/ui/Button";

<Button href="/im-new" variant="primary">Plan a visit</Button>
<Button href="/give" variant="gold">Give online</Button>
<Button href={url} variant="secondary" external>Register on Brushfire</Button>
<Button onClick={…} variant="ghost">Cancel</Button>
```

On ink, `secondary` needs `className="text-cream hover:bg-cream hover:text-ink
border-white/40"` — the Hero and BookFeature show the pattern.

```tsx
import { Card } from "@/components/ui/Card";

<Card as="article" tone="paper">
  <h3>Wednesday: the refill.</h3>
  <p>7 PM. Prayer, prophetic, presence.</p>
</Card>;
```

```tsx
import { SectionHeading } from "@/components/ui/SectionHeading";

<SectionHeading
  kicker="What the house is about"
  title="Three things. God's house. One accord."
  lead="A discipleship progression, not a preference."
/>;
```

### 8.2 `components/brand/`

| Component       | Purpose                                                                     |
| --------------- | --------------------------------------------------------------------------- |
| `WordMark`      | Text logotype (Fraunces) with the three-bar mark adjacent. `tone` ink/cream |
| `AscendingBars` | The three-bar mark as inline SVG. `size`, `tone` current/pillars.           |

`PillarBadge` was removed. Pillar presence is carried by `PillarSpread`, the
pillar-toned mark, and pillar-tinted section chrome — there is no standalone
chip component.

```tsx
import { WordMark } from "@/components/brand/WordMark";

<WordMark />
<WordMark tone="cream" />        {/* on ink canvas */}
<WordMark href={null} />         {/* not a link (inside the mobile drawer) */}
```

### 8.3 `components/layout/`

| Component         | Purpose                                                                 |
| ----------------- | ----------------------------------------------------------------------- |
| `Header`          | Top nav — wordmark, primary links, Connect + Give CTAs.                 |
| `Footer`          | Brand block, four link columns (incl. Brian Hallam Ministries), social. |
| `MobileNav`       | Full-screen drawer under `lg`. Signs off with the pillar-toned mark.    |
| `AnnouncementBar` | Top strip driven by `lib/constants/announcements.ts` (date-windowed).   |

Composed in `app/(marketing)/layout.tsx`. Pages don't import these directly;
the global 404 (`app/not-found.tsx`) composes Header + Footer itself.

### 8.4 `components/sections/`

Shared sections (used on more than one page) live at the top level:

| Section       | Purpose                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------- |
| `BookFeature` | _God Is Prosperity, So I Prosper_ — cover, pitch, two ways to buy, door to BHM. Home + Resources. |

The home page is composed of `components/sections/home/*`, in this order. Each
is a single purpose-built module — don't fork, don't reuse off-home without
extracting shared parts first.

| Section         | Purpose                                                                     |
| --------------- | --------------------------------------------------------------------------- |
| `Hero`          | Lead tagline, service times, primary CTA.                                   |
| `PillarSpread`  | **Signature module.** The three pillars in canonical order, tinted chrome.  |
| `ThisSunday`    | "Sunday, 10 A.M." + the next three real events from the calendar.           |
| `Mission`       | The house verse, centered, with scripture anchors.                          |
| `Convictions`   | "We believe" — the three convictions with their verses. A creed, not cards. |
| `Testimony`     | Ink pull quote from a real person. Never stock.                             |
| `Letter`        | Pastoral note from Apostle Brian and Crystal. Fraunces, `prose` container.  |
| `BookFeature`   | (shared) The book, on ink.                                                  |
| `Altar`         | The giving block — "Give as the altar has loved you." Gold CTA.             |
| `WhereWeGather` | Address, service times, phone, directions.                                  |
| `Benediction`   | Closing blessing. Short. Fraunces.                                          |

### 8.5 Feature folders

`components/sermons/`, `components/events/`, `components/forms/`, etc. are
feature-local. Promote to `ui/` or `brand/` only when reused across two or
more features.

---

## 9. Don'ts

- **No stock smiling-teeth-on-brick photos.** Use type and motif if we don't
  have a real photo of our people or place.
- **No lorem ipsum, ever.** Not in staging. Write `TODO: copy`.
- **No emoji in body copy.**
- **No generic Bootstrap-church tropes.** No "Connect / Grow / Serve" pill
  trios. No wave dividers. No blurred-hero-video with text on top.
- **No rainbow gradients.** Single-hue gradients are fine. Rainbow never is.
- **No fifth-color surprises.** The palette is blue / purple / scarlet / gold /
  silver / bronze. No teal. No mint. No coral. See §10.
- **No all-caps paragraphs.** All-caps is for 2–4-word eyebrows only.
- **No "Click here."** Write the verb.
- **No hand-retyped church facts.** Import from `lib/constants/church.ts`. Fix
  it once, in one file.

---

## 10. Evolution

The fastest way to kill a system is to add to it without rules. When someone
wants a new accent, ask:

1. **What does the tabernacle say?** Is this already one of the six? If yes,
   we have a token. Use it.
2. **Is this a new kind of moment**, not a new color? Try an existing token and
   a layout variation first.
3. **If the answer really is a new hue:** document the scriptural or editorial
   rationale, add the token in `app/globals.css` under the three-variant
   pattern (`base`, `-ink`, `-soft`), include it in `@theme`, and update this
   file. It doesn't exist until it's in all three places.

**New components.** Put it in the narrowest folder that fits (`features/`
first; `ui/` or `brand/` only when genuinely shared). Type the props. No
`any`. Doc-comment the file. If it introduces a new visual primitive, add it
to §8 in the same PR.

**New pages.** Declare the lead pillar at the top (comment or const). It
decides accent color and metadata. Import church facts from
`lib/constants/church.ts`. Check §9 before shipping.

---

## Appendix A — Token cheat sheet

```css
/* Canvas */
--nh-ink        #0B1B2B   body text, inverse canvas
--nh-ink-2      #13293F   hero canvas
--nh-cream      #FAF7F1   default background
--nh-paper      #FFFFFF   card surface
--nh-bone       #EEE8DC   subtle fill
--nh-border     #E5DED0   default border
--nh-stone      #3A4654   secondary text
--nh-fog        #7E8A99   tertiary / metadata

/* Tabernacle accents — all in base / -ink / -soft */
--nh-blue       #1D4F8B   Habitation pillar
--nh-purple     #5B2A86   Bride pillar
--nh-scarlet    #9B1C2E   Harvest pillar
--nh-gold       #C9A227   decision / altar
--nh-silver     #9AA4AD   redemption / pricing
--nh-bronze     #8A5A2B   sacrifice / archive

/* Pillar aliases */
--nh-harvest    → --nh-scarlet
--nh-bride      → --nh-purple
--nh-habitation → --nh-blue

/* Semantic */
--bg     → --nh-cream
--fg     → --nh-ink
--muted  → --nh-stone
--accent → --nh-gold
--border → --nh-border

/* Radii */
--radius-sm  4px     buttons, inputs, badges
--radius     8px     pills, small cards
--radius-lg  14px    cards (default)
--radius-xl  22px    hero cards, callouts

/* Motion */
--dur-fast   150ms
--dur        250ms
--dur-slow   400ms
--ease-rise  cubic-bezier(0.22, 1, 0.36, 1)

/* House utilities (all @layer components) */
.u-eyebrow            Inter 12px 600 uppercase +0.16em — EVERY label
.u-display-soft       opsz 144, SOFT 100 — warm display
.u-display-dramatic   opsz 144, SOFT  60 — hero / cinematic
.u-numeral            opsz 144, old-style — 10 AM, dates
.u-smallcaps          Fraunces true small caps — rare, display only
.u-rule-gold          1px gold hairline (chapter marker)
.u-grain-ink          subtle grain for full-bleed ink blocks
.u-break-anywhere     let an email wrap in a narrow cell
.motif-altar-glow     gold radial wash, clipped to its box
.u-hero-mark          ghosted pillar-color mark, right side of photo-less ink heroes

/* The mark */
<AscendingBars size={28} />                three bars, currentColor
<AscendingBars size={22} tone="pillars" /> scarlet · purple · blue
PILLAR_STRIP                               "Endtime Harvest • Preparation • Habitation"
```

---

## Appendix B — Editing this guide

- Lives at `docs/BRAND.md`. In version control. Treat it like code.
- Any change to tokens, voice rules, or pillar definitions ships in the same
  PR as the code change that motivates it.
- When in doubt: **what does the tabernacle say?** Then ship.
