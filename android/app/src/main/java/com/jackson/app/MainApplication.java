package com.jackson.app;

import android.app.Application;
import android.util.Log;

import com.adjust.sdk.Adjust;
import com.adjust.sdk.AdjustConfig;
import com.adjust.sdk.LogLevel;

public class MainApplication extends Application {

    private static final String TAG = "AdjustNative";
    private static final String ADJUST_APP_TOKEN = "sa992du19dkw";

    @Override
    public void onCreate() {
        super.onCreate();
        initAdjust();
    }

    private void initAdjust() {
        try {
            String environment = AdjustConfig.ENVIRONMENT_PRODUCTION;

            AdjustConfig config = new AdjustConfig(this, ADJUST_APP_TOKEN, environment);

            config.setLogLevel(LogLevel.WARN);

            Adjust.initSdk(config);

            Log.d(TAG, "[Adjust Native] ✅ SDK initialized — token: " + ADJUST_APP_TOKEN + " | env: " + environment);
        } catch (Exception e) {
            Log.e(TAG, "[Adjust Native] ❌ Init failed: " + e.getMessage());
        }
    }
}
