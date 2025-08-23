"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { login, signup, getProfile } from "@/lib/api";
import useOnboardingStore from "@/stores/useOnboardingStore";
import LoadingScreen from "@/components/LoadingScreen";
import { App } from "@capacitor/app";

const AuthContext = createContext({});

export function useAuth() {
  return useContext(AuthContext);
}

const PROTECTED_ROUTES = [
  "/homepage",
  "/myprofile",
  "/edit-profile",
  "/games",
  "/permissions",
  "/location",
];
const PUBLIC_ONLY_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/select-age",
  "/onboarding/select-gender",
  "/onboarding/game-preferences",
  "/onboarding/game-styles",
  "/onboarding/player-type",
  "/welcome",
];

export function AuthProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const listener = App.addListener("appUrlOpen", (event) => {
      const url = new URL(event.url);
      const token = url.searchParams.get("token");

      if (url.hostname === "auth" && url.pathname === "/callback" && token) {
        console.log("Token received via deep link. Finalizing login...");
        handleSocialAuthCallback(token).then((result) => {
          if (result.ok) {
            router.replace("/homepage");
          } else {
            router.replace("/login");
          }
        });
      }
    });
    return () => {
      listener.remove();
    };
  }, [router]);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("user");
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } else {
      }
    } catch (error) {
      console.error("❌ Failed to load session from storage", error);
      localStorage.clear();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoading) {
      console.log("🛡️ [Gatekeeper] Waiting for session to load...");
      return;
    }

    const isAuthenticated = !!user;
    console.log(
      `🛡️ [Gatekeeper] Running check: isAuthenticated=${isAuthenticated}, pathname=${pathname}`
    );

    const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
      pathname.startsWith(route)
    );
    const isPublicOnlyRoute = PUBLIC_ONLY_ROUTES.some((route) =>
      pathname.startsWith(route)
    );
    const isWelcomeRoute = pathname === "/";

    // Rule: Logged-in users should not see public or welcome pages.
    if (isAuthenticated && (isPublicOnlyRoute || isWelcomeRoute)) {
      console.log(
        "🛡️ [Gatekeeper] Redirecting authenticated user from public page to /homepage"
      );
      router.replace("/homepage");
    }

    // Rule: Logged-out users should not see protected pages.
    if (!isAuthenticated && isProtectedRoute) {
      console.log(
        "🛡️ [Gatekeeper] Redirecting unauthenticated user from protected page to /login"
      );
      router.replace("/login");
    }
  }, [isLoading, user, pathname, router]); // Dependency array is key

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
      localStorage.setItem("onboardingComplete", "true");
      console.log("✅ User + Token + OnboardingFlag saved to localStorage");
    } catch (err) {
      console.error("❌ Failed to save to localStorage", err);
    }

    return { ok: true, user };
  };

  const signIn = async (emailOrMobile, password) => {
    console.log("🔐 signIn called with:", { emailOrMobile, password });
    try {
      const data = await login(emailOrMobile, password);
      console.log("📩 login API response:", data);
      return handleAuthSuccess(data);
    } catch (error) {
      console.error("❌ signIn failed:", error);
      return { ok: false, error: error.body || { error: error.message } };
    } finally {
      console.log("⏹️ signIn finished, isLoading =", false);
    }
  };

  const signUpAndSignIn = async (signupData) => {
    console.log("🆕 signUpAndSignIn called with:", signupData);
    try {
      const data = await signup(signupData);
      console.log("📩 signup API response:", data);
      useOnboardingStore.getState().resetOnboarding();
      console.log("🔄 Onboarding store reset");
      return handleAuthSuccess(data);
    } catch (error) {
      console.error("❌ signUpAndSignIn failed:", error);
      return { ok: false, error: error.body || { error: error.message } };
    } finally {
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

  const handleSocialAuthCallback = async (token) => {
    setIsLoading(true);
    try {
      setToken(token);
      localStorage.setItem("authToken", token);
      const userProfile = await getProfile(token);
      console.log("📩 Fetched user profile:", userProfile);
      return handleAuthSuccess({ token, user: userProfile });
    } catch (error) {
      console.error("❌ handleSocialAuthCallback failed:", error);
      signOut();
      return { ok: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserInContext = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem("user", JSON.stringify(newUserData));
  };

  if (isLoading) {
    return <LoadingScreen message="Loading App..." />;
  }

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signUpAndSignIn,
    signOut,
    updateUserInContext,
    handleSocialAuthCallback,
  };

  console.log("📡 [AuthProvider] Context Value:", {
    ...value,
    user: value.user ? "..." : null,
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
