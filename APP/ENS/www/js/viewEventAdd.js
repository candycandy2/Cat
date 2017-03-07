
$("#viewEventAdd").pagecontainer({
    create: function(event, ui) {
        
        var doneDateTime = {};
        var eventTemplateData;
        var eventLocationData;
        window.eventFunctionData;
        var eventAdditionalData;

        /********************************** function *************************************/

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

            var textDateTime = doneDateTime["year"] + "/" + doneDateTime["month"] + "/" + doneDateTime["day"] + " " +
            doneDateTime["hour"] + ":" + doneDateTime["minute"];
            $("#textDateTime").html(textDateTime);

            console.log(doneDateTime);
            tplJS.recoveryPageScroll();
        };

        function eventAddSuccess() {
            var content = '<div><span>AAAAA</span></div>';
            $('<div class="event-add-success-full-screen">' + content + '</div').appendTo("body");

            tplJS.preventPageScroll();

            setTimeout(function() {
                $(".event-add-success-full-screen").remove();
                tplJS.recoveryPageScroll();
            }, 3000);
        }

        /********************************** page event *************************************/
        $("#viewEventAdd").one("pagebeforeshow", function(event, ui) {

            //UI Dropdown List : Event Level
            var eventLevelData = {
                id: "eventLevel",
                option: [{
                    value: "0",
                    text: "一般通報"
                }, {
                    value: "1",
                    text: "緊急通報"
                }],
                attr: {
                    class: "text-bold"
                }
            };

            tplJS.DropdownList("viewEventAdd", "eventLevelContent", "append", "typeA", eventLevelData);

            //UI Dropdown List : Event Template
            eventTemplateData = {
                id: "eventTemplate",
                defaultText: "選擇範本",
                title: "標題範本",
                option: [{
                    value: "1",
                    text: "選擇範本----------------------------------1"
                }, {
                    value: "2",
                    text: "選擇範本----------------------------------2"
                }, {
                    value: "3",
                    text: "選擇範本----------------------------------3"
                }],
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
                option: [{
                    value: "1",
                    text: "QTT 3F"
                }, {
                    value: "2",
                    text: "QTT 7F"
                }, {
                    value: "3",
                    text: "QTY 雙星"
                }],
                attr: {
                    class: "text-bold"
                }
            };

            tplJS.DropdownList("viewEventAdd", "eventLocationSelectContent", "append", "typeB", eventLocationData);

            //UI Dropdown List : Event Additional
            eventAdditionalData = {
                id: "eventAdditional",
                defaultText: "添加事件",
                title: "請選擇-關聯事件",
                option: [{
                    value: "16003",
                    text: "16003[機房緊急通報_停電]因為XXX, 請 QTY 機房進行關機作業"
                }, {
                    value: "16002",
                    text: "16002[機房緊急通報_停電]因為XXX, 請 QTY 機房進行關機作業"
                }, {
                    value: "16001",
                    text: "16001[機房緊急通報_停電]因為XXX, 請 QTY 機房進行關機作業"
                }],
                attr: {
                    class: "text-bold"
                }
            };

            tplJS.DropdownList("viewEventAdd", "eventaAdditionalSelectContent", "append", "typeB", eventAdditionalData);

            //UI Popup : Event Add Confirm
            var eventAddConfirmData = {
                id: "eventAddConfirm",
                content: $("template#tplEventAddConfirm").html()
            };

            tplJS.Popup("viewEventAdd", "contentEventAdd", "append", eventAddConfirmData);

        });
        
        $("#viewEventAdd").on("pageshow", function(event, ui) {
            eventAddSuccess();
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
            var selectedValue = $(this).val();

            //create new Event Location List, set new ID by count number
            var ID = parseInt($(".event-add-location-list").length + 1, 10);

            //UI Dropdown List : Event Function
            eventFunctionData = {
                id: "eventFunction-" + ID,
                defaultText: "All Function",
                title: "IT Function",
                option: [{
                    value: "1",
                    text: "Function A"
                }, {
                    value: "2",
                    text: "Function B"
                }, {
                    value: "3",
                    text: "Function C"
                }, {
                    value: "4",
                    text: "Function D"
                }, {
                    value: "5",
                    text: "Function E"
                }, {
                    value: "6",
                    text: "Function F"
                }],
                attr: {
                    class: "tpl-dropdown-list-icon-arrow"
                }
            };

            var eventLocationListHTML = $("template#tplEventLocationList").html();

            $.each(eventLocationData.option, function(key, obj) {
                if (obj.value == selectedValue) {

                    var eventLocationList = $(eventLocationListHTML);

                    //set Loction Text
                    eventLocationList.find(".event-loction").html(obj.text);

                    //set function content in New ID
                    var functionContentID = eventLocationList.find(".event-function").prop("id");
                    functionContentID = functionContentID + "-" + ID;
                    eventLocationList.find(".event-function").prop("id", functionContentID);

                    $("#eventLocationListContent").append(eventLocationList);

                    //create Event Function drowdown list
                    tplJS.DropdownList("viewEventAdd", functionContentID, "append", "typeB", eventFunctionData);

                    //resize Event Function drowdown list
                    tplJS.reSizeDropdownList(eventFunctionData.id, null, 81);

                    //bind Event Function change event
                    $(document).on("change", "#" + eventFunctionData.id, function() {
                        var selectedValue = $(this).val();

                        $.each(eventFunctionData.option, function(key, obj) {
                            if (obj.value == selectedValue) {
                                $("#" + eventFunctionData.id).find("option:selected").html(obj.text);
                            }
                        });
                    });
                }
            });
        });

        $(document).on("change", "#eventAdditional", function() {
            var selectedValue = $(this).val();

            //create new Event Additional List, set new ID by count number
            var ID = parseInt($(".event-add-additional-list").length + 1, 10);

            var eventAdditionalListHTML = $("template#tplEventAdditionalList").html();

            $.each(eventAdditionalData.option, function(key, obj) {
                if (obj.value == selectedValue) {
                    var eventAdditionalList = $(eventAdditionalListHTML);

                    //set Additional Event Number Text
                    eventAdditionalList.find(".event-additional-number").html(obj.value);

                    $("#eventaAdditionalContent").append(eventAdditionalList);
                }
            });
        });

        //Radio Button : Finish Time
        $(document).on("change", "input[name=setDateTime]", function() {
            var setDateTime = $('input[name=setDateTime]:checked').val();

            if (setDateTime === "setNow") {
                $("#textDateTime").html("");
            } else if (setDateTime === "setTime") {
                $("#doneDate").trigger('datebox', {'method':'open'});

                tplJS.preventPageScroll();
            }
        });

        //Send Event
        $(document).on("click", "#sendEvent", function() {
            $("#eventAddConfirm").popup("open");
        });

        $(document).on("click", "#eventAddConfirm .cancel", function() {
            $("#eventAddConfirm").popup("close");
        });

        $(document).on("click", "#eventAddConfirm .confirm", function() {

        });
    }
});
