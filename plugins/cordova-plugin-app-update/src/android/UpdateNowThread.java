package com.vaenow.appupdate.android;

import android.content.Context;
import android.content.pm.PackageManager.NameNotFoundException;
import android.os.Handler;
import org.apache.cordova.LOG;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.List;


/**
 * Created by Alan on 2017/6/9.
 */
public class UpdateNowThread implements Runnable {
    private String TAG = "UpdateNowThread";

    /* 保存解析的XML信息 */
    HashMap<String, String> mHashMap;
    private Context mContext;
    private List<Version> queue;
    private String packageName;
    private String updateXmlUrl;
    private Handler mHandler;

    private void setMHashMap(HashMap<String, String> mHashMap) {
        this.mHashMap = mHashMap;
    }

    public HashMap<String, String> getMHashMap() {
        return mHashMap;
    }

    public UpdateNowThread(Context mContext, Handler mHandler, List<Version> queue, String packageName, String updateXmlUrl) {
        this.mContext = mContext;
        this.queue = queue;
        this.packageName = packageName;
        this.updateXmlUrl = updateXmlUrl;
        this.mHandler = mHandler;
    }

    @Override
    public void run() {
        //int versionCodeLocal = getVersionCodeLocal(mContext); // 获取当前软件版本
        //int versionCodeRemote = getVersionCodeRemote();  //获取服务器当前软件版本

        //queue.clear(); //ensure the queue is empty
        //queue.add(new Version(versionCodeLocal, versionCodeRemote));

        //if (versionCodeLocal == 0 || versionCodeRemote == 0) {
        //    mHandler.sendEmptyMessage(Constants.VERSION_RESOLVE_FAIL);
        //} else {
            mHandler.sendEmptyMessage(Constants.DOWNLOAD_CLICK_START);
        //}
    }

}