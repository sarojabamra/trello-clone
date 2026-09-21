import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase/firebase";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const syncUserFromFirebase = (firebaseUser) => {
  if (!firebaseUser) return null;

  return {
    id: firebaseUser.uid,
    uid: firebaseUser.uid,
    name:
      firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
    email: firebaseUser.email,
    photoURL: firebaseUser.photoURL,
    provider: firebaseUser.providerData?.[0]?.providerId || "password",
  };
};

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(syncUserFromFirebase(currentUser));
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    setUser(syncUserFromFirebase(result.user));
    return result.user;
  };

  const handleEmailSignup = async ({ name, email, password }) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    if (name) {
      await updateProfile(result.user, { displayName: name });
    }

    const nextUser = syncUserFromFirebase(result.user);
    setUser(nextUser);
    return result.user;
  };

  const handleEmailLogin = async ({ email, password }) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    setUser(syncUserFromFirebase(result.user));
    return result.user;
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const value = {
    user,
    authLoading,
    handleGoogleLogin,
    handleEmailSignup,
    handleEmailLogin,
    handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
