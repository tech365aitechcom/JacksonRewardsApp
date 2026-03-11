import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jackson.app',
  appName: 'Jackson',
  webDir: 'out',
  server: {
    allowNavigation: [
      'http://94.249.151.176:4001',
       'jackson-3c4bc.firebaseapp.com', // Your Firebase Auth Domain
      // 'identitytoolkit.googleapis.com',
       '*.googleapis.com',             // Google APIs
      '*.firebasejs.com',
      // '*.google.com'              // Firebase JS library
    ],
    cleartext: true
  },
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ["phone"],
    },
    SplashScreen: {
      // launchAutoHide: false — JS calls SplashScreen.hide() when ready (industry standard).
      // The plugin keeps the native splash visible indefinitely until we call hide().
      launchAutoHide: false,
      // launchFadeOutDuration: smooth cross-fade when the splash is dismissed (matches iOS feel).
      launchFadeOutDuration: 400,
      backgroundColor: "#000000",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    Geolocation: {
      // Android-specific location configuration
      android: {
        enableHighAccuracy: true,
        timeout: 30000, // 30 seconds timeout for Android
        maximumAge: 0, // Force fresh location
        requireAltitude: false,
        requireSpeed: false,
        requireHeading: false,
        // Android location provider settings
        locationProvider: "gps", // Use GPS as primary location source
        // Enable background location if needed
        enableBackgroundLocation: false,
        // Android-specific permission handling
        permissionRationale: "This app needs location access to provide location-based features and rewards.",
        // Android location accuracy settings
        locationAccuracy: "high", // high, medium, low
        // Android location update settings
        locationUpdateInterval: 10000, // 10 seconds
        fastestLocationUpdateInterval: 5000, // 5 seconds
      },
      // iOS-specific location configuration
      ios: {
        enableHighAccuracy: true,
        timeout: 15000, // 15 seconds timeout for iOS
        maximumAge: 0,
        requireAltitude: false,
        requireSpeed: false,
        requireHeading: false,
        // iOS location authorization
        authorizationLevel: "whenInUse", // whenInUse, always
        // iOS location accuracy
        locationAccuracy: "best",
      }
    },
    Stripe: {
      publishableKey: "pk_test_51SBUH3PJY1SybSwUCQEkb8qM1YDRgbKitMYFGpRDcryE1AFDPIHoI4ovL61hITqeaoFeNgDkFlZ5tBV7rFv7B3U0008lDMyvfe", // Add your Stripe publishable key here
      stripeAccount: "", // Optional: Add if using Connect
      setReturnUrlSchemeOnAndroid: true,
      setReturnUrlSchemeOnIOS: true,
      returnUrlScheme: "jacksonrewards", // Use payment success scheme
    },
    BiometricAuth: {
      // iOS Face ID usage description
      ios: {
        NSFaceIDUsageDescription: "Jackson app uses Face ID to securely verify your identity and protect your account."
      },
      // Android biometric configuration
      android: {
        biometricPromptTitle: "Face Verification",
        biometricPromptSubtitle: "Complete face verification to secure your account",
        biometricPromptNegativeButtonText: "Cancel"
      }
    },
  },
};

export default config;