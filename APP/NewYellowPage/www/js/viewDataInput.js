
$(document).one("pagecreate", "#viewDataInput", function(){
    
    $("#viewDataInput").pagecontainer({
        create: function(event, ui) {
            
            /********************************** function *************************************/
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
                    QPlayAPI("POST", "QueryCompanyData", self.successCallback, self.failCallback);
                }();
            };

            function checkInputData() {
                var queryData;
                var empty = true;
                $("#viewDataInput input[type=text]").each(function(index, element) {
                    queryData = $(element).val();
                    if ($(element).val().length !== 0) {
                        empty = false;
                    }
                });
                if (empty) {
                    $("#noQueryCondition").popup("open");
                } else {
                    $.mobile.changePage('#viewQueryResult');
                }
            }

            function clearInputData() {
                var company = $("select#Company");
                company[0].selectedIndex = 0;
                company.selectmenu("refresh");

                $("#viewDataInput input[type=text]").val("");
                $("#viewDataInput input[type=number]").val("");
            }

            /********************************** page event *************************************/
            $("#viewDataInput").on("pagebeforeshow", function(event, ui) {
                if (doClearInputData) {
                    clearInputData();
                    doClearInputData = true;
                }
            });

            /********************************** dom event *************************************/
            $("#cleanQuery").on("click", function() {
                clearInputData();
            });

            $("#callQuery").on("click", function() {
                prevPageID = "viewDataInput";
                checkInputData();
            });

            $('#viewDataInput').keydown(function(event) {
                if (event.keyCode === 13) {
                    /* keyCode of 'Enter' key is 13 */
                    checkInputData();
                }
            });

            $("#ExtNum").keyup(function(event) {
                var pattern = /([^0-9\-]*)[0-9\-]*([^0-9\-]*)/;
                var char = event.currentTarget.value;
                var maxlength = $("#ExtNum").data('maxlength');
                var residue = char.match(pattern);
                if(residue[1] !== "" || residue[2] !== "") {
                    $("#ExtNum").val($("#ExtNum").val().replace(residue[1],""));
                    $("#ExtNum").val($("#ExtNum").val().replace(residue[2],""));
                }
                if($("#ExtNum").val().length > maxlength - 1 && (event.key) !== "Backspace") {
                    $("#ExtNum").val($("#ExtNum").val().substring(0, 10));   
                }
            });
        }
    });
});