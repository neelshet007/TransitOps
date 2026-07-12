# Git Workflow

To coordinate work between the 3-member development team without code conflicts, TransitOps follows a structured branch strategy.

## 🌿 Branches

- **`main`**: Production-ready code only. Direct commits are **strictly forbidden**.
- **`develop`**: Integration branch for features. This is the default target for PRs.
- **`feature/*`**: Short-lived feature branches branched from `develop`.

---

## 📌 Feature Branch Naming Format

Developers must name their branches corresponding to the module or system they are working on:
- `feature/auth` - Authentication updates
- `feature/users` - User management operations
- `feature/vehicles` - Vehicle management modules
- `feature/drivers` - Driver profile integration
- `feature/trips` - Dispatching and trip workflows
- `feature/fuel` - Refueling logs
- `feature/maintenance` - Repair and maintenance tracking
- `feature/expenses` - Cost and expense logging
- `feature/reports` - Operational and analytics reports

---

## 🔄 Pull Request (PR) & Merging Procedure

1. **Keep Branches Updated:** Before starting or requesting reviews, pull the latest changes from `develop` and rebase your branch:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout feature/your-feature
   git rebase develop
   ```
2. **Compile and Lint Locally:** Ensure the project compiles with no warnings or errors:
   ```bash
   npm run lint
   npm run build
   ```
3. **Submit PR:** Submit a PR targeting the `develop` branch.
4. **Peer Review:** At least one other team member must review and approve the changes.
5. **Merge:** Use squash-merge to keep a clean history.
