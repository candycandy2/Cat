
$("#viewActivitiesDetail").pagecontainer({
    create: function (event, ui) {
        //page init
        /********************************** function *************************************/
        window.ActivitiesDetailQuery = function () {

            var self = this;

            this.successCallback = function (data) {
                loadingMask("hide");

                if (data["ResultCode"] == "1") {
                    var activityObj = data["Content"][0];
                    console.log(activityObj);

                    $("#detailThumbnail").attr("src", activityObj["ActivitiesImage"]);
                    //$("#detailName").text(activityObj["ActivitiesName"]);
                    $("#detailPlace").text(activityObj["QuotaPlaces"]);
                    $("#detailLimit").text(activityObj["LimitPlaces"]);
                    $("#detailDate").text(activityObj["SignupDate"]);
                    $("#detailPeople").text(activityObj["SignupPlaces"]);
                    $("#detailUser").text(activityObj["SignupPlaces"]);

                    isRepeatSignup = activityObj["IsRepeatSignup"];
                    isFull = activityObj["IsFull"];
                    isSignup = activityObj["IsSignup"];
                    actModel = activityObj["SignupModel"];

                    switch (actModel) {
                        case 1:
                            modelName = "Person";
                            break;
                        case 3:
                            modelName = "Family";
                            break;
                        case 4:
                            modelName = "Time";
                            break;
                        case 5:
                            modelName = "Team";
                            break;
                    }

                    switch (isSignup) {
                        case "N":
                            viewName = "Signup";
                            break;
                        case "Y":
                            viewName = "Manage";
                            break;
                    }

                    //根據是否報名，是否滿額等條件判斷顯示不同按鈕
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
                        showBtnByID("beginBtn");
                    }


                }

            };

            this.failCallback = function (data) { };

            var __construct = function () {
                CustomAPI("POST", true, "Activities_Detail", self.successCallback, self.failCallback, activitiesDetailQueryData, "");
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
            changePageByPanel("viewActivitiesSignup", true);

            showViewByModel("viewActivitiesSignup", actModel);
            
        });

        //點擊 "報名管理" 跳轉到編輯頁
        $(".detail-manage-btn").on("click", function () {
            changePageByPanel("viewActivitiesManage", true);

            showViewByModel("viewActivitiesManage", actModel);
        });





    }
});
