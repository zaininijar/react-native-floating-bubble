package com.floatingbubble;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.PixelFormat;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.widget.ImageView;
import androidx.core.content.ContextCompat;
import com.facebook.react.bridge.*;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class FloatingBubbleModule extends ReactContextBaseJavaModule {

    private WindowManager windowManager;
    private View floatingView;
    private WindowManager.LayoutParams layoutParams;
    private boolean isVisible = false;

    private static final String NAME = "FloatingBubble";
    private static final int OVERLAY_PERMISSION_REQUEST_CODE = 1001;

    public FloatingBubbleModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void show(ReadableMap config, Promise promise) {
        try {
            Activity activity = getCurrentActivity();
            if (activity == null) {
                promise.reject("NO_ACTIVITY", "No current activity");
                return;
            }

            if (!hasOverlayPermission()) {
                promise.reject("NO_PERMISSION", "Overlay permission not granted");
                return;
            }

            if (isVisible) {
                hide(new Promise() {
                    @Override
                    public void resolve(Object value) {}
                    @Override
                    public void reject(String code, String message) {}
                    @Override
                    public void reject(String code, String message, Throwable throwable) {}
                    @Override
                    public void reject(String code, Throwable throwable) {}
                    @Override
                    public void reject(Throwable throwable) {}
                    @Override
                    public void reject(String code, WritableMap userInfo) {}
                    @Override
                    public void reject(String code, Throwable throwable, WritableMap userInfo) {}
                    @Override
                    public void reject(String code, String message, WritableMap userInfo) {}
                    @Override
                    public void reject(String code, String message, Throwable throwable, WritableMap userInfo) {}
                });
            }

            createFloatingBubble(config);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("SHOW_ERROR", e.getMessage(), e);
        }
    }

    @ReactMethod
    public void hide(Promise promise) {
        try {
            if (floatingView != null && windowManager != null) {
                windowManager.removeView(floatingView);
                floatingView = null;
                isVisible = false;
            }
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("HIDE_ERROR", e.getMessage(), e);
        }
    }

    @ReactMethod
    public void isVisible(Promise promise) {
        promise.resolve(isVisible);
    }

    @ReactMethod
    public void updatePosition(ReadableMap position, Promise promise) {
        try {
            if (floatingView != null && layoutParams != null && windowManager != null) {
                layoutParams.x = position.getInt("x");
                layoutParams.y = position.getInt("y");
                windowManager.updateViewLayout(floatingView, layoutParams);
                promise.resolve(true);
            } else {
                promise.reject("NOT_VISIBLE", "Floating bubble is not visible");
            }
        } catch (Exception e) {
            promise.reject("UPDATE_POSITION_ERROR", e.getMessage(), e);
        }
    }

    @ReactMethod
    public void getPosition(Promise promise) {
        try {
            if (layoutParams != null && isVisible) {
                WritableMap position = Arguments.createMap();
                position.putInt("x", layoutParams.x);
                position.putInt("y", layoutParams.y);
                promise.resolve(position);
            } else {
                promise.resolve(null);
            }
        } catch (Exception e) {
            promise.reject("GET_POSITION_ERROR", e.getMessage(), e);
        }
    }

    @ReactMethod
    public void updateConfig(ReadableMap config, Promise promise) {
        try {
            if (isVisible) {
                hide(new Promise() {
                    @Override
                    public void resolve(Object value) {}
                    @Override
                    public void reject(String code, String message) {}
                    @Override
                    public void reject(String code, String message, Throwable throwable) {}
                    @Override
                    public void reject(String code, Throwable throwable) {}
                    @Override
                    public void reject(Throwable throwable) {}
                    @Override
                    public void reject(String code, WritableMap userInfo) {}
                    @Override
                    public void reject(String code, Throwable throwable, WritableMap userInfo) {}
                    @Override
                    public void reject(String code, String message, WritableMap userInfo) {}
                    @Override
                    public void reject(String code, String message, Throwable throwable, WritableMap userInfo) {}
                });
                show(config, promise);
            } else {
                promise.resolve(true);
            }
        } catch (Exception e) {
            promise.reject("UPDATE_CONFIG_ERROR", e.getMessage(), e);
        }
    }

    @ReactMethod
    public void requestOverlayPermission(Promise promise) {
        try {
            if (hasOverlayPermission()) {
                promise.resolve(true);
                return;
            }

            Activity activity = getCurrentActivity();
            if (activity == null) {
                promise.reject("NO_ACTIVITY", "No current activity");
                return;
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                Intent intent = new Intent(
                    Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                    Uri.parse("package:" + getReactApplicationContext().getPackageName())
                );
                activity.startActivityForResult(intent, OVERLAY_PERMISSION_REQUEST_CODE);
                promise.resolve(true);
            } else {
                promise.resolve(true);
            }
        } catch (Exception e) {
            promise.reject("REQUEST_PERMISSION_ERROR", e.getMessage(), e);
        }
    }

    @ReactMethod
    public void hasOverlayPermission(Promise promise) {
        promise.resolve(hasOverlayPermission());
    }

    private boolean hasOverlayPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            return Settings.canDrawOverlays(getReactApplicationContext());
        } else {
            return true;
        }
    }

    private void createFloatingBubble(ReadableMap config) {
        Context context = getReactApplicationContext();
        windowManager = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);

        // Create floating view
        floatingView = new ImageView(context);
        ImageView imageView = (ImageView) floatingView;

        // Set default or configured properties
        int size = config.hasKey("size") ? config.getInt("size") : 100;
        int backgroundColor;
        if (config.hasKey("backgroundColor")) {
            backgroundColor = android.graphics.Color.parseColor(config.getString("backgroundColor"));
        } else {
            backgroundColor = ContextCompat.getColor(context, android.R.color.holo_blue_bright);
        }

        imageView.setBackgroundColor(backgroundColor);
        imageView.setScaleType(ImageView.ScaleType.CENTER_CROP);

        // Set layout parameters
        int windowType;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            windowType = WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY;
        } else {
            windowType = WindowManager.LayoutParams.TYPE_PHONE;
        }

        layoutParams = new WindowManager.LayoutParams(
            size,
            size,
            windowType,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
            PixelFormat.TRANSLUCENT
        );

        layoutParams.gravity = Gravity.TOP | Gravity.START;
        layoutParams.x = config.hasKey("x") ? config.getInt("x") : 0;
        layoutParams.y = config.hasKey("y") ? config.getInt("y") : 100;

        // Add touch listener for dragging
        if (!config.hasKey("draggable") || config.getBoolean("draggable")) {
            addDragListener();
        }

        // Add to window manager
        windowManager.addView(floatingView, layoutParams);
        isVisible = true;
    }

    private void addDragListener() {
        floatingView.setOnTouchListener(new View.OnTouchListener() {
            private int initialX = 0;
            private int initialY = 0;
            private float initialTouchX = 0f;
            private float initialTouchY = 0f;

            @Override
            public boolean onTouch(View v, MotionEvent event) {
                switch (event.getAction()) {
                    case MotionEvent.ACTION_DOWN:
                        initialX = layoutParams.x;
                        initialY = layoutParams.y;
                        initialTouchX = event.getRawX();
                        initialTouchY = event.getRawY();
                        return true;
                    case MotionEvent.ACTION_MOVE:
                        layoutParams.x = initialX + (int) (event.getRawX() - initialTouchX);
                        layoutParams.y = initialY + (int) (event.getRawY() - initialTouchY);
                        windowManager.updateViewLayout(floatingView, layoutParams);
                        return true;
                    case MotionEvent.ACTION_UP:
                        // Send position update event to React Native
                        WritableMap params = Arguments.createMap();
                        params.putInt("x", layoutParams.x);
                        params.putInt("y", layoutParams.y);
                        sendEvent("onPositionChanged", params);
                        return true;
                }
                return false;
            }
        });
    }

    private void sendEvent(String eventName, WritableMap params) {
        getReactApplicationContext()
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params);
    }

    @Override
    public void onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy();
        if (isVisible) {
            hide(new Promise() {
                @Override
                public void resolve(Object value) {}
                @Override
                public void reject(String code, String message) {}
                @Override
                public void reject(String code, String message, Throwable throwable) {}
                @Override
                public void reject(String code, Throwable throwable) {}
                @Override
                public void reject(Throwable throwable) {}
                @Override
                public void reject(String code, WritableMap userInfo) {}
                @Override
                public void reject(String code, Throwable throwable, WritableMap userInfo) {}
                @Override
                public void reject(String code, String message, WritableMap userInfo) {}
                @Override
                public void reject(String code, String message, Throwable throwable, WritableMap userInfo) {}
            });
        }
    }
}