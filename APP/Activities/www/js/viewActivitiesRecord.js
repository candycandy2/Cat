

$("#viewActivitiesRecord").pagecontainer({
    create: function (event, ui) {
        //page init
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
            loadingMask("show");
            var acID = $(this).parent().attr("data-id");
            var siNo = $(this).parent().attr("data-no");
            var model = $(this).parent().attr("data-model");

            activitiesSignupCancelQueryData = '<LayoutHeader><ActivitiesID>'
                + acID
                + '</ActivitiesID><SignupNo>'
                + siNo
                + '</SignupNo><SignupModel>'
                + model
                + '</SignupModel><EmployeeNo>'
                + myEmpNo
                + '</EmployeeNo></LayoutHeader>';

            console.log(activitiesSignupCancelQueryData);

            ActivitiesSignupCancelQuery();

        });
    }
});
