$("#viewUserRecord").pagecontainer({
    create: function (event, ui) {



        function initialPage() {

        }

        function createRecordType() {
            var typeData = {
                id: "record-popup",
                option: [],
                title: "",
                defaultText: langStr["str_129"],
                changeDefaultText: true,
                attr: {
                    class: "tpl-dropdown-list-icon-arrow"
                }
            }

            typeData["option"][0] = {};
            typeData["option"][0]["value"] = "1";
            typeData["option"][0]["text"] = langStr["str_130"];
            typeData["option"][1] = {};
            typeData["option"][1]["value"] = "2";
            typeData["option"][1]["text"] = langStr["str_131"];

            tplJS.DropdownList("viewUserRecord", "userRecordType", "prepend", "typeB", typeData);
        }

        /********************************** page event ***********************************/
        $("#viewUserRecord").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewUserRecord").on("pageshow", function (event, ui) {
            // $('#datepicker').parent().datepicker({
            //     "autoclose":true,
            //     "format":"yyyy/mm/dd"
            // });
            // $('#datepicker').datetimepicker({
            //     format: 'Y/m/d',
            //     timepicker: false,
            //     onSelectTime: function(current_time, $input) {
                    
            //     }
            // });
        });

        $("#viewUserRecord").on("pagehide", function (event, ui) {

        });



        /********************************** dom event *************************************/




    }
});