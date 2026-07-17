import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('swiftride_user')
    if (stored) {
      setUser(JSON.parse(stored))
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    const u = { ...userData, lastLogin: new Date().toISOString() }
    setUser(u)
    localStorage.setItem('swiftride_user', JSON.stringify(u))
    return true
  }

  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem('swiftride_users') || '[]')
    const exists = users.find(u => u.email === userData.email)
    if (exists) return { error: 'Email already registered' }

    const newUser = {
      id: Date.now().toString(),
      ...userData,
      role: 'user',
      createdAt: new Date().toISOString(),
      avatar: null,
    }
    users.push(newUser)
    localStorage.setItem('swiftride_users', JSON.stringify(users))
    login(newUser)
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('swiftride_user')
  }

  const updateProfile = (updates) => {
    const updated = { ...user, ...updates }
    setUser(updated)
    localStorage.setItem('swiftride_user', JSON.stringify(updated))

    // also update in users list
    const users = JSON.parse(localStorage.getItem('swiftride_users') || '[]')
    const idx = users.findIndex(u => u.id === user.id)
    if (idx !== -1) {
      users[idx] = updated
      localStorage.setItem('swiftride_users', JSON.stringify(users))
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
