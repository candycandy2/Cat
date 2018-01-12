
$("#viewActivitiesList").pagecontainer({
    create: function(event, ui) {
        //page init
        /********************************** function *************************************/
        window.ActivitiesListQuery = function() {

            var self = this;

            this.successCallback = function(data) {
                loadingMask("hide");
                console.log(data);

                if(data["ResultCode"] == "1") {

                } else if(data["ResultCode"] == "045901") {

                }
                

                
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "Activities_List", self.successCallback, self.failCallback, activitiesListQueryData, "");
            }();

        };


        function showBtnByID(btn, bl) {
            $.each($(".detail-footer > div"), function(index, item) {
                if($(item).attr("id") == btn) {
                    $(item).show();
                } else {
                    $(item).hide();
                }
            });

            if(bl == "Y") {
                $(".detail-header-after").show();
            } else {
                $(".detail-header-after").hide();
            }
        }

        /********************************** page event *************************************/
        $("#viewActivitiesList").on("pagebeforeshow", function(event, ui) {
            
        });

        /********************************** dom event *************************************/
        $("#viewActivitiesList").keypress(function(event) {

        });

        //點擊活動列表，跳轉到詳情頁
        $("#openList .activity-list").on("click", function() {
            var actNo = $(this).attr("data-no");
            activitiesDetailQueryData = '<LayoutHeader><ActivitiesID>'
                + 2025
                + '</ActivitiesID><EmployeeNo>'
                + myEmpNo
                + '</EmployeeNo></LayoutHeader>';

            //ActivitiesDetailQuery();

            if(actNo == "1") {
                actModel = 4;
                isSignup = "N";
                isFull = "N";
                isRepeatSignup = "N";
            } else if(actNo == "2") {
                actModel = 4;
                isSignup = "Y";
                isFull = "N";
                isRepeatSignup = "N";
            } else if(actNo == "3") {
                actModel = 1;
                isSignup = "N";
                isFull = "N";
                isRepeatSignup = "N";
            } else if(actNo == "4") {
                actModel = 1;
                isSignup = "Y";
                isFull = "N";
                isRepeatSignup = "N";
            } else if(actNo == "5") {
                actModel = 3;
                isSignup = "N";
                isFull = "N";
                isRepeatSignup = "N";
            } else if(actNo == "6") {
                actModel = 3;
                isSignup = "Y";
                isFull = "N";
                isRepeatSignup = "N";
            } else if(actNo == "7") {
                actModel = 5;
                isSignup = "N";
                isFull = "N";
                isRepeatSignup = "N";
            } else if(actNo == "8") {
                actModel = 5;
                isSignup = "Y";
                isFull = "N";
                isRepeatSignup = "N";
            }

            changePageByPanel("viewActivitiesDetail", true);

            if(isSignup == "Y" && actModel !== 4) {
                //管理
                showBtnByID("alreadyBtn", isSignup);
            } else if(isSignup == "Y" && actModel == 4) {
                //報名、管理
                showBtnByID("continueBtn", isSignup);
            } else if(isSignup == "N" && isRepeatSignup == "Y") {
                //已報名同類活動
                showBtnByID("repeatBtn", isSignup);
            } else if(isSignup == "N" && isRepeatSignup == "N" && isFull == "Y") {
                //已滿額
                showBtnByID("fullBtn", isSignup);
            } else if(isSignup == "N" && isRepeatSignup == "N" && isFull == "N") {
                //報名 
                showBtnByID("beginBtn", isSignup);
            }


        });

        //從編輯也返回詳情頁
        $("#viewActivitiesList .back-detail").on("click", function() {
            changePageByPanel("viewActivitiesDetail", false);
        });
    }
});
