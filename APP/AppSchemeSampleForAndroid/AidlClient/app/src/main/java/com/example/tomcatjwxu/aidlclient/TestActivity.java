package com.example.tomcatjwxu.aidlclient;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.widget.TextView;

public class TestActivity extends Activity{

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        boolean islogin = false;

        //取得要顯示參數的TextView物件
        TextView tView = (TextView) findViewById(R.id.textView1);

        //取得URL所帶進來的Intent物件
        Intent tIntent = this.getIntent();
        //取得Schema
        String tSchema = tIntent.getScheme();
        //取得URL
        Uri myURI = tIntent.getData();
        if (myURI != null) {
            //取得URL中的Query String參數
            String tValue = myURI.getQueryParameter("Parameters");

            tView.setText(tValue);
        }

        /*if(!islogin){
            Uri uri = Uri.parse("qplayapp://");
            Intent intent = new Intent(Intent.ACTION_VIEW,uri);
            startActivity(intent);
        }*/


    }

}
