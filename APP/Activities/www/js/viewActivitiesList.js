
$("#viewActivitiesList").pagecontainer({
    create: function (event, ui) {
        //page init
        /********************************** function *************************************/
        window.ActivitiesListQuery = function () {

            this.successCallback = function (data) {
                //console.log(data);

                if (data["ResultCode"] == "1") {
                    var activitiesArr = data["Content"];
                    var openContent = "";
                    var closeContent = "";

                    for (var i in activitiesArr) {
                        if (activitiesArr[i]["ActivitiesStatus"] == "Y") {
                            openContent += '<div class="activity-list" data-id="'
                                + activitiesArr[i]["ActivitiesID"]
                                + '" data-status="'
                                + activitiesArr[i]["ActivitiesStatus"]
                                + '"><div class="activity-list-img"><img src="'
                                + activitiesArr[i]["ActivitiesImage"]
                                + '"></div><div class="activity-list-info font-color2"><div class="font-style10">'
                                + activitiesArr[i]["ActivitiesName"]
                                + '</div><div class="font-style11"><span>名額:'
                                + activitiesArr[i]["QuotaPlaces"]
                                + '</span>&nbsp;&nbsp;<span>剩餘:'
                                + activitiesArr[i]["RemainingPlaces"]
                                + '</span></div><div class="font-style11"><span>報名期間:'
                                + activitiesArr[i]["SignupDate"]
                                + '</span></div></div></div><div class="activity-line"></div>';

                        } else if (activitiesArr[i]["ActivitiesStatus"] == "N") {
                            closeContent += '<div class="activity-list" data-id="'
                                + activitiesArr[i]["ActivitiesID"]
                                + '" data-status="'
                                + activitiesArr[i]["ActivitiesStatus"]
                                + '"><div class="activity-list-img"><img src="'
                                + activitiesArr[i]["ActivitiesImage"]
                                + '"></div><div class="activity-list-info font-color2"><div class="font-style10">'
                                + activitiesArr[i]["ActivitiesName"]
                                + '</div><div class="font-style11"><span>名額:'
                                + activitiesArr[i]["QuotaPlaces"]
                                + '</span>&nbsp;&nbsp;<span>剩餘:'
                                + activitiesArr[i]["RemainingPlaces"]
                                + '</span></div><div class="font-style11"><span>報名期間:'
                                + activitiesArr[i]["SignupDate"]
                                + '</span></div></div></div><div class="activity-line"></div>';
                        }
                    }

                    $("#openList").empty().append(openContent).children("div:last-child").remove();
                    $("#closeList").empty().append(closeContent).children("div:last-child").remove();

                    // $("#viewActivitiesNone").hide();
                    // $("#viewActivitiesList").show();
                    
                } else if (data["ResultCode"] == "045901") {
                    // $("#viewActivitiesList").hide();
                    // $("#viewActivitiesNone").show();
                }

                loadingMask("hide");

            };

            this.failCallback = function (data) { };

            var __construct = function () {
                CustomAPI("POST", false, "Activities_List", self.successCallback, self.failCallback, activitiesListQueryData, "");
            }();

        };

        window.ActivitiesDetailQuery = function (status) {

            var self = this;

            this.successCallback = function (data) {
                loadingMask("hide");

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
                    if (status == "Y") {
                        if (isSignup == "Y" && actModel !== 4) {
                            //管理
                            showBtnByID("alreadyBtn", isSignup);
                        } else if (isSignup == "Y" && actModel == 4) {
                            //報名、管理
                            showBtnByID("continueBtn", isSignup);
                        } else if (isSignup == "N" && isRepeatSignup == "Y") {
                            //已報名同類活動
                            showBtnByID("repeatBtn", isSignup);
                        } else if (isSignup == "N" && isRepeatSignup == "N" && isFull == "Y") {
                            //已滿額
                            showBtnByID("fullBtn", isSignup);
                        } else if (isSignup == "N" && isRepeatSignup == "N" && isFull == "N") {
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
                    $.each($("#detailContent img"), function(index, item) {
                        var imgWidth = $(item).attr("width");
                        var imgHeight = $(item).attr("height");
                        var imgRatio = (imgWidth / imgHeight).toFixed(2);
                        //console.log(imgRatio);
                        $(item).css("width", "92.58vw");
                        $(item).css("height", 92.58/imgRatio + "vw");

                    });

                    changePageByPanel("viewActivitiesDetail", true);

                }

            };

            this.failCallback = function (data) { };

            var __construct = function () {
                CustomAPI("POST", true, "Activities_Detail", self.successCallback, self.failCallback, activitiesDetailQueryData, "");
            }();

        };



        function showBtnByID(btn, bl) {
            $.each($(".detail-footer > div"), function (index, item) {
                if ($(item).attr("id") == btn) {
                    $(item).show();
                } else {
                    $(item).hide();
                }
            });

            if (bl == "Y") {
                $(".detail-header-after").show();
            } else {
                $(".detail-header-after").hide();
            }
        }

        /********************************** page event *************************************/
        $("#viewActivitiesList").on("pagebeforeshow", function (event, ui) {

        });

        /********************************** dom event *************************************/
        $("#viewActivitiesList").keypress(function (event) {

        });

        $(document).on("click", ".activity-list", function () {
            var actNo = $(this).attr("data-id");
            activitiesDetailQueryData = '<LayoutHeader><ActivitiesID>'
                + actNo
                + '</ActivitiesID><EmployeeNo>'
                + myEmpNo
                + '</EmployeeNo></LayoutHeader>';

            var actStatus = $(this).attr("data-status");

            ActivitiesDetailQuery(actStatus);

        });

        //點擊活動列表，跳轉到詳情頁
        // $("#openList .activity-list").on("click", function () {
        //     var actNo = $(this).attr("data-no");
        //     activitiesDetailQueryData = '<LayoutHeader><ActivitiesID>'
        //         + 2025
        //         + '</ActivitiesID><EmployeeNo>'
        //         + myEmpNo
        //         + '</EmployeeNo></LayoutHeader>';

        //     //ActivitiesDetailQuery();

        //     if (actNo == "1") {
        //         actModel = 4;
        //         isSignup = "N";
        //         isFull = "N";
        //         isRepeatSignup = "N";
        //     } else if (actNo == "2") {
        //         actModel = 4;
        //         isSignup = "Y";
        //         isFull = "N";
        //         isRepeatSignup = "N";
        //     } else if (actNo == "3") {
        //         actModel = 1;
        //         isSignup = "N";
        //         isFull = "N";
        //         isRepeatSignup = "N";
        //     } else if (actNo == "4") {
        //         actModel = 1;
        //         isSignup = "Y";
        //         isFull = "N";
        //         isRepeatSignup = "N";
        //     } else if (actNo == "5") {
        //         actModel = 3;
        //         isSignup = "N";
        //         isFull = "N";
        //         isRepeatSignup = "N";
        //     } else if (actNo == "6") {
        //         actModel = 3;
        //         isSignup = "Y";
        //         isFull = "N";
        //         isRepeatSignup = "N";
        //     } else if (actNo == "7") {
        //         actModel = 5;
        //         isSignup = "N";
        //         isFull = "N";
        //         isRepeatSignup = "N";
        //     } else if (actNo == "8") {
        //         actModel = 5;
        //         isSignup = "Y";
        //         isFull = "N";
        //         isRepeatSignup = "N";
        //     }

        //     changePageByPanel("viewActivitiesDetail", true);

        //     if (isSignup == "Y" && actModel !== 4) {
        //         //管理
        //         showBtnByID("alreadyBtn", isSignup);
        //     } else if (isSignup == "Y" && actModel == 4) {
        //         //報名、管理
        //         showBtnByID("continueBtn", isSignup);
        //     } else if (isSignup == "N" && isRepeatSignup == "Y") {
        //         //已報名同類活動
        //         showBtnByID("repeatBtn", isSignup);
        //     } else if (isSignup == "N" && isRepeatSignup == "N" && isFull == "Y") {
        //         //已滿額
        //         showBtnByID("fullBtn", isSignup);
        //     } else if (isSignup == "N" && isRepeatSignup == "N" && isFull == "N") {
        //         //報名 
        //         showBtnByID("beginBtn", isSignup);
        //     }


        // });

        //從編輯也返回詳情頁
        $("#viewActivitiesList .back-detail").on("click", function () {
            changePageByPanel("viewActivitiesDetail", false);
        });
    }
});
