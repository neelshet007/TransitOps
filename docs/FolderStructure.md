# Folder Structure Directory

This document details the directories of the TransitOps repository.

## 📁 Monorepo Layout
```
TransitOps/
├── .github/            # GitHub actions, workflows, and PR templates
├── apps/
│   ├── api/            # Express Backend API Service
│   └── web/            # Next.js Frontend Application
├── docs/               # System and developer documentation
├── packages/
│   ├── types/          # Shared TypeScript type definitions
│   ├── utils/          # Standard utility helpers
│   └── config/         # Shared configurations
└── scripts/            # Database / environment orchestration scripts
```

---

## 📁 Backend Structure (`apps/api/src`)

The Express module is structured into distinct layers to isolate changes:

```
src/
├── config/             # Zod environment loaders
├── constants/          # Role, permission, and HTTP code keys
├── controllers/        # Handlers parsing request parameters
├── middlewares/        # Authentication, log stream, and error catchers
├── routes/             # Path definitions and route registration
├── services/           # Business logic and operations orchestration
├── repositories/       # Database interface pattern using Prisma
├── validators/         # Zod schemas for input validation
├── helpers/            # Application custom errors and formatters
├── utils/              # Logging instances (Winston)
├── database/           # Prisma client instantiation
└── modules/            # Domain subfolders for future development
```

---

## 📁 Frontend Structure (`apps/web`)

The Next.js client is configured with App Router directories:

```
apps/web/
├── app/                # Layouts, pages, route components (App Router)
├── lib/                # Third-party client initializations (Axios, etc.)
├── hooks/              # Custom reusable React hooks
├── services/           # Fetch clients and endpoints
├── store/              # State management (Zustand stores)
├── types/              # Next.js custom typings
├── utils/              # Local visual utilities
├── constants/          # Static layout configuration constants
├── middleware/         # App-level routing control
└── providers/          # Global React providers
```
