var widget = {

    init: function(divItem) {

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
            .then(this.load(12, divItem))
            .then(this.env());
    },
    list: function() {

        return [
            { id: 0, name: 'carousel', enabled: true, lang: langStr['wgt_001'] },
            { id: 1, name: 'weather', enabled: true, lang: langStr['wgt_002'] },
            { id: 2, name: 'reserve', enabled: true, lang: langStr['wgt_003'] },
            { id: 3, name: 'message', enabled: true, lang: langStr['wgt_004'] },
            { id: 4, name: 'applist', enabled: true, lang: langStr['wgt_005'] },
            { id: 5, name: 'qpay', enabled: true, lang: langStr['wgt_009'] },
            { id: 6, name: 'accountingrate', enabled: true, lang: langStr['wgt_070'] },
            { id: 7, name: 'yellowpage', enabled: true, lang: 'Yellow Page' },
            { id: 8, name: 'idea', enabled: true, lang: langStr['wgt_101'] },
            { id: 9, name: 'qstore', enabled: true, lang: langStr['wgt_100'] },
            { id: 10, name: 'staff', enabled: true, lang: langStr['wgt_102'] },
            { id: 11, name: 'staffAdmin', enabled: true, lang: langStr['wgt_102'] },
            { id: 12, name: 'cards', enabled: true, lang: langStr['wgt_167'] }

        ];
    },
    load: function(id, div) {

        var widgetArr = JSON.parse(window.localStorage.getItem('widgetList'));
        if (widgetArr !== null) {
            for (var j = 0; j < widgetArr.length; j++) {
                if (id == widgetArr[j].id) {
                    if (widgetArr[j].enabled == false)
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
                        window[widgetItem].init(contentItem);
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
        $.each(this.list(), function(key, value) {
            var widgetItem = value.name + "Widget";
            if (value.enabled == true && window[widgetItem] != undefined && window[widgetItem].show != undefined) {
                window[widgetItem].show();
            }
        });
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