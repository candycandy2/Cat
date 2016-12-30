
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
                var pattern;
                var residue;
                var empty = true;
                var error = false;
                var USERINPUT = {
                        CNAME      : 0,
                        ENAME      : 1,
                        DEPARTMENT : 2,
                        EXT        : 3
                };
                $("#viewDataInput input[type=text]").each(function(index, element) {
                    queryData = $(element).val();
                    if ($(element).val().length !== 0) {
                        empty = false;
                        switch(index){
                           
                            case USERINPUT.CNAME :
                            /***********************************************************************
                            1.開始查詢前，要判斷是否有特殊字元，有的話彈跳顯示視窗( 中文姓名不允許
                            輸入特殊符號，但可輸入( . 和 - )符號。 )，並且無法進行查詢。

                            2.開始查詢前，要判斷是否超過10個字，超過的話彈跳顯示視窗( 中文姓名超過10
                            個字。 )，並且無法進行查詢。
                            ************************************************************************/
                                break;
                            case USERINPUT.ENAME :
                           
                                break;
                            case USERINPUT.DEPARTMENT :

                                break;
                            case USERINPUT.EXT :
                            /************************************************************************
                            1.判斷輸入值是否為10個數字(字元)，包含特殊符號 ( - )            (O) 
                            2.判斷輸入值是否含有特殊字元，允許特殊符號( - )                 (O)
                            3.去掉特殊符號( - ) ，是否為數字                                (O)
                            *************************************************************************/
                                pattern = /([^0-9\-]*)([0-9\-]*)([^0-9\-]*)/;
                                residue = queryData.match(pattern);
                                if(residue[1] === "" && residue[3] === "") {
                                    pattern = /([0-9\-]{0,10})([0-9\-]*)/;
                                    residue = queryData.match(pattern);
                                    if(residue[2] === "") {
                                        /**/
                                    }else{
                                        /*
                                        ERROR!! the size of input is larger than 10 character.
                                        */
                                        error = true;
                                        empty = true;
                                    }
                                }else{
                                    /*
                                    ERROR!! the input dosen't contain any special character.
                                    */
                                    error = true;
                                    empty = true;
                                }
                        }
                    }
                });
                // if(error) {

                // }
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