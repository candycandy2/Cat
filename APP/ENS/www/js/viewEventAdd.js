
$("#viewEventAdd").pagecontainer({
    create: function(event, ui) {
        
        /********************************** function *************************************/

        window.someFunction = function(obj, para1, para2, para3, para4, para5) {
            console.log(obj);
            console.log(para1);
            console.log(para2);
            console.log(para3);
            console.log(para4);
            console.log(para5);
        };

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
            var eventTemplateData = {
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

            tplJS.DropdownList("viewEventAdd", "eventTempalteSelectContent", "append", "typeB", eventTemplateData);

            //UI Dropdown List : Event Function
            var eventFunctionData = {
                id: "eventFunction",
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

            tplJS.DropdownList("viewEventAdd", "eventFunctionSelectContent", "append", "typeB", eventFunctionData);

            //UI Dropdown List : Event Additional
            var eventAdditionalData = {
                id: "eventAdditional",
                defaultText: "添加事件",
                title: "請選擇-關聯事件",
                option: [{
                    value: "1",
                    text: "16003[機房緊急通報_停電]因為XXX, 請 QTY 機房進行關機作業"
                }, {
                    value: "2",
                    text: "16003[機房緊急通報_停電]因為XXX, 請 QTY 機房進行關機作業"
                }, {
                    value: "3",
                    text: "16003[機房緊急通報_停電]因為XXX, 請 QTY 機房進行關機作業"
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
            /*
            $('#someinput').FlipBox({
                afterToday: true
            });
            */
        });
        /********************************** dom event *************************************/

    }
});
