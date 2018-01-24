

$("#viewActivitiesRecord").pagecontainer({
    create: function (event, ui) {
        /********************************** variable *************************************/
        var currentID, currentNo, currentModel;
        /********************************** function *************************************/
        //獲取報名記錄
        window.ActivitiesRecordQuery = function () {

            this.successCallback = function (data) {
                console.log(data);

                if (data["ResultCode"] == "1") {
                    var recordArr = data["Content"];
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
                console.log(data);

                if (data["ResultCode"] == "045913") {
                    ActivitiesListQuery();
                    ActivitiesRecordQuery();

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

        //取消報名
        $(document).on("click", ".record-delete", function () {
            currentID = $(this).parent().attr("data-id");
            currentNo = $(this).parent().attr("data-no");
            currentModel = $(this).parent().attr("data-model");

            recordActName = $(this).parent().prev().children("div:eq(1)").text();
            recordTeamName = $(this).parent().prev().children("div:eq(0)").text();

            $(".recordSignupMsg .header-title").text(recordActName);
            $(".recordSignupMsg .main-paragraph").text(recordTeamName);
            popupMsgInit('.recordSignupMsg');

        });


        $("#recordSignup").on("click", function () {
            loadingMask("show");
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
