# Coding Standards

TransitOps is an enterprise solution. It is critical that all developers write code adhering to these standards.

## 🛡 Strict TypeScript

- **No `any` Types:** Never use `any`. Always declare specific interface types, helper unions, or generics.
- **Strict Null Checks:** Ensure inputs are explicitly checked for null/undefined before dereferencing.
- **Return Types:** Explicitly define return types for all public services, controllers, and repository methods.

---

## 🏗 SOLID Architecture

- **Single Responsibility:** Each class, route handler, and service method must perform exactly one function. Keep controller methods under 15 lines.
- **Open/Closed:** Services and repositories should be open to extension but closed to modification. Inject dependencies (like prisma or configs) where appropriate.
- **Liskov Substitution:** Ensure subclass exceptions inherit correctly from `AppError`.
- **Interface Segregation:** Use clean, focused TypeScript interface declarations rather than bulky structures.
- **Dependency Inversion:** High-level controller layers must depend on abstractions (Services / Repositories) rather than direct database clients.

---

## 🧪 Error Management

- Do not use arbitrary string catch blocks. Always throw typed exceptions:
  - `ValidationError` (400)
  - `AuthenticationError` (401)
  - `ForbiddenError` (403)
  - `NotFoundError` (404)
  - `ConflictError` (409)
- Always pass errors to Express `next(error)` in catch blocks so the centralized middleware handler formats them.
