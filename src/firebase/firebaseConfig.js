import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey:            "AIzaSyCpVOykYV_Kqz_dh0IebLq-2zgIlsznbeE",
  authDomain:        "resildas-fa23f.firebaseapp.com",
  projectId:         "resildas-fa23f",
  storageBucket:     "resildas-fa23f.firebasestorage.app",
  messagingSenderId: "457786417462",
  appId:             "1:457786417462:web:7323db03879c36c3c5d397",
  measurementId:     "G-XLEKFCZ7WV"
}

const app = initializeApp(firebaseConfig)

export const auth           = getAuth(app)
export const db             = getFirestore(app)
export const storage        = getStorage(app)
export const googleProvider = new GoogleAuthProvider()

export default app