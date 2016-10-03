package org.apache.cordova.qlogin;

import org.json.JSONArray;

import java.util.ArrayList;
import java.util.List;

public class LoginInfo {
    private static LoginInfo mLoginInfo;
    private String loginData;
    private LoginInfo() {
    }
    public static LoginInfo getInstance() {
        if (mLoginInfo == null) {
            mLoginInfo = new LoginInfo();
        }
        return mLoginInfo;
    }
    public String getloginData() {
        return this.loginData;
    }
    public void setloginData(String loginData) {
        this.loginData = loginData;
    }
}
