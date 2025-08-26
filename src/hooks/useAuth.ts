import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { apiPost } from '../lib/api'
import { AuthenticationError, ValidationError } from '../types/errors'

export interface User {
  id: string
  uid: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  getUser: () => User | null
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is already logged in (e.g., from localStorage or session)
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('user')
        setError('Failed to restore user session')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiPost('/api/auth/login', { email, password })
      
      if (response.ok && response.data) {
        const { user: userData, accessToken } = response.data
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('accessToken', accessToken)
        return true
      } else {
        // Handle different types of errors
        if (response.error) {
          if (response.error.includes('Invalid credentials')) {
            setError('Invalid email or password')
          } else if (response.error.includes('required')) {
            setError('Please fill in all required fields')
          } else if (response.error.includes('email')) {
            setError('Please enter a valid email address')
          } else {
            setError(response.error)
          }
        } else {
          setError('Login failed. Please try again.')
        }
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      
      // Handle specific error types
      if (error instanceof AuthenticationError) {
        setError(error.message)
      } else if (error instanceof ValidationError) {
        setError(error.message)
      } else if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          setError('Network error. Please check your connection.')
        } else {
          setError('An unexpected error occurred. Please try again.')
        }
      } else {
        setError('Login failed. Please try again.')
      }
      
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setError(null)
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
  }

  const getUser = (): User | null => {
    return user
  }

  const clearError = () => {
    setError(null)
  }

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    logout,
    getUser,
    clearError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
