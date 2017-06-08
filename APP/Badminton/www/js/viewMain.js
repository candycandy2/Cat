var leaveTypeData = {
    id: "eventType",
    option: [{
        value: "0",
        text: "去年特休"
    }, {
        value: "1",
        text: "去年彈休"
    }, {
        value: "2",
        text: "本期特休"
    }, {
        value: "3",
        text: "生理假"
    }],
    defaultValue: 1
};

$("#viewMain").pagecontainer({
    create: function(event, ui) {
        //page init

        $("#viewMain").one("pagebeforeshow", function(event, ui) {
        	// tplJS.DropdownList("viewMain", "leaveType", "append", "typeA", leaveTypeData);
        	

        });

        $("body").on("click","#popupTest", function() {
        	popupMsgInit('.loginPopup');
        });
    }
});