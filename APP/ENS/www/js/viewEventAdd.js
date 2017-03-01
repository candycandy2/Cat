
$("#viewEventAdd").pagecontainer({
    create: function(event, ui) {
        
        /********************************** function *************************************/
        
        /********************************** page event *************************************/
        $("#viewEventList").one("pagebeforeshow", function(event, ui) {

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
                title: "請選擇一機房位置",
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
        });
        
        /********************************** dom event *************************************/

    }
});
