package org.apache.cordova.qlogin;

import android.app.ActionBar;
import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebView;

import com.qplay.appqplaytest.R;//need to change by project, example: com.BenQ.QPlay.R;
import org.apache.cordova.ConfigXmlParser;
import org.xmlpull.v1.XmlPullParser;

public class LoginActivity extends Activity {
    private WebView webview;
    private String serverUrl;
    private String tSchema;
    private String uuid;
    private String function;

    @Override
    public void onCreate(Bundle savedInstanceState){
        super.onCreate(savedInstanceState);
        setContentView(R.layout.login_activity);
        ActionBar actionBar = getActionBar();
        actionBar.hide();

        Intent tIntent = this.getIntent();
        Bundle b=tIntent.getExtras();
        if(b!=null){
            uuid=b.getString("uuid");
        }
        Uri myURI = tIntent.getData();
        if(myURI!=null){
            tSchema = myURI.getQueryParameter("Name");
            uuid = myURI.getQueryParameter("uuid");
            function = myURI.getQueryParameter("Function");
        }

        webview = (WebView) findViewById(R.id.WebViewDetail);
        webview.getSettings().setJavaScriptEnabled(true);
        webview.setWebChromeClient(new WebChromeClient());
        webview.setLongClickable(false);
        webview.addJavascriptInterface(new LoginJavaScriptInterface(), "LoginWebview");
        new CustomConfigXmlParser().parse(webview.getContext());
        webview.getSettings().setDomStorageEnabled(true);
        webview.getSettings().setDatabaseEnabled(true);
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.KITKAT) {
            String databasePath = this.getApplicationContext().getDir("database", webview.getContext().MODE_PRIVATE).getPath();
            webview.getSettings().setDatabasePath(databasePath);
        }
        webview.loadUrl(serverUrl);
    }

    final class LoginJavaScriptInterface {
        @JavascriptInterface
        public void loginResult(String data){
            LoginInfo.getInstance().setloginData(data);
            if(tSchema==null){
                Intent mIntent = new Intent();
                mIntent.putExtra("data", data);
                setResult(RESULT_OK, mIntent);
				finish();
            }else{
                Uri uri = Uri.parse(tSchema+"://Login?Parameters="+data+"&Function="+function);
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
				serverUrl = serverUrl + "?device_type=android&uuid=" + uuid;
            }
        }
        @Override
        public void handleEndTag(XmlPullParser xml) {
        }
    }
}
