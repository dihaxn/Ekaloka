import { ApiResponse, ErrorResponse, SuccessResponse } from '../types/errors'

export async function apiFetch<T = any>(
  path: string, 
  opts: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(path, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...opts.headers,
      },
      ...opts,
    })

    if (!res.ok) {
      // Try to parse error response
      let errorData: any
      try {
        errorData = await res.json()
      } catch {
        // If JSON parsing fails, use text
        errorData = { error: await res.text() || `HTTP ${res.status}` }
      }

      // Return structured error response
      return {
        ok: false,
        data: null,
        error: {
          message: errorData.error || `HTTP ${res.status}: ${res.statusText}`,
          code: `HTTP_${res.status}`,
          statusCode: res.status,
          timestamp: new Date().toISOString(),
          path: path
        }
      }
    }

    const data = await res.json()
    return data
  } catch (error) {
    console.error('API fetch error:', error)
    
    // Handle different types of fetch errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        ok: false,
        data: null,
        error: {
          message: 'Network error. Please check your connection.',
          code: 'NETWORK_ERROR',
          statusCode: 0,
          timestamp: new Date().toISOString(),
          path: path
        }
      }
    }
    
    if (error instanceof SyntaxError) {
      return {
        ok: false,
        data: null,
        error: {
          message: 'Invalid response format from server.',
          code: 'PARSE_ERROR',
          statusCode: 0,
          timestamp: new Date().toISOString(),
          path: path
        }
      }
    }

    return {
      ok: false,
      data: null,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        code: 'UNKNOWN_ERROR',
        statusCode: 0,
        timestamp: new Date().toISOString(),
        path: path
      }
    }
  }
}

export async function apiPost<T = any>(
  path: string,
  data: any,
  opts: RequestInit = {}
): Promise<ApiResponse<T>> {
  return apiFetch<T>(path, {
    method: 'POST',
    body: JSON.stringify(data),
    ...opts,
  })
}

export async function apiGet<T = any>(
  path: string,
  opts: RequestInit = {}
): Promise<ApiResponse<T>> {
  return apiFetch<T>(path, {
    method: 'GET',
    ...opts,
  })
}

export async function apiPut<T = any>(
  path: string,
  data: any,
  opts: RequestInit = {}
): Promise<ApiResponse<T>> {
  return apiFetch<T>(path, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...opts,
  })
}

export async function apiDelete<T = any>(
  path: string,
  opts: RequestInit = {}
): Promise<ApiResponse<T>> {
  return apiFetch<T>(path, {
    method: 'DELETE',
    ...opts,
  })
}

// Helper function to check if response is successful
export function isSuccessResponse<T>(response: ApiResponse<T>): response is SuccessResponse<T> {
  return response.ok === true
}

// Helper function to check if response is an error
export function isErrorResponse<T>(response: ApiResponse<T>): response is ErrorResponse {
  return response.ok === false
}

// Helper function to extract error message
export function getErrorMessage(response: ApiResponse<any>): string {
  if (isErrorResponse(response)) {
    return response.error.message || 'An error occurred'
  }
  return 'No error'
}
