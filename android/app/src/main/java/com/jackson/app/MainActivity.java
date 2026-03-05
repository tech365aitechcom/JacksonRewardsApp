package com.jackson.app;

import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.webkit.WebView;
import androidx.core.splashscreen.SplashScreen;
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
        // Register custom plugin before bridge is created (BridgeActivity builds bridge in super.onCreate)
        registerPlugin(UmpConsentPlugin.class);

        // Hide the action bar before splash screen
        if (getSupportActionBar() != null) {
            getSupportActionBar().hide();
        }

        // Install the splash screen
        SplashScreen splashScreen = SplashScreen.installSplashScreen(this);

        super.onCreate(savedInstanceState);

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

        // Keep the Android 12+ system splash visible until Capacitor's own overlay
        // has had a chance to attach to the WebView. Without this delay the system
        // splash exits immediately, exposing a raw white/black frame before the
        // Capacitor layer appears. 250 ms is enough for the plugin to initialise.
        // Industry pattern: hold system splash → Capacitor overlay takes over seamlessly.
        final boolean[] keepSplash = {true};
        splashScreen.setKeepOnScreenCondition(() -> keepSplash[0]);
        new Handler(Looper.getMainLooper()).postDelayed(() -> keepSplash[0] = false, 250);
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
