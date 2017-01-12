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
        public JPushProxy()
        {
            string appKey = ConfigurationManager.AppSettings.Get("jpush_app_key");
            string masterSecret = ConfigurationManager.AppSettings.Get("jpush_master_secret");
            mPushClient = new JPushClient(appKey, masterSecret);
            mDeviceClient = new DeviceClient(appKey, masterSecret);
        }

        public bool RemoveTag(string registration_id, string tag)
        {
            HashSet<String> tagHashsetRemove = new HashSet<string>();
            tagHashsetRemove.Add(tag);
            DefaultResult result = null;
            try {
                result = mDeviceClient.updateDevice(registration_id,
                                                       "",
                                                       "",
                                                       new HashSet<string>(),
                                                       tagHashsetRemove
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

            if(result.isResultOK())
            {
                return true;
            }

            return false;
        }

        public static HashSet<String> TAG_HASHSET_REMOVE = new HashSet<string> { TAG_NO };

    }
}
