

$("#viewActivitiesRecord").pagecontainer({
    create: function (event, ui) {
        /********************************** variable *************************************/
        var currentID, currentNo, currentModel;
        var recordArr = [];
        /********************************** function *************************************/
        //獲取報名記錄
        window.ActivitiesRecordQuery = function () {

            this.successCallback = function (data) {
                console.log(data);

                if (data["ResultCode"] == "1") {
                    recordArr = data["Content"];
                    var recordContent = "";

                    for (var i in recordArr) {
                        recordContent += '<div class="record-list"><div class="font-style10 font-color2"><div>'
                            + recordArr[i]["SignupName"]
                            + ' / '
                            + recordArr[i]["SignupRelationship"]
                            + ' / '
                            + recordArr[i]["SignupPlaces"]
                            + (recordArr[i]["SignupModel"] == "4" ? "組" : "人")
                            + '</div><div>'
                            + recordArr[i]["ActivitiesName"]
                            + '</div></div><div data-id="'
                            + recordArr[i]["ActivitiesID"]
                            + '" data-no="'
                            + recordArr[i]["SignupNo"]
                            + '" data-model="'
                            + recordArr[i]["SignupModel"]
                            + '">'
                            + (recordArr[i]["CanCancel"] == "Y" ? '<img src="img/delete.png" class="record-delete">' : '')
                            + '</div></div><div class="record-line"></div>';
                    }

                    $("#viewRecordList").empty().append(recordContent).children("div:last-child").remove();

                    $("#viewRecordsNone").hide();

                } else if (data["ResultCode"] == "045909") {
                    $("#viewRecordsNone").show();
                }


                loadingMask("hide");
            };

            this.failCallback = function (data) { };

            var __construct = function () {
                CustomAPI("POST", false, "Activities_Record", self.successCallback, self.failCallback, activitiesListQueryData, "");
            }();

        };


        //取消報名
        window.ActivitiesRecordCancelQuery = function () {

            this.successCallback = function (data) {
                //console.log(data);

                if (data["ResultCode"] == "045913") {
                    ActivitiesListQuery();
                    ActivitiesRecordQuery();
                    $("#signupCancelMsg").fadeIn(100).delay(2000).fadeOut(100);

                } else if (data["ResultCode"] == "045914") {
                    //報名取消失敗
                    popupMsgInit('.recordFailMsg');
                }

                loadingMask("hide");
            };

            this.failCallback = function (data) { };

            var __construct = function () {
                CustomAPI("POST", true, "Activities_Signup_Cancel", self.successCallback, self.failCallback, activitiesRecordCancelQueryData, "");
            }();

        };

        /********************************** page event *************************************/
        $("#viewActivitiesRecord").on("pagebeforeshow", function (event, ui) {
            if (viewRecordInit) {
                //ActivitiesRecordQuery();
                viewRecordInit = false;
            }
        });

        $("#viewActivitiesRecord").on("pageshow", function (event, ui) {

        });

        /********************************** dom event *************************************/
        $("#viewActivitiesRecord").keypress(function (event) {

        });

        //取消報名-popup
        $("#viewRecordList").on("click", ".record-delete", function () {
            currentID = $(this).parent().attr("data-id");
            currentNo = $(this).parent().attr("data-no");
            currentModel = $(this).parent().attr("data-model");

            var recordActName = '', recordTeamName = '';
            for (var i in recordArr) {
                if (currentID == recordArr[i]["ActivitiesID"]) {
                    recordActName = recordArr[i]["ActivitiesName"];

                    if (recordArr[i]["SignupModel"] == "1") {
                        recordTeamName = '<span>' + recordArr[i]["SignupName"] + ' / ' + recordArr[i]["SignupRelationship"] + ' / ' + recordArr[i]["SignupPlaces"] + '人</span>';
                    } else if (recordArr[i]["SignupModel"] == "3") {
                        recordTeamName += '<span>' + recordArr[i]["SignupName"] + ' / ' + recordArr[i]["SignupRelationship"] + ' / ' + recordArr[i]["SignupPlaces"] + '人</span><br>';
                    } else if (recordArr[i]["SignupModel"] == "4") {
                        recordTeamName = '<span>' + recordArr[i]["SignupTeamName"] + '</span>';
                    } else if (recordArr[i]["SignupModel"] == "5") {
                        recordTeamName = '<span>' + recordArr[i]["SignupName"] + ' / ' + recordArr[i]["SignupRelationship"] + ' / ' + recordArr[i]["SignupPlaces"] + '人 / ' + recordArr[i]["SignupTime"] + '</span>';
                    }
                }
            }

            $(".recordSignupMsg .header-title").text(recordActName);
            $(".recordSignupMsg .main-paragraph").empty().append(recordTeamName);
            popupMsgInit('.recordSignupMsg');

        });

        //確定取消報名-API
        $("#confirmCancelRecord").on("click", function () {
            //loadingMask("show");
            activitiesRecordCancelQueryData = '<LayoutHeader><ActivitiesID>'
                + currentID
                + '</ActivitiesID><SignupNo>'
                + currentNo
                + '</SignupNo><SignupModel>'
                + currentModel
                + '</SignupModel><EmployeeNo>'
                + myEmpNo
                + '</EmployeeNo></LayoutHeader>';

            console.log(activitiesRecordCancelQueryData);
            ActivitiesRecordCancelQuery();
        });

    }
});
