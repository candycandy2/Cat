//widget naming rule widget.js/list()[].name + "Widget"
var osisWidget = {

    secretKey: 'swexuc453refebraXecujeruBraqAc4e',

    init: function (contentItem) {

        function createContent(contentItem) {

            $.get(serverURL + "/widget/widget/osis/osis.html", function (data) {
                //1.html
                contentItem.html('').append(data);
                //2.img
                var osisImg = $('<img>').attr('src', serverURL + '/widget/widget/osis/img/widget_osis_icon.png');
                $('.osis-icon').html('').append(osisImg);
                var moreImg = $('<img>').attr('src', serverURL + '/widget/widget/osis/img/widget_osis_img.png');
                $('.osis-widget-img').html('').append(moreImg);

            }, "html");

            //跳转到OSIS页面
            contentItem.on('click', '.osis-widget-img, .osis-btn', function() {
                var emp_no = loginData['emp_no'];
                var signatureTime = getSignature('getTime').toString();
                //base64后有特殊符号，需要进行编码
                var signature = encodeURIComponent(getSignatureByKey('key', signatureTime + emp_no, osisWidget.secretKey));
                var url = 'http://58.210.86.182/OSISMobile/Home/Login?emp_no=' + emp_no + '&signatureTime=' + signatureTime + '&signature=' + signature;
                cordova.InAppBrowser.open(url, '_blank', 'location=no,toolbar=no,hardwareback=no');
            });

        }

        $.fn.osis = function (options) {
            options = options || {};

            return this.each(function () {
                var state = $.data(this, 'osis');
                if (state) {
                    $.extend(state.options, options);
                } else {
                    $.data(this, 'osis', {
                        options: $.extend({}, $.fn.osis.defaults, options)
                    });
                }

                createContent(contentItem);

            })
        };

        $.fn.osis.methods = {
            options: function(jq) {
                return $.data(jq[0], 'osis').options;
            }
        };

        $.fn.osis.defaults = {};

        $('.osisWidget').osis();
    }

};