

$("#viewActivitiesRecord").pagecontainer({
    create: function (event, ui) {
        /********************************** variable *************************************/
        var currentID, currentNo, currentModel, recordOverTime;

        /********************************** function *************************************/
        //獲取報名記錄
        window.ActivitiesRecordQuery = function () {

            this.successCallback = function (data) {
                //console.log(data);

                if (data["ResultCode"] == "1") {
                    recordArr = data["Content"];

                    //動態生成html
                    var recordContent = "";
                    for (var i in recordArr) {
                        recordContent += '<div class="record-list"><div class="font-style10 font-color2 record-detail"><div>'
                            + recordArr[i]["SignupName"]
                            + ' / '
                            + recordArr[i]["SignupRelationship"]
                            + ' / '
                            + recordArr[i]["SignupPlaces"]
                            + (recordArr[i]["SignupModel"] == "4" ? langStr["str_074"] : langStr["str_058"])
                            + '</div><div>'
                            + recordArr[i]["ActivitiesName"]
                            + '</div></div><div data-id="'
                            + recordArr[i]["ActivitiesID"]
                            + '" data-no="'
                            + recordArr[i]["SignupNo"]
                            + '" data-model="'
                            + recordArr[i]["SignupModel"]
                            + '" data-over="'
                            + recordArr[i]["Deadline"]
                            + '">'
                            + (recordArr[i]["CanCancel"] == "Y" ? '<img src="img/delete.png" class="record-delete">' : '')
                            + '</div></div><div class="record-line"></div>';
                    }

                    $("#viewRecordList").empty().append(recordContent).children("div:last-child").remove();

                    $("#viewRecordsNone").hide();

                } else if (data["ResultCode"] == "045909") {
                    $("#viewRecordList").empty();
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
        window.ActivitiesRecordCancelQuery = function (model) {

            this.successCallback = function (data) {
                //console.log(data);

                if (data["ResultCode"] == "045913") {
                    ActivitiesListQuery();
                    ActivitiesRecordQuery();
                    if (model == "3") {
                        ActivitiesFamilyQuery();
                    }
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
            /**** PullToRefresh ****/
            PullToRefresh.init({
                mainElement: '.pull-record',
                onRefresh: function () {
                    loadingMask("show");
                    //重新获取報名記錄
                    ActivitiesRecordQuery();
                }
            });
        });

        $("#viewActivitiesRecord").on("pageshow", function (event, ui) {

        });

        /********************************** dom event *************************************/
        $("#viewActivitiesRecord").keypress(function (event) {

        });

        //超時關閉popup，並返回活動列表
        $("#recordTimeOverBtn").on("click", function () {
            //重新獲取報名記錄
            ActivitiesRecordQuery();
        });

        //報名記錄詳情
        $("#viewRecordList").on("click", ".record-detail", function () {

        });

        //取消報名-popup
        $("#viewRecordList").on("click", ".record-delete", function () {
            currentID = $(this).parent().attr("data-id");
            currentNo = $(this).parent().attr("data-no");
            currentModel = $(this).parent().attr("data-model");
            recordOverTime = timeConversion($(this).parent().attr("data-over"));

            //取消報名popup彈窗內容
            var recordActName = '', recordContent = '';
            for (var i in recordArr) {
                if (currentID == recordArr[i]["ActivitiesID"]) {
                    recordActName = recordArr[i]["ActivitiesName"];

                    if (recordArr[i]["SignupModel"] == "1") {
                        recordContent = '<span>' + recordArr[i]["SignupName"] + ' / ' + recordArr[i]["SignupRelationship"] + ' / ' + recordArr[i]["SignupPlaces"] + langStr["str_058"] + '</span>';
                    } else if (recordArr[i]["SignupModel"] == "3") {
                        recordContent += '<span>' + recordArr[i]["SignupName"] + ' / ' + recordArr[i]["SignupRelationship"] + ' / ' + recordArr[i]["SignupPlaces"] + langStr["str_058"] + '</span><br>';
                    } else if (recordArr[i]["SignupModel"] == "5") {
                        recordContent = '<span>' + recordArr[i]["SignupName"] + ' / ' + recordArr[i]["SignupRelationship"] + ' / ' + recordArr[i]["SignupPlaces"] + langStr["str_058"] + ' / ' + recordArr[i]["SignupTime"] + '</span>';
                    }
                }

                //組隊報名可以申請多次，所以不能用活動編號判斷，需要用報名編號判斷
                if (currentNo == recordArr[i]["SignupNo"] && recordArr[i]["SignupModel"] == "4") {
                    recordContent = '<span>' + recordArr[i]["SignupTeamName"] + '</span>';
                }
            }

            $(".recordSignupMsg .header-title").text(recordActName);
            $(".recordSignupMsg .main-paragraph").empty().append(recordContent);
            popupMsgInit('.recordSignupMsg');

        });

        //確定取消報名-API
        $("#confirmCancelRecord").on("click", function () {
            //先判斷是否超時
            var nowTime = getTimeNow();
            if (nowTime - recordOverTime < 0) {
                loadingMask("show");

                activitiesRecordCancelQueryData = '<LayoutHeader><ActivitiesID>'
                    + currentID
                    + '</ActivitiesID><SignupNo>'
                    + (currentModel == "3" ? "" : currentNo)
                    + '</SignupNo><SignupModel>'
                    + currentModel
                    + '</SignupModel><EmployeeNo>'
                    + myEmpNo
                    + '</EmployeeNo></LayoutHeader>';

                //console.log(activitiesRecordCancelQueryData);
                ActivitiesRecordCancelQuery(currentModel);
            } else {
                //超時提示
                setTimeout(function() {
                    popupMsgInit('.recordTimeOverMsg');
                }, 500);
                
            }

        });

    }
});
