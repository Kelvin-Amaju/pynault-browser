package com.pynault.browser;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override public void onRequestPermissionsResult(int requestCode,String[] permissions,int[] grantResults) {
        super.onRequestPermissionsResult(requestCode,permissions,grantResults);
        NativePagesPlugin.completeSystemPermission(requestCode,grantResults);
    }
    @Override public void onCreate(Bundle savedInstanceState) {
        registerPlugin(NativePagesPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
