
$("#viewApplyInsurance").pagecontainer({
    create: function (event, ui) {
        /********************************** function *************************************/
        //加保原因DDL生成
        function getApplyReasonList() {
            //初始化           
            $("#applyReason").html("");
            $("#applyReason-popup").remove();
            $(document).off("click", "#applyReason-popup-option");
            $("#applyReason-popup-option").popup("destroy").remove();

            var options = [{value: "1", text: "依附投保" }, 
                           {value: "2", text: "喪失被保險人身分"},
                           {value: "3", text: "結婚"},
                           {value: "4", text: "新生嬰兒"},
                           {value: "5", text: "在學無業"},
                           {value: "6", text: "禁治產宣告"},
                           {value: "7", text: "殘障不能謀生"},
                           {value: "8", text: "重傷病無業"},
                           {value: "9", text: "應屆畢業(退伍)"},
                           {value: "23", text: "等級變更"}];

            var defaultReason = "依附投保";

            var applyReasonData = {
                id: "applyReason-popup",
                option: options,
                defaultText: defaultReason,
                changeDefaultText: true,
                attr: {
                    class: "tpl-dropdown-list-icon-arrow"
                }
            };

            //生成申請加保reason dropdownlist
            tplJS.DropdownList("viewApplyInsurance", "applyReason", "prepend", "typeB", applyReasonData);

        }

        /********************************** page event *************************************/
        $("#viewApplyInsurance").one("pagebeforeshow", function (event, ui) {
            getApplyReasonList();
        });

        $("#viewApplyInsurance").on("pageshow", function (event, ui) {
            $("#familyName").text(clickFamilyName);
        });
        
        /******************************** datetimepicker ***********************************/


        /********************************** dom event *************************************/
        //返回到個人保險現況，彈窗popup
        $("#backPersonalInsurance").on("click", function () {
            popupMsgInit('.confirmCancelApply');
        });

        //確定取消申請，跳轉
        $("#confirmCancelApplyBtn").on("click", function () {
            $.mobile.changePage("#viewPersonalInsurance"); 
        });
    }
});