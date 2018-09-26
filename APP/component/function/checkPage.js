//check app page on local
function checkAppPage(pageID, pageVisitedList) {
    var pageLength = $('#' + pageID).length;

    //0表示没有该元素，直接从local添加，既第一次添加
    //1表示有该元素，直接跳转，不用添加
    if (pageLength == 0) {
        $.get('View/' + pageID + '.html', function(data) {
            //1. html
            $.mobile.pageContainer.append(data);
            $('#' + pageID).page().enhanceWithin();

            //2. language string
            setViewLanguage(pageID);

            //3. water mark
            //According to the data [waterMarkPageList] which set in index.js
            if (!(typeof waterMarkPageList === 'undefined')) {
                if (waterMarkPageList.indexOf(pageID) !== -1) {
                    $('#' + pageID).css('background-color', 'transparent');
                }
            }

            //4. js
            setTimeout(function() {
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = 'js/' + pageID + '.js';
                document.head.appendChild(script);

                //5. change page
                $.mobile.changePage('#' + pageID);
                window.ga.trackView(pageID);

            }, 200);
            pageVisitedList.push(pageID);

        }, 'html');

    } else {

        //如果即将跳转的页面正好是当前页面（既visited最后一页），触发pageshow即可
        if (pageID == pageVisitedList[pageVisitedList.length - 1]) {
            $('#' + pageID).trigger('pageshow');

        } else {
            $.mobile.changePage('#' + pageID);
            window.ga.trackView(pageID);
            pageVisitedList.push(pageID);
        }

    }

}

//check app widgetPage on server
function checkWidgetPage(pageID, pageVisitedList) {
    var url = serverURL + '/widget/widgetPage/' + pageID + '/' + pageID;
    var pageLength = $('#' + pageID).length;

    //0表示没有该元素，直接从local添加，既第一次添加
    //1表示有该元素，直接跳转，不用添加
    if (pageLength == 0) {

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
                window.ga.trackView(pageID);

            }, 200);
            pageVisitedList.push(pageID);

        }, 'html');

    } else {

        //如果即将跳转的页面正好是当前页面（既visited最后一页），触发pageshow即可
        if (pageID == pageVisitedList[pageVisitedList.length - 1]) {
            $('#' + pageID).trigger('pageshow');

        } else {
            $.mobile.changePage('#' + pageID);
            window.ga.trackView(pageID);
            pageVisitedList.push(pageID);
        }

    }

}

function setViewLanguage(view) {
    $("#" + view + " .langStr").each(function(index, element) {
        var id = $(element).data("id");

        $(".langStr[data-id='" + id + "']").each(function(index, element) {
            if (langStr[id] !== undefined) {
                $(this).html(langStr[id]);
            }
        });
    });
}

//[Android]Handle the back button
function onBackKeyDown(bForceByPassPopup) {
    // var activePageID = $.mobile.pageContainer.pagecontainer("getActivePage")[0].id;
    var activePageID = pageVisitedList[pageVisitedList.length - 1];
    var prevPageID = pageVisitedList[pageVisitedList.length - 2];
    bForceByPassPopup = bForceByPassPopup || false;

    if (bForceByPassPopup === false && checkPopupShown()) {
        var popupID = $(".ui-popup-active")[0].children[0].id;
        $('#' + popupID).popup("close");

    } else if (pageVisitedList.length == 1) {
        navigator.app.exitApp();
    } else {
        var backToPage = window.sessionStorage.getItem(activePageID + '_backTo');
        if (backToPage != null) {
            backToSpecifiedPage(backToPage, pageVisitedList);
        } else {
            pageVisitedList.pop();
            $.mobile.changePage('#' + pageVisitedList[pageVisitedList.length - 1]);
        }

    }
}

function backToHome() {

    for (; pageVisitedList.length !== 1;) {
        pageVisitedList.pop();
    }

    if (pageVisitedList.length == 1) {
        $.mobile.changePage('#' + pageVisitedList[0]);
    }
}

//退回到某一特定页面
function backToSpecifiedPage(pageID, pageVisitedList) {
    var index = 0;
    for (var i = pageVisitedList.length - 1; i > -1; i--) {
        if (pageVisitedList[i] == pageID) {
            index = i;
        }
    }

    var length = pageVisitedList.length - index - 2;
    for (var i = 0; i < length; i++) {
        pageVisitedList.pop();
    }

    //执行back逻辑
    onBackKeyDown(true);
}