var widget = {

    init: function(divItem) {

        this.env();

        this.load(0, divItem)
            .then(this.load(1, divItem))
            .then(this.load(2, divItem))
            .then(this.load(3, divItem))
            .then(this.load(4, divItem))
            .then(this.load(5, divItem))
            .then(this.load(6, divItem))
            .then(this.load(7, divItem))
            .then(this.load(8, divItem))
            .then(this.load(9, divItem))
            .then(this.load(10, divItem))
            .then(this.load(11, divItem))
            .then(this.load(12, divItem));
    },
    list: function() {

        return [
            { id: 0, name: 'carousel', enabled: true, show: true, deletable: false, lang: langStr['wgt_001'] },
            { id: 1, name: 'weather', enabled: true, show: true, deletable: false, lang: langStr['wgt_002'] },
            { id: 2, name: 'reserve', enabled: true, show: true, deletable: true, lang: langStr['wgt_003'] },
            { id: 3, name: 'message', enabled: true, show: true, deletable: true, lang: langStr['wgt_004'] },
            { id: 4, name: 'applist', enabled: true, show: true, deletable: true, lang: langStr['wgt_005'] },
            { id: 5, name: 'qpay', enabled: true, show: true, deletable: true, lang: langStr['wgt_009'] },
            { id: 6, name: 'accountingrate', enabled: true, show: false, deletable: true, lang: langStr['wgt_070'] },
            { id: 7, name: 'yellowpage', enabled: true, show: false, deletable: true, lang: 'Yellow Page' },
            { id: 8, name: 'idea', enabled: true, show: false, deletable: true, lang: langStr['wgt_101'] },
            { id: 9, name: 'qstore', enabled: true, show: false, deletable: true, lang: langStr['wgt_100'] },
            { id: 10, name: 'staff', enabled: true, show: true, deletable: true, lang: langStr['wgt_102'] },
            { id: 11, name: 'staffAdmin', enabled: true, show: false, deletable: true, lang: langStr['wgt_102'] },
            { id: 12, name: 'cards', enabled: true, show: true, deletable: false, lang: langStr['wgt_167'] }

        ];
    },
    load: function(id, div, status) {
        status = status || null;

        var widgetArr = JSON.parse(window.localStorage.getItem('widgetList'));
        if (widgetArr !== null) {
            for (var j = 0; j < widgetArr.length; j++) {
                if (widgetArr[j] != null && id == widgetArr[j].id) {
                    if (widgetArr[j].enabled == false || widgetArr[j].show == false)
                        return new Promise((resolve, reject) => {});
                    break;
                }
            }
        }

        return new Promise((resolve, reject) => {

            var widgetItem = this.list()[id].name + "Widget";
            var contentItem = $('<div id="' + widgetItem + '" class="' + widgetItem + '"></div>');
            div.append(contentItem);

            $.getScript(serverURL + "/widget/widget/" + this.list()[id].name + "/" + this.list()[id].name + ".js")
                .done(function(script, textStatus) {

                    if (typeof window[widgetItem] != 'undefined') {
                        window[widgetItem].init(contentItem, status);
                        //是否需要plugin
                        if (typeof window[widgetItem].plugin != 'undefined') {
                            window[widgetItem].plugin();
                        }
                    }

                });

        });
    },
    show: function() {

        this.height();

        let widgetArr = JSON.parse(window.localStorage.getItem('widgetList'));
        for (var i = 0; i < widgetArr.length; i++) {
            let widgetItem = $('.' + widgetArr[i]['name'] + 'Widget');
            //1.原来有，现在没有
            if (widgetItem.length > 0 && widgetArr[i]['show'] == false) {
                widgetItem.remove();
                //2.原来没有，现在有
            } else if (widgetItem.length == 0 && widgetArr[i]['show'] == true) {
                widget.load(widgetArr[i]['id'], $('#widgetList'), 'new');
                //3.原来有，现在也有（或者即将要有）
            } else if (widgetItem.length > 0 && widgetArr[i]['show'] == true) {
                let key = widgetArr[i]['name'] + 'Widget';
                if (typeof window[key] != 'undefined' && typeof window[key].show != 'undefined') {
                    window[key].show();
                } else if (typeof window[key] == 'undefined') {
                    widget.load(widgetArr[i]['id'], $('#widgetList'), 'new');
                }
            }
            //4.原来没有，现在也没有，nothing to do
        }
    },
    refresh: function() {

    },
    clear: function() {

        $.each(this.list(), function(key, value) {
            var widgetItem = value.name + "Widget";
            if (value.enabled == true && window[widgetItem] != undefined && window[widgetItem].clear != undefined) {
                window[widgetItem].clear();
            }
        });
    },
    height: function() {
        let hasHeight = window.sessionStorage.getItem('pageMainHeight');
        if (hasHeight == null) {
            let win = $(window).height();
            let header = $('#viewMain3 .page-header').height();
            let main;
            if (device.platform === "iOS") {
                main = win - header - iOSFixedTopPX();
            } else {
                main = win - header;
            }
            var mainHeight = main.toString() + 'px';
            //设置首页main高度
            $('#viewMain3 .page-main').css('height', mainHeight);
            //记录高度，供其他页使用
            window.sessionStorage.setItem('pageMainHeight', mainHeight);
        }
    },
    env: function() {
        //获取当前环境，appEnvironment:app.min.js
        if (loginData["versionName"].indexOf("Staging") !== -1) {
            appEnvironment = "test";
        } else if (loginData["versionName"].indexOf("Development") !== -1) {
            appEnvironment = "dev";
        } else {
            appEnvironment = "";
        }
    },
    plugin: function(arr) {
        for (var i = 0; i < arr.length; i++) {
            let status = false;
            for (var j = 0; j < pluginList.length; j++) {
                if (arr[i] == pluginList[j]) {
                    status = true;
                    break;
                }
            }
            if (!status) {
                pluginList.push(arr[i]);
                $.getScript(serverURL + '/widget/widgetPlugin/' + arr[i] + '.js');
            }
        }
    }
};


//覆盖App.min.js中checkWidgetPage，可用于上架到staging和production
function checkWidgetPage(pageID, pageVisitedList, parmData) {
    //新增参数：用于不同页面间传值
    parmData = parmData || null;
    if (parmData != null && typeof parmData == 'object') {
        window.sessionStorage.setItem(pageID + "_parmData", JSON.stringify(parmData));
    }

    var url = serverURL + '/widget/widgetPage/' + pageID + '/' + pageID;
    var pageLength = $('#' + pageID).length;

    //0表示没有该元素，直接从local添加，既第一次添加
    //1表示有该元素，直接跳转，不用添加
    if (pageLength == 0) {

        addDownloadHit(pageID);

        $.get(url + '.html', function(data) {
            //1. css
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = url + '.css';
            document.head.appendChild(link);

            //2. html
            $.mobile.pageContainer.append(data);
            $('#' + pageID).page().enhanceWithin();

            //3. language string
            setViewLanguage(pageID);

            //4. water mark
            //According to the data [waterMarkPageList] which set in index.js
            if (!(typeof waterMarkPageList === 'undefined')) {
                if (waterMarkPageList.indexOf(pageID) !== -1) {
                    $('#' + pageID).css('background-color', 'transparent');
                }
            }

            //5. js
            setTimeout(function() {
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = url + '.js';
                document.head.appendChild(script);

                //6. change page
                $.mobile.changePage('#' + pageID);
                if (window.ga !== undefined) {
                    window.ga.trackView(pageID);
                }

            }, 200);
            pageVisitedList.push(pageID);

        }, 'html');

    } else {

        //如果即将跳转的页面正好是当前页面（既visited最后一页），触发pageshow即可
        if (pageID == pageVisitedList[pageVisitedList.length - 1]) {
            $('#' + pageID).trigger('pageshow');

        } else {
            $.mobile.changePage('#' + pageID);
            if (window.ga !== undefined) {
                window.ga.trackView(pageID);
            }
            pageVisitedList.push(pageID);
        }

    }
}


//重设dropdownlist宽度
function setDropdownlistWidth(num) {
    let pxWidth = $("span[data-id='tmp_option_width']").outerWidth();
    let vwWidth = (100 / document.documentElement.clientWidth) * pxWidth + num;
    return vwWidth;
}


//检查widgetlist顺序
function checkWidgetListOrder() {

    var checkFunctionList = setInterval(function() {
        var widgetArr = JSON.parse(window.localStorage.getItem('widgetList'));
        var widget_list = JSON.parse(window.localStorage.getItem('FunctionData'));

        if (widget_list != null) {
            clearInterval(checkFunctionList);

            if (widgetArr == null) {
                //1. 如果local没有数据，直接获取widget.js
                var widget_arr = widget.list();

                //2. 遍历widgetlist，已functionlist为主
                var widgetArray = compareWidgetAndFunction(widget_arr, widget_list['widget_list']);

                //3. 数据存到local
                window.localStorage.setItem('widgetList', JSON.stringify(widgetArray));

            } else {
                //1. check widget.js add
                for (var i = 0; i < widget.list().length; i++) {
                    var found = false;
                    var obj = {};
                    for (var j = 0; j < widgetArr.length; j++) {
                        if (widgetArr[j] != null && widget.list()[i].id == widgetArr[j].id) {
                            found = true;
                            obj = $.extend({}, widgetArr[j], widget.list()[i]);
                            //show的值以localStorage为准
                            obj['show'] = widgetArr[j].show;
                            break;
                        }
                    }

                    if (found) {
                        widgetArr.splice(j, 1, obj);
                    } else {
                        widgetArr.push(widget.list()[i]);
                    }
                }

                //2. check widget.js delete
                for (var j = 0; j < widgetArr.length; j++) {
                    var found = false;
                    for (var i = 0; i < widget.list().length; i++) {
                        if (widgetArr[j] != null && widgetArr[j].id == widget.list()[i].id) {
                            found = true;
                            break;
                        }
                    }

                    if (!found) {
                        widgetArr.splice(j, 1);
                        j--;
                    }
                }

                //3. check FunctionList
                var widgetArray = compareWidgetAndFunction(widgetArr, widget_list['widget_list']);
                window.localStorage.setItem('widgetList', JSON.stringify(widgetArray));
            }
        }

    }, 500);

}


//widget排序
function orderWidget() {
    var widgetListDirty = window.sessionStorage.getItem('widgetListDirty');

    if (widgetListDirty == 'Y' || widgetListDirty == null) {

        var widgetOrder = setInterval(function() {

            var arr = JSON.parse(window.localStorage.getItem('widgetList'));

            if (arr != null) {
                clearInterval(widgetOrder);

                for (var i = 0; i < arr.length - 1; i++) {
                    $('.' + arr[i].name + 'Widget').after($('.' + arr[i + 1].name + 'Widget'));
                }

                window.sessionStorage.setItem('widgetListDirty', 'N');
            }
        }, 500);
    }
}