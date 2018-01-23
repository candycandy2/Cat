
$("#viewActivitiesDetail").pagecontainer({
    create: function (event, ui) {
        /********************************** function *************************************/
        var isFull, isRepeatSignup, isSignup, actModel, actID, modelName, viewName;

        //活動詳情
        window.ActivitiesDetailQuery = function (status) {

            this.successCallback = function (data) {
                if (data["ResultCode"] == "1") {
                    var activityObj = data["Content"][0];
                    console.log(activityObj);

                    $("#detailThumbnail").attr("src", activityObj["ActivitiesImage"]);
                    $("#detailName").text(activityObj["ActivitiesName"]);
                    $("#detailPlace").text(activityObj["QuotaPlaces"]);
                    $("#detailLimit").text(activityObj["LimitPlaces"]);
                    $("#detailPeople").text(activityObj["ActivitiesPlaces"]);
                    $("#detailUser").text(activityObj["SignupPlaces"]);
                    $("#detailDate").text(activityObj["SignupDate"]);
                    $("#detailContent").empty().append(activityObj["ActivitiesContent"]);

                    isRepeatSignup = activityObj["IsRepeatSignup"];
                    isFull = activityObj["IsFull"];
                    isSignup = activityObj["IsSignup"];
                    actModel = activityObj["SignupModel"];
                    actID = activityObj["ActivitiesID"];

                    //根據是否報名，是否滿額等條件判斷顯示不同按鈕
                    if (status == "Y") {
                        if (isSignup == "Y" && actModel !== 4) {
                            //管理
                            showBtnByID("alreadyBtn", isSignup);
                        } else if (isSignup == "Y" && isFull == "N" && actModel == 4) {
                            //報名、管理
                            showBtnByID("continueBtn", isSignup);
                        } else if (isSignup == "Y" && isFull == "Y" && actModel == 4) {
                            //管理
                            showBtnByID("alreadyBtn", isSignup);
                        } else if (isSignup == "N" && isFull == "Y") {
                            //已滿額
                            showBtnByID("fullBtn", isSignup);
                        } else if (isSignup == "N" && isFull == "N") {
                            //報名 
                            showBtnByID("beginBtn", isSignup);
                            $("#beginBtn").removeClass("btn-disabled");
                        }
                    } else if (status == "N") {
                        //未開放報名的活動，反灰且不可選“我要報名”
                        showBtnByID("beginBtn", isSignup);
                        $("#beginBtn").addClass("btn-disabled");
                    }


                    //處理圖片大小問題
                    $.each($("#detailContent img"), function (index, item) {
                        var imgWidth = $(item).attr("width");
                        var imgHeight = $(item).attr("height");
                        var imgRatio = (imgWidth / imgHeight).toFixed(2);
                        //console.log(imgRatio);
                        $(item).css("width", "92.58vw");
                        $(item).css("height", 92.58 / imgRatio + "vw");

                    });

                    changePageByPanel("viewActivitiesDetail", true);

                }

                loadingMask("hide");

            };

            this.failCallback = function (data) { };

            var __construct = function () {
                CustomAPI("POST", true, "Activities_Detail", self.successCallback, self.failCallback, activitiesDetailQueryData, "");
            }();

        };

        //根據不同活動類型，show不同頁面
        function showViewByModel(view, model) {
            $.each($("#" + view + " .page-main > div"), function (index, item) {
                if ($(item).attr("data-model") == model) {
                    $(item).show();
                } else {
                    $(item).hide();
                }
            });
        }

        //根絕不同活動類型，show不同按鈕
        function showBtnByID(btn, bl) {
            $.each($(".detail-footer > div"), function (index, item) {
                if ($(item).attr("id") == btn) {
                    $(item).show();
                } else {
                    $(item).hide();
                }
            });

            if (bl == "Y") {
                $(".detail-header-signuped").show();
            } else {
                $(".detail-header-signuped").hide();
            }
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
            if (isRepeatSignup == "Y") {
                //已報名同類活動，不能報名該活動
                popupMsgInit('.signupedSameMsg');
            } else if (isRepeatSignup == "N") {
                activitiesSignupQueryData = '<LayoutHeader><ActivitiesID>'
                    + actID
                    + '</ActivitiesID><SignupModel>'
                    + actModel
                    + '</SignupModel><EmployeeNo>'
                    + myEmpNo
                    + '</EmployeeNo></LayoutHeader>';

                //console.log(activitiesSignupQueryData);

                ActivitiesSignupQuery(actModel);

                showViewByModel("viewActivitiesSignup", actModel);
                changePageByPanel("viewActivitiesSignup", true);
            }

        });

        //點擊 "報名管理" 跳轉到編輯頁
        $(".detail-manage-btn").on("click", function () {
            activitiesSignupManageQueryData = '<LayoutHeader><ActivitiesID>'
                + actID
                + '</ActivitiesID><SignupModel>'
                + actModel
                + '</SignupModel><EmployeeNo>'
                + myEmpNo
                + '</EmployeeNo></LayoutHeader>';

            //console.log(activitiesSignupManageQueryData);

            ActivitiesSignupManageQuery(actModel);

            showViewByModel("viewActivitiesManage", actModel);
            changePageByPanel("viewActivitiesManage", true);

        });





    }
});
