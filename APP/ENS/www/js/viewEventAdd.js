
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

        function getUnrelatedEventList() {

            var self = this;
            var queryData = "<LayoutHeader><emp_no>" + loginData["emp_no"] + "</emp_no></LayoutHeader>";

            this.successCallback = function(data) {

                loadingMask("hide");

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

                tplJS.DropdownList("viewEventAdd", "eventaAdditionalSelectContent", "append", "typeB", eventRelatedData);

                if (relatedEventExist) {
                    $(document).on("change", "#eventAdditional", function() {
                        var selectedValue = $(this).val();

                        //create new Event Additional List, set new ID by count number
                        var ID = parseInt($(".event-add-additional-list").length + 1, 10);

                        var eventAdditionalListHTML = $("template#tplEventAdditionalList").html();

                        $.each(eventRelatedData.option, function(key, obj) {
                            if (obj.value == selectedValue) {

                                var eventAdditionalList = $(eventAdditionalListHTML);

                                //set Additional Event Number Text
                                eventAdditionalList.find(".event-additional-number").html(obj.value);

                                $("#eventaAdditionalContent .event-add-additional-list").remove();
                                $("#eventaAdditionalContent").append(eventAdditionalList);
                            }
                        });
                    });
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

        function newEvent() {

            var self = this;

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

            var queryDataParameter = processLocalData.createXMLDataString(queryDataObj);
            var basicListParameter = "";

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

            var queryData = "<LayoutHeader>" + queryDataParameter + basicListParameter + "</LayoutHeader>";

            this.successCallback = function(data) {

                var resultCode = data['ResultCode'];

                if (resultCode === "014901") {
                    loadingMask("hide");
                    eventAddSuccess();
                } else if (resultCode === "014918") {
                    loadingMask("hide");
                    $("#eventAddFail").popup("open");
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                $("#eventAddConfirm").popup("close");
                loadingMask("show");
                checkEventTemplateData("update", $("#eventTemplateTextarea").val());

                CustomAPI("POST", true, "newEvent", self.successCallback, self.failCallback, queryData, "");
            }();

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

                $.mobile.changePage('#viewEventList');
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
            var unrelatedEventList = new getUnrelatedEventList();

            //Set Default
            $("#eventLevel").val("1");
            $("#eventTemplateTextarea").val("請選擇範本或輸入標題");
            $("#eventDescriptionTextarea").val("描述文字");
            $("#eventLocationListContent .event-add-location-list").remove();
            $("#setNow").prop("checked", "checked");
            setDateTime = "setNow";
            $("#textDateTime").html("");
            $("#eventaAdditionalContent .event-add-additional-list").remove();
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
            var domID = $(this).parent().siblings().find("select").prop("id");

            $("#" + domID).parents(".event-add-additional-list").remove();
            $("#" + domID).val("0");
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

        //Event Add Fail
        $(document).on("click", "#eventAddFail .confirm", function() {
            $("#eventAddFail").popup("close");
        });
    }
});
