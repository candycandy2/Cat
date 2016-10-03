package org.apache.cordova.qsecurity;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Tomcat.JW.Xu on 2016/6/23.
 */
public class SecurityList {
    private static SecurityList mSecurityList;
    private List<String> navList = new ArrayList<String>();
    private List<String> intList = new ArrayList<String>();
    private List<String> reqList = new ArrayList<String>();
    private int level;
    private SecurityList() {
    }
    public static SecurityList getInstance() {
        if (mSecurityList == null) {
            mSecurityList = new SecurityList();
        }
        return mSecurityList;
    }
    public List<String> getNavigationList() {
        return this.navList;
    }
    public void setNavigationList(List<String> navList) {
        this.navList = navList;
    }
    public List<String> getIntentList() {
        return this.intList;
    }
    public void setIntentList(List<String> intList) {
        this.intList = intList;
    }
    public List<String> getRequestList() {
        return this.reqList;
    }
    public void setRequestList(List<String> reqList) {
        this.reqList = reqList;
    }
    public int getLevel() {
        return this.level;
    }
    public void setLevel(int level) {
        this.level = level;
    }
}
