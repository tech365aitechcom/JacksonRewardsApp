package com.jackson.app;

import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import com.jackson.app.R;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.View;
import android.view.WindowInsetsController;
import android.webkit.WebView;
import androidx.core.splashscreen.SplashScreen;
import androidx.core.view.WindowCompat;
import com.adjust.sdk.Adjust;
import com.getcapacitor.BridgeActivity;
import com.google.android.ump.ConsentInformation;
import com.google.android.ump.ConsentRequestParameters;
import com.google.android.ump.FormError;
import com.google.android.ump.UserMessagingPlatform;

public class MainActivity extends BridgeActivity {

    private static final String TAG = "MainActivity";
    private ConsentInformation consentInformation;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // Register custom plugins before bridge is created (BridgeActivity builds bridge in super.onCreate)
        registerPlugin(UmpConsentPlugin.class);
        registerPlugin(AdjustPlugin.class);
        registerPlugin(SoftInputPlugin.class);

        // Hide the action bar before splash screen
        if (getSupportActionBar() != null) {
            getSupportActionBar().hide();
        }

        // Install the splash screen
        SplashScreen splashScreen = SplashScreen.installSplashScreen(this);

        super.onCreate(savedInstanceState);

        // Set window background to BLACK immediately so the window behind the Capacitor
        // splash overlay is always black (never the green splash_bg).
        getWindow().setBackgroundDrawable(new ColorDrawable(Color.BLACK));

        // On Android 15+ (API 35) setStatusBarColor/setNavigationBarColor are no-ops
        // because edge-to-edge is enforced. Use WindowInsetsController instead.
        // values-v35/styles.xml also opts out of edge-to-edge for the launch theme
        // so this ensures bars stay black once the theme switches to AppTheme.NoActionBar.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.VANILLA_ICE_CREAM) {
            // API 35+ — use WindowInsetsController to set bar appearance
            android.view.WindowInsetsController ctrl = getWindow().getInsetsController();
            if (ctrl != null) {
                ctrl.setSystemBarsAppearance(0,
                    android.view.WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS |
                    android.view.WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS);
            }
        } else {
            getWindow().setStatusBarColor(Color.BLACK);
            getWindow().setNavigationBarColor(Color.BLACK);
        }

        // Enable WebView debugging
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            WebView.setWebContentsDebuggingEnabled(true);
        }

        // Hide the action bar again after super.onCreate
        if (getSupportActionBar() != null) {
            getSupportActionBar().hide();
        }

        // Request AdMob/UMP consent at every app launch (required for legal ad serving)
        Log.d(TAG, "[AdMob/UMP] App launched – starting UMP consent flow (mob id in AndroidManifest)");
        runConsentFlow();

        // Configure WebView to hide scrollbars after initialization
        try {
            // Use post to ensure WebView is initialized
            getWindow().getDecorView().post(new Runnable() {
                @Override
                public void run() {
                    try {
                        WebView webView = getBridge().getWebView();
                        if (webView != null) {
                            // Completely disable horizontal and vertical scrollbars
                            webView.setVerticalScrollBarEnabled(false);
                            webView.setHorizontalScrollBarEnabled(false);
                            // Set scrollbar style to hide overlay
                            webView.setScrollBarStyle(WebView.SCROLLBARS_INSIDE_OVERLAY);
                            // Disable overscroll bounce effect (over-scroll mode)
                            webView.setOverScrollMode(WebView.OVER_SCROLL_NEVER);
                        }
                    } catch (Exception e) {
                        // Ignore if WebView is not available
                    }
                }
            });
        } catch (Exception e) {
            // Ignore if bridge is not available yet
        }

        // adjustPan is set in AndroidManifest — the WebView never resizes for the keyboard,
        // so the window background is never exposed. No keyboard-gap logic needed.
        final boolean[] keepSplash = {true};
        splashScreen.setKeepOnScreenCondition(() -> keepSplash[0]);
        new Handler(Looper.getMainLooper()).postDelayed(() -> {
            keepSplash[0] = false;
            // Transition: immersive splash → edge-to-edge app (bars visible, transparent).
            // This is the same pattern used by Instagram, WhatsApp, Spotify, etc.
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                // API 30+ — let system fit content within bars (not edge-to-edge).
                // setOverlaysWebView(false) in JS handles status bar spacing;
                // setDecorFitsSystemWindows(true) ensures nav bar spacing is also respected.
                WindowCompat.setDecorFitsSystemWindows(getWindow(), true);
                WindowInsetsController ctrl = getWindow().getInsetsController();
                if (ctrl != null) {
                    ctrl.show(android.view.WindowInsets.Type.systemBars());
                    ctrl.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_DEFAULT);
                    // 0 clears APPEARANCE_LIGHT_*: white icons for dark app background
                    ctrl.setSystemBarsAppearance(0, WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS);
                    ctrl.setSystemBarsAppearance(0, WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS);
                }
            } else {
                // API 21-29 — default fitting, system handles bar spacing
                getWindow().getDecorView().setSystemUiVisibility(
                    View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                );
            }
            // Replace splash window background with solid black NOW (Capacitor splash
            // still covers the screen at this point so the swap is invisible to the user).
            // This ensures the keyboard gap NEVER reveals the splash image at any point.
            getWindow().setBackgroundDrawable(new ColorDrawable(Color.BLACK));
            // On API 35+ setStatusBarColor/setNavigationBarColor are no-ops; bar
            // appearance is already set via WindowInsetsController above (APPEARANCE_LIGHT_*
            // cleared = white icons on dark background). For API < 35 set explicitly.
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.VANILLA_ICE_CREAM) {
                getWindow().setStatusBarColor(Color.BLACK);
                getWindow().setNavigationBarColor(Color.BLACK);
            }
        }, 400);
    }

    /** AdMob App ID from AndroidManifest (for debug logs). */
    private static final String ADMOB_APP_ID = "ca-app-pub-2800391972465887~5310386906";

    /**
     * Runs Google UMP consent flow at every app launch.
     * See: https://developers.google.com/admob/android/privacy
     */
    private void runConsentFlow() {
        Log.d(TAG, "[AdMob/UMP] ========== UMP consent flow started ==========");
        Log.d(TAG, "[AdMob/UMP] AdMob App ID (mob id): " + ADMOB_APP_ID);
        Log.d(TAG, "[AdMob/UMP] NOTE: If consent form never appears, this is NOT an app bug – it is AdMob/Google side: create a message in AdMob → Privacy & messaging for this app ID.");

        consentInformation = UserMessagingPlatform.getConsentInformation(this);
        ConsentRequestParameters params = new ConsentRequestParameters.Builder().build();

        Log.d(TAG, "[AdMob/UMP] Calling requestConsentInfoUpdate() (our code is correct; failure = Google/AdMob config)...");
        consentInformation.requestConsentInfoUpdate(
            this,
            params,
            () -> {
                Log.d(TAG, "[AdMob/UMP] requestConsentInfoUpdate() SUCCESS – consent info updated (AdMob side OK)");
                Log.d(TAG, "[AdMob/UMP] canRequestAds (before form): " + consentInformation.canRequestAds());
                Log.d(TAG, "[AdMob/UMP] Calling loadAndShowConsentFormIfRequired()...");
                // Consent info updated; load and show form if required
                UserMessagingPlatform.loadAndShowConsentFormIfRequired(this, formError -> {
                    if (formError != null) {
                        Log.w(TAG, "[AdMob/UMP] Consent form error (AdMob/Google side, not app bug): code=" + formError.getErrorCode() + " msg=" + formError.getMessage());
                    } else {
                        Log.d(TAG, "[AdMob/UMP] loadAndShowConsentFormIfRequired() completed (form shown or not required)");
                    }
                    boolean canRequest = consentInformation.canRequestAds();
                    Log.d(TAG, "[AdMob/UMP] Consent flow complete. canRequestAds=" + canRequest);
                    Log.d(TAG, "[AdMob/UMP] ========== UMP consent flow finished ==========");
                });
            },
            requestConsentError -> {
                int code = requestConsentError.getErrorCode();
                String msg = requestConsentError.getMessage();
                Log.w(TAG, "[AdMob/UMP] requestConsentInfoUpdate() FAILED: code=" + code + " msg=" + msg);
                Log.w(TAG, "[AdMob/UMP] >>> NOT AN APPLICATION ERROR: This is AdMob/Google (mob) side. Code 3 = no consent form configured in AdMob for this app ID. Fix: AdMob console → Privacy & messaging → add message for " + ADMOB_APP_ID);
                boolean canRequest = consentInformation.canRequestAds();
                Log.d(TAG, "[AdMob/UMP] canRequestAds (after error, may use cached): " + canRequest);
                Log.d(TAG, "[AdMob/UMP] ========== UMP consent flow finished (mob side error – form not shown) ==========");
            }
        );
    }

    @Override
    public void onResume() {
        super.onResume();
        Adjust.onResume();
    }

    @Override
    public void onPause() {
        super.onPause();
        Adjust.onPause();
    }

    /**
     * Call from Settings/Privacy to let users change consent (required when getPrivacyOptionsRequirementStatus() == REQUIRED).
     * Expose to JS via Capacitor plugin if you add a "Privacy options" button.
     */
    public void showPrivacyOptionsForm(Runnable onDismissed) {
        if (consentInformation == null) {
            consentInformation = UserMessagingPlatform.getConsentInformation(this);
        }
        UserMessagingPlatform.showPrivacyOptionsForm(this, formError -> {
            if (formError != null) {
                Log.w(TAG, "UMP privacy options form error: " + formError.getErrorCode() + " " + formError.getMessage());
            }
            if (onDismissed != null) onDismissed.run();
        });
    }
}
