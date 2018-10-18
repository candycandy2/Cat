//widget naming rule widget.js/list()[].name + "Widget"
var yellowpageWidget = {

    yellowPageKey: 'appyellowpage',
    yellowPageSecretKey: 'c103dd9568f8493187e02d4680e1bf2f',

    init: function(contentItem) {

        function createContent() {
            $.get(serverURL + "/widget/yellowpage/yellowpage.html", function(data) {
                //1.html
                contentItem.html('').append(data);
                //2.img
                var rateImg = $('<img>').attr('src', serverURL + '/widget/yellowpage/img/widget_yellowpage.png');
                $('.yellowpage-widget-icon').html('').append(rateImg);
                

            }, "html");

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

                createContent();

            });
        }

        $.fn.yellowpage.methods = {
            options: function(jq) {
                return $.data(jq[0], 'yellowpage').options;
            },
            refresh: function(jq) {
                return jq.each(function() {
                    createContent();
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
            var resultCode = data['ResultCode'];
            
            if(resultCode == '1') {
                $('.no-phone-book').hide();
                //book list
                var phoneList = data['Content'];
                var content = '';
                for(var i in phoneList) {
                    if(i < 3) {
                        content += '<li class="phone-book-li"><div class="phone-book-name"><div>' + $.trim(phoneList[i]['Name_EN']) +
                            '</div><div>' + $.trim(phoneList[i]['Name_CH']) + '</div></div><div><img src="' + serverURL +
                            '/widget/yellowpage/img/phone.png"></div><div>' + $.trim(phoneList[i]['Ext_No']) + '</div><div><img src="' +
                            serverURL + '/widget/yellowpage/img/info.png"></div></li>';
                    }
                }
                $('.phone-book-ul').html('').append(content).show();

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