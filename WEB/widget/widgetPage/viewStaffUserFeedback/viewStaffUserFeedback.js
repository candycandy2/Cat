$("#viewStaffUserFeedback").pagecontainer({
    create: function(event, ui) {

        let imgURL = '/widget/widgetPage/viewStaffUserFeedback/img/';
        let statusList = ['請選擇', '投影機故障', '缺訊號線', '文具損毀/遺失', '燈泡故障', '空調故障', '其他']

        function initFeedback() {
            //1. site code
            let siteData = {
                id: "feedbackSite",
                option: [],
                title: "",
                defaultText: langStr['wgt_038'],
                changeDefaultText: true,
                attr: {
                    class: "dropdown-arrow"
                }
            }

            siteData["option"][0] = {};
            siteData["option"][0]["value"] = "1";
            siteData["option"][0]["text"] = "BQT";
            siteData["option"][1] = {};
            siteData["option"][1]["value"] = "2";
            siteData["option"][1]["text"] = "QTT";

            tplJS.DropdownList("viewStaffUserFeedback", "staffSiteCode", "prepend", "typeB", siteData);

            //2. meeting room
            let roomData = {
                id: "feedbackRoom",
                option: [],
                title: "",
                defaultText: langStr['wgt_038'],
                changeDefaultText: true,
                attr: {
                    class: "dropdown-arrow"
                }
            }

            roomData["option"][0] = {};
            roomData["option"][0]["value"] = "1";
            roomData["option"][0]["text"] = "T01";
            roomData["option"][1] = {};
            roomData["option"][1]["value"] = "2";
            roomData["option"][1]["text"] = "T02";

            tplJS.DropdownList("viewStaffUserFeedback", "staffMeetingRoom", "prepend", "typeB", roomData);

            //3. device status
            let statusData = {
                id: "feedbackStatus",
                option: [],
                title: "",
                defaultText: langStr['wgt_038'],
                changeDefaultText: true,
                attr: {
                    class: "dropdown-arrow"
                }
            }


            for(var i = 0; i < statusList.length; i++) {
                statusData["option"][i] = {};
                statusData["option"][i]["value"] = i;
                statusData["option"][i]["text"] = statusList[i];
            }

            tplJS.DropdownList("viewStaffUserFeedback", "staffDeviceStatus", "prepend", "typeB", statusData);
        }


        /********************************** page event ***********************************/
        $("#viewStaffUserFeedback").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewStaffUserFeedback").one("pageshow", function(event, ui) {
            var mainHeight = getPageMainHeight('viewStaffUserFeedback');
            $('#viewStaffUserFeedback .page-main').css('height', mainHeight + 'px');

            initFeedback();
        });

        $("#viewStaffUserFeedback").on("pageshow", function(event, ui) {

        });

        $("#viewStaffUserFeedback").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/
        

    }
});