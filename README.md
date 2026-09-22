# VentureMatch

![VentureMatch banner](docs/venturematch-banner.svg)

> **Connect skills. Build ventures. Find your co-founder.**

VentureMatch is a multidisciplinary venture-building platform for USTED innovators. Students build a Talent DNA profile, discover complementary people and ventures, form teams, run founder trials, and manage the path from idea to launch.

## Information Center

| Area | What it supports |
| --- | --- |
| **Talent DNA** | Academic background, capabilities, interests, availability, goals, and working style. |
| **Venture workspace** | Venture creation, capability requirements, milestones, health, DNA, charter, recruitment, and contributions. |
| **Matching** | Ranked co-founder recommendations based on capability gaps and compatibility signals. |
| **Collaboration** | Invitations, conversations, notifications, venture rooms, and founder trials. |
| **Administration** | User, venture, moderation, configuration, and matching-weight management. |

## Product Screens

Add approved application screenshots to [`docs/screenshots`](docs/screenshots). GitHub renders the image paths below automatically when the corresponding files are added.

| Screen | Screenshot path | Purpose |
| --- | --- | --- |
| Landing page | `docs/screenshots/landing.png` | Product overview and sign-up entry point. |
| Talent onboarding | `docs/screenshots/onboarding-capabilities.png` | Capability selection and Talent DNA setup. |
| Venture dashboard | `docs/screenshots/venture-dashboard.png` | Venture workspace, health, milestones, and team progress. |
| Matching recommendations | `docs/screenshots/matching-recommendations.png` | Ranked candidates and factor-level match explanations. |
| Admin console | `docs/screenshots/admin-console.png` | Platform operations and matching configuration. |

```text
docs/
├── venturematch-banner.svg
└── screenshots/
	├── landing.png
	├── onboarding-capabilities.png
	├── venture-dashboard.png
	├── matching-recommendations.png
	└── admin-console.png
```

## Matching Model

VentureMatch uses a deterministic, weighted compatibility model. A recommendation is saved when its overall score is at least **40/100** and expires after **7 days**.

| Factor | Weight | Signal |
| --- | ---: | --- |
| Missing capability coverage | 35% | How well a candidate fills capabilities required by the venture but not already covered by active team members. |
| Venture-sector interest | 20% | Alignment between the candidate’s sector interests and the venture’s primary sector. |
| Commitment compatibility | 15% | Compatibility of candidate and venture commitment levels. |
| Availability compatibility | 10% | Candidate weekly-hours band compared with the venture’s expected commitment. |
| Venture-goal alignment | 10% | Alignment between the candidate’s goal and the venture’s ambition. |
| Working-style compatibility | 5% | Structured/flexible, independent/collaborative, and fast/deliberate preferences. |
| Capability evidence | 5% | Evidence attached to relevant candidate capabilities. |

The active matching configuration is stored in the database and can be managed in the admin console. The default algorithm version is `1.0.0`.

## Core Flows

### Student onboarding

1. Create an account.
2. Complete academic details.
3. Select capabilities and proficiency levels.
4. Select venture-sector interests.
5. Set founder preferences and availability.
6. Complete the Talent DNA profile.

### Venture matching

1. Create a venture.
2. Set capability requirements and importance scores.
3. Publish the venture so it becomes active.
4. Run matching from the venture recommendations page.
5. Review ranked candidates, then send invitations or propose founder trials.

## Technology

- **Framework:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS 4
- **Database:** TiDB/MySQL through Prisma 7 and `@prisma/adapter-mariadb`
- **Authentication:** Better Auth
- **Validation:** Zod
- **Realtime and integrations:** Pusher, Cloudinary, Nodemailer

## Getting Started

### Prerequisites

- Node.js 20+
- A TiDB/MySQL database
- npm

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create `.env` from your deployment values. At minimum, configure:

```dotenv
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=replace-with-a-long-random-secret
DATABASE_URL=mysql://USER:PASSWORD@HOST:4000/DATABASE?sslaccept=strict
```

Optional integrations include Cloudinary, Pusher, and SMTP settings.

### 3. Generate and sync the database schema

```bash
npx prisma generate
npx prisma db push
```

### 4. Seed reference data

```bash
npm run seed
```

The seed provides 7 capability families, 43 capabilities, 12 venture sectors, a default active matching configuration, and an initial admin user at `admin@venturematch.app`.

### 5. Run the application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality Checks

```bash
# Strict lint: fails on any warning
npm run lint -- --max-warnings=0

# Production build and type check
npm run build
```

## API Highlights

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/v1/capabilities` | `GET` | Capability library grouped by family. |
| `/api/v1/sectors` | `GET` | Active venture sectors. |
| `/api/v1/ventures` | `GET`, `POST` | Current-user ventures and venture creation. |
| `/api/v1/ventures/:ventureId/requirements` | `PUT` | Define required venture capabilities. |
| `/api/v1/ventures/:ventureId/publish` | `POST` | Publish a venture as active. |
| `/api/v1/ventures/:ventureId/recommendations` | `GET`, `POST` | Retrieve or generate matching recommendations. |
| `/api/v1/profile/onboarding/*` | `POST` | Save Talent DNA onboarding steps. |

## Project Structure

```text
src/
├── app/                 # Next.js App Router pages and API routes
├── components/          # Shared, feature, and UI components
├── server/
│   ├── matching/        # Scoring algorithm and matching types
│   ├── repositories/    # Prisma data access
│   ├── services/        # Domain workflows
│   └── validators/      # Zod request validation
├── lib/                 # Auth, Prisma client, API helpers, utilities
└── generated/prisma/    # Generated Prisma client
prisma/
├── schema.prisma
└── seed.ts
docs/
├── venturematch-banner.svg
└── screenshots/
```

## Security Notes

- Do not commit `.env` files or database credentials.
- Use a unique, high-entropy `BETTER_AUTH_SECRET` in every environment.
- Use a TLS-enabled TiDB/MySQL connection string in deployed environments.
- Rotate any credential that has been accidentally exposed.

## License

Private project. All rights reserved.
