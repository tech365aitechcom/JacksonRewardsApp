import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "./firebase";

let confirmationResult = null;

export const sendFirebaseOtp = async (phoneNumber) => {
  if (typeof window === "undefined") return;

  // Clear old ReCAPTCHA to avoid "container already has content" error
  if (window.recaptchaVerifier) {
    window.recaptchaVerifier.clear();
    window.recaptchaVerifier = null;
  }

  window.recaptchaVerifier = new RecaptchaVerifier(auth, "firebase-recaptcha", {
    size: "invisible",
  });

  confirmationResult = await signInWithPhoneNumber(
    auth,
    phoneNumber,
    window.recaptchaVerifier
  );
};

export const verifyFirebaseOtp = async (otp) => {
  if (!confirmationResult) throw new Error("Session expired. Resend OTP.");
  const result = await confirmationResult.confirm(otp);
  return await result.user.getIdToken(); // Return token for Node.js
};
