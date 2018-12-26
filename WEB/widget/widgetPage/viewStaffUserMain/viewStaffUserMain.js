$("#viewStaffUserMain").pagecontainer({
    create: function(event, ui) {

        var imgURL = '/widget/widgetPage/viewStaffUserMain/img/',
            staffKey = 'appempservice';

        function getBoardType() {
            let queryData = "<LayoutHeader><emp_no>" +
                loginData["emp_no"] +
                "</emp_no><source>" +
                staffKey +
                appEnvironment +
                "</source></LayoutHeader>";

            var successCallback = function(data) {

                if(data['ResultCode'] == '1') {
                    let boardArr = data['Content']['board_list'];
                    let boardObj = {};
                    for(var i in boardArr) {
                        if(boardArr[i].board_name == 'staffFAQ') {
                            boardObj['staffFAQ'] = boardArr[i];

                        } else if(boardArr[i].board_name == 'staffAnnounce') {
                            boardObj['staffAnnounce'] = boardArr[i];
                        }
                    }
                    boardObj['lastUpdateTime'] = new Date();
                    window.localStorage.setItem('staffBoardType', JSON.stringify(boardObj));
                }

            };

            var failCallback = function(data) {};

            var __construct = function() {
                let staffBoardType = JSON.parse(window.localStorage.getItem('staffBoardType'));
                if(staffBoardType == null || checkDataExpired(staffBoardType['lastUpdateTime'], 1, 'dd')) {
                    QForumPlugin.CustomAPI("POST", true, "getBoardList", successCallback, failCallback, queryData, "");
                }
            }();
        }


        /********************************** page event ***********************************/
        $("#viewStaffUserMain").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewStaffUserMain").one("pageshow", function(event, ui) {
            var mainHeight = window.sessionStorage.getItem('pageMainHeight');
            $('#viewStaffUserMain .page-main').css('height', mainHeight);

            $('.tea-user-photo').attr('src', serverURL + imgURL + 'default_photo.png');
            $('.tea-user-name').text(loginData['loginid']);
            $('.tea-user-today').text(new Date().toLocaleDateString(browserLanguage, {month: 'long', day: 'numeric', weekday:'long'}));

            $('.subtract').attr('src', serverURL + imgURL + 'subtraction_gray.png');
            $('.add').attr('src', serverURL + imgURL + 'addition_blue.png');
            $('.room-refresh').attr('src', serverURL + imgURL + 'loading.png');
            //获取所有staff的board主题
            getBoardType();
        });

        $("#viewStaffUserMain").on("pageshow", function(event, ui) {

        });

        $("#viewStaffUserMain").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/


    }
});