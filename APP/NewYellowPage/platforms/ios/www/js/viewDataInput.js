
$(document).one("pagecreate", "#viewDataInput", function(){
    
    $("#viewDataInput").pagecontainer({
        create: function(event, ui) {
            
            /********************************** function *************************************/
            window.QueryCompanyData = function() {
                console.log("Allen---------2");
                var self = this;

                this.successCallback = function(data) {
                    var resultcode = data['ResultCode'];
                    console.log("Allen---------3");
                    if (resultcode === "1" || resultcode === "1906") {
                        var dataContent = data['Content'];
                        
                        for (var i=2; i<dataContent.length; i++) { // ignore 0 and 1, 0: "All Company", 1: ""
                            var companyname = dataContent[i].CompanyName;
                            $('#Company').append('<option value="' + companyname + '">' + companyname + '</option>');
                        }console.log("Allen---------4");
                    }
                };

                this.failCallback = function(data) {
                    
                };

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
                    $(":mobile-pagecontainer").pagecontainer("change", $("#viewQueryResult"));
                }
            }

            /********************************** page event *************************************/
            $("#viewDataInput").one("pagebeforeshow", function(event, ui) {
            
            });

            $("#viewDataInput").one("pageshow", function(event, ui) {
            
            });

            /********************************** dom event *************************************/
            $("#cleanQuery").on("click", function() {
                var company = $("select#Company"); 
                company[0].selectedIndex = 0; 
                company.selectmenu("refresh");

                $("#viewDataInput input[type=text]").val("");
            });

            $("#callQuery").on("click", function() {
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