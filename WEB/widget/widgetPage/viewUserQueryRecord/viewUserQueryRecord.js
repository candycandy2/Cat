$("#viewUserQueryRecord").pagecontainer({
    create: function (event, ui) {



        function initialPage() {

        }

        function createQueryType() {
            var typeData = {
                id: "query-type",
                option: [],
                title: "",
                defaultText: langStr["str_129"],
                changeDefaultText: true,
                attr: {
                    class: "tpl-dropdown-list-icon-arrow-incline"
                }
            }

            typeData["option"][0] = {};
            typeData["option"][0]["value"] = "1";
            typeData["option"][0]["text"] = langStr["str_130"];
            typeData["option"][1] = {};
            typeData["option"][1]["value"] = "2";
            typeData["option"][1]["text"] = langStr["str_131"];

            tplJS.DropdownList("viewUserQueryRecord", "userQueryType", "prepend", "typeB", typeData);
            $('#query-type').css('padding', '0');
            $('#query-type-option').find('.close').css('top', '0');
            $('#query-type-option-list').css('margin-top', '3vw');
        }

        function initialDatetimePicker() {
            $('#userStartDate').attr('placeholder', langStr['str_135']);
            $('#userStartDate').datetimepicker({
                format: 'Y/m/d',
                timepicker: false,
            });

            $('#userEndDate').attr('placeholder', langStr['str_135']);
            $('#userEndDate').datetimepicker({
                format: 'Y/m/d',
                timepicker: false,
            });
        }

        //检查表单
        function checkForm() {
            var typeVal = $('#query-type').val();
            var startVal = $('#userStartDate').val();
            var endVal = $('#userEndDate').val();
            if(typeVal != langStr["str_129"] && startVal != '' && endVal != '') {
                $('.user-query-search').addClass('button-active');
            } else {
                $('.user-query-search').removeClass('button-active');
            }
        }

        /********************************** page event ***********************************/
        $("#viewUserQueryRecord").on("pagebeforeshow", function (event, ui) {
            
        });

        $("#viewUserQueryRecord").one("pageshow", function (event, ui) {
            createQueryType();
            initialDatetimePicker();
        });

        $("#viewUserQueryRecord").on("pageshow", function (event, ui) {
            
        });

        $("#viewUserQueryRecord").on("pagehide", function (event, ui) {

        });



        /********************************** dom event *************************************/
        $('#userQueryType').on('change', '#query-type', function () {
            checkForm();
        });

        $('#userStartDate').on('change', function () {
            checkForm();
        });

        $('#userEndDate').on('change', function () {
            checkForm();
        });

        $('.user-query-search').on('click', function () {
            var has = $(this).hasClass('button-active');
            if(has){
                checkWidgetPage('viewUserRecordList');
            }
        });



    }
});