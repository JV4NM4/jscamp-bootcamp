import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  
  return context
}

export function AuthProvider ({ children }) { 
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () => {
    setIsLoggedIn(true)
  };
  
  const logout = () => {
    setIsLoggedIn(false)
  };

  const value = {
    isLoggedIn,
    login,
    logout
  };

  return <AuthContext value={value}>
    {children}
  </AuthContext>
}