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
    private String tSchema;

    @Override
    public void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);
        setContentView(R.layout.login_activity);
        ActionBar actionBar = getActionBar();
        actionBar.hide();

        //取得URL所帶進來的Intent物件
        Intent tIntent = this.getIntent();
        Uri myURI = tIntent.getData();
        if(myURI!=null){
            tSchema = myURI.getQueryParameter("Name");
        }

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
            if(tSchema==null){
                finish();
            }else{
                Uri uri = Uri.parse(tSchema+"://Login?Parameters="+data);
                Intent intent = new Intent(Intent.ACTION_VIEW,uri);
				intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP );
                startActivity(intent);
            }
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
