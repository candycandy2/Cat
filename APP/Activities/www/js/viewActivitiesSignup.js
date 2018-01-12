
$("#viewActivitiesSignup").pagecontainer({
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

        /********************************** page event *************************************/
        $("#viewActivitiesSignup").on("pagebeforeshow", function(event, ui) {
            
        });

        /********************************** dom event *************************************/
        $("#viewActivitiesSignup").keypress(function(event) {

        });

        //點擊活動列表，跳轉到詳情頁
        $("#openList .activity-list").on("click", function() {
            var actNo = $(this).attr("data-no");
            activitiesDetailQueryData = '<LayoutHeader><ActivitiesID>'
                + actNo
                + '</ActivitiesID><EmployeeNo>'
                + myEmpNo
                + '</EmployeeNo></LayoutHeader>';

            //ActivitiesDetailQuery();

            changePageByPanel("viewActivitiesDetail", true);
            if(actNo == "1") {
                $(".detail-header-after").hide();
                $("#teamToManage").hide();
                $("#teamToSignup").show();
                actModel = 4;
                isSignup = false;
            } else if(actNo == "2") {
                $("#teamToSignup").hide();
                $(".detail-header-after").show();
                $("#teamToManage").show();
                actModel = 4;
                isSignup = true;
            } else if(actNo == "3") {
                $(".detail-header-after").hide();
                $("#teamToManage").hide();
                $("#teamToSignup").show();
                actModel = 1;
                isSignup = false;
            } else if(actNo == "4") {
                isSignup = true;
                actModel = 1;
            }
        });

        //從編輯也返回詳情頁
        $("#viewActivitiesSignup .back-detail").on("click", function() {
            changePageByPanel("viewActivitiesDetail", false);
        });
    }
});
