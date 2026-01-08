# Atrangi Eventz Website

A modern event management platform for organizing and selling tickets to cultural events, including Bollywood parties, Garba nights, and cultural festivals.

## Features

- 🎫 **Event Management** - Create and manage events with multiple ticket tiers
- 💳 **Payment Processing** - Secure checkout with Stripe integration
- 🎟️ **Ticket Reservations** - Real-time ticket reservation system with expiration timers
- 📧 **Email Notifications** - Automated order confirmations and ticket delivery
- 📄 **PDF Tickets** - Generate downloadable tickets with QR codes
- 👤 **User Authentication** - Secure user accounts with NextAuth.js
- 🎨 **Modern UI** - Responsive design with animations and dark mode support

## Tech Stack

### Frontend

- **Next.js 16** (App Router) with React 19
- **TypeScript** for type safety
- **Tailwind CSS 4** for styling
- **shadcn/ui** + **Radix UI** for accessible components
- **Framer Motion** for animations
- **React Hook Form** + **Zod** for form validation

### State Management

- **Redux Toolkit** for global state
- **TanStack Query** for server state management

### Backend & Database

- **PostgreSQL** (Neon serverless) for data storage
- **db-migrate** for database migrations
- **NextAuth.js** for authentication

### Services & Integrations

- **Stripe** for payment processing
- **AWS S3** (Cloudflare R2) for file storage
- **Mailgun** for email delivery
- **Upstash Redis** for caching
- **Upstash QStash** for background jobs

### Additional Libraries

- **@react-pdf/renderer** for PDF generation
- **qrcode** for QR code generation
- **bcryptjs** for password hashing

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (Neon recommended)
- Environment variables configured (see `.env.example`)

### Installation

```bash
npm install
```

### Database Setup

Run migrations to set up the database schema:

```bash
npm run migrate
```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run migrate` - Run database migrations
- `npm run migrate:down` - Rollback last migration
- `npm run migrate:reset` - Reset database
- `npm run migrate:check` - Check migration status
- `npm run migrate:create` - Create new migration

## Project Structure

```
src/
├── app/              # Next.js app router pages and API routes
├── components/       # React components
├── contexts/         # React contexts
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and configurations
├── providers/       # Context providers
├── server/          # Server-side services and repositories
├── store/           # Redux store and slices
└── types/           # TypeScript type definitions
```

## License

See [LICENSE](LICENSE) file for details.
