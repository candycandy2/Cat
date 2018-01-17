
$("#viewActivitiesDetail").pagecontainer({
    create: function (event, ui) {
        //page init
        /********************************** function *************************************/
        window.ActivitiesSignupQuery = function() {

            var self = this;

            this.successCallback = function(data) {
                loadingMask("hide");
                console.log(data);

                var resultcode = data['ResultCode'];
                //do something
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "Activities_Signup", self.successCallback, self.failCallback, activitiesSignupQueryData, "");
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
            activitiesSignupQueryData = '<LayoutHeader><ActivitiesID>'
                + 2025
                + '</ActivitiesID><SignModel>'
                + actModel
                + '</SignModel><EmployeeNo>'
                + myEmpNo
                + '</EmployeeNo></LayoutHeader>';
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
            changePageByPanel("viewActivitiesSignup", true);

            showViewByModel("viewActivitiesSignup", actModel);

            //ActivitiesSignupQuery();
            
        });

        //點擊 "報名管理" 跳轉到編輯頁
        $(".detail-manage-btn").on("click", function () {
            changePageByPanel("viewActivitiesManage", true);

            showViewByModel("viewActivitiesManage", actModel);

            //ActivitiesSignupQuery();
        });





    }
});
