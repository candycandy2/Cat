$("#viewUserRecordList").pagecontainer({
    create: function (event, ui) {



        function initialPage() {

        }

        function createRecordList() {

        }
        

        /********************************** page event ***********************************/
        $("#viewUserRecordList").on("pagebeforeshow", function (event, ui) {
            
        });

        $("#viewUserRecordList").one("pageshow", function (event, ui) {
            
        });

        $("#viewUserRecordList").on("pageshow", function (event, ui) {
            
        });

        $("#viewUserRecordList").on("pagehide", function (event, ui) {

        });



        /********************************** dom event *************************************/
        $('#userRefresh').on('click', function () {
            createRecordList();
        });



    }
});