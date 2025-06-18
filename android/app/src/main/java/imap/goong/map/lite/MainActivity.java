package imap.goong.map.lite;

import com.facebook.react.ReactActivity;

import android.os.Bundle;

import android.content.Intent;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "GoongMap";
    }
    @Override
    protected void onCreate(Bundle savedInstanceState) {
       super.onCreate(null);
       handleIncomingIntent(getIntent());
    }

    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleIncomingIntent(intent);
    }

    private void handleIncomingIntent(Intent intent) {
        String action = intent.getAction();
        String type = intent.getType();

        if (Intent.ACTION_SEND.equals(action) && type != null) {
            if ("text/plain".equals(type)) {
                String sharedText = intent.getStringExtra(Intent.EXTRA_TEXT); 
                if (sharedText != null) {
                    sendIntentToReactNative(sharedText);
                }
            }
        }
    }

    private void sendIntentToReactNative(String sharedText) {
        ReactInstanceManager reactInstanceManager = getReactNativeHost().getReactInstanceManager();
        ReactContext reactContext = reactInstanceManager.getCurrentReactContext();

        if (reactContext != null) {
            WritableMap params = Arguments.createMap();
            params.putString("sharedText", sharedText);

            // Gửi sự kiện sang React Native thông qua DeviceEventEmitter
            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("onReceiveSharedText", params);
        } else {
            reactInstanceManager.addReactInstanceEventListener(new ReactInstanceManager.ReactInstanceEventListener() {
                @Override
                public void onReactContextInitialized(ReactContext initializedContext) {
                    WritableMap params = Arguments.createMap();
                    params.putString("sharedText", sharedText);

                    initializedContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("onReceiveSharedText", params);

                    reactInstanceManager.removeReactInstanceEventListener(this);
                }
            });
        }
    }

}
