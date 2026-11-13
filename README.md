# ReportCard 🇳🇬

> Virtual Report Card Portal for Primary and Secondary Schools in Nigeria.

A multi-tenant SaaS web platform that simplifies continuous assessment (CA) and examination recording, automatically computes student totals, grades, and rankings, provides administrative review/publishing workflows, and offers parents a mobile-first portal to track their children's academic performance.

---

## 🚀 Features

- **Multi-Tenant Architecture**: Shared database schema with tenant-level isolation using `schoolId`.
- **Role-Based Access Control**:
  - **Platform Admin**: Provision and manage schools and subscriptions.
  - **School Admin**: Configure academic sessions, terms, grading schemes, classes, subjects, teacher assignments, student roster (with CSV import), and publication approvals.
  - **Teacher**: Rapid score entry grid (TanStack Table) with CA components and exam marks, autosave, and submission status.
  - **Parent**: Mobile-first portal with child selection, subject breakdowns, term averages, rankings, and high-fidelity printable report cards.
- **Grading & Computation Engine**:
  - Support for Nigerian WAEC 9-point scale (`A1` through `F9`) and Letter scale (`A` through `F`).
  - Standard competition ranking (`1224`) for subject and class positions.
  - Deterministic pure calculation functions with 100% unit test coverage.
- **Audit Logging**: Comprehensive audit trail for score changes, approvals, and publication events.
- **Mobile-First UX**: Responsive layouts tested down to 360px viewport widths with loading, empty, and error states.

---

## 🛠 Tech Stack

- **Framework**: Next.js (App Router) + TypeScript
- **Styling**: Tailwind CSS + Lucide Icons
- **Database & ORM**: PostgreSQL + Prisma
- **Auth**: NextAuth.js (JWT session with role and tenant context)
- **Validation**: Zod + React Hook Form
- **Tables**: TanStack Table
- **Testing**: Vitest

---

## 📦 Getting Started

### 1. Prerequisites
- Node.js 18+ (Node.js 20+ recommended)
- PostgreSQL database (e.g. Neon, Supabase, or local instance)

### 2. Installation
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://username:password@localhost:5432/reportcard?schema=public"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-jwt-key-min-32-chars"

# Optional Paystack (Test mode)
PAYSTACK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_test_..."
```

### 4. Database Setup
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing

Run the Vitest test suite for grading calculations and business logic:
```bash
npm test
```
