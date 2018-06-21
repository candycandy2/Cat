$("#viewMessageList").pagecontainer({
    create: function (event, ui) {

        var messageType = "news";

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
                createMessageByType();

            } else {
                var resultArr = msgContent['message_list'];
                console.log(resultArr);

                var newsContent = '';
                var eventContent = '';
                for (var i in resultArr) {
                    if (resultArr[i]['message_type'] == 'event') {
                        eventContent += '<li data-icon="false"><div class="behind"><a href="#" class="ui-btn delete-btn"><img src="img/delete.png" class="msg-delete-btn"></a>' +
                            '</div><a href="#" class="ui-div ui-btn"><div class="msg-check-icon"><img src="img/checkbox.png" class="msg-check-btn"></div><div class="msg-content-title"><div>' +
                            resultArr[i].create_time.split(' ')[0] + '</div><div>' +
                            resultArr[i].message_title + '</div></div><div class="msg-next-icon"><img src="img/nextpage.png" class="msg-next-btn"></div></a></li>';

                    } else if (resultArr[i]['message_type'] == 'news') {
                        newsContent += '<li data-icon="false"><div class="behind"><a href="#" class="ui-btn delete-btn"><img src="img/delete.png" class="msg-delete-btn"></a>' +
                            '</div><a href="#" class="ui-div ui-btn"><div class="msg-check-icon"><img src="img/checkbox.png" class="msg-check-btn"></div><div class="msg-content-title"><div>' +
                            resultArr[i].create_time.split(' ')[0] + '</div><div>' +
                            resultArr[i].message_title + '</div></div><div class="msg-next-icon"><img src="img/nextpage.png" class="msg-next-btn"></div></a></li>';
                    }
                }

                $(".news-content ul").html('').append(newsContent);
                $(".event-content ul").html('').append(eventContent);
            }

            var x;
            $('.swipe-delete li > a')
                .on('touchstart', function (event) {
                    //console.log(event.originalEvent.pageX)
                    $('.swipe-delete li > a').css('left', '0px') // close em all
                    $(event.currentTarget).addClass('open')
                    //x为手指接触屏幕的点与屏幕左侧的边距，初始值（0~360）
                    x = event.originalEvent.targetTouches[0].pageX // anchor point
                })
                .on('touchmove', function (event) {
                    //结束位置 - 起始位置 = 滑动距离（-360~360），小于零表示左滑，反之右滑
                    var change = event.originalEvent.targetTouches[0].pageX - x
                    //(-100~0),右滑为0,左滑为距离
                    change = Math.min(Math.max(-100, change), 0) // restrict to -100px left, 0px right
                    event.currentTarget.style.left = change + 'px'
                    if (change < -10) disable_scroll() // disable scroll once we hit 10px horizontal slide
                })
                .on('touchend', function (event) {
                    var left = parseInt(event.currentTarget.style.left)
                    var itemWidth = $(this).prev().children("a").width()
                    var new_left;
                    // if (left < -35) {
                    //     new_left = '-100px'
                    // } else if (left > 35) {
                    //     new_left = '100px'
                    // } else {
                    //     new_left = '0px'
                    // }
                    if (left < (itemWidth - itemWidth * 2) / 3) {
                        new_left = '-' + itemWidth.toString() + 'px';
                    } else if (left > itemWidth / 3) {
                        new_left = itemWidth.toString() + 'px';
                    } else {
                        new_left = '0px'
                    }

                    // event.currentTarget.style.left = new_left
                    $(event.currentTarget).animate({ left: new_left }, 200)
                    enable_scroll()
                });
        }

        //swipe to delete function
        function prevent_default(event) {
            event.preventDefault();
        }

        function disable_scroll() {
            $(document).on('touchmove', prevent_default);
        }

        function enable_scroll() {
            $(document).unbind('touchmove', prevent_default)
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
            $(".select-news").slideToggle(200);
        });

        $("#viewMessageList div[data-name=msgType]").on("click", function () {
            var self = this;
            var currentType = $(self).attr("data-value");

            if (currentType != messageType) {

                if (currentType == 'news') {
                    $(".news-content").show();
                    $(".event-content").hide();
                } else {
                    $(".event-content").show();
                    $(".news-content").hide();
                }

                messageType = currentType;
                $(".dropdown-title").text($(self).text());
            }

            $(".select-news").slideUp(200);

        });

        // $('li .delete-btn').on('touchend', function (event) {
        //     event.preventDefault()
        //     $(this).parents('li').slideUp('fast', function () {
        //         $(this).remove()
        //     })
        // })
    }
});