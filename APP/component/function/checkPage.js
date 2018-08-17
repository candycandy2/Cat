

//check app page before change
function checkAppPage(pageID) {
    var appStatus = false;

    for (var i in pageList) {
        if (pageID == pageList[i]) {
            appStatus = true;
            break;
        }
    }

    if (appStatus) {
        $.mobile.changePage('#' + pageID);
    } else {
        $.get('View/' + pageID + '.html', function (data) {
            $.mobile.pageContainer.append(data);
            $('#' + pageID).page().enhanceWithin();

            //set current page language
            setViewLanguage(pageID);

            //Show Water Mark
            //According to the data [waterMarkPageList] which set in index.js
            if (!(typeof waterMarkPageList === 'undefined')) {
                if (waterMarkPageList.indexOf(pageID) !== -1) {
                    $('#' + pageID).css('background-color', 'transparent');
                }
            }

            setTimeout(function () {
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = 'js/' + pageID + '.js';
                document.head.appendChild(script);

                $.mobile.changePage('#' + pageID);
                $('#' + pageID).on('pagebeforeshow', pageBeforeShow(pageID));
                pageList.push(pageID);
            }, 200);

        }, 'html');
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