import { useState } from 'react'

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  pagination?: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

interface UseApiOptions {
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
}

export function useApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const request = async <T = any>(
    url: string,
    options: RequestInit = {},
    apiOptions: UseApiOptions = {}
  ): Promise<ApiResponse<T> | null> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(url, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Request failed')
      }

      if (apiOptions.onSuccess) {
        apiOptions.onSuccess(data)
      }

      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      
      if (apiOptions.onError) {
        apiOptions.onError(errorMessage)
      }

      return null
    } finally {
      setLoading(false)
    }
  }

  const get = <T = any>(url: string, options: UseApiOptions = {}) =>
    request<T>(url, { method: 'GET' }, options)

  const post = <T = any>(url: string, data: any, options: UseApiOptions = {}) =>
    request<T>(url, {
      method: 'POST',
      body: JSON.stringify(data),
    }, options)

  const put = <T = any>(url: string, data: any, options: UseApiOptions = {}) =>
    request<T>(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, options)

  const del = <T = any>(url: string, options: UseApiOptions = {}) =>
    request<T>(url, { method: 'DELETE' }, options)

  return {
    loading,
    error,
    request,
    get,
    post,
    put,
    delete: del,
  }
}