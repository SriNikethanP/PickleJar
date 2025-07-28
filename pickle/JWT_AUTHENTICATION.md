# JWT Authentication Implementation

This document explains how JWT authentication has been implemented in the Pickle backend.

## Overview

The JWT authentication system provides secure, stateless authentication for the Pickle e-commerce application. Users can register, login, and access protected endpoints using JWT tokens.

## Features

- **JWT Token Generation**: Secure token generation with user ID, email, and role
- **Token Validation**: Automatic validation of JWT tokens on protected endpoints
- **Refresh Tokens**: Long-lived refresh tokens for seamless user experience
- **Role-based Access Control**: Different access levels for CUSTOMER and ADMIN roles
- **Stateless Authentication**: No server-side session storage required

## API Endpoints

### Authentication Endpoints (Public)

#### Register User

```
POST /api/v1/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "mobile": "1234567890",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400000,
  "user": {
    "id": 1,
    "fullName": "John Doe",
    "email": "john@example.com",
    "mobile": "1234567890",
    "role": "CUSTOMER"
  }
}
```

#### Login User

```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** Same as register response

#### Refresh Token

```
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:** Same as register response with new tokens

### Protected Endpoints

All protected endpoints require the `Authorization` header with the JWT token:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Customer Endpoints (Requires CUSTOMER role)

- `GET /api/v1/cart` - Get user's cart
- `PUT /api/v1/cart/item` - Update cart item
- `DELETE /api/v1/cart/item` - Remove cart item
- `POST /api/v1/cart/checkout` - Checkout cart
- `GET /api/v1/users/me` - Get current user info
- `GET /api/v1/users/me/orders` - Get current user's orders
- `GET /api/v1/orders/**` - Order management
- `GET /api/v1/wishlist/**` - Wishlist management
- `GET /api/v1/account/**` - Account management

#### Admin Endpoints (Requires ADMIN role)

- `GET /api/v1/admin/**` - Admin dashboard and management

## Frontend Integration

### Storing Tokens

Store the JWT tokens securely in your frontend application:

```javascript
// After successful login/register
localStorage.setItem("accessToken", response.accessToken);
localStorage.setItem("refreshToken", response.refreshToken);
localStorage.setItem("user", JSON.stringify(response.user));
```

### Making Authenticated Requests

Include the JWT token in the Authorization header:

```javascript
const token = localStorage.getItem("accessToken");

fetch("/api/v1/cart", {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
```

### Token Refresh

Implement automatic token refresh when the access token expires:

```javascript
async function refreshToken() {
  const refreshToken = localStorage.getItem("refreshToken");

  try {
    const response = await fetch("/api/v1/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      return data.accessToken;
    }
  } catch (error) {
    // Redirect to login
    localStorage.clear();
    window.location.href = "/login";
  }
}
```

### Axios Interceptor Example

```javascript
import axios from "axios";

// Request interceptor to add token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const newToken = await refreshToken();
      if (newToken) {
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return axios.request(error.config);
      }
    }
    return Promise.reject(error);
  }
);
```

## Security Considerations

1. **Token Storage**: Store tokens securely (localStorage for development, httpOnly cookies for production)
2. **Token Expiration**: Implement automatic token refresh
3. **HTTPS**: Always use HTTPS in production
4. **Secret Key**: Use a strong, unique secret key in production
5. **Token Validation**: Always validate tokens on the server side
6. **Logout**: Clear tokens on logout

## Configuration

JWT configuration is in `application.properties`:

```properties
jwt.secret=your-super-secret-jwt-key-here-make-it-very-long-and-secure-for-production-use
jwt.expiration=86400000
jwt.issuer=pickle-company
jwt.audience=pickle-users
```

## Testing

You can test the JWT authentication using tools like Postman or curl:

1. Register a new user
2. Login to get tokens
3. Use the access token in the Authorization header for protected endpoints
4. Test token refresh when the access token expires

## Error Handling

Common error responses:

- `401 Unauthorized`: Invalid or expired token
- `403 Forbidden`: Insufficient permissions
- `400 Bad Request`: Invalid request data
- `500 Internal Server Error`: Server error

The JWT filter will automatically return 401 for invalid tokens and 403 for insufficient permissions.
