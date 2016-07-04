/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
*/

package org.apache.cordova.qsecurity;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.ConfigXmlParser;
import org.apache.cordova.PluginResult;
import org.apache.cordova.Whitelist;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.xmlpull.v1.XmlPullParser;

import android.content.Context;

import java.util.List;

public class QSecurityPlugin extends CordovaPlugin {
    private static final String LOG_TAG = "QSecurityPlugin";
    private Whitelist allowedNavigations;
    private Whitelist allowedIntents;
    private Whitelist allowedRequests;

    // Used when instantiated via reflection by PluginManager
    public QSecurityPlugin() {
    }
    // These can be used by embedders to allow Java-configuration of whitelists.
    public QSecurityPlugin(Context context) {
        this(new Whitelist(), new Whitelist(), null);
        new CustomConfigXmlParser().parse(context);
    }
    public QSecurityPlugin(XmlPullParser xmlParser) {
        this(new Whitelist(), new Whitelist(), null);
        new CustomConfigXmlParser().parse(xmlParser);
    }
    public QSecurityPlugin(Whitelist allowedNavigations, Whitelist allowedIntents, Whitelist allowedRequests) {
        if (allowedRequests == null) {
            allowedRequests = new Whitelist();
            allowedRequests.addWhiteListEntry("file:///*", false);
            allowedRequests.addWhiteListEntry("data:*", false);
        }
        this.allowedNavigations = allowedNavigations;
        this.allowedIntents = allowedIntents;
        this.allowedRequests = allowedRequests;
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if(action.equals("setWhitelist")){
            this.setSecurityList(args,callbackContext);
            return true;
        }else if (action.equals("resumeCheckLevel")){
            this.resumeCheckLevel(callbackContext);
            return true;
        }else if(action.equals("changeLevel")){
            this.changeLevel(args,callbackContext);
            return true;
        }
        return false;
    }

    public void setSecurityList(final JSONArray data, final CallbackContext callbackContext) throws JSONException {
        try{
            final JSONObject option = data.getJSONObject(0);
            String level = option.getString("level");
            JSONArray navigations = option.getJSONArray("Navigations");
            JSONArray intents = option.getJSONArray("Intents");
            JSONArray requests = option.getJSONArray("Requests");

            List<String> navList = SecurityList.getInstance().getNavigationList();
            List<String> reqList = SecurityList.getInstance().getRequestList();
            List<String> intList = SecurityList.getInstance().getIntentList();
            String url;

            for(int i = 0; i < navigations.length(); i++) {
                url = navigations.getString(i);
                //String url = item.getString("value");
                if(navList==null || !navList.contains(url)){
                    allowedNavigations.addWhiteListEntry(url, false);
                    navList.add(url);
                }
            }

            for(int i = 0; i < intents.length(); i++) {
                url = intents.getString(i);
                //String url = item.getString("value");
                if(intList==null || !intList.contains(url)){
                    allowedIntents.addWhiteListEntry(url, false);
                    intList.add(url);
                }
            }

            for(int i = 0; i < requests.length(); i++) {
                url = requests.getString(i);
                //String url = item.getString("value");
                if(reqList==null || !reqList.contains(url)){
                    allowedRequests.addWhiteListEntry(url, false);
                    reqList.add(url);
                }
            }

            SecurityList.getInstance().setLevel(Integer.parseInt(level));
            SecurityList.getInstance().setNavigationList(navList);
            SecurityList.getInstance().setRequestList(reqList);
            SecurityList.getInstance().setIntentList(intList);

            JSONArray jsonResult = new JSONArray();
            jsonResult.put(0, "Set SecurityList");
            jsonResult.put(1, level);

            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK,jsonResult));
        }catch (JSONException e){
            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR,"Set SecurityList"));
        }


    }

    public void changeLevel(final JSONArray data, final CallbackContext callbackContext) throws JSONException {
        try{
            final JSONObject option = data.getJSONObject(0);
            String level = option.getString("level");
            SecurityList.getInstance().setLevel(Integer.parseInt(level));

            JSONArray jsonResult = new JSONArray();
            jsonResult.put(0, "Set Level ");
            jsonResult.put(1, level);

            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK,jsonResult));
        }catch (JSONException e){
            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR,"Set Level "));
        }
    }

    public void resumeCheckLevel(final CallbackContext callbackContext){
        int level = SecurityList.getInstance().getLevel();
        callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK,level));
    }

    @Override
    public void pluginInitialize() {
        if (allowedNavigations == null) {
            allowedNavigations = new Whitelist();
            allowedIntents = new Whitelist();
            allowedRequests = new Whitelist();
            new CustomConfigXmlParser().parse(webView.getContext());
        }
    }

    private class CustomConfigXmlParser extends ConfigXmlParser {
        @Override
        public void handleStartTag(XmlPullParser xml) {
            String strNode = xml.getName();
            if (strNode.equals("content")) {
                String startPage = xml.getAttributeValue(null, "src");
                allowedNavigations.addWhiteListEntry(startPage, false);
                //allowedNavigations.addWhiteListEntry("*://*.baidu.com/*", false);
                //allowedNavigations.addWhiteListEntry("https://*/*", false);
                //allowedNavigations.addWhiteListEntry("data:*", false);
                //allowedRequests.addWhiteListEntry("http://*/*", false);
                //allowedRequests.addWhiteListEntry("https://*/*", false);
                //allowedIntents.addWhiteListEntry("tel:*", false);
                //allowedIntents.addWhiteListEntry("sms:*", false);
                //allowedIntents.addWhiteListEntry("mailto:*", false);
                //allowedIntents.addWhiteListEntry("geo:*", false);
            }
            if(strNode.equals("apiUrl")){
                String apiUrl = xml.getAttributeValue(null, "href");
                List<String> reqList = SecurityList.getInstance().getRequestList();
                reqList.add(apiUrl);
                allowedRequests.addWhiteListEntry(apiUrl, false);
            }
        }
        @Override
        public void handleEndTag(XmlPullParser xml) {
        }
    }

    @Override
    public Boolean shouldAllowNavigation(String url) {
        if (allowedNavigations.isUrlWhiteListed(url)) {
            return true;
        }
        return null; // Default policy
    }

    @Override
    public Boolean shouldAllowRequest(String url) {
        if (Boolean.TRUE == shouldAllowNavigation(url)) {
            return true;
        }
        if (allowedRequests.isUrlWhiteListed(url)) {
            return true;
        }
        return null; // Default policy
    }

    @Override
    public Boolean shouldOpenExternalUrl(String url) {
        if (allowedIntents.isUrlWhiteListed(url)) {
            return true;
        }
        return null; // Default policy
    }

    public Whitelist getAllowedNavigations() {
        return allowedNavigations;
    }

    public void setAllowedNavigations(Whitelist allowedNavigations) {
        this.allowedNavigations = allowedNavigations;
    }

    public Whitelist getAllowedIntents() {
        return allowedIntents;
    }

    public void setAllowedIntents(Whitelist allowedIntents) {
        this.allowedIntents = allowedIntents;
    }

    public Whitelist getAllowedRequests() {
        return allowedRequests;
    }

    public void setAllowedRequests(Whitelist allowedRequests) {
        this.allowedRequests = allowedRequests;
    }
}
