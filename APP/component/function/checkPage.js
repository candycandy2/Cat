

//check app page before change
function checkAppPage(pageID) {
    var pageStatus = false;

    for (var i in pageList) {
        if (pageID == pageList[i]) {
            pageStatus = true;
            break;
        }
    }

    if (pageStatus) {
        $.mobile.changePage('#' + pageID);
    } else {
        $.ajax({
            type: 'GET',
            url: serverURL + '/widget/widgetPage/' + pageID + '/' + pageID + '.html',
            dataType: 'html',
            success: function (data) {
                var pageInitial = window.sessionStorage.getItem(pageID);

                if (pageInitial == 'true') {
                    $.mobile.changePage('#' + pageID);

                } else {
                    //1. css
                    var link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.type = 'text/css';
                    link.href = serverURL + '/widget/widgetPage/' + pageID + '/' + pageID + '.css';
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
                    setTimeout(function () {
                        var script = document.createElement('script');
                        script.type = 'text/javascript';
                        script.src = serverURL + '/widget/widgetPage/' + pageID + '/' + pageID + '.js';
                        document.head.appendChild(script);
                        
                        //6. change page
                        $.mobile.changePage('#' + pageID);
                        window.sessionStorage.setItem(pageID, 'true');
                        
                    }, 200);

                }
            },
            error: function () {
                var pageInitial = window.sessionStorage.getItem(pageID);

                if (pageInitial == 'true') {
                    $.mobile.changePage('#' + pageID);

                } else {
                    $.get('View/' + pageID + '.html', function (serverData) {
                        //1. html
                        $.mobile.pageContainer.append(serverData);
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
                        setTimeout(function () {
                            var script = document.createElement('script');
                            script.type = 'text/javascript';
                            script.src = 'js/' + pageID + '.js';
                            document.head.appendChild(script);

                            //5. change page
                            $.mobile.changePage('#' + pageID);
                            window.sessionStorage.setItem(pageID, 'true');

                        }, 200);

                    }, 'html');
                }
            }

        })

    }
}

function setViewLanguage(view) {
    $("#" + view + " .langStr").each(function (index, element) {
        var id = $(element).data("id");

        $(".langStr[data-id='" + id + "']").each(function (index, element) {
            if (langStr[id] !== undefined) {
                $(this).html(langStr[id]);
            }
        });
    });
}

/*because pagebeforeshow event not work first time,
need override pagebeforeshow in index.js*/
// function pageBeforeShow(pageID) {
//     if (pageID == 'viewAppList') {}
// }