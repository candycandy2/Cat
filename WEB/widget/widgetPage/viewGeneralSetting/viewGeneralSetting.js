(function (b) { b.support.touch = "ontouchend" in document; if (!b.support.touch) { return; } var c = b.ui.mouse.prototype, e = c._mouseInit, a; function d(g, h) { if (g.originalEvent.touches.length > 1) { return; } g.preventDefault(); var i = g.originalEvent.changedTouches[0], f = document.createEvent("MouseEvents"); f.initMouseEvent(h, true, true, window, 1, i.screenX, i.screenY, i.clientX, i.clientY, false, false, false, false, 0, null); g.target.dispatchEvent(f); } c._touchStart = function (g) { var f = this; if (a || !f._mouseCapture(g.originalEvent.changedTouches[0])) { return; } a = true; f._touchMoved = false; d(g, "mouseover"); d(g, "mousemove"); d(g, "mousedown"); }; c._touchMove = function (f) { if (!a) { return; } this._touchMoved = true; d(f, "mousemove"); }; c._touchEnd = function (f) { if (!a) { return; } d(f, "mouseup"); d(f, "mouseout"); if (!this._touchMoved) { d(f, "click"); } a = false; }; c._mouseInit = function () { var f = this; f.element.bind("touchstart", b.proxy(f, "_touchStart")).bind("touchmove", b.proxy(f, "_touchMove")).bind("touchend", b.proxy(f, "_touchEnd")); e.call(f); }; })(jQuery);

$("#viewGeneralSetting").pagecontainer({
    create: function (event, ui) {

        var widgetArr = JSON.parse(window.localStorage.getItem('widgetList')),
            imgURL = '/widget/widgetPage/viewGeneralSetting/img/',
            changeWidgetOrderDirty = 'N';

        //根据widgetlist获取一般设定的顺序
        function setGeneralSetting(widgetArr_) {
            var content = '';
            for (var i in widgetArr_) {
                content += '<div class="default-item ' +
                    (widgetArr_[i].name == 'carousel' || !widgetArr_[i].enabled ? 'hide' : 'show') +
                    '" data-item="' + widgetArr_[i].name + '" data-index="' +
                    i + '"><div>' + widgetArr_[i].lang +
                    '</div><div><img src="img/move.png" width="90%"></div></div>';
            }

            $('#defaultList').html('').append(content);
        }

        //widgetlist分類
        function setWidgetList(arr) {
            let defaultContent = '';
            let moreContent = '';
            for(let i in arr) {
                if(arr[i]['show'] == true) {
                    defaultContent += '<li class="' +
                        (arr[i].name == 'carousel' || !arr[i].enabled ? 'hide' : 'show') +
                        '"><div><img src="' +
                        serverURL + imgURL +
                        'delete.png"></div><div><img src="' +
                        serverURL + imgURL + 'widget_' + arr[i]['name'] + '.png"></div><div>' +
                        arr[i]['name'] +
                        '</div><div></div></li>';
                } else {
                    moreContent += '<li class="' +
                        (arr[i].name == 'carousel' || !arr[i].enabled ? 'hide' : 'show') +
                        '"><div><img src="' +
                        serverURL + imgURL +
                        'add.png"></div><div><img src="' +
                        serverURL + imgURL + 'widget_' + arr[i]['name'] + '.png"></div><div>' +
                        arr[i]['name'] +
                        '</div><div></div></li>';
                }
            }

            $('.default-widget-list ul').html('').append(defaultContent);
            $('.more-widget-list ul').html('').append(moreContent);
        }


        /********************************** page event ***********************************/
        $("#viewGeneralSetting").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewGeneralSetting").one("pageshow", function (event, ui) {
            var mainHeight = window.sessionStorage.getItem('pageMainHeight');
            $('#viewGeneralSetting .page-main').css('height', mainHeight);

            //setWidgetList(widgetArr);

            //2. create content
            setGeneralSetting(widgetArr);

            //3. sort listview
            $("#defaultList").sortable();
            $("#defaultList").sortable({
                delay: 1000
            });
            $("#defaultList").disableSelection();
            $("#defaultList").on("sortstop", function (event, ui) {
                changeWidgetOrderDirty = 'Y';
            });

            //$("#defaultList").sortable('disable'); //禁用
            //$("#defaultList").sortable('enable'); //啓用
        });

        $("#viewGeneralSetting").on("pageshow", function (event, ui) {

        });

        $("#viewGeneralSetting").on("pagehide", function (event, ui) {
            if (changeWidgetOrderDirty == 'Y') {

                //1. 记录新index
                var newSettingIndex = [];
                $.each($('.default-item'), function (index, item) {
                    newSettingIndex.push(parseInt($(item).attr('data-index')));
                });

                //2. 记录新顺序
                var arr = [];
                for (var j in newSettingIndex) {
                    var item = widgetArr[newSettingIndex[j]];
                    arr.push(item);
                }

                //3. 更新到local
                window.localStorage.setItem('widgetList', JSON.stringify(arr));
                window.sessionStorage.setItem('widgetListDirty', 'Y');

                changeWidgetOrderDirty = 'N';
            }

        });

        /********************************** dom event *************************************/
    }
});