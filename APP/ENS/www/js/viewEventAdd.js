
$("#viewEventAdd").pagecontainer({
    create: function(event, ui) {
        
        var setDateTime = "setNow";
        var doneDateTime = {};
        var eventTemplateData;
        var eventLocationData;
        window.eventFunctionData;
        var loctionFunctionData = [];
        var loctionFunctionID = 0;
        var eventRelatedData;

        /********************************** function *************************************/

        function getUnrelatedEventList(action) {

            action = action || null;
            var self = this;
            var queryData = "<LayoutHeader><emp_no>" + loginData["emp_no"] + "</emp_no></LayoutHeader>";

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
                eventRelatedData = {
                    id: "eventAdditional",
                    defaultText: "添加事件",
                    title: "請選擇-關聯事件",
                    option: [],
                    attr: {
                        class: "text-bold"
                    }
                };

                if (relatedEventExist) {
                    for (var i=0; i<data['Content'].length; i++) {
                        var tempData = {
                            value: data['Content'][i].event_row_id,
                            text: data['Content'][i].event_row_id + "[" + data['Content'][i].event_title + "]" + data['Content'][i].event_desc
                        };
                        eventRelatedData["option"].push(tempData);
                    }
                }

                $("#eventaAdditionalSelectContent").html("");
                tplJS.DropdownList("viewEventAdd", "eventaAdditionalSelectContent", "append", "typeB", eventRelatedData);

                if (relatedEventExist) {
                    $(document).on("change", "#eventAdditional", function() {
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
                    $(document).off("click", "#eventAdditional");

                    $(document).on("click", "#eventAdditional", function() {
                        $("#noRelatedEventExist").popup("open");
                    });
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
            var eventRowID = selectedValue;

            $.each(eventRelatedData.option, function(key, obj) {
                if (obj.value == selectedValue) {
                    eventRowID = obj.value;
                }
            });

            var eventAdditionalListHTML = $("template#tplEventAdditionalList").html();
            var eventAdditionalList = $(eventAdditionalListHTML);
            //set Additional Event Number Text
            eventAdditionalList.find(".event-additional-number").html(eventRowID);

            $("#eventaAdditionalContent .event-add-additional-list").remove();
            $("#eventaAdditionalContent").append(eventAdditionalList);
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
            var relatedEventVal = $("#eventAdditional").val();
            if (!$.isNumeric(relatedEventVal)) {
                relatedEventVal = "";
            }

            var queryDataObj = {
                lang: "zh-tw",
                need_push: "Y",
                app_key: appKey,
                event_type_parameter_value: $("#eventLevel").val(),
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
                for (var i=0; i<loctionFunctionData.length; i++) {

                    if (loctionFunctionData[i].function === "all") {
                        $.each(loginData["BasicInfo"]["locationFunction"], function(location, functionName) {
                            if (location === loctionFunctionData[i].location) {
                                for (var j=0; j<functionName.length; j++) {
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
                    if (resultCode === "014901") {
                        loadingMask("hide");
                        eventAddSuccess();
                    } else if (resultCode === "014918") {
                        loadingMask("hide");
                        $("#eventAddFail").popup("open");
                    }
                } else {
                    if (resultCode === "014901") {
                        loadingMask("hide");
                        eventAddSuccess();
                    } else if (resultCode === "014910") {
                        //Can not edit closed Event
                    }
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                $("#eventAddConfirm").popup("close");
                loadingMask("show");
                checkEventTemplateData("update", $("#eventTemplateTextarea").val());

                CustomAPI("POST", true, action, self.successCallback, self.failCallback, queryData, "");
            }();

        }

        function editEvent(data) {

            //Type: 緊急通報 / 一般通報
            if (data.event_type === "一般通報") {
                $("#eventLevel").val("1");
            } else {
                $("#eventLevel").val("2");
            }

            //Event Title
            $("#eventTemplateTextarea").val(data.event_title);

            //Event Desc
            $("#eventDescriptionTextarea").val(data.event_desc);

            //Complete Datetime
            $("#setTime").prop("checked", "checked");
            setDateTime = "setTime";

            var completeTime = new Date(parseInt(data.estimated_complete_date * 1000, 10));
            var completeTimeConvert = completeTime.TimeZoneConvert();
            var completeTimeData = new Date(completeTimeConvert);

            doneDateTime["year"] = completeTimeData.getFullYear();
            doneDateTime["month"] = padLeft(parseInt(completeTimeData.getMonth() + 1, 10), 2);
            doneDateTime["day"] = padLeft(completeTimeData.getUTCDate(), 2);
            doneDateTime["hour"] = padLeft(completeTimeData.getHours(), 2);
            doneDateTime["minute"] = padLeft(completeTimeData.getMinutes(), 2);

            var completeTimeText = completeTimeConvert.substr(0, parseInt(completeTimeConvert.length - 3, 10));
            $("#textDateTime").html(completeTimeText);

            //Related Event
            if (data.related_event_row_id !== 0) {
                var newOption = '<option value="' + data.related_event_row_id + '" hidden selected>添加事件</option>';
                $("#eventAdditional").find("option").remove().end().append(newOption);
                relatedEventList(data.related_event_row_id);
            }

            //Task List
            for (var i=0; i<data.task_detail.length; i++) {

                $.each(loginData["BasicInfo"]["locationFunction"], function(location, functionData){
                    if (data.task_detail[i].task_location === location) {

                        var selectedFunctionText = "All Function";

                        //create new Event Location List, set new ID by count number
                        var ID = loctionFunctionID;
                        loctionFunctionID++;

                        //UI Dropdown List : Event Function
                        eventFunctionData = {
                            id: "eventFunction-" + ID,
                            defaultText: selectedFunctionText,
                            title: "IT Function",
                            autoResize: false,
                            option: [{
                                value: "all",
                                text: "All Function"
                            }],
                            attr: {
                                class: "tpl-dropdown-list-icon-arrow"
                            }
                        };

                        for (var j=0; j<functionData.length; j++) {
                            if (data.task_detail[i].task_function === functionData[j]) {
                                selectedFunctionText = data.task_detail[i].task_function;
                            }
                            var tempData = {
                                value: functionData[j],
                                text: functionData[j]
                            };

                            eventFunctionData["option"].push(tempData);
                        }

                        eventFunctionData["defaultValue"] = selectedFunctionText;
                        $("#eventFunction-" + ID).val(selectedFunctionText);

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

                                //create Event Function drowdown list
                                tplJS.DropdownList("viewEventAdd", functionContentID, "append", "typeA", eventFunctionData);

                                //Remove Class[delete]
                                $(".event-add-location-list .delete").removeClass("delete");

                                //Off DropdownList Click Event
                                $(document).off("click", "#" + eventFunctionData.id);

                                //set Event Function
                                $("#" + eventFunctionData.id).val();

                                //resize Event Function drowdown list
                                tplJS.reSizeDropdownList(eventFunctionData.id, null, 81);

                                //bind Event Function change event
                                $(document).on("change", "#" + eventFunctionData.id, function() {
                                    var selectID = $(this).prop("id");
                                    var selectedValue = $(this).val();

                                    $.each(eventFunctionData.option, function(key, obj) {
                                        if (obj.value == selectedValue) {
                                            $("#" + selectID).find("option:selected").html(obj.text);
                                        }
                                    });

                                    //Update loctionFunctionData
                                    updateLoctionFunctionData("update", selectID);
                                });

                                //Insert loctionFunctionData
                                var tempData = {
                                    domID: eventFunctionData.id,
                                    location: location,
                                    function: selectedFunctionText
                                };

                                loctionFunctionData.push(tempData);
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
            var top = parseInt((clientHeight - heightPopup) / 2, 10 );
            var left = parseInt((clientWidth - widthPopup), 10 );

            $(".ui-datebox-container").parent("div.ui-popup-active").css({
                "top": top,
                "left": left
            });
        };

        window.openDoneTime = function(obj) {
            var setDate = obj.date;
            doneDateTime["year"] = this.callFormat('%Y', setDate);
            doneDateTime["month"] = this.callFormat('%m', setDate);
            doneDateTime["day"] = this.callFormat('%d', setDate);

            $("#doneTime").trigger('datebox', {'method':'open'});
        };

        window.setDoneDateTime = function(obj) {
            var setTime = obj.date;
            doneDateTime["hour"] = this.callFormat('%H', setTime);
            doneDateTime["minute"] = this.callFormat('%M', setTime);

            var textDateTime = doneDateTime["year"] + "-" + doneDateTime["month"] + "-" + doneDateTime["day"] + " " +
            doneDateTime["hour"] + ":" + doneDateTime["minute"];
            $("#textDateTime").html(textDateTime);

            tplJS.recoveryPageScroll();
        };

        function updateLoctionFunctionData(action, domID) {
            for (var i=0; i<loctionFunctionData.length; i++) {
                if (loctionFunctionData[i]["domID"] === domID) {
                    if (action === "update") {
                        loctionFunctionData[i]["function"] = $("#" + domID).val();
                    } else if (action === "delete") {
                        loctionFunctionData.splice(i, 1);
                        $("#" + domID).parents(".event-add-location-list").remove();
                    }
                }
            }
        }

        function eventAddSuccess() {
            var content = '<div><span>通報已發送</span></div>';
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

            if (prevPageID === "viewEventList") {
                $("#eventAddConfirm .header .header").html("確定發送緊急通報?");
            } else if (prevPageID === "viewEventContent") {
                $("#eventAddConfirm .header .header").html("確定修改且重送緊急通報?");
            }
        }

        function checkFunctionData() {
            if (loctionFunctionData.length === 0) {
                $("#selectLocationFunction").popup("open");
            } else {
                checkDoneDateTime();
            }
        }

        function checkTemplateDesc() {
            var tempalte = $("#eventTemplateTextarea").val();
            var description = $("#eventDescriptionTextarea").val();

            if (tempalte.length === 0 || description.length === 0) {
                $("#templateDescEmpty").popup("open");
            } else {
                checkFunctionData();
            }
        }

        /********************************** page event *************************************/
        $("#viewEventAdd").one("pagebeforeshow", function(event, ui) {

            //UI Dropdown List : Event Template
            eventTemplateData = {
                id: "eventTemplate",
                defaultText: "選擇範本",
                title: "標題範本",
                option: templateData,
                attr: {
                    class: "text-bold"
                }
            };

            tplJS.DropdownList("viewEventAdd", "eventTemplateSelectContent", "append", "typeB", eventTemplateData);

            //UI Dropdown List : Event Location
            eventLocationData = {
                id: "eventLocation",
                defaultText: "添加位置/IT Function",
                title: "請選擇-機房位置",
                option: [],
                attr: {
                    class: "text-bold"
                }
            };

            $.each(loginData["BasicInfo"]["location"], function(key, vlaue) {
                var tempData = {
                    value: key,
                    text: key
                };

                eventLocationData["option"].push(tempData);
            });

            tplJS.DropdownList("viewEventAdd", "eventLocationSelectContent", "append", "typeB", eventLocationData);

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

            //UI Popup : Event Edit Confirm
            var eventEditConfirmData = {
                id: "eventEditConfirm",
                content: $("template#tplEventEditConfirm").html()
            };

            tplJS.Popup("viewEventAdd", "contentEventAdd", "append", eventEditConfirmData);

            //UI Popup : Event Edit Cancel Confirm
            var eventEditCancelConfirmData = {
                id: "eventEditCancelConfirm",
                content: $("template#tplEventEditCancelConfirm").html()
            };

            tplJS.Popup("viewEventAdd", "contentEventAdd", "append", eventEditCancelConfirmData);

            //UI Popup : Event Add Fail
            var eventAddFailData = {
                id: "eventAddFail",
                content: $("template#tplEventAddFail").html()
            };

            tplJS.Popup("viewEventAdd", "contentEventAdd", "append", eventAddFailData);

        });

        $("#viewEventAdd").on("pagebeforeshow", function(event, ui) {

            //UI Dropdown List : Event Level
            $("#eventLevelContent").html("");

            var eventLevelData = {
                id: "eventLevel",
                option: [{
                    value: "1",
                    text: "緊急通報"
                }, {
                    value: "2",
                    text: "一般通報"
                }],
                attr: {
                    class: "text-bold"
                },
                defaultValue: "1"
            };

            tplJS.DropdownList("viewEventAdd", "eventLevelContent", "append", "typeA", eventLevelData);

        });

        $("#viewEventAdd").on("pageshow", function(event, ui) {
            loctionFunctionData = [];

            $("#textDateTime").html("");
            $("#eventaAdditionalContent .event-add-additional-list").remove();
            $("#eventLocationListContent .event-add-location-list").remove();

            if (prevPageID === "viewEventList") {
                //Set Default
                $("#eventLevel").val("1");
                $("#eventTemplateTextarea").val("請選擇範本或輸入標題");
                $("#eventDescriptionTextarea").val("描述文字");
                $("#setNow").prop("checked", "checked");
                setDateTime = "setNow";

                var title = "新增通報";
                var buttonText = "發送";

                var unrelatedEventList = new getUnrelatedEventList();

                $("#eventLocationSelectContent").show();
            } else if (prevPageID === "viewEventContent") {
                loadingMask("show");

                var title = "編輯通報";
                var buttonText = "儲存";

                var unrelatedEventList = new getUnrelatedEventList("edit");

                //Event edit > can not edit Loction / Function
                //$(document).off("click", "#eventLocation");
                $("#eventLocationSelectContent").hide();
            }

            $("#viewEventAdd .ui-title").html(title);
            $("#viewEventAdd #sendEvent").html(buttonText);
            footerFixed();
        });

        /********************************** dom event *************************************/
        $(document).on("change", "#eventTemplate", function() {
            var selectedValue = $(this).val();

            $("#eventTemplateTextarea").val("");

            $.each(eventTemplateData.option, function(key, obj) {
                if (obj.value == selectedValue) {
                    $("#eventTemplateTextarea").val(obj.text);
                }
            });
        });

        $(document).on("change", "#eventLocation", function() {
            var selectedLocation = $(this).val();

            //create new Event Location List, set new ID by count number
            var ID = loctionFunctionID;
            loctionFunctionID++;

            //UI Dropdown List : Event Function
            eventFunctionData = {
                id: "eventFunction-" + ID,
                defaultText: "All Function",
                title: "IT Function",
                autoResize: false,
                option: [{
                    value: "all",
                    text: "All Function"
                }],
                attr: {
                    class: "tpl-dropdown-list-icon-arrow"
                }
            };

            for (var i=0; i<loginData["BasicInfo"]["locationFunction"][selectedLocation].length; i++) {
                var tempData = {
                    value: loginData["BasicInfo"]["locationFunction"][selectedLocation][i],
                    text: loginData["BasicInfo"]["locationFunction"][selectedLocation][i]
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
                    tplJS.reSizeDropdownList(eventFunctionData.id, null, 81);

                    //bind Event Function change event
                    $(document).on("change", "#" + eventFunctionData.id, function() {
                        var selectID = $(this).prop("id");
                        var selectedValue = $(this).val();

                        $.each(eventFunctionData.option, function(key, obj) {
                            if (obj.value == selectedValue) {
                                $("#" + selectID).find("option:selected").html(obj.text);
                            }
                        });

                        //Update loctionFunctionData
                        updateLoctionFunctionData("update", selectID);
                    });

                    //Insert loctionFunctionData
                    var tempData = {
                        domID: eventFunctionData.id,
                        location: selectedLocation,
                        function: "all"
                    };

                    loctionFunctionData.push(tempData);
                }
            });
        });

        //Event Related delete
        $(document).on("click", ".event-add-additional-list .delete", function() {
            $("#eventaAdditionalContent .event-add-additional-list").remove();
            var newOption = '<option value="添加事件" hidden selected>添加事件</option>';
            $("#eventAdditional").find("option").remove().end().append(newOption);
        });

        //Location-Function delete
        $(document).on("click", ".event-add-location-list .delete", function() {
            var domID = $(this).parent().siblings().find("select").prop("id");

            //Update loctionFunctionData
            updateLoctionFunctionData("delete", domID);
        });

        //Radio Button : Finish Time
        $(document).on("change", "input[name=setDateTime]", function() {
            setDateTime = $('input[name=setDateTime]:checked').val();

            if (setDateTime === "setNow") {
                $("#textDateTime").html("");
            } else if (setDateTime === "setTime") {
                $("#doneDate").trigger('datebox', {'method':'open'});

                tplJS.preventPageScroll();
            }
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

        //Event Edit Button
        $(document).on("click", "#eventEditConfirm .cancel", function() {
            $("#eventEditConfirm").popup("close");
        });

        //Event Edit Cancel Button
        $(document).on("click", "#eventEditCancelConfirm .cancel", function() {
            $("#eventEditCancelConfirm").popup("close");
        });

        $(document).on("click", "#eventEditCancelConfirm .confirm", function() {
            $("#eventEditCancelConfirm").popup("close");

            var eventDetail = new getEventDetail(eventRowID);
            $.mobile.changePage('#viewEventContent');
        });

        //Event Add Fail
        $(document).on("click", "#eventAddFail .confirm", function() {
            $("#eventAddFail").popup("close");
        });

        //Back Button
        $(document).on("click", "#eventAddBack", function() {
            onBackKeyDown();
        });
    }
});
