"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: "admin" | "manager" | "employee" | "viewer"
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  hasRole: (roles: string[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        // In a real app, this would check localStorage, cookies, or make an API call
        const savedUser = localStorage.getItem("user")
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
      } catch (error) {
        console.error("Auth check failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock authentication logic
      if (email === "admin@example.com" && password === "password") {
        const mockUser: User = {
          id: "1",
          email: "admin@example.com",
          firstName: "John",
          lastName: "Doe",
          role: "admin",
          avatar: "/avatars/01.png"
        }
        
        setUser(mockUser)
        localStorage.setItem("user", JSON.stringify(mockUser))
        return true
      } else if (email === "manager@example.com" && password === "password") {
        const mockUser: User = {
          id: "2",
          email: "manager@example.com",
          firstName: "Jane",
          lastName: "Smith",
          role: "manager",
          avatar: "/avatars/02.png"
        }
        
        setUser(mockUser)
        localStorage.setItem("user", JSON.stringify(mockUser))
        return true
      } else if (email === "employee@example.com" && password === "password") {
        const mockUser: User = {
          id: "3",
          email: "employee@example.com",
          firstName: "Bob",
          lastName: "Johnson",
          role: "employee",
          avatar: "/avatars/03.png"
        }
        
        setUser(mockUser)
        localStorage.setItem("user", JSON.stringify(mockUser))
        return true
      } else if (email === "viewer@example.com" && password === "password") {
        const mockUser: User = {
          id: "4",
          email: "viewer@example.com",
          firstName: "Alice",
          lastName: "Brown",
          role: "viewer",
          avatar: "/avatars/04.png"
        }
        
        setUser(mockUser)
        localStorage.setItem("user", JSON.stringify(mockUser))
        return true
      }
      
      return false
    } catch (error) {
      console.error("Login failed:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/auth/login")
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  const hasRole = (roles: string[]): boolean => {
    return user ? roles.includes(user.role) : false
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        updateUser,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}