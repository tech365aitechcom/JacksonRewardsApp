import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyATHdTHrDds-jPOjKeZF3hbBjtz3q_BiOU",
  authDomain: "jackson-3c4bc.firebaseapp.com",
  projectId: "jackson-3c4bc",
  storageBucket: "jackson-3c4bc.firebasestorage.app",
  messagingSenderId: "278411577622",
  appId: "1:278411577622:web:8a8d3513f02e8fcc4c2837",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

let confirmationResult = null;
let recaptchaVerifier = null;

export const sendFirebaseOtp = async (phoneNumber) => {
  try {
    const containerId = "recaptcha-container";
    const container = document.getElementById(containerId);

    if (!container) {
      throw new Error("Missing <div id='recaptcha-container'></div>");
    }

    // 🔴 CLEAR OLD VERIFIER (important on retries)
    if (recaptchaVerifier) {
      recaptchaVerifier.clear();
      recaptchaVerifier = null;
    }

    // ✅ USE INVISIBLE CAPTCHA FOR PRODUCTION
    recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: "invisible", // 👈 CHANGED TO INVISIBLE
      callback: () => {
        console.log("reCAPTCHA solved");
      },
      "expired-callback": () => {
        console.warn("reCAPTCHA expired");
      },
    });

    await recaptchaVerifier.render();

    confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      recaptchaVerifier
    );

    console.log("✅ OTP sent to:", phoneNumber);
    return true;
  } catch (error) {
    console.error("❌ SMS Error:", error.code, error.message);
    throw error;
  }
};

export const verifyFirebaseOtp = async (otp) => {
  if (!confirmationResult) {
    throw new Error("No OTP session found. Please resend OTP.");
  }

  const result = await confirmationResult.confirm(otp);
  return await result.user.getIdToken();
};
