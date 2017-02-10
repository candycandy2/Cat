
//$(document).one("pagecreate", "#viewDataInput", function(){
    
    $("#viewDataInput").pagecontainer({
        create: function(event, ui) {
            
            /****************************************************** function ********************************************************/
            window.QueryCompanyData = function() {
                
                var self = this;

                this.successCallback = function(data) {
                    loadingMask("hide");
                    var resultcode = data['ResultCode'];
                    if (resultcode === "1") {
                        var dataContent = data['Content'];
                        $('#Company').html('<option value="All Company">All Company</option>');
                        for (var i=2; i<dataContent.length; i++) { // ignore 0 and 1, 0: "All Company", 1: ""
                            var companyname = dataContent[i].CompanyName;
                            $('#Company').append('<option value="' + companyname + '">' + companyname + '</option>');
                        }
                        QueryMyPhoneBook();
                    }
                };
                this.failCallback = function(data) {};
                var __construct = function() {
                    CustomAPI("POST", true, "QueryCompanyData", self.successCallback, self.failCallback, queryData, "");
                }();
            };

            function checkInputData() {
                var queryData;
                var empty = true;
                $("#viewDataInput input[type=text]").each(function(index, element) {
                    queryData = $(element).val();
                    if ($(element).val().length !== 0)
                        empty = false;
                });
                if (empty) {
                    popupMsg("noQueryCondition", "請輸入查詢條件", "", "", false, "關閉", "");
                } else {
                    $.mobile.changePage('#viewQueryResult');
                }
            }

            function clearInputData() {
                var company = $("select#Company");
                company[0].selectedIndex = 0;
                company.selectmenu("refresh");
                $("#viewDataInput input[type=text]").val("");
            }

            /******************************************************* page event *******************************************************/
            $("#viewDataInput").on("pagebeforeshow", function(event, ui) {
                if (doClearInputData) {
                    clearInputData();
                    doClearInputData = true;
                }
            });

            /******************************************************** dom event *******************************************************/
            $("#cleanQuery").on("click", function() {
                clearInputData();
            });

            $("#callQuery").on("click", function() {
                prevPageID = "viewDataInput";
                checkInputData();
            });

            $('body').on('click', 'div[for=noQueryCondition] #confirm', function() {
                    $("#viewPopupMsg").popup("close");
            });

            // $('#viewDataInput').keydown(function(event) {
            //     /* keyCode of 'Enter' key is 13 */
            //     if (event.keyCode === 13)
            //         checkInputData();
            // });

            /***********************************************  Validation of input data  ***********************************************/
            $("#CName").keyup(function(event) {
                var pattern = /([^\u4E00-\u9FFF\u3400-\u4DB5\-\.]*)[\u4E00-\u9FFF\u3400-\u4DB5\-\.]*([^\u4E00-\u9FFF\u3400-\u4DB5\-\.]*)/;
                var maxlength = $("#CName").data('maxlength');
                var residue = event.currentTarget.value.match(pattern);
                if(residue[1] !== "" || residue[2] !== "") {
                    $("#CName").val($("#CName").val().replace(residue[1], ""));
                    $("#CName").val($("#CName").val().replace(residue[2], ""));
                }
                if($("#CName").val().length > maxlength - 1)
                    $("#CName").val($("#CName").val().substring(0, maxlength));
            });

            $("#EName").keyup(function(event) {
                var pattern = /([^a-zA-Z\-\.]*)[a-zA-Z\-\.]*([^a-zA-Z\-\.]*)/;
                var maxlength = $("#EName").data('maxlength');
                var residue = event.currentTarget.value.match(pattern);
                if(residue[1] !== "" || residue[2] !== "") {
                    $("#EName").val($("#EName").val().replace(residue[1], ""));
                    $("#EName").val($("#EName").val().replace(residue[2], ""));
                }
                if($("#EName").val().length > maxlength - 1)
                    $("#EName").val($("#EName").val().substring(0, maxlength));
            });

            $("#Department").keyup(function(event) {
                var pattern = /([^a-zA-Z0-9\-]*)[a-zA-Z0-9\-]*([^a-zA-Z0-9\-]*)/;
                var maxlength = $("#Department").data('maxlength');
                var residue = event.currentTarget.value.match(pattern);
                if(residue[1] !== "" || residue[2] !== "") {
                    $("#Department").val($("#Department").val().replace(residue[1],""));
                    $("#Department").val($("#Department").val().replace(residue[2], ""));
                }
                if($("#Department").val().length > maxlength - 1)
                    $("#Department").val($("#Department").val().substring(0, maxlength));
            });

            $("#ExtNum").keyup(function(event) {
                var pattern = /([^0-9\-]*)[0-9\-]*([^0-9\-]*)/;
                var maxlength = $("#ExtNum").data('maxlength');
                var residue = event.currentTarget.value.match(pattern);
                if(residue[1] !== "" || residue[2] !== "") {
                    $("#ExtNum").val($("#ExtNum").val().replace(residue[1], ""));
                    $("#ExtNum").val($("#ExtNum").val().replace(residue[2], ""));
                }
                if($("#ExtNum").val().length > maxlength - 1)
                    $("#ExtNum").val($("#ExtNum").val().substring(0, maxlength));   
            });
        }
    });
//});