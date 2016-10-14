package org.apache.cordova.qlogin;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.ConfigXmlParser;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.xmlpull.v1.XmlPullParser;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.net.Uri;

import java.util.List;

public class QLoginPlugin extends CordovaPlugin {
    private static final String LOG_TAG = "QLoginPlugin";
	private static Activity cordovaActivity;
    private static QLoginPlugin instance;
    private String functionName;
    private String schemeData;

	public QLoginPlugin() {
        instance = this;
    }

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        cordovaActivity = cordova.getActivity();
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if(action.equals("openCertificationPage")){
            try {
				functionName = args.getString(0);
                Intent intent = new Intent().setClass(cordova.getActivity(), Class.forName("org.apache.cordova.qlogin.LoginActivity"));
				intent.putExtra("uuid", args.getString(1));
                this.cordova.startActivityForResult(this, intent, 1);

                PluginResult mPlugin = new PluginResult(PluginResult.Status.NO_RESULT);
                mPlugin.setKeepCallback(true);
                callbackContext.sendPluginResult(mPlugin);
                callbackContext.success("success");
            } catch (ClassNotFoundException e) {
                e.printStackTrace();
                return false;
            }
        }else if(action.equals("getLoginData")){
            String loginData = LoginInfo.getInstance().getloginData();
            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK,loginData));
        }else if(action.equals("openAppCheckScheme")){
            Intent intent = cordova.getActivity().getIntent();
            Uri myURI = intent.getData();
            schemeData = "" + myURI;
            openAppCheckScheme();
        }
        return true;
    }
	
	@Override
    public void onActivityResult(int requestCode, int resultCode, Intent intent){
        switch (resultCode) { //resultCode为回传的标记，我在第二个Activity中回传的是RESULT_OK
            case Activity.RESULT_OK:
                Bundle b=intent.getExtras();
                String data=b.getString("data");//data即为回传的值

                String format = functionName+"(%s);";
                final String js = String.format(format, data);

                cordovaActivity.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        instance.webView.loadUrl("javascript:" + js);
                    }
                });

                break;
            default:
                break;
        }
    }

    @JavascriptInterface
    public void openAppCheckScheme() {
        cordovaActivity.runOnUiThread(new Runnable() {
            public void run() {
                instance.webView.loadUrl("javascript:" + "handleOpenURL('" + schemeData + "');");
            }
        });
    }
}
