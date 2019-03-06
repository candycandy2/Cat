//widget naming rule widget.js/list()[].name + "Widget"
var yellowpageWidget = {

    yellowPageKey: 'appyellowpage',
    yellowPageSecretKey: 'c103dd9568f8493187e02d4680e1bf2f',

    init: function(contentItem, status) {
        status = status || null;

        var _key = this.yellowPageKey;

        function createContent(key) {
            $.get(serverURL + "/widget/widget/yellowpage/yellowpage.html", function(data) {
                //1.html
                contentItem.html('').append(data);
                //2.img
                var rateImg = $('<img>').attr('src', serverURL + '/widget/widget/yellowpage/img/widget_yellowpage.png');
                $('.yellowpage-icon').html('').append(rateImg);
                var moreImg = $('<img>').attr('src', serverURL + '/widget/widget/yellowpage/img/more_green.png');
                $('.phone-book-more').html('').append(moreImg);

                if (status != null) {
                    yellowpageWidget.show();
                }

            }, "html");

            //点击更多，跳转YellowPage APP
            contentItem.on('click', '.phone-book-more', function() {
                var env = '';
                if (loginData["versionName"].indexOf("Staging") !== -1) {
                    env = 'test';
                } else if (loginData["versionName"].indexOf("Development") !== -1) {
                    env = 'dev';
                }

                var schemeURL = key + env + createAPPSchemeURL();
                openAPP(schemeURL);
            });

        }

        $.fn.yellowpage = function(options, param) {
            if (typeof options == 'string') {
                return $.fn.yellowpage.methods[options](this, param);
            }

            options = options || {};
            return this.each(function() {
                var state = $.data(this, 'yellowpage');
                if (state) {
                    $.extend(state.options, options);
                } else {
                    $.data(this, 'yellowpage', {
                        options: $.extend({}, $.fn.yellowpage.defaults, options)
                    });
                }

                createContent(_key);

            });
        }

        $.fn.yellowpage.methods = {
            options: function(jq) {
                return $.data(jq[0], 'yellowpage').options;
            },
            refresh: function(jq) {
                return jq.each(function() {
                    createContent(_key);
                });
            }
        }

        $.fn.yellowpage.defaults = {};

        $('.yellowpageWidget').yellowpage();
    },
    refresh: function(key, secret) {
        var self = this;
        var queryData = '<LayoutHeader><User_EmpID>' + loginData["emp_no"] + '</User_EmpID></LayoutHeader>';

        this.successCallback = function(data) {
            //init
            $('.phone-book-ul').html('');
            //result code
            var resultCode = data['ResultCode'];
            if (resultCode == '1') {
                $('.no-phone-book').hide();
                //book list
                var phoneList = data['Content'];
                //var content = '';
                for (var i in phoneList) {
                    if (i < 3) {
                        //merge tel & vpn
                        var telArr = ($.trim(phoneList[i]['Ext_No']) + ';' + $.trim(phoneList[i]['Mvpn'])).split(';');
                        var arr = [];
                        for (var j in telArr) {
                            if (telArr[j] != '') {
                                arr.push(telArr[j]);
                            }
                        }

                        var content = '<li class="phone-book-li" data-index="' + i + '"><div class="phone-book-name"><div>' + $.trim(phoneList[i]['Name_EN']) +
                            '</div><div>' + $.trim(phoneList[i]['Name_CH']) + '</div></div><div><a href="' + (arr.length == 1 ? 'tel:' + arr[0] : '#') +
                            '"><img src="' + serverURL + '/widget/widget/yellowpage/img/phone.png"></a></div><div><a href="' + (arr.length == 1 ? 'tel:' + arr[0] : '#') +
                            '">' + (typeof arr[0] != 'undefined' ? arr[0] : '') + '</a></div><div><img src="' + serverURL + '/widget/widget/yellowpage/img/info.png" class="open-yellowpage"></div></li>';

                        $('.phone-book-ul').append(content);
                        //bind data
                        $('.phone-book-li[data-index="' + i + '"]').data('tel', arr);

                    }
                }
                $('.phone-book-ul').show();

                //bind a href='#' click
                $('.phone-book-ul').on('click', 'a[href="#"]', function() {
                    //get bind data
                    var telArr = $(this).parents('.phone-book-li').data('tel');
                    if (telArr.length > 0) {
                        //append html
                        var content = '';
                        for (var i in telArr) {
                            content += '<li><img src="' + serverURL + '/widget/widget/yellowpage/img/phone.png" style="width:4vw; height:auto;"><span>' +
                                '<a href="tel:' + telArr[i] + '" style="text-decoration: none; font-weight: normal;">' + telArr[i] + '</a></span></li>';
                        }
                        $('#numSelectPopupWindow ul').html('').append(content);
                        //open popup
                        $('#numSelectPopupWindow').popup();
                        $('#numSelectPopupWindow').show();
                        $('#numSelectPopupWindow').popup('open');
                    }
                });

                //close popup
                $('#numPopupCloseBtn').on('click', function() {
                    $('#numSelectPopupWindow').popup('close');
                });

                //bind open yellow page app
                $('.phone-book-ul').on('click', '.open-yellowpage', function() {
                    var env = '';
                    if (loginData["versionName"].indexOf("Staging") !== -1) {
                        env = 'test';
                    } else if (loginData["versionName"].indexOf("Development") !== -1) {
                        env = 'dev';
                    }

                    var schemeURL = key + env + createAPPSchemeURL();
                    openAPP(schemeURL);
                });

            } else {
                $('.no-phone-book').show();
                $('.phone-book-ul').hide();
            }
        };

        this.failCallback = function() {};

        var __construct = function() {
            CustomAPIByKey("POST", true, key, secret, "QueryMyPhoneBook", self.successCallback, self.failCallback, queryData, "", 60 * 60, "low");
        }();
    },
    show: function() {
        //Call API
        this.refresh(this.yellowPageKey, this.yellowPageSecretKey)
    },
    clear: function() {
        var env = '';
        if (loginData["versionName"].indexOf("Staging") !== -1) {
            env = 'test';
        } else if (loginData["versionName"].indexOf("Development") !== -1) {
            env = 'dev';
        }

        window.localStorage.removeItem(this.yellowPageKey + env);
    }
}