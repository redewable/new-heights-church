# New Heights Church Digital Platform

> "We exist to love people and point them to Christ."

A modern, premium digital ministry platform built with Next.js, Sanity CMS, and Supabase.

![New Heights Church](https://via.placeholder.com/1200x630/0A0A0A/C5A059?text=New+Heights+Church)

## ✨ Features

### Public Experience
- **Dynamic Live Streaming** - Automatic YouTube live detection with fallback states
- **Sermon Archive** - Searchable library with series organization
- **Podcast Integration** - RSS feed support for pastor's podcast
- **Events Calendar** - Upcoming events with registration support
- **Beliefs & Stances** - Interactive doctrinal content

### Member Portal
- **User Authentication** - Email/password and Google OAuth
- **Saved Content** - Bookmark sermons and podcast episodes
- **Family Profiles** - Manage household and children
- **Training Pathways** - N2N onboarding, baptism registration

### Kids Check-in v2.0
- **Secure Check-in Flow** - Parent-initiated with verification codes
- **Real-time Room Dashboard** - For ministry leaders
- **Parent Alerts** - Push notifications via Web Push API
- **Complete Audit Trail** - Every action logged

### Giving
- **Standard Giving** - PushPay integration
- **Asset Giving** - Crypto, stocks, property intake workflow

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18.17+
- npm or yarn
- Supabase account
- Sanity account

### 1. Clone and Install

```bash
git clone https://github.com/your-org/new-heights-church.git
cd new-heights-church
npm install
```

### 2. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env.local
```

Fill in your credentials:

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-token

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# YouTube (optional - for live detection)
YOUTUBE_API_KEY=your-api-key
NEXT_PUBLIC_YOUTUBE_CHANNEL_ID=your-channel-id

# Demo Mode (set to false for production)
NEXT_PUBLIC_DEMO_MODE=true
```

### 3. Database Setup

Run the Supabase migration:

```bash
# If using Supabase CLI
supabase db push

# Or copy the SQL from supabase/migrations/00001_initial_schema.sql
# and run it in the Supabase SQL editor
```

### 4. Sanity Studio Setup

```bash
cd sanity
npm install
npm run dev
```

Visit `http://localhost:3333` to access the Sanity Studio.

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the site.

---

## 📁 Project Structure

```
new-heights-church/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Auth callback routes
│   │   ├── about/             # About, beliefs, stances
│   │   ├── api/               # API routes
│   │   ├── events/            # Events pages
│   │   ├── give/              # Giving pages
│   │   ├── live/              # Live stream page
│   │   ├── member/            # Member portal
│   │   ├── ops/               # Staff operations dashboard
│   │   ├── podcast/           # Podcast page
│   │   ├── visit/             # Plan a visit
│   │   └── watch/             # Sermon archive
│   ├── components/
│   │   ├── kids/              # Kids check-in components
│   │   ├── layout/            # Layout components
│   │   ├── live/              # Live stream components
│   │   └── ui/                # Reusable UI components
│   ├── lib/
│   │   ├── sanity/            # Sanity client & queries
│   │   ├── supabase/          # Supabase clients
│   │   ├── utils/             # Utility functions
│   │   └── hooks/             # Custom React hooks
│   └── types/                 # TypeScript types
├── sanity/
│   ├── schemaTypes/           # Sanity schema definitions
│   └── sanity.config.ts       # Sanity configuration
├── supabase/
│   └── migrations/            # Database migrations
└── public/
    ├── icons/                 # PWA icons
    └── manifest.json          # PWA manifest
```

---

## 🎨 Design System

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#0A0A0A` | Primary background |
| `--gold` | `#C5A059` | Brand accent |
| `--text-primary` | `#F5F5F5` | Primary text |
| `--text-secondary` | `#A0A0A0` | Secondary text |

### Typography

- **Headings**: Cinzel (serif, authority)
- **Body/UI**: Inter (sans-serif, clarity)

### Components

All components follow the design tokens and use Tailwind CSS with custom utilities:

```jsx
<button className="btn-primary">Primary Action</button>
<button className="btn-secondary">Secondary Action</button>
<div className="card">Card content</div>
```

---

## 🔐 Security

### Kids Check-in Security

- **Verification Codes**: 4-6 digit codes required for pickup
- **Photo Matching**: Visual confirmation by ministry leaders
- **Audit Logging**: Every check-in/out action logged with timestamps
- **Row Level Security**: Database-enforced access controls

### Authentication

- Supabase Auth with email/password and Google OAuth
- Role-based access control (member, volunteer, kids_leader, staff_admin, super_admin)
- JWT tokens with secure cookie storage

---

## 📱 PWA Support

The site is a Progressive Web App with:

- Installable on mobile devices
- Offline support for critical pages
- Push notifications for parent alerts
- App-like experience without App Store

### Install Prompts

The app will prompt users to install after their second visit.

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

Make sure to set:
- `NEXT_PUBLIC_DEMO_MODE=false`
- All Sanity and Supabase production credentials
- YouTube API key (if using live detection)
- VAPID keys for push notifications

---

## 📊 Build Order (Phases)

### Phase 1 — Public Voice ✅
- Design tokens + component library
- Sanity schemas + studio
- Home + Live + Watch + Podcast + About + Events
- Standard giving integration

### Phase 2 — Member Foundation
- Supabase auth + profiles
- Saved items
- N2N onboarding + baptism registration

### Phase 3 — Kids Check-in v2.0
- Household + children profiles
- Rooms + services + checkin flow
- Ops dashboard + real-time + push

### Phase 4 — Training
- Course content in Sanity
- Progress tracking in Supabase

### Phase 5 — Asset Offering
- Intake + staff review + audit logs

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

---

## 📄 License

Private - New Heights Church

---

## 🙏 Support

For questions or issues, contact the development team.

---

Built with ❤️ for the glory of God.
