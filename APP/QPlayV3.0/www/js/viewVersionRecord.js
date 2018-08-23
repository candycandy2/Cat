$("#viewVersionRecord").pagecontainer({
    create: function(event, ui) {

        /********************************** page event ***********************************/
        $("#viewVersionRecord").on("pagebeforeshow", function(event, ui) {
            $("#versionRecordList").html('');
        });

        $("#viewVersionRecord").on("pageshow", function(event, ui) {
            if (versionFrom) {
                var versionData = new getVersionRecord();
            } else {
                var versionData = new getVersionRecord(checkAPPKey);
            }
        });

        $("#viewVersionRecord").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/
        //返回上一页
        $('#viewVersionRecord .q-btn-header').on('click', function() {
            if (versionFrom) {
                checkAppPage('viewAppSetting');
            } else {
                checkAppPage('viewAppDetail2-2');
            }
        });

    }
});