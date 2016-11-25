$(document).one("pagecreate", "#viewSettingList", function() {

        $("#viewSettingList").pagecontainer({
            create: function(event, ui) {

                /********************************** function *************************************/

                function queryQuickReserve() {

                    // var obj = new Object();
                    // obj.id = "0001"
                    // obj.title = "BenQ會議室";
                    // obj.people = "none";
                    // obj.time = "0830";
                    // obj.floor = "1f,2f,3f";

                    // localStorage.setItem('localData', JSON.stringify(obj));

                    var data = JSON.parse(localStorage.getItem('localData'));
                    var htmlContent = "";

                    for (var i = 0, item; item = data['content'][i]; i++) {
                        htmlContent
                            += replace_str($('#setting').get(0).outerHTML, item);
                    }

                    $("#setting").remove();
                    $("#default").after(htmlContent);

                }

                /********************************** page event *************************************/
                $("#viewSettingList").on("pagebeforeshow", function(event, ui) {
                    // loadingMask("show");
                    queryQuickReserve();
                });

                /********************************** dom event *************************************/
                function replace_str(content, item) {

                    var peopleStr = (item.people == 'none') ? "不限" : item.people;
                    // var start_time = new Date(item.time);
                    // var end_time = end_time.setMinutes(start_time.getMinutes() + 30);
                    // var timeStr = (item.time == 'hour') ? "現在起一小時" : start_time + ' - ' + end_time;
                    var floorStr = (item.floor == 'none') ? "不限" : item.floor;

                    return content
                        .replace('index', item.id)
                        .replace('title', item.title)
                        .replace('people', peopleStr)
                        .replace('time', item.time)
                        .replace('floor', floorStr);
                }
            }
        });

    });