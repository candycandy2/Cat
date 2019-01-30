(function (b) { b.support.touch = "ontouchend" in document; if (!b.support.touch) { return; } var c = b.ui.mouse.prototype, e = c._mouseInit, a; function d(g, h) { if (g.originalEvent.touches.length > 1) { return; } g.preventDefault(); var i = g.originalEvent.changedTouches[0], f = document.createEvent("MouseEvents"); f.initMouseEvent(h, true, true, window, 1, i.screenX, i.screenY, i.clientX, i.clientY, false, false, false, false, 0, null); g.target.dispatchEvent(f); } c._touchStart = function (g) { var f = this; if (a || !f._mouseCapture(g.originalEvent.changedTouches[0])) { return; } a = true; f._touchMoved = false; d(g, "mouseover"); d(g, "mousemove"); d(g, "mousedown"); }; c._touchMove = function (f) { if (!a) { return; } this._touchMoved = true; d(f, "mousemove"); }; c._touchEnd = function (f) { if (!a) { return; } d(f, "mouseup"); d(f, "mouseout"); if (!this._touchMoved) { d(f, "click"); } a = false; }; c._mouseInit = function () { var f = this; f.element.bind("touchstart", b.proxy(f, "_touchStart")).bind("touchmove", b.proxy(f, "_touchMove")).bind("touchend", b.proxy(f, "_touchEnd")); e.call(f); }; })(jQuery);

$("#viewGeneralSetting").pagecontainer({
    create: function (event, ui) {

        var widgetArr = JSON.parse(window.localStorage.getItem('widgetList')),
            imgURL = '/widget/widgetPage/viewGeneralSetting/img/',
            changeWidgetOrderDirty = 'N',
            disabledWidgetList = [];

        //widgetlist分類
        function setWidgetList(arr) {
            let defaultContent = '';
            let moreContent = '';
            for(let i in arr) {
                if(arr[i].enabled) {
                    if(arr[i]['show']) {
                        defaultContent += '<li data-id="' +
                            arr[i]['id'] +
                            (arr[i].name == 'carousel' ? '" class="hide"' : '"') +
                            '><div' +
                            (arr[i]['deletable'] == true ? ' class="delete-widget"' : '') +
                            '></div><div><img src="' +
                            serverURL + imgURL + 'widget_' + arr[i]['name'] +
                            '.png"></div><div>' +
                            arr[i]['lang'] +
                            '</div><div class="move"></div></li>';
                    } else {
                        moreContent += '<li data-id="' +
                            arr[i]['id'] +
                            (arr[i].name == 'carousel' ? '" class="hide"' : '"') +
                            '><div class="add-widget"></div><div><img src="' +
                            serverURL + imgURL + 'widget_' + arr[i]['name'] +
                            '.png"></div><div>' +
                            arr[i]['lang'] +
                            '</div><div></div></li>';
                    }
                } else {
                    disabledWidgetList.push(arr[i]);
                }
            }

            $('.default-widget-ul').html('').append(defaultContent);
            $('.more-widget-ul').html('').append(moreContent);
        }

        //根据id获取widget info
        function getWidgetInfoByID(id, status) {
            status = (status === true || status === false ? status : null);
            for(let i in widgetArr) {
                if(id == widgetArr[i]['id']) {
                    if(status != null) {
                        widgetArr[i]['show'] = status;
                    }
                    return widgetArr[i];
                }
            }
        }

        //从默认中删除
        function removeToDefault(obj) {
            let content = '<li data-id="' +
                obj['id'] +
                '"><div class="add-widget"></div><div><img src="' +
                serverURL + imgURL + 'widget_' + obj['name'] +
                '.png"></div><div>' +
                obj['lang'] +
                '</div><div></div></li>';

            $('.more-widget-ul').append(content);
        }

        //添加到默认
        function addToDefault(obj) {
            let content = '<li data-id="' +
                obj['id'] +
                '"><div class="delete-widget"></div><div><img src="' +
                serverURL + imgURL + 'widget_' + obj['name'] +
                '.png"></div><div>' +
                obj['lang'] +
                '</div><div></div></li>';

            $('.default-widget-ul').append(content);
        }


        /********************************** page event ***********************************/
        $("#viewGeneralSetting").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewGeneralSetting").one("pageshow", function (event, ui) {
            var mainHeight = window.sessionStorage.getItem('pageMainHeight');
            $('#viewGeneralSetting .page-main').css('height', mainHeight);

            //1.widget分组
            setWidgetList(widgetArr);

            //2.sortable
            $('.default-widget-ul').sortable();
            $('.default-widget-ul').disableSelection();
            $('.default-widget-ul').on("sortstop", function (event, ui) {
                changeWidgetOrderDirty = 'Y';
                $('.default-widget-ul').sortable('disable');
            });
            $('.default-widget-ul').sortable('disable');

        });

        $("#viewGeneralSetting").on("pageshow", function (event, ui) {

        });

        $("#viewGeneralSetting").on("pagehide", function (event, ui) {
            if (changeWidgetOrderDirty == 'Y') {
                //1.按照排序记录widget id
                let idArr = [];
                $('.default-widget-ul li').each(function(index, item) {
                    idArr.push($(item).data('id'));
                });
                $('.more-widget-ul li').each(function(index, item) {
                    idArr.push($(item).data('id'));
                });
                $.each(disabledWidgetList, function(index, item) {
                    idArr.push(item['id']);
                });

                //2.根据排好序的id将widgetlist排序
                let currentArr = [];
                for(let i in idArr) {
                    currentArr.push(getWidgetInfoByID(idArr[i]));
                }

                //3. 更新到local
                window.localStorage.setItem('widgetList', JSON.stringify(currentArr));
                window.sessionStorage.setItem('widgetListDirty', 'Y');

                changeWidgetOrderDirty = 'N';
            }

        });


        /********************************** dom event *************************************/
        //长按拖动
        $('.default-widget-ul').on('taphold', 'li', function() {
            $('.default-widget-ul').sortable('enable');
        });

        //删除default
        $('.default-widget-ul').on('click', '.delete-widget', function() {
            //1.get id
            let infoID = $(this).parent().data('id');
            //2.remove element
            $(this).parent().remove();
            //3.get info
            let infoObj = getWidgetInfoByID(infoID, false);
            //4.append more list
            removeToDefault(infoObj);
            //5.refresh sortable
            $('.default-widget-ul').sortable('refresh');
            //6.dirty
            changeWidgetOrderDirty = 'Y';
        });

        //添加default
        $('.more-widget-ul').on('click', '.add-widget', function() {
            //1.get id
            let infoID = $(this).parent().data('id');
            //2.remove element
            $(this).parent().remove();
            //3.get info
            let infoObj = getWidgetInfoByID(infoID, true);
            //4.append default list
            addToDefault(infoObj);
            //5.refresh sortable
            $('.default-widget-ul').sortable('refresh');
            //6.dirty
            changeWidgetOrderDirty = 'Y';
        });


    }
});