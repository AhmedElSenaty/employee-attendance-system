package com.Attendance;

import android.os.Bundle;
import android.webkit.WebSettings;

import com.getcapacitor.BridgeActivity;


public class MainActivity extends BridgeActivity {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Allow HTTPS page (https://localhost) to load HTTP API (http://192.168.1.7:3000)
    this.bridge.getWebView()
      .getSettings()
      .setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
  }
}