package com.jackson.app;

import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.graphics.Rect;
import android.view.View;
import android.view.ViewTreeObserver;
import android.view.WindowManager;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "SoftInputPlugin")
public class SoftInputPlugin extends Plugin {

    private ViewTreeObserver.OnGlobalLayoutListener keyboardListener;

    @PluginMethod
    public void setMode(PluginCall call) {
        String mode = call.getString("mode", "pan");
        getActivity().runOnUiThread(() -> {
            if ("resize".equals(mode)) {
                // "resize" mode: Android resizes the WebView viewport to fit above
                // the keyboard. The bottom-sheet at bottom:0 / max-height:100dvh
                // naturally sits flush with the keyboard top.
                getActivity().getWindow().setSoftInputMode(
                    WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
                stopKeyboardHeightListener();
            } else {
                // "pan" mode: let Android pan the window. No JS height tracking needed.
                getActivity().getWindow().setSoftInputMode(
                    WindowManager.LayoutParams.SOFT_INPUT_ADJUST_PAN);
                stopKeyboardHeightListener();
            }
            // Keep window background solid so any residual gap is seamless.
            getActivity().getWindow().setBackgroundDrawable(
                new ColorDrawable(Color.parseColor("#272052")));
        });
        call.resolve();
    }

    // Watches actual keyboard height via layout changes and emits to JS.
    // Works reliably with adjustPan on all Android versions.
    private void startKeyboardHeightListener() {
        View rootView = getActivity().getWindow().getDecorView().getRootView();
        stopKeyboardHeightListener();
        keyboardListener = () -> {
            Rect rect = new Rect();
            rootView.getWindowVisibleDisplayFrame(rect);
            int screenHeight = rootView.getHeight();
            int keyboardHeight = screenHeight - rect.bottom;
            JSObject data = new JSObject();
            data.put("keyboardHeight", Math.max(0, keyboardHeight));
            notifyListeners("keyboardHeightChanged", data);
        };
        rootView.getViewTreeObserver().addOnGlobalLayoutListener(keyboardListener);
    }

    private void stopKeyboardHeightListener() {
        if (keyboardListener != null) {
            View rootView = getActivity().getWindow().getDecorView().getRootView();
            rootView.getViewTreeObserver().removeOnGlobalLayoutListener(keyboardListener);
            keyboardListener = null;
            // Emit 0 so JS resets keyboard height
            JSObject data = new JSObject();
            data.put("keyboardHeight", 0);
            notifyListeners("keyboardHeightChanged", data);
        }
    }
}
