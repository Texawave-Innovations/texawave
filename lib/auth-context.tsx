"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged
} from "firebase/auth";
import { ref, get, set, update } from "firebase/database";
import { auth, db } from "./firebase";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "hr" | "user" | "guest";
  createdAt: string;
  lastLogin: string;
  active: boolean;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; role?: string; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to fetch or create user profile in RTDB
  const getOrCreateProfile = async (firebaseUser: User, customName?: string, customRole?: UserProfile["role"]): Promise<UserProfile> => {
    const profileRef = ref(db, `users/${firebaseUser.uid}`);
    const snapshot = await get(profileRef);
    const now = new Date().toISOString();

    if (snapshot.exists()) {
      // Update last login
      const existingData = snapshot.val();
      const updatedProfile = {
        ...existingData,
        lastLogin: now,
        active: true
      };
      await update(profileRef, { lastLogin: now, active: true });
      return updatedProfile as UserProfile;
    } else {
      // Create new profile
      const newProfile: UserProfile = {
        uid: firebaseUser.uid,
        name: customName || firebaseUser.displayName || (firebaseUser.isAnonymous ? "Guest Visitor" : firebaseUser.email?.split("@")[0] || "User"),
        email: firebaseUser.email || "anonymous@texawave.com",
        role: customRole || (firebaseUser.isAnonymous ? "guest" : "user"),
        createdAt: now,
        lastLogin: now,
        active: true
      };
      await set(profileRef, newProfile);
      return newProfile;
    }
  };

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          setUser(currentUser);
          const profile = await getOrCreateProfile(currentUser);
          setUserProfile(profile);
          // Set in localStorage for legacy compatibility
          localStorage.setItem("texawave_token", "firebase_jwt_placeholder");
          localStorage.setItem("texawave_role", profile.role);
          localStorage.setItem("texawave_username", profile.name);
        } else {
          setUser(null);
          setUserProfile(null);
          localStorage.removeItem("texawave_token");
          localStorage.removeItem("texawave_role");
          localStorage.removeItem("texawave_username");
        }
      } catch (err) {
        console.error("Auth state observer error:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Login handler with auto-seeding for demo accounts
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      let userCredential;
      try {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } catch (signInErr: any) {
        // Auto-seed default credentials if authentication fails and email matches admin/hr demos
        const isDemoAdmin = email.toLowerCase() === "admin@texawave.com" && password === "adminpassword";
        const isDemoHR = email.toLowerCase() === "hr@texawave.com" && password === "hrpassword";

        if (isDemoAdmin || isDemoHR) {
          // Register the new user
          userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const role: UserProfile["role"] = isDemoAdmin ? "admin" : "hr";
          const name = isDemoAdmin ? "Texawave Admin" : "Texawave HR";
          
          // Seed their profile directly in RTDB
          const profile = await getOrCreateProfile(userCredential.user, name, role);
          setUser(userCredential.user);
          setUserProfile(profile);

          localStorage.setItem("texawave_token", "firebase_jwt_placeholder");
          localStorage.setItem("texawave_role", role);
          localStorage.setItem("texawave_username", name);

          return { success: true, role };
        } else {
          throw signInErr;
        }
      }

      // If successful, retrieve profile
      const profile = await getOrCreateProfile(userCredential.user);
      setUser(userCredential.user);
      setUserProfile(profile);

      return { success: true, role: profile.role };
    } catch (error: any) {
      console.error("Login error:", error);
      return { success: false, error: error.message || "Failed to authenticate" };
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      setLoading(true);
      // Mark active status false in DB before signing out
      if (user && !user.isAnonymous) {
        const profileRef = ref(db, `users/${user.uid}`);
        await update(profileRef, { active: false });
      }
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
      localStorage.removeItem("texawave_token");
      localStorage.removeItem("texawave_role");
      localStorage.removeItem("texawave_username");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Reset Password handler
  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, login, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
