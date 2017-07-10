package com.vaenow.appupdate.android;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.Message;
import android.support.v4.content.FileProvider;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.ProgressBar;

import java.io.File;
import java.util.HashMap;

/**
 * Created by LuoWen on 2015/12/14.
 */
public class DownloadHandler extends Handler {
    private String TAG = "DownloadHandler";

    private Context mContext;
    /* 更新进度条 */
    private ProgressBar mProgress;
    /* 记录进度条数量 */
    private int progress;
    /* 下载保存路径 */
    private String mSavePath;
    /* 保存解析的XML信息 */
    private HashMap<String, String> mHashMap;
    private MsgHelper msgHelper;
    private AlertDialog mDownloadDialog;

    public DownloadHandler(Context mContext, ProgressBar mProgress, AlertDialog mDownloadDialog, String mSavePath, HashMap<String, String> mHashMap) {
        this.msgHelper = new MsgHelper(mContext.getPackageName(), mContext.getResources());
        this.mDownloadDialog = mDownloadDialog;
        this.mContext = mContext;
        this.mProgress = mProgress;
        this.mSavePath = mSavePath;
        this.mHashMap = mHashMap;
    }

    public void handleMessage(Message msg) {
        switch (msg.what) {
            // 正在下载
            case Constants.DOWNLOAD:
                // 设置进度条位置
                mProgress.setProgress(progress);
                break;
            case Constants.DOWNLOAD_FINISH:
                updateMsgDialog();
                // 安装文件
                installApk();
                break;
            default:
                break;
        }
    }

    public void updateProgress(int progress) {
        this.progress = progress;
    }

    public void updateMsgDialog() {
        mDownloadDialog.getButton(DialogInterface.BUTTON_NEGATIVE).setVisibility(View.GONE); //Update in background
        mDownloadDialog.getButton(DialogInterface.BUTTON_NEUTRAL).setVisibility(View.VISIBLE); //Install Manually
        mDownloadDialog.getButton(DialogInterface.BUTTON_POSITIVE).setVisibility(View.VISIBLE); //Download Again

        mDownloadDialog.setTitle(msgHelper.getString(MsgHelper.DOWNLOAD_COMPLETE_TITLE));
        mDownloadDialog.getButton(DialogInterface.BUTTON_NEUTRAL)
                .setOnClickListener(downloadCompleteOnClick);
    }

    private OnClickListener downloadCompleteOnClick = new OnClickListener() {
        @Override
        public void onClick(View view) {
            installApk();
        }
    };

    /**
     * 安装APK文件
     */
    private void installApk() {

        File file = new File(mSavePath, mHashMap.get("name"));
        Intent intent = new Intent(Intent.ACTION_VIEW);

        //判读版本是否在7.0以上
        if (Build.VERSION.SDK_INT >= 24) {
            //provider authorities
            String packageName = mContext.getPackageName();
            Uri apkUri = FileProvider.getUriForFile(mContext, packageName + ".fileprovider", file);
            //Granting Temporary Permissions to a URI
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            intent.setDataAndType(apkUri, "application/vnd.android.package-archive");
        } else {
            intent.setDataAndType(Uri.fromFile(file), "application/vnd.android.package-archive");
        }

        mContext.startActivity(intent);
        //close dialog ?
        mDownloadDialog.dismiss();
    }
}
