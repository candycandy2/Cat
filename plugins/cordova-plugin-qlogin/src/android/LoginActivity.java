package org.apache.cordova.qlogin;

import android.app.ActionBar;
import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebView;

import com.example.hello.R;
import org.apache.cordova.ConfigXmlParser;
import org.xmlpull.v1.XmlPullParser;

public class LoginActivity extends Activity {
    private WebView webview;
    private String serverUrl;

    @Override
    public void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);
        setContentView(R.layout.login_activity);
        ActionBar actionBar = getActionBar();
        actionBar.hide();

        webview = (WebView) findViewById(R.id.WebViewDetail);
        webview.getSettings().setJavaScriptEnabled(true);
        webview.setWebChromeClient(new WebChromeClient());
        webview.setLongClickable(false);
        webview.addJavascriptInterface(new LoginJavaScriptInterface(), "LoginWebview");
        new CustomConfigXmlParser().parse(webview.getContext());
        webview.loadUrl(serverUrl);
    }

    final class LoginJavaScriptInterface {
        @JavascriptInterface
        public void loginResult(String data){
            LoginInfo.getInstance().setloginData(data);
            Uri uri = Uri.parse("yellowapp://Order?LoginInfo="+data);
            Intent intent = new Intent(Intent.ACTION_VIEW,uri);
            startActivity(intent);
        }
    }

    private class CustomConfigXmlParser extends ConfigXmlParser {
        @Override
        public void handleStartTag(XmlPullParser xml) {
            String strNode = xml.getName();
            if (strNode.equals("serverUrl")) {
                serverUrl = xml.getAttributeValue(null, "href");
            }
        }
        @Override
        public void handleEndTag(XmlPullParser xml) {
        }
    }
}
