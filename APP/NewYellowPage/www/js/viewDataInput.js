
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
                    }
                };

                this.failCallback = function(data) {};

                var __construct = function() {
                    QPlayAPI("POST", "QueryCompanyData", self.successCallback, self.failCallback);
                }();

            };

            function checkInputData() {
                var emptyData = true;

                $("#viewDataInput input[type=text]").each(function(index, element){
                    if ($(element).val().length !== 0) {
                        emptyData = false;
                    }
                });

                if (emptyData) {
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

            $('#viewDataInput').keypress(function(event) {
                if (event.keyCode === 13) {
                    // keyCode of 'Enter' key is 13
                    checkInputData();
                }
            });

        }
    });

});