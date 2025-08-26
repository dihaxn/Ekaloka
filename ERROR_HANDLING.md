# Error Handling System Documentation

This document describes the comprehensive error handling system implemented in the Ekaloka application.

## Overview

The error handling system provides:

- Custom error classes for different types of errors
- Centralized error handling and logging
- Form validation with user-friendly error messages
- React error boundaries for UI error handling
- Toast notifications for user feedback
- Retry logic and circuit breaker patterns
- Comprehensive API error handling

## Architecture

### 1. Error Types (`src/types/errors.ts`)

#### Base Error Class

```typescript
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code?: string;
}
```

#### Specific Error Classes

- `ValidationError` - Input validation errors (400)
- `AuthenticationError` - Authentication failures (401)
- `AuthorizationError` - Permission denied (403)
- `NotFoundError` - Resources not found (404)
- `ConflictError` - Resource conflicts (409)
- `RateLimitError` - Too many requests (429)
- `DatabaseError` - Database operation failures (500)
- `ExternalServiceError` - Third-party service failures (502)

### 2. Validation System (`src/lib/validation.ts`)

#### Built-in Validators

```typescript
export const validators = {
  required: (value: any, fieldName: string) => ValidationError | null
  email: (value: string, fieldName: string) => ValidationError | null
  minLength: (value: string, minLength: number, fieldName: string) => ValidationError | null
  maxLength: (value: string, maxLength: number, fieldName: string) => ValidationError | null
  minValue: (value: number, minValue: number, fieldName: string) => ValidationError | null
  maxValue: (value: number, maxValue: number, fieldName: string) => ValidationError | null
  positive: (value: number, fieldName: string) => ValidationError | null
  url: (value: string, fieldName: string) => ValidationError | null
  enum: (value: any, allowedValues: any[], fieldName: string) => ValidationError | null
}
```

#### Validation Functions

- `validateLoginCredentials()` - Login form validation
- `validateRegistrationData()` - Registration form validation
- `validateProductData()` - Product form validation
- `validatePaginationParams()` - Pagination parameter validation

### 3. Error Handler (`src/lib/errorHandler.ts`)

#### Core Functions

```typescript
// Handle and format API errors
handleApiError(error: Error | AppError, req?: any): ErrorResponse

// Send error response to Next.js API
sendErrorResponse(res: NextApiResponse, error: Error | AppError, req?: any): void

// Send success response to Next.js API
sendSuccessResponse<T>(res: NextApiResponse, data: T, statusCode?: number): void
```

#### Error Logging

- Structured error logging with context
- Configurable loggers (console, file, external services)
- Error categorization (operational vs programming errors)

### 4. Async Operations (`src/lib/asyncHandler.ts`)

#### Retry Logic

```typescript
// Execute with retry and exponential backoff
withRetry<T>(operation: () => Promise<T>, config?: Partial<RetryConfig>): Promise<AsyncResult<T>>

// Execute with timeout
withTimeout<T>(operation: Promise<T>, timeoutMs: number): Promise<T>

// Execute with fallback
withFallback<T>(primary: () => Promise<T>, fallback: () => Promise<T>): Promise<T>
```

#### Circuit Breaker Pattern

```typescript
export class CircuitBreaker {
  async execute<T>(operation: () => Promise<T>): Promise<T>;
  getState(): string;
  reset(): void;
}
```

### 5. React Components

#### Error Boundary (`src/components/ErrorBoundary.tsx`)

- Catches JavaScript errors in React components
- Provides fallback UI when errors occur
- Logs errors for debugging
- Higher-order component wrapper available

#### Toast Notifications (`src/components/Toast.tsx`)

- Success, error, warning, and info notifications
- Auto-dismiss with configurable duration
- Persistent notifications for critical messages
- Animated entrance/exit effects

#### Form Fields (`src/components/FormField.tsx`)

- Input validation with real-time error display
- Support for text, email, password, number, textarea, and select
- Error styling and user feedback
- Form validation hook for complex forms

### 6. Middleware (`src/middleware/errorHandler.ts`)

#### API Route Middleware

```typescript
// Error handling wrapper
withErrorHandler(handler: Function): Function

// Rate limiting
withRateLimit(handler: Function, options: RateLimitOptions): Function

// Authentication
withAuth(handler: Function, options: AuthOptions): Function

// Input validation
withValidation<T>(handler: Function, validator: Function): Function

// CORS handling
withCORS(handler: Function, options: CORSOptions): Function
```

## Usage Examples

### 1. API Route Error Handling

```typescript
import { sendErrorResponse, sendSuccessResponse } from "@/lib/errorHandler";
import { ValidationError, AuthenticationError } from "@/types/errors";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Validate input
    if (!req.body.email) {
      return sendErrorResponse(
        res,
        new ValidationError("Email is required", "email")
      );
    }

    // Process request
    const result = await processRequest(req.body);

    return sendSuccessResponse(res, result);
  } catch (error) {
    // Re-throw to be handled by global error handler
    throw error;
  }
}
```

### 2. Form Validation

```typescript
import { useFormValidation } from "@/components/FormField";
import { validators } from "@/lib/validation";

const validationSchema = {
  email: [validators.required, validators.email],
  password: [validators.required, validators.minLength(8, "Password")],
};

const { data, errors, setFieldValue, validateAll } = useFormValidation(
  { email: "", password: "" },
  validationSchema
);
```

### 3. Toast Notifications

```typescript
import { useToastHelpers } from "@/components/Toast";

const { success, error, warning, info } = useToastHelpers();

// Show success message
success("Login successful", "Welcome back!");

// Show error message
error("Login failed", "Invalid credentials");

// Show persistent warning
persistent("warning", "Session expiring", "Please save your work");
```

### 4. Async Operations with Retry

```typescript
import { withRetry, withTimeout } from "@/lib/asyncHandler";

// Retry with custom configuration
const result = await withRetry(() => fetchData(), {
  maxAttempts: 5,
  delayMs: 2000,
});

// Execute with timeout
const data = await withTimeout(
  fetchData(),
  10000 // 10 seconds
);
```

### 5. Error Boundary Usage

```typescript
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Wrap component with error boundary
<ErrorBoundary
  fallback={<CustomErrorUI />}
  onError={(error, errorInfo) => {
    // Log to external service
    logErrorToService(error, errorInfo);
  }}
>
  <MyComponent />
</ErrorBoundary>;

// Higher-order component
const SafeComponent = withErrorBoundary(MyComponent);
```

## Best Practices

### 1. Error Classification

- Use appropriate error classes for different scenarios
- Distinguish between operational and programming errors
- Provide meaningful error messages for users

### 2. Validation

- Validate input at multiple levels (client, API, database)
- Use consistent validation schemas
- Provide immediate feedback for validation errors

### 3. Error Logging

- Log errors with sufficient context
- Include request details, user information, and stack traces
- Use structured logging for better analysis

### 4. User Experience

- Show user-friendly error messages
- Provide actionable feedback
- Use toast notifications for non-blocking errors
- Implement graceful degradation

### 5. Security

- Don't expose sensitive information in error messages
- Sanitize error details in production
- Log security-related errors separately

## Configuration

### Environment Variables

```bash
# JWT secrets for authentication
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Error logging
LOG_LEVEL=error
LOG_SERVICE_URL=https://logs.example.com

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Custom Loggers

```typescript
import { setGlobalLogger } from "@/lib/errorHandler";

// Custom logger implementation
const customLogger = {
  error: (message: string, error?: Error, context?: Record<string, any>) => {
    // Send to external service
    sendToLogService(message, error, context);
  },
  warn: (message: string, context?: Record<string, any>) => {
    console.warn(message, context);
  },
  info: (message: string, context?: Record<string, any>) => {
    console.info(message, context);
  },
};

setGlobalLogger(customLogger);
```

## Monitoring and Debugging

### 1. Error Tracking

- Monitor error rates and patterns
- Set up alerts for critical errors
- Track user impact of errors

### 2. Performance Monitoring

- Monitor API response times
- Track retry attempts and success rates
- Monitor circuit breaker states

### 3. User Analytics

- Track form validation errors
- Monitor user error recovery patterns
- Analyze error impact on user experience

## Testing

### 1. Unit Tests

```typescript
import { ValidationError } from "@/types/errors";

describe("ValidationError", () => {
  it("should create error with correct properties", () => {
    const error = new ValidationError("Invalid email", "email", "test");

    expect(error.message).toBe("Invalid email");
    expect(error.field).toBe("email");
    expect(error.statusCode).toBe(400);
  });
});
```

### 2. Integration Tests

```typescript
describe("API Error Handling", () => {
  it("should return proper error response for validation errors", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "invalid-email" });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });
});
```

### 3. Error Boundary Tests

```typescript
describe("ErrorBoundary", () => {
  it("should catch errors and render fallback UI", () => {
    const wrapper = mount(
      <ErrorBoundary>
        <ComponentThatThrows />
      </ErrorBoundary>
    );

    expect(wrapper.text()).toContain("Something went wrong");
  });
});
```

## Troubleshooting

### Common Issues

1. **Errors not being caught**: Ensure error boundaries are properly configured
2. **Validation errors not showing**: Check if form fields are marked as touched
3. **Toast notifications not appearing**: Verify ToastProvider is wrapping the app
4. **API errors not formatted**: Check if sendErrorResponse is being used

### Debug Mode

Enable debug mode to see detailed error information:

```typescript
// In development
process.env.NODE_ENV = "development";

// Error boundaries will show detailed error information
// Validation errors will include field names and values
// API responses will include stack traces
```

## Future Enhancements

1. **Error Reporting Service Integration**: Sentry, LogRocket, etc.
2. **Advanced Retry Strategies**: Jitter, exponential backoff variations
3. **Error Recovery Mechanisms**: Automatic retry with user notification
4. **Performance Metrics**: Error impact on Core Web Vitals
5. **Machine Learning**: Predictive error prevention

## Conclusion

This error handling system provides a robust foundation for building reliable applications. It handles errors gracefully at multiple levels while providing excellent user experience and developer debugging capabilities.

For questions or contributions, please refer to the project's contributing guidelines.
