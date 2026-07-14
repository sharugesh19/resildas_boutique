import { useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth'
import { auth, googleProvider } from '../firebase/firebaseConfig'
import Loader from '../components/common/Loader'
import { AuthContext } from './AuthContextObject'

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password)

  const register = async (email, password, displayName) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    if (displayName) {
      await updateProfile(cred.user, { displayName })
    }
    return cred
  }

  const loginWithGoogle = () => signInWithPopup(auth, googleProvider)

  const logout = () => signOut(auth)

  const resetPassword = (email) => sendPasswordResetEmail(auth, email)

  const value = {
    user,
    loading,
    isLoggedIn: !!user,
    login,
    register,
    loginWithGoogle,
    logout,
    resetPassword,
  }

  if (loading) return <Loader />

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}