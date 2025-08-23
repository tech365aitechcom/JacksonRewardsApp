"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";

export default function AppLoader() {
  const router = useRouter();
  const [loadingMessage, setLoadingMessage] = useState("Loading App...");

  useEffect(() => {
    const storedUserString = localStorage.getItem("user");
    const hasCompletedOnboarding =
      localStorage.getItem("onboardingComplete") === "true";

    if (storedUserString) {
      try {
        const user = JSON.parse(storedUserString);
        if (user && user.firstName) {
          setLoadingMessage(`Welcome back, ${user.firstName}!`);
        } else {
          setLoadingMessage("Resuming your session...");
        }
      } catch (e) {
        setLoadingMessage("Resuming your session...");
      }
    } else if (hasCompletedOnboarding) {
      router.replace("/login");
    } else {
      router.replace("/welcome");
    }
  }, [router]);

  return <LoadingScreen message={loadingMessage} />;
}
