$("#viewEventAdd").pagecontainer({
    create: function(event, ui) {

        var setDateTime = "setNow";
        var doneDateTime = {};
        var tempDateTime = {};
        var eventTemplateID = 0;
        var eventTemplateData;
        var eventLocationData;
        window.eventFunctionData;
        var loctionFunctionData = [];
        var loctionFunctionID = 0;
        var eventRelatedData;
        var eventRelatedID = 0;

        /********************************** function *************************************/

        function getUnrelatedEventList(action) {

            action = action || null;
            //If Edit Event, do not relate itself, API add parameter
            if (action === "edit") {
                var newParameter = "<event_row_id>" + eventRowID + "</event_row_id>";
            } else {
                var newParameter = "";
            }
            var self = this;
            var queryData = "<LayoutHeader><emp_no>" + loginData["emp_no"] + "</emp_no>" + newParameter + "<project>" + projectName + "</project></LayoutHeader>";

            this.successCallback = function(data) {

                var resultCode = data['ResultCode'];
                var relatedEventExist = false;

                if (resultCode === 1) {
                    relatedEventExist = true;
                } else if (resultCode === "014904" || resultCode === "014907") {
                    //014904: No Unrelated Event
                    //014907: No Authority
                }

                //UI Dropdown List : Event Additional
                var ID = eventRelatedID;
                var oldID = parseInt(ID) - 1;
                eventRelatedID++;

                $("#eventaAdditionalSelectContent").html("");
                if (oldID >= 0) {
                    $("#eventAdditional" + oldID).remove();
                    $(document).off("click", "#eventAdditional" + oldID + "-option");
                    $("#eventAdditional" + oldID + "-option").popup("destroy").remove();
                }

                eventRelatedData = {
                    id: "eventAdditional" + ID,
                    defaultText: langStr["str_066"], // "添加事件",
                    title: langStr["str_067"], // "請選擇-關聯事件",
                    option: []
                };

                if (relatedEventExist) {
                    for (var i = 0; i < data['Content'].length; i++) {
                        var tempData = {
                            value: data['Content'][i].event_row_id,
                            text: data['Content'][i].event_row_id + "[" + data['Content'][i].event_title + "]" + data['Content'][i].event_desc
                        };
                        eventRelatedData["option"].push(tempData);
                    }
                }


                tplJS.DropdownList("viewEventAdd", "eventaAdditionalSelectContent", "append", "typeB", eventRelatedData);

                if (relatedEventExist) {
                    $(document).on("change", "#eventAdditional" + ID, function() {
                        var selectedValue = $(this).val();
                        relatedEventList(selectedValue);
                    });

                    if (action === "edit") {
                        editEvent(eventContentData);
                    } else {
                        loadingMask("hide");
                    }

                } else {
                    //off event which set in template.js
                    $(document).off("click", "#eventAdditional" + ID);

                    $(document).on("click", "#eventAdditional" + ID, function() {
                        $("#noRelatedEventExist").popup("open");
                    });

                    loadingMask("hide");
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "getUnrelatedEventList", self.successCallback, self.failCallback, queryData, "");
            }();

        }

        function relatedEventList(selectedValue) {
            //create new Event Additional List, set new ID by count number
            var ID = parseInt($(".event-add-additional-list").length + 1, 10);
            var relatedeventRowID = selectedValue;

            $.each(eventRelatedData.option, function(key, obj) {
                if (obj.value == selectedValue) {
                    relatedeventRowID = obj.value;
                }
            });

            var eventAdditionalListHTML = $("template#tplEventAdditionalList").html();
            var eventAdditionalList = $(eventAdditionalListHTML);
            //set Additional Event Number Text
            eventAdditionalList.find(".event-additional-number").html(relatedeventRowID);

            $("#eventaAdditionalContent .event-add-additional-list").remove();
            $("#eventaAdditionalContent").append(eventAdditionalList);

            var deleteButton = $(".event-add-additional-list .left");
            var dataHeight = $(".event-add-additional-list .right")[0].clientHeight;
            var deleteButtonHeight = parseInt(document.documentElement.clientWidth * 7.407 / 100, 10);
            var deleteButtonPaddingTop = (dataHeight - deleteButtonHeight) / 2;
            $(deleteButton).css("padding-top", deleteButtonPaddingTop + "px");
        }

        function newEvent() {

            var self = this;

            if (prevPageID === "viewEventList") {
                var action = "newEvent";
            } else if (prevPageID === "viewEventContent") {
                var action = "updateEvent";
            }

            //Complete Datetime
            if (setDateTime === "setNow") {
                var specificDoneDateTime = new Date();
                var specificTimeStamp = specificDoneDateTime.TimeStamp();
            } else if (setDateTime === "setTime") {
                var specificDoneDateTime = doneDateTime["year"] + "/" + doneDateTime["month"] + "/" + doneDateTime["day"] + " " +
                    doneDateTime["hour"] + ":" + doneDateTime["minute"] + ":00";
                var specificTime = new Date(specificDoneDateTime);
                var specificTimeStamp = specificTime.TimeStamp();
            }

            //Related Event
            var nowRelatedID = parseInt(eventRelatedID - 1, 10);
            var relatedEventVal = $("#eventAdditional" + nowRelatedID).val();
            if (!$.isNumeric(relatedEventVal)) {
                relatedEventVal = "";
            }

            var queryDataObj = {
                lang: "zh-tw",
                need_push: "Y",
                project: projectName,
                event_type_parameter_value: $("#eventLevel" + projectName).val(),
                event_title: $("#eventTemplateTextarea").val(),
                event_desc: $("#eventDescriptionTextarea").val(),
                estimated_complete_date: specificTimeStamp,
                related_event_row_id: relatedEventVal,
                emp_no: loginData["emp_no"]
            };

            if (action === "updateEvent") {
                queryDataObj.event_row_id = eventRowID;
            }

            var queryDataParameter = processLocalData.createXMLDataString(queryDataObj);
            var basicListParameter = "";

            if (action === "newEvent") {
                for (var i = 0; i < loctionFunctionData.length; i++) {

                    if (loctionFunctionData[i].function === "all") {
                        $.each(loginData["BasicInfo"][projectName]["locationFunction"], function(location, functionName) {
                            if (location === loctionFunctionData[i].location) {
                                for (var j = 0; j < functionName.length; j++) {
                                    var tempDataObj = {
                                        location: loctionFunctionData[i].location,
                                        function: functionName[j]
                                    }

                                    basicListParameter += "<basic_list>" + processLocalData.createXMLDataString(tempDataObj) + "</basic_list>";
                                }
                            }
                        });
                    } else {
                        var tempDataObj = {
                            location: loctionFunctionData[i].location,
                            function: loctionFunctionData[i].function
                        }

                        basicListParameter += "<basic_list>" + processLocalData.createXMLDataString(tempDataObj) + "</basic_list>";
                    }
                }
            }

            var queryData = "<LayoutHeader>" + queryDataParameter + basicListParameter + "</LayoutHeader>";

            this.successCallback = function(data) {

                var resultCode = data['ResultCode'];

                if (action === "newEvent") {
                    loadingMask("hide");
                    if (resultCode === "014901") {
                        eventAddSuccess();
                    } else if (resultCode === "014918") {
                        $("#eventAddFail").popup("open");
                    } else if (resultCode === "014921") {
                        $("#eventMemberError").popup("open");
                    }
                } else {
                    if (resultCode === "014901") {
                        loadingMask("hide");
                        eventAddSuccess();
                    } else if (resultCode === "014910") {
                        //Can not edit closed Event
                    } else if (resultCode === "014921") {
                        loadingMask("hide");
                        $("#eventMemberError").popup("open");
                    }
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                $("#eventAddConfirm").popup("close");
                loadingMask("show");
                checkEventTemplateData("update", $("#eventLevel" + projectName).val(), $("#eventTemplateTextarea").val(), $("#eventDescriptionTextarea").val());

                CustomAPI("POST", true, action, self.successCallback, self.failCallback, queryData, "");
            }();

        }

        function editEvent(data) {

            //Type:
            //ITS> 緊急通報 / 一般通報
            //RM> A級事件 / B級事件 / C級事件 / 預警事件 / 資訊分享
            if (data.event_type === langStr["str_068"] /*"緊急通報"*/ ) {
                $("#eventLevel" + projectName).val("1");
            } else if (data.event_type === langStr["str_069"] /*"一般通報"*/ ) {
                $("#eventLevel" + projectName).val("2");
            } else if (data.event_type === langStr["str_070"] /*"A級事件"*/ ) {
                $("#eventLevel" + projectName).val("3");
            } else if (data.event_type === langStr["str_071"] /*"B級事件"*/ ) {
                $("#eventLevel" + projectName).val("4");
            } else if (data.event_type === langStr["str_072"] /*"C級事件"*/ ) {
                $("#eventLevel" + projectName).val("5");
            } else if (data.event_type === langStr["str_073"] /*"預警事件"*/ ) {
                $("#eventLevel" + projectName).val("6");
            } else if (data.event_type === langStr["str_074"] /*"資訊分享"*/ ) {
                $("#eventLevel" + projectName).val("7");
            }

            //Event Title
            $("#eventTemplateTextarea").val(data.event_title);

            //Event Desc
            $("#eventDescriptionTextarea").val(data.event_desc);

            //Complete Datetime
            $("#setTime").prop("checked", "checked");
            setDateTime = "setTime";

            var completeTime = new Date(parseInt(data.estimated_complete_date * 1000, 10));

            doneDateTime["year"] = completeTime.getFullYear();
            doneDateTime["month"] = padLeft(parseInt(completeTime.getMonth() + 1, 10), 2);
            doneDateTime["day"] = padLeft(completeTime.getUTCDate(), 2);
            doneDateTime["hour"] = padLeft(completeTime.getHours(), 2);
            doneDateTime["minute"] = padLeft(completeTime.getMinutes(), 2);

            var completeTimeText = doneDateTime["year"] + "/" + doneDateTime["month"] + "/" + doneDateTime["day"] + " " +
                doneDateTime["hour"] + ":" + doneDateTime["minute"];
            $("#textDateTime").html(completeTimeText);

            //Related Event
            if (data.related_event_row_id !== 0) {
                var nowRelatedID = parseInt(eventRelatedID - 1, 10);
                // var newOption = '<option value="' + data.related_event_row_id + '" hidden selected>添加事件</option>';
                var newOption = '<option value="' + data.related_event_row_id + '" hidden selected>' + langStr["str_066"] + '</option>';
                $("#eventAdditional" + nowRelatedID).find("option").remove().end().append(newOption);
                relatedEventList(data.related_event_row_id);
            }

            //Task List
            for (var i = 0; i < data.task_detail.length; i++) {

                $.each(loginData["BasicInfo"][projectName]["locationFunction"], function(location, functionData) {
                    if (data.task_detail[i].task_location === location) {

                        if (projectName === "ITS") {
                            var selectedFunctionText = "All Function";
                        } else if (projectName === "RM") {
                            var selectedFunctionText = langStr["str_075"]; //"所有單位";
                        }

                        //create new Event Location List, set new ID by count number
                        var ID = loctionFunctionID;
                        loctionFunctionID++;

                        for (var j = 0; j < functionData.length; j++) {
                            if (data.task_detail[i].task_function === functionData[j]) {
                                selectedFunctionText = data.task_detail[i].task_function;
                            }
                        }

                        var eventLocationListHTML = $("template#tplEventLocationList").html();

                        $.each(eventLocationData.option, function(key, obj) {
                            if (obj.value == location) {
                                var eventLocationList = $(eventLocationListHTML);

                                //set Loction Text
                                eventLocationList.find(".event-loction").html(obj.text);

                                //set function content in New ID
                                var functionContentID = eventLocationList.find(".event-function").prop("id");
                                functionContentID = functionContentID + "-" + ID;
                                eventLocationList.find(".event-function").prop("id", functionContentID);

                                $("#eventLocationListContent").append(eventLocationList);
                                $("#" + functionContentID).html(selectedFunctionText);

                                //Remove Class[delete]
                                $(".event-add-location-list .delete").removeClass("delete");
                            }
                        });
                    }
                });
            }

            loadingMask("hide");
        }

        window.resizeDatebox = function(obj) {
            var widthPopup = $(".ui-datebox-container").parent("div.ui-popup-active").width();
            var heightPopup = $(".ui-datebox-container").parent("div.ui-popup-active").height();
            var clientWidth = document.documentElement.clientWidth;
            var clientHeight = document.documentElement.clientHeight;
            var pageScrollHeight = $(".ui-page.ui-page-active").scrollTop();

            if (device.platform === "iOS") {
                pageScrollHeight += 20;
            }
            var top = parseInt(((clientHeight - heightPopup) / 2) - pageScrollHeight, 10);
            var left = parseInt((clientWidth - widthPopup), 10);

            $(".ui-datebox-container").parent("div.ui-popup-active").css({
                "top": top,
                "left": left
            });

            $(".ui-datebox-container").css("opacity", "1");

            $('.ui-popup-screen.in').css({
                'overflow': 'hidden',
                'touch-action': 'none'
            });

            if (doneDateTime["year"] !== undefined) {
                $("#doneDate").datebox('setTheDate', doneDateTime["year"] + "-" + doneDateTime["month"] + "-" + doneDateTime["day"]);
                $("#doneTime").datebox('setTheDate', doneDateTime["hour"] + ":" + doneDateTime["minute"]);
            } else {
                var now = new Date();
                $("#doneDate").datebox('setTheDate',
                    now.getFullYear() + "-" +
                    parseInt(now.getMonth() + 1, 10) + "-" +
                    now.getDate()
                );
            }
        };

        window.openDoneTime = function(obj) {
            if (!obj.cancelClose) {
                var setDate = obj.date;

                doneDateTime["year"] = this.callFormat('%Y', setDate);
                doneDateTime["month"] = this.callFormat('%m', setDate);
                doneDateTime["day"] = this.callFormat('%d', setDate);

                $("#doneTime").trigger('datebox', { 'method': 'open' });
                tplJS.preventPageScroll();
            } else {
                if (doneDateTime["year"] === undefined) {
                    $("#setNow").click();
                } else {
                    $("#doneDate").datebox('setTheDate', doneDateTime["year"] + "-" + doneDateTime["month"] + "-" + doneDateTime["day"]);
                }
            }

            $(".ui-datebox-container").css("opacity", "0");
        };

        window.setDoneDateTime = function(obj) {
            if (!obj.cancelClose) {
                var setTime = obj.date;
                doneDateTime["hour"] = this.callFormat('%H', setTime);
                doneDateTime["minute"] = this.callFormat('%M', setTime);

                var textDateTime = doneDateTime["year"] + "/" + doneDateTime["month"] + "/" + doneDateTime["day"] + " " +
                    doneDateTime["hour"] + ":" + doneDateTime["minute"];
                $("#textDateTime").html(textDateTime);

                //Create temporary data
                tempDateTime = JSON.parse(JSON.stringify(doneDateTime));
            } else {
                if (doneDateTime["hour"] === undefined) {
                    doneDateTime = {};
                    $("#setNow").click();
                } else {
                    //Recover year/month/day
                    doneDateTime["year"] = tempDateTime["year"];
                    doneDateTime["month"] = tempDateTime["month"];
                    doneDateTime["day"] = tempDateTime["day"];
                }
            }
            tplJS.recoveryPageScroll();

            $(".ui-datebox-container").css("opacity", "0");
        };

        function updateLoctionFunctionData(action, domID, location, functionData) {
            functionData = functionData || null;

            if (action === "delete") {
                for (var i = parseInt(loctionFunctionData.length - 1, 10); i >= 0; i--) {
                    if (loctionFunctionData[i]["location"] === location) {
                        loctionFunctionData.splice(i, 1);
                    }
                }
            } else if (action === "update") {
                var IDArray = domID.split("-");
                var IDNumber = IDArray[1];
                $("#eventFunctionSelectContent-" + IDNumber + " .event-funciton-list").remove();

                if (typeof functionData === "string") {
                    $("#" + domID).val(functionData);
                } else {
                    for (var i = 0; i < functionData.length; i++) {
                        if (i == 0) {
                            $("#" + domID).val(functionData[i]);
                        } else {
                            $("#eventFunctionSelectContent-" + IDNumber).append('<div class="event-funciton-list">' + functionData[i] + '</div>');
                        }
                    }
                }

                verticalCenterDeleteButton("eventFunctionSelectContent-" + IDNumber);
            } else if (action === "remove") {
                for (var i = parseInt(loctionFunctionData.length - 1, 10); i >= 0; i--) {
                    if (loctionFunctionData[i]["domID"] === domID) {
                        loctionFunctionData.splice(i, 1);
                    }
                }
            }
        }

        function verticalCenterDeleteButton(ID) {
            var deleteButton = $("#" + ID).parent().siblings(".left");
            var dataHeight = $("#" + ID).parent()[0].clientHeight;
            var deleteButtonHeight = parseInt(document.documentElement.clientWidth * 7.407 / 100, 10);
            var deleteButtonPaddingTop = (dataHeight - deleteButtonHeight) / 2;
            $(deleteButton).css("padding-top", deleteButtonPaddingTop + "px");
        }

        function eventAddSuccess() {
            //var content = '<div><span>通報已發送</span></div>';
            var content = '<div><span>' + langStr["str_076"] + '</span></div>';
            $('<div class="event-add-success-full-screen">' + content + '</div').appendTo("body");

            tplJS.preventPageScroll();

            setTimeout(function() {
                $(".event-add-success-full-screen").remove();
                tplJS.recoveryPageScroll();

                if (prevPageID === "viewEventList") {
                    $.mobile.changePage('#viewEventList');
                } else if (prevPageID === "viewEventContent") {
                    var eventDetail = new getEventDetail(eventRowID);
                    $.mobile.changePage('#viewEventContent');
                }

            }, 3000);
        }

        function checkDoneDateTime() {

            //Complete Datetime
            if (setDateTime === "setNow") {
                $("#eventAddConfirm").popup("open");
            } else if (setDateTime === "setTime") {
                var specificDoneDateTime = doneDateTime["year"] + "/" + doneDateTime["month"] + "/" + doneDateTime["day"] + " " +
                    doneDateTime["hour"] + ":" + doneDateTime["minute"] + ":00";
                var specificTime = new Date(specificDoneDateTime);
                var specificTimeStamp = specificTime.TimeStamp();

                var nowDateTime = new Date();
                var nowTimestamp = nowDateTime.TimeStamp();

                if (specificTimeStamp <= nowTimestamp) {
                    $("#doneDateTimeAlert").popup("open");
                } else {
                    $("#eventAddConfirm").popup("open");
                }
            }

            //Event Level
            var eventLevelStr = "";
            var eventLevel = $("#eventLevel" + projectName).val();

            if (projectName === "ITS") {
                if (eventLevel === "1") {
                    eventLevelStr = langStr["str_068"]; //"緊急通報";
                } else if (eventLevel === "2") {
                    eventLevelStr = langStr["str_069"]; //"一般通報";
                }
            } else if (projectName === "RM") {
                if (eventLevel === "3") {
                    eventLevelStr = langStr["str_070"]; //"A級事件";
                } else if (eventLevel === "4") {
                    eventLevelStr = langStr["str_071"]; //"B級事件";
                } else if (eventLevel === "5") {
                    eventLevelStr = langStr["str_072"]; //"C級事件";
                } else if (eventLevel === "6") {
                    eventLevelStr = langStr["str_073"]; //"預警事件";
                } else if (eventLevel === "7") {
                    eventLevelStr = langStr["str_074"]; //"資訊分享";
                }
            }

            if (prevPageID === "viewEventList") {
                //$("#eventAddConfirm .header .header").html("確定發送" + eventLevelStr + "通報?");
                $("#eventAddConfirm .header .header").html(langStr["str_077"] + eventLevelStr + langStr["str_078"]);
            } else if (prevPageID === "viewEventContent") {
                //$("#eventAddConfirm .header .header").html("確定修改且重送" + eventLevelStr + "通報?");
                $("#eventAddConfirm .header .header").html(langStr["str_079"] + eventLevelStr + langStr["str_078"]);
            }
        }

        function checkFunctionData() {
            if (prevPageID === "viewEventList") {
                if (loctionFunctionData.length === 0) {
                    $("#selectLocationFunction").popup("open");
                } else {
                    checkDoneDateTime();
                }
            } else {
                checkDoneDateTime();
            }
        }

        function checkTemplateDesc() {
            var tempalte = $("#eventTemplateTextarea").val();

            if (tempalte.length === 0) {
                $("#templateDescEmpty").popup("open");
            } else {
                checkFunctionData();
            }
        }

        function createTemplateDropdownList() {
            var titleData;
            var contentData;
            var eventLevelVal = $("#eventLevel" + projectName).val();

            if (eventLevelVal === "1") {
                //ITS - urgent
                titleData = urgentTitle;
                contentData = urgentContent;
            } else if (eventLevelVal === "2") {
                //ITS - normal
                titleData = normalTitle;
                contentData = normalContent;
            } else {
                //RM
                titleData = RMTitle;
                contentData = RMContent;
            }

            //UI Dropdown List : Event Template
            var ID = eventTemplateID;
            var oldID = parseInt(ID) - 1;
            eventTemplateID++;

            if ($("#eventTemplate" + oldID).length) {
                $("#eventTemplate" + oldID).remove();
                $("#eventTemplate" + oldID + "-option").popup("destroy").remove();
            }

            eventTemplateData = {
                id: "eventTemplate" + ID,
                defaultText: langStr["str_080"], //"選擇範本",
                title: langStr["str_081"], //"標題範本",
                option: titleData
            };

            tplJS.DropdownList("viewEventAdd", "eventTemplateSelectContent", "append", "typeB", eventTemplateData);

            $(document).on("change", "#eventTemplate" + ID, function() {
                var selectedValue = $(this).val();

                $("#eventTemplateTextarea").val("");

                $.each(eventTemplateData.option, function(key, obj) {
                    if (obj.value == selectedValue) {
                        $("#eventTemplateTextarea").val(obj.text);
                    }
                });

                $.each(contentData, function(key, obj) {
                    if (obj.value == selectedValue) {
                        $("#eventDescriptionTextarea").val(obj.text);
                    }
                });
            });
        }

        /********************************** page event *************************************/
        $("#viewEventAdd").one("pagebeforeshow", function(event, ui) {

            //UI Popup : No Related Event Exist
            var noRelatedEventExistData = {
                id: "noRelatedEventExist",
                content: $("template#tplNoRelatedEventExist").html()
            };

            tplJS.Popup("viewEventAdd", "contentEventAdd", "append", noRelatedEventExistData);

            //UI Popup : Template / Descirption were empty
            var templateDescEmptyData = {
                id: "templateDescEmpty",
                content: $("template#tplTemplateDescEmpty").html()
            };

            tplJS.Popup("viewEventAdd", "contentEventAdd", "append", templateDescEmptyData);

            //UI Popup : Location / Function does not select
            var selectLocationFunctionData = {
                id: "selectLocationFunction",
                content: $("template#tplSelectLocationFunction").html()
            };

            tplJS.Popup("viewEventAdd", "contentEventAdd", "append", selectLocationFunctionData);

            //UI Popup : Done DateTime less then Now
            var doneDateTimeAlertData = {
                id: "doneDateTimeAlert",
                content: $("template#tplDoneDateTimeAlert").html()
            };

            tplJS.Popup("viewEventAdd", "contentEventAdd", "append", doneDateTimeAlertData);

            //UI Popup : Event Add Confirm
            var eventAddConfirmData = {
                id: "eventAddConfirm",
                content: $("template#tplEventAddConfirm").html()
            };

            tplJS.Popup("viewEventAdd", "contentEventAdd", "append", eventAddConfirmData);

            //UI Popup : Event Add / Edit Cancel Confirm
            var eventAddEditCancelConfirmData = {
                id: "eventAddEditCancelConfirm",
                content: $("template#tplEventAddEditCancelConfirm").html()
            };

            tplJS.Popup("viewEventAdd", "contentEventAdd", "append", eventAddEditCancelConfirmData);

            //UI Popup : Event Add Fail
            var eventAddFailData = {
                id: "eventAddFail",
                content: $("template#tplEventAddFail").html()
            };

            tplJS.Popup("viewEventAdd", "contentEventAdd", "append", eventAddFailData);

            //UI Popup : Event Member Error
            var eventMemerErrorData = {
                id: "eventMemberError",
                content: $("template#tplEventMemberError").html()
            };

            tplJS.Popup("viewEventAdd", "contentEventAdd", "append", eventMemerErrorData);

        });

        $("#viewEventAdd").on("pagebeforeshow", function(event, ui) {

            //UI Dropdown List : Event Location (ITS or RM)
            $("#eventLocationSelectContent").html("");
            $("#eventLocation" + projectName).remove();
            $(document).off("click", "#eventLocation-option");
            $("#eventLocation-option").popup("destroy").remove();

            if (projectName === "ITS") {
                var defaultText = langStr["str_082"]; //"添加位置/IT Function";
                var title = langStr["str_083"]; //"請選擇-機房位置";
            } else if (projectName === "RM") {
                var defaultText = langStr["str_084"]; //"添加通知對象/單位";
                var title = langStr["str_085"]; //"請選擇-通知對象";
            }

            eventLocationData = {
                id: "eventLocation" + projectName,
                defaultText: defaultText,
                title: title,
                option: [],
                attr: {
                    class: "function-select"
                }
            };

            $.each(loginData["BasicInfo"][projectName]["location"], function(key, vlaue) {
                var tempData = {
                    value: key,
                    text: key
                };

                eventLocationData["option"].push(tempData);
            });

            tplJS.DropdownList("viewEventAdd", "eventLocationSelectContent", "append", "typeB", eventLocationData);

            //UI Dropdown List : Event Level (ITS or RM)
            $("#eventLevelContent").html("");
            $("#eventLevel" + projectName).remove();
            $(document).off("click", "#eventLevel-option");
            $("#eventLevel-option").popup("destroy").remove();

            var defaultEventLevel;
            if (projectName === "ITS") {

                var options = [{
                    value: "1",
                    text: langStr["str_068"] //"緊急通報"
                }, {
                    value: "2",
                    text: langStr["str_069"] //"一般通報"
                }];

                defaultEventLevel = "1";

                if (prevPageID === "viewEventContent") {
                    if (eventContentData.event_type === langStr["str_069"] /*"一般通報"*/ ) {
                        defaultEventLevel = "2";
                    }
                }
            } else if (projectName === "RM") {

                var options = [{
                    value: "3",
                    text: langStr["str_070"] //"A級事件"
                }, {
                    value: "4",
                    text: langStr["str_071"] //"B級事件"
                }, {
                    value: "5",
                    text: langStr["str_072"] //"C級事件"
                }, {
                    value: "6",
                    text: langStr["str_073"] //"預警事件"
                }, {
                    value: "7",
                    text: langStr["str_074"] //"資訊分享"
                }];

                defaultEventLevel = "3";

                if (prevPageID === "viewEventContent") {
                    if (eventContentData.event_type === langStr["str_071"] /*"B級事件"*/ ) {
                        defaultEventLevel = "4";
                    } else if (eventContentData.event_type === langStr["str_072"] /*"C級事件"*/ ) {
                        defaultEventLevel = "5";
                    } else if (eventContentData.event_type === langStr["str_073"] /*"預警事件"*/ ) {
                        defaultEventLevel = "6";
                    } else if (eventContentData.event_type === langStr["str_074"] /*"資訊分享"*/ ) {
                        defaultEventLevel = "7";
                    }
                }
            }

            var eventLevelData = {
                id: "eventLevel" + projectName,
                option: options,
                defaultValue: defaultEventLevel,
                attr: {
                    class: "event-level"
                }
            };

            tplJS.DropdownList("viewEventAdd", "eventLevelContent", "append", "typeA", eventLevelData);

            $(document).on("change", ".event-level", function() {
                createTemplateDropdownList();
            });

            createTemplateDropdownList();
        });

        $("#viewEventAdd").on("pageshow", function(event, ui) {
            doneDateTime = {};
            loctionFunctionData = [];

            $("#textDateTime").html("");
            $("#eventaAdditionalContent .event-add-additional-list").remove();
            $("#eventLocationListContent .event-add-location-list").remove();

            if (prevPageID === "viewEventList") {
                //Set Default
                if (projectName === "ITS") {
                    $("#eventLevel" + projectName).val("1");
                } else if (projectName === "RM") {
                    $("#eventLevel" + projectName).val("3");
                }
                $("#eventTemplateTextarea").val("");
                $('#eventTemplateTextarea').prop('placeholder', langStr["str_086"] /*"請選擇範本或輸入標題"*/ );
                $("#eventDescriptionTextarea").val("");
                $('#eventDescriptionTextarea').prop('placeholder', langStr["str_087"] /*"描述文字"*/ );
                $("#setNow").prop("checked", "checked");
                setDateTime = "setNow";

                var title = langStr["str_001"]; //"新增通報";
                var buttonText = langStr["str_002"]; //"發送";

                var unrelatedEventList = new getUnrelatedEventList();

                $("#eventLocationSelectContent").show();
            } else if (prevPageID === "viewEventContent") {
                loadingMask("show");

                var title = langStr["str_088"]; //"編輯通報";
                var buttonText = langStr["str_089"]; //"儲存";

                var unrelatedEventList = new getUnrelatedEventList("edit");

                //Event edit > can not edit Loction / Function
                //$(document).off("click", "#eventLocation");
                $("#eventLocationSelectContent").hide();
            }

            //Function title
            $(".function-title").hide();
            $(".title-" + projectName).show();

            $("#viewEventAdd .ui-title").html(title);
            $("#viewEventAdd #sendEvent span").html(buttonText);
            footerFixed();
        });

        /********************************** dom event *************************************/
        $(document).on("change", ".function-select", function() {
            var selectedLocation = $("#eventLocation" + projectName).val();

            //Check if this Location has Exist in Data List
            for (var i = 0; i < loctionFunctionData.length; i++) {
                if (loctionFunctionData[i]["location"] === selectedLocation) {
                    return;
                }
            }

            //create new Event Location List, set new ID by count number
            var ID = loctionFunctionID;
            loctionFunctionID++;

            //UI Dropdown List : Event Function
            if (projectName === "ITS") {
                var textAll = "All Function";
            } else if (projectName === "RM") {
                var textAll = langStr["str_075"]; //"所有單位";
            }

            eventFunctionData = {
                id: "eventFunction-" + ID,
                defaultText: textAll,
                title: "IT Function",
                autoResize: false,
                multiSelect: true,
                defaultValue: "all",
                option: [{
                    value: "all",
                    text: textAll
                }],
                attr: {
                    class: "tpl-dropdown-list-icon-arrow"
                }
            };

            for (var i = 0; i < loginData["BasicInfo"][projectName]["locationFunction"][selectedLocation].length; i++) {
                var tempData = {
                    value: loginData["BasicInfo"][projectName]["locationFunction"][selectedLocation][i],
                    text: loginData["BasicInfo"][projectName]["locationFunction"][selectedLocation][i]
                };

                eventFunctionData["option"].push(tempData);
            }

            var eventLocationListHTML = $("template#tplEventLocationList").html();

            $.each(eventLocationData.option, function(key, obj) {
                if (obj.value == selectedLocation) {

                    var eventLocationList = $(eventLocationListHTML);

                    //set Loction Text
                    eventLocationList.find(".event-loction").html(obj.text);

                    //set function content in New ID
                    var functionContentID = eventLocationList.find(".event-function").prop("id");
                    functionContentID = functionContentID + "-" + ID;
                    eventLocationList.find(".event-function").prop("id", functionContentID);

                    $("#eventLocationListContent").append(eventLocationList);

                    //create Event Function drowdown list
                    tplJS.DropdownList("viewEventAdd", functionContentID, "append", "typeA", eventFunctionData);

                    //resize Event Function drowdown list
                    tplJS.reSizeDropdownList(eventFunctionData.id, null, 80);

                    verticalCenterDeleteButton(functionContentID);

                    //bind Event Function change event
                    $(document).on("change", "#" + eventFunctionData.id, function() {
                        var dataArray = $(this).data("multiVal").split("|");
                        var indexAll = dataArray.indexOf("all");
                        var selectID = $(this).prop("id");

                        updateLoctionFunctionData("delete", selectID, selectedLocation);

                        if (indexAll > -1) {
                            var tempData = {
                                domID: selectID,
                                location: selectedLocation,
                                function: "all"
                            };
                            loctionFunctionData.push(tempData);

                            updateLoctionFunctionData("update", selectID, selectedLocation, "all");
                        } else {
                            for (var i = 0; i < dataArray.length; i++) {
                                var tempData = {
                                    domID: selectID,
                                    location: selectedLocation,
                                    function: dataArray[i]
                                };
                                loctionFunctionData.push(tempData);
                            }
                            updateLoctionFunctionData("update", selectID, selectedLocation, dataArray);
                        }
                    });

                    //Insert loctionFunctionData
                    var tempData = {
                        domID: eventFunctionData.id,
                        location: selectedLocation,
                        function: "all"
                    };

                    loctionFunctionData.push(tempData);
                    $("#" + eventFunctionData.id).data("multiVal", "all");
                }
            });
        });

        //Event Related delete
        $(document).on("click", ".event-add-additional-list .delete-event-additional", function() {
            var nowRelatedID = parseInt(eventRelatedID - 1, 10);
            $("#eventaAdditionalContent .event-add-additional-list").remove();
            // var newOption = '<option value="添加事件" hidden selected>添加事件</option>';
            var newOption = '<option value=' + langStr["str_066"] + 'hidden selected>' + langStr["str_066"] + '</option>';


            $("#eventAdditional" + nowRelatedID).find("option").remove().end().append(newOption);
        });

        //Location-Function delete
        $(document).on("click", ".event-add-location-list .delete-event-location", function() {
            var domID = $(this).siblings().find("select").prop("id");
            var location = $(this).siblings().find(".event-loction").text();

            //Update loctionFunctionData
            updateLoctionFunctionData("remove", domID, location);

            $("#" + domID).remove();
            $(document).off("click", "#" + domID + "-option");
            $("#" + domID + "-option").popup("destroy").remove();

            $(this).parent().remove();
        });

        //Radio Button : Finish Time
        $(document).on("change", "input[name=setDateTime]", function() {
            setDateTime = $('input[name=setDateTime]:checked').val();
            if (setDateTime === "setNow") {
                $("#textDateTime").html("");
            }
        });

        $(document).on("click", "#setTime", function() {
            $("#doneDate").trigger('datebox', { 'method': 'open' });
            tplJS.preventPageScroll();
        });

        //No Related Event Exist
        $(document).on("click", "#noRelatedEventExist .confirm", function() {
            $("#noRelatedEventExist").popup("close");
        });

        //Template / Descirption were empty
        $(document).on("click", "#templateDescEmpty .confirm", function() {
            $("#templateDescEmpty").popup("close");
        });

        //Send Event
        $(document).on("click", "#sendEvent", function() {
            checkTemplateDesc();
        });

        $(document).on("click", "#selectLocationFunction .confirm", function() {
            $("#selectLocationFunction").popup("close");
        });

        $(document).on("click", "#doneDateTimeAlert .confirm", function() {
            $("#doneDateTimeAlert").popup("close");
        });

        $(document).on("click", "#eventAddConfirm .cancel", function() {
            $("#eventAddConfirm").popup("close");
        });

        $(document).on("click", "#eventAddConfirm .confirm", function() {
            var event = new newEvent();
        });

        //Event Add / Edit Cancel Button
        $(document).on("popupafteropen", "#eventAddEditCancelConfirm", function() {
            if (prevPageID === "viewEventList") {
                $("#eventAddEditCancelConfirm .header-text").html(langStr["str_090"] /*"確定取消新增?"*/ );
            } else if (prevPageID === "viewEventContent") {
                $("#eventAddEditCancelConfirm .header-text").html(langStr["str_019"] /*"確定取消編輯?"*/ );
            }
        });

        $(document).on("click", "#eventAddEditCancelConfirm .cancel", function() {
            $("#eventAddEditCancelConfirm").popup("close");
        });

        $(document).on("click", "#eventAddEditCancelConfirm .confirm", function() {
            $("#eventAddEditCancelConfirm").popup("close");

            if (prevPageID === "viewEventList") {
                $.mobile.changePage('#viewEventList');
            } else if (prevPageID === "viewEventContent") {
                var eventDetail = new getEventDetail(eventRowID);
                $.mobile.changePage('#viewEventContent');
            }
        });

        //Event Add Fail
        $(document).on("click", "#eventAddFail .confirm", function() {
            $("#eventAddFail").popup("close");
        });

        //Event Member Error
        $(document).on("click", "#eventMemberError .confirm", function() {
            $("#eventMemberError").popup("close");
        });

        //Back Button
        $(document).on("click", "#eventAddBack", function() {
            onBackKeyDown();
        });
    }
});