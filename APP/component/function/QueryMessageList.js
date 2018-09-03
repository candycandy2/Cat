function UpdateMessageListContent(messagecontent__) {
    var jsonData = {};
    jsonData = {
        lastUpdateTime: new Date(),
        content: messagecontent__
    };
    window.localStorage.setItem('messagecontent', JSON.stringify(jsonData));
    sessionStorage.setItem('changeMessageContentDirty', 'Y');
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

            UpdateMessageListContent(messagecontent);

        }

    };

    this.failCallback = function(data) {};

    var __construct = function() {

        messagecontent_ = JSON.parse(window.localStorage.getItem('messagecontent'));

        if (messagecontent_ !== null && messagecontent_.lastUpdateTime === undefined) {
            window.localStorage.removeItem('messagecontent');
            messagecontent_ = null;
        }

        if (messagecontent_ === null || checkDataExpired(messagecontent_['lastUpdateTime'], 1, 'hh')) {
            QPlayAPIEx("GET", "getMessageList", self.successCallback, self.failCallback, null, queryStr);
        }
    }();
}