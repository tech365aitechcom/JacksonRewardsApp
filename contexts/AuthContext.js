"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login, signup } from "@/lib/api";
import useOnboardingStore from "@/stores/useOnboardingStore";

const AuthContext = createContext({});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log(
      "🔄 [AuthProvider] useEffect running - checking localStorage..."
    );
    try {
      const storedToken = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("user");
      console.log("📦 Stored Token:", storedToken);
      console.log("📦 Stored User:", storedUser);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        console.log("✅ Session restored from storage:", {
          token: storedToken,
          user: JSON.parse(storedUser),
        });
      } else {
        console.log("⚠️ No session found in storage");
      }
    } catch (error) {
      console.error("❌ Failed to load session from storage", error);
      localStorage.clear(); // Clear corrupted storage
    } finally {
      setIsLoading(false);
      console.log("⏹️ Finished checking storage. isLoading =", false);
    }
  }, []);

  const handleAuthSuccess = (data) => {
    console.log("🔑 handleAuthSuccess called with:", data);
    const { token, user } = data;

    if (!token || !user) {
      console.warn("⚠️ Missing token or user in response!", { token, user });
    }

    setUser(user);
    setToken(token);

    try {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("authToken", token);
      console.log("✅ User + Token saved to localStorage");
    } catch (err) {
      console.error("❌ Failed to save to localStorage", err);
    }

    return { ok: true, user };
  };

  const signIn = async (emailOrMobile, password) => {
    console.log("🔐 signIn called with:", { emailOrMobile, password });
    setIsLoading(true);
    try {
      const data = await login(emailOrMobile, password);
      console.log("📩 login API response:", data);
      return handleAuthSuccess(data);
    } catch (error) {
      console.error("❌ signIn failed:", error);
      return { ok: false, error: error.message };
    } finally {
      setIsLoading(false);
      console.log("⏹️ signIn finished, isLoading =", false);
    }
  };

  const signUpAndSignIn = async (signupData) => {
    console.log("🆕 signUpAndSignIn called with:", signupData);
    setIsLoading(true);
    try {
      const data = await signup(signupData);
      console.log("📩 signup API response:", data);
      useOnboardingStore.getState().resetOnboarding();
      console.log("🔄 Onboarding store reset");
      return handleAuthSuccess(data);
    } catch (error) {
      console.error("❌ signUpAndSignIn failed:", error);
      return { ok: false, error: error.message };
    } finally {
      setIsLoading(false);
      console.log("⏹️ signUpAndSignIn finished, isLoading =", false);
    }
  };

  const signOut = () => {
    console.log("🚪 signOut called. Clearing session...");
    setUser(null);
    setToken(null);

    try {
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      console.log("🧹 Cleared user + token from localStorage");
    } catch (err) {
      console.error("❌ Failed to clear localStorage", err);
    }

    router.push("/login");
    console.log("➡️ Redirected to /login");
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signUpAndSignIn,
    signOut,
  };

  console.log("📡 [AuthProvider] Context Value:", value);

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}
