package com.pynault.browser;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override public void onCreate(Bundle savedInstanceState) {
        registerPlugin(NativePagesPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
