function UpdateMessageListContent(messagecontent__, fromAPI) {

    //0. check orginal
    var orginalContent = JSON.parse(window.localStorage.getItem('messagecontent'));
    if (orginalContent !== null && orginalContent.content !== null) {
        if (fromAPI) {
            for (var messageindex = 0; messageindex < orginalContent.content.message_count; messageindex++) {
                var oldmessage = orginalContent.content.message_list[messageindex];
                if (oldmessage.message_type == "news") {
                    //find it in new content
                    for (var newmessageindex = 0; newmessageindex < messagecontent__.message_count; newmessageindex++) {
                        var newmessage = messagecontent__.message_list[newmessageindex];
                        if (newmessage.message_send_row_id == oldmessage.message_send_row_id) {
                            messagecontent__.message_list[newmessageindex] = oldmessage;
                            break;
                        }
                    }
                }
            }
        }
    }

    //1. keep to localStorage
    var jsonData = {};
    jsonData = {
        lastUpdateTime: new Date(),
        content: messagecontent__
    };
    window.localStorage.setItem('messagecontent', JSON.stringify(jsonData));
    sessionStorage.setItem('changeMessageContentDirty', 'Y');

    //2. for badge
    var countNews = 0;
    var countEvents = 0;
    var countNewsUnread = 0;
    var countEventUnread = 0;
    var countNewsDeleted = 0;
    var countEventDeleted = 0;
    var badgeCount = 0;

    for (var messageindex = 0; messageindex < messagecontent__.message_count; messageindex++) {

        var message = messagecontent__.message_list[messageindex];

        if (message.message_type == "news") {
            countNews++;
            if (message.read === "N") {
                countNewsUnread++;
                badgeCount++;
            } else if (message.read === "D") {
                countNewsDeleted++;
            }
        } else if (message.message_type == "event") {
            countEvents++;
            if (message.read === "N") {
                countEventUnread++;
                badgeCount++;
            } else if (message.read === "D") {
                countEventDeleted++;
            }
        }
    }

    window.plugins.QPushPlugin.setApplicationIconBadgeNumber(Math.max(0, badgeCount));
}

function QueryMessageListEx() {

    var self = this;
    var queryStr = "";
    var msgDateTo = getTimestamp();
    var msgDateFrom = parseInt(msgDateTo - 60 * 60 * 24 * 30, 10);
    var messagecontent_ = null;

    queryStr = "&date_from=" + msgDateFrom + "&date_to=" + msgDateTo + "&overwrite_timestamp=1";

    this.successCallback = function(data) {
        var resultcode = data['result_code'];

        if (resultcode === 1) {

            var messageCount = data['content']['message_count'];
            var messagecontent = data['content'];

            //Update datetime according to local timezone
            var messageindexLength = parseInt(messagecontent.message_count - 1, 10);

            for (var messageindex = 0; messageindex < messageindexLength; messageindex++) {
                var message = messagecontent.message_list[messageindex];
                var tempDate = dateFormatYMD(message.create_time);
                var createTime = new Date(tempDate);
                var createTimeConvert = createTime.TimeZoneConvert();
                message.create_time = createTimeConvert;
            }

            UpdateMessageListContent(messagecontent, true);
        }

    };

    this.failCallback = function(data) {};

    var __construct = function() {

        messagecontent_ = JSON.parse(window.localStorage.getItem('messagecontent'));
        if (messagecontent_ !== null && messagecontent_.lastUpdateTime === undefined) {
            //it's old data from QPlay2.0
            //convert to new format
            var jsonData = {};
            var date = new Date();
            jsonData = {
                lastUpdateTime: date.setDate(date.getDate() - 1),
                content: messagecontent_
            };
            window.localStorage.setItem('messagecontent', JSON.stringify(jsonData));
        }

        if (messagecontent_ === null || checkDataExpired(messagecontent_['lastUpdateTime'], 1, 'hh')) {
            QPlayAPIEx("GET", "getMessageList", self.successCallback, self.failCallback, null, queryStr);
        }
    }();
}