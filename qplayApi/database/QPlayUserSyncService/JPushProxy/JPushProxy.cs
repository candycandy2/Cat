using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using cn.jpush.api;
using System.Configuration;
using cn.jpush.api.push.mode;
using cn.jpush.api.device;
using cn.jpush.api.common;
using cn.jpush.api.common.resp;

namespace JPushProxy
{
    public class JPushProxy
    {
        private JPushClient mPushClient;
        private DeviceClient mDeviceClient;
        private PushPayload mPayload;

        private JPushLogger.JPushLogger mLogger;
        public JPushProxy()
        {
            string appKey = ConfigurationManager.AppSettings.Get("jpush_app_key");
            string masterSecret = ConfigurationManager.AppSettings.Get("jpush_master_secret");
            mPushClient = new JPushClient(appKey, masterSecret);
            mDeviceClient = new DeviceClient(appKey, masterSecret);
            mLogger = new JPushLogger.JPushLogger();
        }

        /*
        public bool RemoveTags(string registration_id, HashSet<String> tags)
        {
            DefaultResult result = null;
            try
            {
                result = mDeviceClient.updateDevice(registration_id,
                                                       "",
                                                       "",
                                                       new HashSet<string>(),
                                                       tags
                                                       );
            }
            catch (APIRequestException e)
            {
                return false;
            }
            catch (APIConnectionException e)
            {
                return false;
            }

            if (result != null && result.isResultOK())
            {
                return true;
            }

            return false;
        }

        public bool RemoveTag(string registration_id, string tag)
        {
            HashSet<String> tagHashsetRemove = new HashSet<string>();
            tagHashsetRemove.Add(tag);

            return RemoveTags(registration_id, tagHashsetRemove);
        }
        */

        public bool RemoveTag(string registration_id, string tag)
        {
            HashSet<String> usersToRemove = new HashSet<string>();
            usersToRemove.Add(registration_id);
            DefaultResult result = null;
            try
            {
                result = mDeviceClient.addRemoveDevicesFromTag(tag, new HashSet<string>(), usersToRemove);
            }
            catch (APIRequestException e)
            {
                return false;
            }
            catch (APIConnectionException e)
            {
                return false;
            }

            if (result != null && result.isResultOK())
            {
                return true;
            }

            return false;
        }
    }
}
