package com.jackson.app;

import android.util.Log;

import com.adjust.sdk.Adjust;
import com.adjust.sdk.AdjustEvent;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "AdjustPlugin")
public class AdjustPlugin extends Plugin {

    private static final String TAG = "AdjustNative";

    /**
     * Track a custom Adjust event from JavaScript.
     * Call from JS: AdjustNative.trackEvent({ token, revenue?, currency? })
     */
    @PluginMethod
    public void trackEvent(PluginCall call) {
        String token = call.getString("token");

        if (token == null || token.isEmpty()) {
            call.reject("token is required");
            return;
        }

        try {
            AdjustEvent event = new AdjustEvent(token);

            Double revenue = call.getDouble("revenue");
            if (revenue != null) {
                String currency = call.getString("currency", "USD");
                event.setRevenue(revenue, currency);
                Log.d(TAG, "[Adjust Native] 📤 trackEvent — token: " + token + " | revenue: $" + revenue + " " + currency);
            } else {
                Log.d(TAG, "[Adjust Native] 📤 trackEvent — token: " + token);
            }

            Adjust.trackEvent(event);
            Log.d(TAG, "[Adjust Native] ✅ Event sent — token: " + token);

            call.resolve();
        } catch (Exception e) {
            Log.e(TAG, "[Adjust Native] ❌ trackEvent failed — token: " + token + " | " + e.getMessage());
            call.reject("trackEvent failed: " + e.getMessage());
        }
    }

    /**
     * Check if Adjust SDK is ready (always true if MainApplication initialized it).
     */
    @PluginMethod
    public void isInitialized(PluginCall call) {
        JSObject result = new JSObject();
        result.put("initialized", true);
        call.resolve(result);
    }
}
