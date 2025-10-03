import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null)
  const [role, setRole] = useState(null)

  useEffect(() => {
    try {
      const t = localStorage.getItem('token')
      const r = localStorage.getItem('role')
      if (t) setToken(t)
      if (r) setRole(r)
    } catch {}
  }, [])

  const value = useMemo(() => ({
    token,
    role,
    isAuthenticated: Boolean(token),
    login: ({ token: t, role: r }) => {
      setToken(t)
      setRole(r)
      try {
        localStorage.setItem('token', t)
        localStorage.setItem('role', r)
      } catch {}
    },
    logout: () => {
      setToken(null)
      setRole(null)
      try {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
      } catch {}
    }
  }), [token, role])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}


