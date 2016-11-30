$(document).one("pagecreate", "#viewWebNews2-3-1", function() {

    function cleanHTML(input) {
        // 1. remove line breaks / Mso classes
        var stringStripper = /(\n|\r| class=(")?Mso[a-zA-Z]+(")?)/g;
        var output = input.replace(stringStripper, ' ');
        // 2. strip Word generated HTML comments
        var commentSripper = new RegExp('<!--(.*?)-->', 'g');
        var output = output.replace(commentSripper, '');
        var tagStripper = new RegExp('<(/)*(meta|link|span|table|tbody|td|tr|body|div|strong|\\?xml:|st1:|o:|font)(.*?)>', 'gi');
        // 3. remove tags leave content if any
        output = output.replace(tagStripper, '');
        // 4. Remove everything in between and including tags '<style(.)style(.)>'
        var badTags = ['style', 'script', 'applet', 'embed', 'noframes', 'noscript'];

        for (var i = 0; i < badTags.length; i++) {
            tagStripper = new RegExp('<' + badTags[i] + '.*?' + badTags[i] + '(.*?)>', 'gi');
            output = output.replace(tagStripper, '');
        }
        // 5. remove attributes ' style="..."'
        var badAttributes = ['style', 'start'];
        for (var i = 0; i < badAttributes.length; i++) {
            var attributeStripper = new RegExp(' ' + badAttributes[i] + '="(.*?)"', 'gi');
            output = output.replace(attributeStripper, '');
        }
        return output;
    }

    $("#viewWebNews2-3-1").pagecontainer({
        create: function(event, ui) {

            /********************************** function *************************************/
            function QueryMessageDetail() {
                var self = this;
                var queryStr = "&message_send_row_id=" + messageRowId;

                this.successCallback = function(data) {
                    var resultcode = data['result_code'];

                    if (resultcode == 1) {
                        var responsecontent = data['content'];
                        /*
                        if (responsecontent.message_type == "news") {

                        } else if (responsecontent.message_type == "event") {

                        }
                        */
                        var title = responsecontent.message_title;
                        var messagetext = responsecontent.message_text;
                        var messagehtml = responsecontent.message_html;
                        var rowid = responsecontent.message_send_row_id;
                        var time = responsecontent.create_time;
                        var author = responsecontent.create_user;

                        $("#newsDetailCreateTime").html(time.substr(0, 10));
                        $("#newsDetailTitle").html(title);
                        $("#newsAuthor").html(author);
                        $("#newsContent").html(cleanHTML(messagetext));

                        window.localStorage.getItem("openMessage") === "false";
                        loginData["openMessage"] = false;

                    } else {

                    }
                };

                this.failCallback = function(data) {};

                var __construct = function() {
                    QPlayAPI("POST", "getMessageDetail", self.successCallback, self.failCallback, null, queryStr);
                }();
            }

            /********************************** page event *************************************/
            $("#viewWebNews2-3-1").on("pagebeforeshow", function(event, ui) {
                var messageDetail = new QueryMessageDetail();
            });

            $("#viewWebNews2-3-1").one("pageshow", function(event, ui) {

                //RWD header & footer
                var header = {
                    width: 600,
                    height: 172
                };

                var footerImage = {
                    width: 98,
                    height: 65
                };

                var tempWidth;
                var tempHeight;
                var tempTop;
                var footerWidth;
                var footerHeight;

                tempWidth = $("#viewWebNews2-3-1 .news-header").width();
                tempHeight = header['height'] * tempWidth / header['width'];
                $("#viewWebNews2-3-1 .news-header").css('height', tempHeight + 'px');

                tempTop = tempHeight * 0.2;
                $("#viewWebNews2-3-1 .priority-title").css('top', tempTop + 'px');

                tempTop = tempHeight * 0.35;
                $("#viewWebNews2-3-1 .header-date").css('top', tempTop + 'px');

                footerWidth = $("#viewWebNews2-3-1 .footer-top").width();

                if (footerWidth * 0.2 < footerImage['width']) {
                    tempWidth = footerWidth * 0.2;
                    tempHeight = footerImage['height'] * tempWidth / footerImage['width'];

                    $("#viewWebNews2-3-1 .footer-top").css('height', tempHeight + 'px');

                    $("#viewWebNews2-3-1 .footer-benq").css({
                        'width': tempWidth + 'px',
                        'height': tempHeight + 'px'
                    });
                    $("#viewWebNews2-3-1 .footer-qisda").css({
                        'width': tempWidth + 'px',
                        'height': tempHeight + 'px'
                    });

                    $("#viewWebNews2-3-1 .footer-text").css({
                        'width': (footerWidth - tempWidth * 2) - 15 + 'px',
                        'padding-top': tempHeight * 0.4 + 'px',
                        'font-size': '10px'
                    });
                } else {
                    $("#viewWebNews2-3-1 .footer-top").css('height', footerImage['height'] + 'px');

                    $("#viewWebNews2-3-1 .footer-benq").css({
                        'width': footerImage['width'] + 'px',
                        'height': footerImage['height'] + 'px'
                    });
                    $("#viewWebNews2-3-1 .footer-qisda").css({
                        'width': footerImage['width'] + 'px',
                        'height': footerImage['height'] + 'px'
                    });

                    $("#viewWebNews2-3-1 .footer-text").css({
                        'width': (footerWidth - footerImage['width'] * 2) - 15 + 'px',
                        'padding-top': footerImage['height'] * 0.4 + 'px',
                        'font-size': '12px'
                    });
                }
            });

            /********************************** dom event *************************************/
        }
    });

});
