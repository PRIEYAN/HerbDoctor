# API Integration Guide

## Overview
This guide explains how to integrate the Herbal Doctor app with your backend API using axios and AsyncStorage for JWT token management, with comprehensive error handling and status code validation.

## Setup

### 1. Install Dependencies
```bash
npm install axios @react-native-async-storage/async-storage
```

### 2. Configure API Base URL
Update the `API_BASE_URL` in `utils/api.ts`:
```typescript
export const API_BASE_URL = 'http://your-actual-api-domain.com';
```

## API Endpoints

### Signup Endpoint
- **URL**: `POST /signup`
- **Request Body**:
```json
{
  "name": "string",
  "email": "string", 
  "phonenumber": "string",
  "nmr_number": "string",
  "password": "string",
  "hospital": "string",
  "specialization": "string",
  "aboutme": "string"
}
```

- **Response** (201 Created):
```json
{
  "message": "Doctor registered successfully",
  "token": "jwt_token_here",
  "doctor": {
    "id": "number",
    "name": "string",
    "email": "string",
    "phonenumber": "string",
    "nmr_number": "string",
    "hospital": "string",
    "specialization": "string"
  }
}
```

### Login Endpoint
- **URL**: `POST /login`
- **Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```

- **Response** (200 OK or 201 Created):
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "doctor": {
    "id": "number",
    "name": "string",
    "email": "string",
    "phonenumber": "string",
    "nmr_number": "string",
    "hospital": "string",
    "specialization": "string"
  }
}
```

### JWT Verification Endpoint
- **URL**: `POST /doctor/auth/jwt`
- **Request Body**:
```json
{
  "token": "jwt_token_here"
}
```

- **Response** (200 OK):
```json
{
  "message": "JWT verified",
  "doctor": {
    "sno": 3,
    "name": "Prieyq",
    "phonenumber": "96385207471",
    "email": "prie@gmail.com",
    "nmr_number": "Jdid",
    "password": "$2b$10$IUgedEk6H0gu7TwFGttImuHmu1fVkh1hNUgjLdPYJwThShqbX0p0.",
    "hospital": "Appolo",
    "specialization": "Ent ",
    "aboutme": "Ahh am just a kid",
    "booked": "none",
    "bookedby": "none"
  }
}
```

## Status Code Validation

### ✅ **Success Responses (Redirect to Homepage)**
- **200 OK**: Request successful
- **201 Created**: Resource created successfully

### ❌ **Error Responses (Show Backend Message)**
- **400 Bad Request**: Invalid data format
- **401 Unauthorized**: Invalid credentials
- **403 Forbidden**: Access denied
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource already exists
- **422 Validation Error**: Data validation failed
- **500 Internal Server Error**: Server error
- **502 Bad Gateway**: Server temporarily unavailable
- **503 Service Unavailable**: Service down
- **504 Gateway Timeout**: Request timeout

## Features Implemented

### 1. **Form Validation**
- Required field validation
- Email format validation
- Phone number format validation
- Real-time error feedback

### 2. **API Integration**
- Axios HTTP client with interceptors
- Automatic JWT token handling
- Request/response error handling
- Timeout configuration (10 seconds)

### 3. **Status Code Validation**
- **Only redirect on 200/201**: Ensures successful responses
- **Show backend errors**: Displays actual server error messages
- **Fallback messages**: User-friendly error descriptions
- **Network error handling**: Connection and timeout issues

### 4. **JWT Token Management**
- Secure storage in AsyncStorage
- Automatic token inclusion in requests
- Token expiration handling (401 responses)
- Secure logout with storage cleanup

### 5. **User Experience**
- Loading states during API calls
- Success/error alerts with backend messages
- Form validation feedback
- Disabled button states during submission

## File Structure

```
utils/
  ├── api.ts              # API configuration and utilities
  └── errorHandler.ts     # Error handling utilities
components/pages_tabs/
  ├── signup.tsx          # Signup form with API integration
  ├── login.tsx           # Login form with API integration
  └── homepage.tsx        # Homepage with logout functionality
```

## Usage Examples

### Making API Calls
```typescript
import { authAPI } from '@/utils/api';

// Signup
const response = await authAPI.signup(signupData);

// Login
const response = await authAPI.login(loginData);
```

### Error Handling
```typescript
import { getErrorMessage } from '@/utils/errorHandler';

try {
  const response = await authAPI.login(loginData);
  
  // Check for successful status codes
  if (response.status === 200 || response.status === 201) {
    // Success - redirect to homepage
    router.push('/homepage');
  }
} catch (error) {
  // Get user-friendly error message
  const errorMessage = getErrorMessage(error);
  Alert.alert('Login Failed', errorMessage);
}
```

### Managing Storage
```typescript
import { storage } from '@/utils/api';

// Store token
await storage.setToken(token);

// Get user data
const userData = await storage.getUserData();

// Clear all data (logout)
await storage.clearAll();
```

## Error Handling

### Backend Error Messages
The app will display the exact error message from your backend:
- `"Phone number already exists"` - Shows backend validation error
- `"Internal server error"` - Shows server error message
- `"Wrong password"` - Shows authentication error

### Network Errors
- **No Internet**: "Network error. Please check your connection and try again."
- **Timeout**: "Request timeout. Please try again."
- **Server Down**: "Service unavailable. Please try again later."

### Validation Errors
- **Client-side**: Form validation before API call
- **Server-side**: Backend validation error messages
- **Format Errors**: Email, phone number format validation

## Security Features

### 1. **JWT Token Security**
- Tokens stored securely in AsyncStorage
- Automatic token inclusion in request headers
- Token expiration handling

### 2. **Input Validation**
- Client-side validation before API calls
- Server response validation
- Error message sanitization

### 3. **Error Handling**
- Network error detection
- Timeout handling
- Graceful fallbacks

## Configuration

### Timeout Settings
```typescript
// In utils/api.ts
export const apiClient = axios.create({
  timeout: 10000, // 10 seconds
});
```

### Headers
```typescript
headers: {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer ${token}' // Auto-added by interceptor
}
```

## Testing Scenarios

### 1. **Success Cases**
- ✅ Valid signup → Status 201 → Redirect to homepage
- ✅ Valid login → Status 200 → Redirect to homepage

### 2. **Error Cases**
- ❌ Invalid email → Status 400 → Show backend message
- ❌ Wrong password → Status 401 → Show "Wrong password"
- ❌ Duplicate phone → Status 409 → Show "Phone number already exists"
- ❌ Server error → Status 500 → Show "Internal server error"

### 3. **Network Issues**
- ❌ No internet → Show "Network error"
- ❌ Timeout → Show "Request timeout"
- ❌ Server down → Show "Service unavailable"

## Troubleshooting

### Common Issues

1. **"Network Error"**
   - Check API base URL
   - Verify server is running
   - Check network connectivity

2. **"Request Timeout"**
   - Increase timeout value in api.ts
   - Check server response time
   - Verify network stability

3. **"JWT Token Invalid"**
   - Check token storage
   - Verify token format
   - Check server JWT secret

4. **"Backend Error Messages Not Showing"**
   - Check error response format
   - Verify error handling utility
   - Check console logs

### Debug Steps
1. Check console logs for errors
2. Verify API endpoint URLs
3. Test API with Postman/Insomnia
4. Check AsyncStorage contents
5. Verify network permissions

## Next Steps

### 1. **Implement Additional Endpoints**
- Profile update API
- Password change API
- Logout API

### 2. **Add Route Protection**
- Implement authentication guards
- Add token refresh logic
- Handle token expiration gracefully

### 3. **Enhance Security**
- Add biometric authentication
- Implement certificate pinning
- Add request encryption

## Support

For API integration issues:
1. Check the console logs
2. Verify API endpoint configuration
3. Test with external API testing tools
4. Review network permissions in app.json
5. Verify backend error response format 