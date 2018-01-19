
$("#viewActivitiesDetail").pagecontainer({
    create: function (event, ui) {
        //page init
        /********************************** function *************************************/
        //我要報名
        window.ActivitiesSignupQuery = function() {

            this.successCallback = function(data) {
                console.log(data);

                var resultcode = data['ResultCode'];
                //do something


                loadingMask("hide");
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "Activities_Signup", self.successCallback, self.failCallback, activitiesSignupQueryData, "");
            }();

        };

        //報名管理
        window.ActivitiesSignupManageQuery = function() {

            this.successCallback = function(data) {
                console.log(data);

                var resultcode = data['ResultCode'];
                //do something


                loadingMask("hide");
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "Activities_Signup_Manage", self.successCallback, self.failCallback, activitiesSignupManageQueryData, "");
            }();

        };

        function showViewByModel(view, model) {
            $.each($("#"+view+" .page-main > div"), function(index, item) {
                if($(item).attr("data-model") == model) {
                    $(item).show();
                } else {
                    $(item).hide();
                }
            });
        }


        /********************************** page event *************************************/
        $("#viewActivitiesDetail").on("pagebeforeshow", function (event, ui) {
            
        });

        $("#viewActivitiesDetail").on("pageshow", function (event, ui) {

        });

        /********************************** dom event *************************************/
        $("#viewActivitiesDetail").keypress(function (event) {

        });

        //從詳情頁返回列表
        $("#viewActivitiesDetail .back-list").on("click", function () {
            changePageByPanel("viewActivitiesList", false);
        });

        //點擊 "開始報名" 跳轉到編輯頁
        $(".detail-signup-btn").on("click", function () {
            activitiesSignupQueryData = '<LayoutHeader><ActivitiesID>'
                + actID
                + '</ActivitiesID><SignModel>'
                + actModel
                + '</SignModel><EmployeeNo>'
                + myEmpNo
                + '</EmployeeNo></LayoutHeader>';

            console.log(activitiesSignupQueryData);

            //ActivitiesSignupQuery();
            
            changePageByPanel("viewActivitiesSignup", true);

            showViewByModel("viewActivitiesSignup", actModel);

        });

        //點擊 "報名管理" 跳轉到編輯頁
        $(".detail-manage-btn").on("click", function () {
            activitiesSignupManageQueryData = '<LayoutHeader><ActivitiesID>'
                + actID
                + '</ActivitiesID><SignModel>'
                + actModel
                + '</SignModel><EmployeeNo>'
                + myEmpNo
                + '</EmployeeNo></LayoutHeader>';

            console.log(activitiesSignupManageQueryData);
        
            //ActivitiesSignupManageQuery();

            changePageByPanel("viewActivitiesManage", true);

            showViewByModel("viewActivitiesManage", actModel);

        });





    }
});
