//widget naming rule widget.js/list()[].name + "Widget"
var qpayWidget = {

    init: function(contentItem) {

        function createContent() {
            $.get(serverURL + "/widget/widget/qpay/qpay.html", function (data) {
                //1.html
                contentItem.html('').append(data);
                //2.img
                var ideaImg = $('<img>').attr('src', serverURL + '/widget/widget/qpay/img/widget_pay.png');
                $('.qpay-icon').html('').append(ideaImg);
                var moreImg = $('<img>').attr('src', serverURL + '/widget/widget/qpay/img/more_green.png');
                $('.qpay-more').html('').append(moreImg);
                //3. due date
                var dueDate = getDueDay();
                $('.qpay-due-date').text(dueDate);

            }, "html");

            //点击前往，跳转user pay
            contentItem.on('click', '.qpay-toMain', function() {
                checkWidgetPage('viewUserPayMain', pageVisitedList);
            });

            //点击更多，跳转shop pay
            contentItem.on('click', '.qpay-more', function() {
                checkWidgetPage('viewShopPayMain', pageVisitedList);
            });
        }

        function getDueDay() {
            var year = new Date().getFullYear().toString();
            return new Date(year + '/12/31').toLocaleDateString('zh', { year: 'numeric', month: 'long', day: 'numeric' })
        }

        $.fn.qpay = function(options, param) {
            if (typeof options == 'string') {
                return $.fn.qpay.methods[options](this, param);
            }

            options = options || {};
            return this.each(function() {
                var state = $.data(this, 'qpay');
                if (state) {
                    $.extend(state.options, options);
                } else {
                    $.data(this, 'qpay', {
                        options: $.extend({}, $.fn.qpay.defaults, options)
                    });
                }

                createContent();

            });
        }

        $.fn.qpay.methods = {
            options: function(jq) {
                return $.data(jq[0], 'qpay').options;
            }
        }

        $.fn.qpay.defaults = {}

        $('.qpayWidget').qpay();
    },

    show: function() {
        if(loginData['company'] == 'shop') {
            $('.qpay-none').show();
            $('.qpay-more-hidden').show();
            $('.qpay-main').hide();
        } else {
            var self = this;

            this.successCallback = function (data) {

                if(data['result_code'] == '1') {
                    var point_now = data['content'].point_now;
                    $('.qpay-money').text(point_now);
                    //window.sessionStorage.setItem('QPayWidgetPoint', point_now);
                } else {
                    $('.qpay-money').text('0');
                }

                $('.qpay-none').hide();
                $('.qpay-more-hidden').hide();
                $('.qpay-main').show();
            };

            this.failCallback = function () { };

            var __construct = function () {
                QPlayAPIEx("GET", "getQPayInfoEmp", self.successCallback, self.failCallback, null, null, "low", 30000, true);   
            }();
        }
        
    },

    refresh: function() {
        
    }
}