
$("#viewActivitiesList").pagecontainer({
    create: function (event, ui) {
        /********************************** variable *************************************/
        var lastActNo;


        /********************************** function *************************************/
        window.ActivitiesListQuery = function () {

            this.successCallback = function (data) {
                console.log(data);

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
                                + '</span>&nbsp;&nbsp;&nbsp;<span>剩餘:'
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
                                + '</span>&nbsp;&nbsp;&nbsp;<span>剩餘:'
                                + activitiesArr[i]["RemainingPlaces"]
                                + '</span></div><div class="font-style11"><span>報名期間:'
                                + activitiesArr[i]["SignupDate"]
                                + '</span></div></div></div><div class="activity-line"></div>';
                        }
                    }

                    $("#openList").empty().append(openContent).children("div:last-child").remove();
                    $("#closeList").empty().append(closeContent).children("div:last-child").remove();
                    
                } else if (data["ResultCode"] == "045901") {
                    $("#viewActivitiesContent").hide();
                    $("#viewActivitiesNone").show();
                }

                loadingMask("hide");

            };

            this.failCallback = function (data) { };

            var __construct = function () {
                CustomAPI("POST", false, "Activities_List", self.successCallback, self.failCallback, activitiesListQueryData, "");
            }();

        };


        /********************************** page event *************************************/
        $("#viewActivitiesList").on("pagebeforeshow", function (event, ui) {

        });

        /********************************** dom event *************************************/
        $("#viewActivitiesList").keypress(function (event) {

        });


        $("#viewActivitiesContent").on("click", ".activity-list", function(e) {
            var actNo = $(this).attr("data-id");
            var actStatus = $(this).attr("data-status");

            activitiesDetailQueryData = '<LayoutHeader><ActivitiesID>'
                + actNo
                + '</ActivitiesID><EmployeeNo>'
                + myEmpNo
                + '</EmployeeNo></LayoutHeader>';

            ActivitiesDetailQuery(actStatus);
        });

        //從編輯也返回詳情頁
        $("#viewActivitiesList .back-detail").on("click", function () {
            changePageByPanel("viewActivitiesDetail", false);
        });
    }
});
