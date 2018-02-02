
$("#viewActivitiesManage").pagecontainer({
    create: function (event, ui) {
        /********************************** variable *************************************/
        var resultArr = [];
        var cancelModel, cancelActName, cancelID, cancelNo, cancelTeamName;

        
        /********************************** function *************************************/
        //報名管理
        window.ActivitiesSignupManageQuery = function (model) {

            this.successCallback = function (data) {
                //console.log(data);

                //取消報名的活動類型
                cancelModel = model;
                if (data["ResultCode"] == "1") {
                    if (model == "1") {

                    } else if (model == "3") {

                    } else if (model == "4") {
                        //初始化
                        $("#expandAllTeam").attr("src", "img/all_list_down.png");

                        var manageArr = data["Content"];
                        cancelActName = manageArr[0]["ActivitiesName"];
                        $("#teamManageThumbnail").attr("src", manageArr[0]["ActivitiesImage"]);
                        $("#teamManageName").text(manageArr[0]["ActivitiesName"]);
                        $("#teamSignupedPlaces").text(manageArr[0]["SignupTeam"]);

                        //簡化數據
                        var simplifyArr = [];
                        $.each(manageArr, function (index, item) {
                            simplifyArr.push({
                                "ActivitiesID": item["ActivitiesID"],
                                "TeamID": item["TeamID"],
                                "TeamDept": item["TeamDept"],
                                "TeamName": item["TeamName"],
                                "TeamNo": item["TeamNo"],
                                "TeamMember": item["TeamMemberDept"] + " " + item["TeamMember"]
                            });
                        });

                        //相同Team合併
                        resultArr = [];
                        for (var i = 0; i < simplifyArr.length;) {
                            if (i >= simplifyArr.length - 1) {
                                if (i == simplifyArr.length - 1) {
                                    resultArr.push(mergeItemBySameTeam(simplifyArr[i], null, "TeamMember"));
                                }
                                break;
                            }
                            //如果TeamID相同，合併對象；如果不同Team，直接添加到新數組
                            if (simplifyArr[i]["TeamID"] == simplifyArr[i + 1]["TeamID"]) {
                                var mergedItem = mergeItemBySameTeam(simplifyArr[i], simplifyArr[i + 1], "TeamMember");
                                var exist = false;
                                for (var j = 0; j < resultArr.length; j++) {
                                    if (resultArr[j]["TeamID"] == mergedItem["TeamID"]) {
                                        resultArr[j] = mergeItemBySameTeam(resultArr[j], mergedItem, "TeamMember");
                                        exist = true;
                                        break;
                                    }
                                }
                                if (!exist) {
                                    resultArr.push(mergedItem);
                                }

                                i += 2;
                            } else {
                                resultArr.push(mergeItemBySameTeam(simplifyArr[i], null, "TeamMember"));
                                i += 1;
                            }

                        }
                        //console.log(resultArr);

                        //生成html
                        var manageContent = "";
                        for (var i in resultArr) {
                            manageContent += '<tr><td>'
                                + resultArr[i]["TeamNo"]
                                + '</td><td>'
                                + resultArr[i]["TeamDept"]
                                + '</td><td></td><td>'
                                + resultArr[i]["TeamName"]
                                + '</td><td><img src="img/list_down.png" class="list-img"></td></tr><tr style="display:none;"><td></td><td></td><td></td><td>'
                                + resultArr[i]["Member"]
                                + '</td><td><img src="img/delete.png" class="team-delete" data-id="'
                                + resultArr[i]["ActivitiesID"]
                                + '" data-no="'
                                + resultArr[i]["TeamID"]
                                + '"></td></tr>';
                        }

                        $("#teamTable tr:first-child").nextAll().remove();
                        $("#teamTable").append(manageContent);


                    } else if (model == "5") {

                    }
                }

                loadingMask("hide");
            };

            this.failCallback = function (data) { };

            var __construct = function () {
                CustomAPI("POST", true, "Activities_Signup_Manage", self.successCallback, self.failCallback, activitiesSignupManageQueryData, "");
            }();

        };

        //取消報名
        window.ActivitiesSignupCancelQuery = function () {

            this.successCallback = function (data) {
                //console.log(data);

                if (data["ResultCode"] == "045913") {
                    //重新獲取活動列表
                    ActivitiesListQuery();
                    
                    //跳轉
                    $.each($("#openList .activity-list"), function(index, item) {
                        if($(item).attr("data-id") == cancelID) {
                            $(item).trigger("click");
                        }
                    });

                    //重新獲取報名記錄
                    ActivitiesRecordQuery();

                } else if (data["ResultCode"] == "045914") {
                    //報名取消失敗
                    popupMsgInit('.cancelFailMsg');
                }

                loadingMask("hide");
            };

            this.failCallback = function (data) { };

            var __construct = function () {
                CustomAPI("POST", true, "Activities_Signup_Cancel", self.successCallback, self.failCallback, activitiesSignupCancelQueryData, "");
            }();

        };



        window.APIRequest = function () {

            var self = this;

            this.successCallback = function (data) {
                loadingMask("hide");

                var resultcode = data['ResultCode'];
                //do something
            };

            this.failCallback = function (data) { };

            var __construct = function () {
                //CustomAPI("POST", true, "APIRequest", self.successCallback, self.failCallback, queryData, "");
            }();

        };

        //合併對象
        function mergeItemBySameTeam(obj1, obj2, param) {
            var obj = {};
            if (obj2 !== null) {
                obj["Member"] = obj1[param] + "<br>" + obj2[param];
            } else {
                obj["Member"] = obj1[param];
            }
            obj["ActivitiesID"] = obj1["ActivitiesID"];
            obj["TeamDept"] = obj1["TeamDept"];
            obj["TeamID"] = obj1["TeamID"];
            obj["TeamName"] = obj1["TeamName"];
            obj["TeamNo"] = obj1["TeamNo"];
            return obj;
        }


        /********************************** page event *************************************/
        $("#viewActivitiesManage").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewActivitiesManage").on("pageshow", function (event, ui) {

        });

        /********************************** dom event *************************************/
        $("#viewActivitiesManage").keypress(function (event) {

        });

        //從管理頁返回詳情頁
        $("#viewActivitiesManage .back-detail").on("click", function () {
            changePageByPanel("viewActivitiesDetail", false);
        });

        //展開隊伍
        $("#teamTable").on("click", ".list-img", function () {
            var self = $(this);
            var src = $(this).attr("src").split("/")[1];
            var parentNode = $(this).parent().parent();

            if (src == "list_down.png") {
                self.attr("src", "img/list_up.png");
                parentNode.css("border-bottom", "0");
                parentNode.next().css("border-bottom", "1px solid #d6d6d6");
                parentNode.next().show();
            } else {
                self.attr("src", "img/list_down.png");
                parentNode.css("border-bottom", "1px solid #d6d6d6");
                parentNode.next().css("border-bottom", "0");
                parentNode.next().hide();
            }
        });

        //展開所有隊伍
        $("#expandAllTeam").on("click", function () {
            var src = $(this).attr("src").split("/")[1];
            if (src == "all_list_down.png") {
                $.each($(".list-img"), function (index, item) {
                    if ($(item).attr("src") == "img/list_down.png") {
                        $(item).trigger("click");
                    }
                });
                $(this).attr("src", "img/all_list_up.png");
            } else {
                $.each($(".list-img"), function (index, item) {
                    if ($(item).attr("src") == "img/list_up.png") {
                        $(item).trigger("click");
                    }
                });
                $(this).attr("src", "img/all_list_down.png");
            }
        });

        //取消組隊報名
        $("#teamTable").on("click", ".team-delete", function () {
            cancelID = $(this).attr("data-id");
            cancelNo = $(this).attr("data-no");
            cancelTeamName;

            for (var i in resultArr) {
                if (cancelNo == resultArr[i]["TeamID"]) {
                    cancelTeamName = resultArr[i]["TeamName"];
                    break;
                }
            }

            $(".cancelSignupMsg .header-title").text(cancelActName);
            $(".cancelSignupMsg .main-paragraph").text(cancelTeamName);
            popupMsgInit('.cancelSignupMsg');

        });

        //確定取消報名
        $("#cancelSignup").on("click", function () {
            //loadingMask("show");
            activitiesSignupCancelQueryData = '<LayoutHeader><ActivitiesID>'
                + cancelID
                + '</ActivitiesID><SignupNo>'
                + cancelNo
                + '</SignupNo><SignupModel>'
                + cancelModel
                + '</SignupModel><EmployeeNo>'
                + myEmpNo
                + '</EmployeeNo></LayoutHeader>';

            //console.log(activitiesSignupCancelQueryData);

            ActivitiesSignupCancelQuery();
        });







    }
});
