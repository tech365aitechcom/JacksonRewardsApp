package com.jackson.app;

import android.util.Log;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.ump.ConsentInformation;
import com.google.android.ump.UserMessagingPlatform;

/**
 * Capacitor plugin for Google UMP consent.
 * Exposes canRequestAds() and showPrivacyOptionsForm() to the web layer.
 * See: https://developers.google.com/admob/android/privacy
 */
@CapacitorPlugin(name = "UmpConsent")
public class UmpConsentPlugin extends Plugin {

    private static final String TAG = "UmpConsentPlugin";

    @PluginMethod
    public void canRequestAds(PluginCall call) {
        try {
            Log.d(TAG, "[AdMob/UMP] canRequestAds() called from JS");
            ConsentInformation consentInformation =
                UserMessagingPlatform.getConsentInformation(getContext());
            boolean canRequest = consentInformation.canRequestAds();
            Log.d(TAG, "[AdMob/UMP] canRequestAds() result: " + canRequest);
            if (!canRequest) {
                Log.d(TAG, "[AdMob/UMP] canRequestAds=false – if form never showed, this is AdMob/Google (mob) config, not app error. Add message in AdMob → Privacy & messaging.");
            }
            JSObject ret = new JSObject();
            ret.put("value", canRequest);
            call.resolve(ret);
        } catch (Exception e) {
            Log.e(TAG, "[AdMob/UMP] canRequestAds failed", e);
            call.reject("canRequestAds failed: " + e.getMessage());
        }
    }

    @PluginMethod
    public void showPrivacyOptionsForm(PluginCall call) {
        try {
            Log.d(TAG, "[AdMob/UMP] showPrivacyOptionsForm() called from JS – showing privacy form");
            UserMessagingPlatform.showPrivacyOptionsForm(
                getActivity(),
                formError -> {
                    if (formError != null) {
                        Log.w(TAG, "[AdMob/UMP] Privacy options form error: " + formError.getErrorCode() + " " + formError.getMessage());
                    } else {
                        Log.d(TAG, "[AdMob/UMP] Privacy options form dismissed OK");
                    }
                    call.resolve();
                }
            );
        } catch (Exception e) {
            Log.e(TAG, "[AdMob/UMP] showPrivacyOptionsForm failed", e);
            call.reject("showPrivacyOptionsForm failed: " + e.getMessage());
        }
    }
}
