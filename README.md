# WorkProofed

**Proof Your Work. Get Paid. Stress-Free.**

WorkProofed is the first end-to-end platform for service businesses to manage jobs, show proof of work, and guarantee payment collection.

## Features

### Core Platform
- **Job Management**: Post jobs, accept requests, track status
- **Proof of Work**: Upload before/after photos with geotagging and timestamps
- **Smart Invoicing**: Auto-generated invoices with job details
- **Guaranteed Payments**: Stripe integration with 2.5% split fee structure
- **AI Assistant**: Generate job descriptions and upsell suggestions
- **Admin Dashboard**: Monitor disputes, payouts, and platform analytics

### User Roles
- **Clients**: Request services, approve work, make payments
- **Providers**: Accept jobs, upload proof, get paid
- **Admins**: Platform oversight and dispute resolution

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js with Google OAuth
- **Payments**: Stripe with webhooks
- **AI**: OpenAI GPT-3.5-turbo
- **File Storage**: S3-compatible storage
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Stripe account
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Work-Proofed/WorkProofed.git
cd WorkProofed
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

Fill in your environment variables in `.env.local`:
- Database connection string
- Stripe keys
- OpenAI API key
- NextAuth secrets
- OAuth provider credentials

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Environment Variables

See `env.example` for all required environment variables:

- **Database**: PostgreSQL connection string
- **Authentication**: NextAuth secrets and OAuth providers
- **Payments**: Stripe API keys and webhook secrets
- **AI**: OpenAI API key
- **Storage**: S3 credentials for file uploads
- **Email**: SendGrid API key for notifications

## Database Schema

The application uses Prisma ORM with the following main models:
- **User**: Clients, providers, and admins
- **Job**: Job postings and requests
- **Photo**: Proof of work images with metadata
- **Invoice**: Payment tracking and fee calculation
- **Review**: Client feedback and ratings

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js endpoints

### Jobs
- `GET /api/jobs` - List jobs with filters
- `POST /api/jobs` - Create new job
- `GET /api/jobs/[id]` - Get job details
- `PUT /api/jobs/[id]` - Update job status

### Photos
- `POST /api/photos/upload` - Upload proof photos
- `GET /api/photos/[jobId]` - Get job photos

### Invoices
- `GET /api/invoices` - List invoices
- `POST /api/invoices` - Create invoice
- `GET /api/invoices/[id]/pdf` - Download invoice PDF

### Payments
- `POST /api/payments/create-payment-intent` - Create Stripe payment
- `POST /api/payments/webhook` - Stripe webhook handler

### AI
- `POST /api/ai/generate-description` - Generate job description
- `POST /api/ai/upsell-suggestions` - Get upsell suggestions

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is proprietary software. All rights reserved.

## Support

For support, email support@workproofed.com or create an issue in the repository.

---

**WorkProofed** - The future of service business management.