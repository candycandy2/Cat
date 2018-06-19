$("#viewMessageList").pagecontainer({
    create: function (event, ui) {

        var newsType = "news";

        function getNewsList() {

            var self = this;
            var msgDateTo = getTimestamp();
            var queryStr = "&date_from=" + loginData["msgDateFrom"] + "&date_to=" + msgDateTo + "&overwrite_timestamp=1";

            window.localStorage.setItem("msgDateFrom", loginData["msgDateFrom"]);

            this.successCallback = function (data) {
                console.log(data);
                
            };

            this.failCallback = function () { };

            var __construct = function () {
                QPlayAPI("GET", "getMessageList", self.successCallback, self.failCallback, null, queryStr);
            }();
        }

        function createMessageByType() {
            var msgContent = loginData["messagecontent"];

            if (msgContent == null || msgContent == "") {
                var messageList = new QueryMessageList();

            } else {
                var resultArr = msgContent['message_list'];
                console.log(resultArr);

                var newsContent = '';
                var eventContent = '';
                for (var i in resultArr) {
                    if (resultArr[i]['message_type'] == 'event') {
                        eventContent += '<div class="news-list"><div class="news-list-left"><div>' +
                            resultArr[i].create_time +
                            '</div><div>' +
                            resultArr[i].message_title +
                            '</div></div><div class="news-list-right"><img src="img/nextpage.png"></div></div>';

                    } else if (resultArr[i]['message_type'] == 'news') {
                        newsContent += '<div class="news-list"><div class="news-list-left"><div>' +
                            resultArr[i].create_time +
                            '</div><div>' +
                            resultArr[i].message_title +
                            '</div></div><div class="news-list-right"><img src="img/nextpage.png"></div></div>';
                    }
                }

                $(".news-content").html('').append(newsContent);
                $(".event-content").html('').append(eventContent);
            }
        }

        /********************************** page event ***********************************/
        $("#viewMessageList").on("pagebeforeshow", function (event, ui) {
            createMessageByType();
        });

        $("#viewMessageList").on("pageshow", function (event, ui) {

        });

        $("#viewMessageList").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/
        $("#viewMessageList .ui-title").on("click", function () {
            $(".select-news").slideDown(200);
        });

        $("#viewMessageList div[data-name=msgType]").on("click", function () {
            var self = this;
            var msgType = $(self).attr("data-value");

            if (msgType != newsType) {
                newsType = msgType;

                if(msgType == 'news') {
                    $(".news-content").show();
                    $(".event-content").hide();
                } else {
                    $(".event-content").show();
                    $(".news-content").hide();
                }

            }

            $(".select-news").slideUp(200);
            $(".dropdown-title").text($(self).text());
        });

    }
});