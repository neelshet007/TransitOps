# API Specifications & Standards

Every REST endpoint in the TransitOps backend must follow these specifications.

## 📥 Request Structure

- Content Type: `application/json`
- Headers: `Authorization: Bearer <Access Token>` (for protected endpoints)

## 📤 Standard API Responses

### 1. Success Response (2xx HTTP Codes)

```json
{
  "success": true,
  "message": "Resource retrieved successfully.",
  "data": {
    "id": "893c5d6e-f78a-4db5-9e6b-765fdf89b41a",
    "email": "user@transitops.com"
  },
  "meta": {
    "page": 1,
    "limit": 10,
    "total_records": 1,
    "total_pages": 1
  }
}
```

### 2. Error Response (4xx/5xx HTTP Codes)

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    "body.email: Invalid email address",
    "body.password: Password must be at least 6 characters long"
  ]
}
```

---

## 🔒 Authentication API Endpoints

### 1. User Login

- **Endpoint:** `POST /api/v1/auth/login`
- **Payload:**
  ```json
  {
    "email": "admin@transitops.com",
    "password": "Password123"
  }
  ```
- **Response Data:** Returns `accessToken` in the JSON body, and sets a secure HttpOnly cookie containing the `refreshToken`.

### 2. Token Rotation

- **Endpoint:** `POST /api/v1/auth/refresh`
- **Payload:** Empty or `{ "refreshToken": "string" }`
- **Behavior:** Verifies the refresh token cookie/payload, rotates both tokens, sets the new cookie, and returns the new `accessToken`.

### 3. User Logout

- **Endpoint:** `POST /api/v1/auth/logout`
- **Behavior:** Clears the HttpOnly `refreshToken` cookie.

### 4. Fetch Active Context (Me)

- **Endpoint:** `GET /api/v1/auth/me`
- **Headers:** `Authorization: Bearer <token>`
- **Response Data:** Returns full user schema context including flattened active role and permission lists.
