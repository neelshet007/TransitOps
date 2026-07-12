# TransitOps - Enterprise Fleet Operations ERP

TransitOps is a modern, enterprise-grade Fleet Operations ERP platform. This repository contains the Phase 0 Foundation Setup, designed for high scalability, type safety, and parallel team development.

---

## 🏗 Project Architecture

TransitOps is configured as an enterprise monorepo using npm workspaces:

```
TransitOps/
├── apps/
│   ├── api/            # Express.js + TypeScript + node-postgres (pg) API Backend
│   └── web/            # Next.js (App Router) + TypeScript Frontend (Scaffold Only)
├── database/           # Raw SQL schema, migrations, indexes, functions, views, seeds
├── packages/
│   ├── types/          # Shared TypeScript models and API types
│   ├── utils/          # Common utility helpers (date, formatting, responses)
│   └── config/         # Shared linter, theme design tokens, and environment configs
├── docs/               # Architecture, database schema, and development guides
└── scripts/            # Build and CI/CD setup scripts
```

For detailed specifications, see the documentation in `docs/`:
- [Architecture.md](file:///c:/Web%20Devlopment/HackathonProject/transitops/docs/Architecture.md)
- [Database.md](file:///c:/Web%20Devlopment/HackathonProject/transitops/docs/Database.md)
- [API.md](file:///c:/Web%20Devlopment/HackathonProject/transitops/docs/API.md)
- [FolderStructure.md](file:///c:/Web%20Devlopment/HackathonProject/transitops/docs/FolderStructure.md)
- [ContributionGuide.md](file:///c:/Web%20Devlopment/HackathonProject/transitops/docs/ContributionGuide.md)
- [CodingStandards.md](file:///c:/Web%20Devlopment/HackathonProject/transitops/docs/CodingStandards.md)
- [GitWorkflow.md](file:///c:/Web%20Devlopment/HackathonProject/transitops/docs/GitWorkflow.md)
- [EnvironmentSetup.md](file:///c:/Web%20Devlopment/HackathonProject/transitops/docs/EnvironmentSetup.md)

---

## 🚀 Getting Started

### 📋 Prerequisites
- **Node.js** (v20+ recommended)
- **npm** (v10+ recommended)
- **PostgreSQL** instance running locally or remotely (can be managed with pgAdmin 4)

### ⚙️ Quick Start

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd transitops
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Copy the example env in `apps/api/`:
   ```bash
   cp apps/api/.env.example apps/api/.env
   ```
   Open `apps/api/.env` and update the `DATABASE_URL` with your PostgreSQL credentials.

4. **Synchronize the database & seed:**
   ```bash
   npm run db:migrate --workspace=@transitops/api
   npm run db:seed --workspace=@transitops/api
   ```

5. **Run the services in development:**
   ```bash
   npm run dev
   ```

---

## 🔒 Authentication & Seeding

The database seeding initializes an administrative user:
- **Email:** `admin@transitops.com`
- **Password:** `Password123`
- **Roles:** `admin` (full permissions)
