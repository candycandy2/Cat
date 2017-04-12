
//$(document).one("pagecreate", "#viewDataInput", function(){

// review
var companyInfoAry = [], expiredTime = 3;   // exporedTime = 3 months

    $("#viewDataInput").pagecontainer({
        create: function(event, ui) {
            var tempPhonebookData = {};
            var doRefresh = false, telString = "";

            /****************************************************** function ********************************************************/
            window.QueryCompanyData = function() {
                
                var self = this, storageTime;
                
                // review
                if (localStorage.getItem('companyInfo') === null){
                    this.successCallback = function(data) {
                        loadingMask("hide");
                        var resultcode = data['ResultCode'];
                        if (resultcode === "1") {
                            insertCompanyValue(data['Content']);
                            
                            // save data into localstorage
                            var nowTime = new Date();
                            companyInfoAry.push({'result': data['Content'], 'time': nowTime});
                            localStorage.setItem('companyInfo', JSON.stringify(companyInfoAry));
                        }
                    };
                    this.failCallback = function(data) {};
                    var __construct = function() {
                        CustomAPI("POST", true, "QueryCompanyData", self.successCallback, self.failCallback, queryData, "");
                    }();
                }
                else{
                    var storageData = JSON.parse(localStorage.getItem("companyInfo"));
                    insertCompanyValue(storageData[0].result);
                    if (checkDataExpired(storageData[0].time, expiredTime, 'MM')){
                        localStorage.removeItem("companyInfo");
                    }
                    loadingMask("hide");
                }
            };

            // review
            // insert value into html
            function insertCompanyValue(dataContent){
                $('#Company').html('<option value="All Company">All Company</option>');
                for (var i=2; i<dataContent.length; i++) { // ignore 0 and 1, 0: "All Company", 1: ""
                    var companyname = dataContent[i].CompanyName;
                    $('#Company').append('<option value="' + companyname + '">' + companyname + '</option>');
                }
                QueryMyPhoneBook();
            }

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

            function phoneBookListHTML(index, company, eName, cName, extNo) {
                // check has more than one ext num or not
                if (extNo.indexOf(';')>0){
                    telString = " class='chooseNumPop extNumMore'" + ' ';
                    for (var i = 0; i < extNo.match(/;/igm).length+1; i++){
                        telString += "data-extnum" + (i+1) + "='" + extNo.split(';')[i] + "' ";
                    }
                    telString += 'data-extnum="' + extNo + '"';
                    extTmpNum = extNo.split(';')[0];
                }
                else{
                    telString = " href='tel:" + extNo + "'";
                    extTmpNum = extNo;
                }
                return '<li>'
                        +   '<div class="checkbox-area">'
                        +       '<input type="checkbox" class="custom" data-mini="true" id="phoneBookList' + index + '">'
                        +   '</div>'
                        +   '<div class="name">'
                        +       '<p><a href="#" value="' + index.toString() + '" name="detailIndex">' + eName + '</a></p>'
                        +       '<p><a href="#" value="' + index.toString() + '" name="detailIndex">' + cName + '</a></p>'
                        +   '</div>'
                        +   '<div class="img-phone">'
                        +       '<img src = "img/phone.png">'
                        +       '<div class="tel-num">'
                        +           '<p><a rel="external"' + telString + '>' + extTmpNum + '</a></p>'
                        +       '</div>'
                        +   '</div>'
                        +   '<div class="img-info">'
                        +       '<a href="#" value="' + index.toString() + '" name="detailIndex"><img src="img/info.png"></a>'
                        +   '</div>'
                        + '</li>';
            }

            window.QueryMyPhoneBook = function() {
                var self = this;
                var queryData = '<LayoutHeader><User_EmpID>' + loginData["emp_no"] + '</User_EmpID></LayoutHeader>';

                this.successCallback = function(data) {
                    var resultcode = data['ResultCode'];

                    if (resultcode === "1") {

                        phonebookData = {};
                        var htmlContent = "";

                        if(data['Content'].length !== 0) {
                            $('#phonebookEdit').show();
                        }

                        for (var i=0; i<data['Content'].length; i++) {
                            var tempData = {};

                            tempData["company"] = data['Content'][i].Company;
                            tempData["ename"] = data['Content'][i].Name_EN;
                            tempData["cname"] = data['Content'][i].Name_CH;
                            tempData["extnum"] = data['Content'][i].Ext_No;
                            tempData["employeeid"] = data['Content'][i].EmployeeID;

                            phonebookData[i] = tempData;

                            var content = htmlContent + phoneBookListHTML(i, tempData["company"], tempData["ename"], tempData["cname"], tempData["extnum"]);
                            htmlContent = content;
                        }

                        $("#myPhonebookList").html(htmlContent).enhanceWithin();
                        $('#myPhonebookList').listview('refresh');
                        loadingMask("hide");

                        $('a[name="detailIndex"]').click(function(e) {
                            e.stopImmediatePropagation();
                            e.preventDefault();

                            prevPageID = "viewDataInput";
                            employeeSelectedIndex = $(this).attr("value");
                            $.mobile.changePage('#viewDetailInfo');
                        });
                    } else {
                        //ResultCode = 001901, [no data]
                        loadingMask("hide");
                        $('#phonebookEdit').hide();
                    }
                };

                this.failCallback = function(data) {};

                var __construct = function() {
                    CustomAPI("POST", true, "QueryMyPhoneBook", self.successCallback, self.failCallback, queryData, "");
                }();

            }

            window.deletePhoneBook = function(actionPage, index) {
                var self = this;
                var company;
                for(var i=0; i<Object.keys(phonebookData).length; i++) {
                    if(index === phonebookData[i].employeeid) {
                        company = phonebookData[i].company
                        break;
                    }
                }
                var queryData = '<LayoutHeader><User_EmpID>' + loginData["emp_no"] + '</User_EmpID>' +
                                '<Delete_EmpID>' + index + '</Delete_EmpID>' + 
                                '<Delete_Company>' + company + '</Delete_Company></LayoutHeader>';
                this.successCallback = function(data) {
                    if (data['ResultCode'] === "001904") {
                        if (actionPage === "pageTwo") {
                            if (doRefresh) {
                                refreshMyPhonebookList();
                            }
                        } else if (actionPage === "viewDetailInfo") {
                            deletePheonBookFinished();
                        }
                    } else if (resultcode === "000908" || resultcode === "000907" || resultcode === "000914") {
                        getServerData();
                    } else {
                        //ResultCode = 001905, [fail]
                    }
                    QueryMyPhoneBook();
                };

                this.failCallback = function(data) {};

                var __construct = function() {
                    CustomAPI("POST", true, "DeleteMyPhoneBook", self.successCallback, self.failCallback, queryData, "");
                }();
            };

            function refreshMyPhonebookList() {

                phonebookData = tempPhonebookData;
                tempPhonebookData = {};
                
                $("#myPhonebookList").empty();
                var htmlContent = "";

                $.map(phonebookData, function(value, key) {
                    var content = htmlContent + phoneBookListHTML(key, phonebookData[key].company, phonebookData[key].ename, phonebookData[key].cname, phonebookData[key].extnum);
                    htmlContent = content;
                });

                $("#myPhonebookList").html(htmlContent).enhanceWithin();
                $('#myPhonebookList').listview('refresh');
                loadingMask("hide");
                doRefresh = false;
                if(Object.keys(phonebookData).length === 0){
                    $('#phonebookEdit').hide();
                }
            }

            window.cancelEditMode = function() {
                $('.edit-checkbox').hide();
                $('#myPhonebookList .ui-checkbox').hide();
                $('#phonebookEditBtn').hide();
                $('#myPhonebookList').removeClass('editClick');
            };

            /******************************************************* page event *******************************************************/
            $("#viewDataInput").on("pagebeforeshow", function(event, ui) {
                if (doClearInputData) {
                    clearInputData();
                    doClearInputData = true;
                }
                $('#pageOne').show();
                $('#pageTwo').hide();
                var tabValue = $("#reserveTab :radio:checked").val();
                if (tabValue == 'tab2'){
                    $('#myPhonebookList').removeClass('editClick');
                    $('#phonebookEditBtn').hide();
                    $('#phonebookEdit').show();
                    $('#pageOne').hide();
                    $('#pageTwo').show();
                    $('#phoneDelete').addClass('noneSelect');
                }
                if (device.platform === "iOS") {
                    $('.ui-page:not(#viewInitial)').addClass('ui-page-ios');
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

            $('#reserveTab').change(function() {
                var tabValue = $("#reserveTab :radio:checked").val();
                if (tabValue == 'tab1') {
                    $('#pageOne').show();
                    $('#pageTwo').hide();
                    $('#phonebookEditBtn').hide();
                    $('#phonebookEdit').show();
                    $('#myPhonebookList').removeClass('editClick');
                    $('#phoneDelete').addClass('noneSelect');
                } else if (tabValue == 'tab2'){
                    $('#pageTwo').show();
                    $('#pageOne').hide();
                }
            });

            $('body').on('click', '#phonebookEdit', function(){
               if ($('#phonebookEditBtn').hasClass('hide')) {
                    $('.edit-checkbox').show();
                    $('#myPhonebookList .ui-checkbox').show();
                    $('#phonebookEditBtn').show();
                    $('#myPhonebookList .edit-checkbox').css('height','20px');
                    $('#pageTwo :checkbox').prop('checked', false);
                    $('#myPhonebookList').addClass('editClick');
                    $(this).hide();
               } else {
                    cancelEditMode();
               }
            });

            $('#pageTwo #phoneCancelDelete').on('click', function(){
                $('#phonebookEditBtn').hide();
                $('#phonebookEdit').show();
                $('#myPhonebookList').removeClass('editClick');
                $('#phoneDelete').addClass('noneSelect');
            });

            $('#phoneDelete').on('click', function(){
                var checkboxCheckedCount = $('#pageTwo :checkbox:checked').length;

                if (checkboxCheckedCount === 0) {
                    // popupMsgInit('.phonebookSelectAlert');
                } else {
                    popupMsgInit('.phonebookDeleteConfirm');
                }
            });

            $('body').on('click', '#myPhonebookList .ui-checkbox input', function(){
                if ($('#myPhonebookList .ui-checkbox input:checked').length < 1){
                    $('#phoneDelete').addClass('noneSelect');
                }
                else{
                    $('#phoneDelete').removeClass('noneSelect');
                }
            });

            // phone book delete confirm
            $('body').on('click', '.phonebookDeleteConfirm .btn-confirm', function() {
                var doDeleteCount = 0;
                var checkboxCheckedCount = $('#pageTwo :checkbox:checked').length;
                loadingMask("show");

                $.map(phonebookData, function(value, key) {
                    var tempData = {};
                    
                    if ($("#phoneBookList" + key).prop("checked")) {
                        doDeleteCount++;
                        
                        if (checkboxCheckedCount === doDeleteCount) {
                            doRefresh = true;
                        }

                        deletePhoneBook("pageTwo", phonebookData[key].employeeid);

                    } else {
                        tempData["company"] = phonebookData[key].company;
                        tempData["ename"] = phonebookData[key].ename;
                        tempData["cname"] = phonebookData[key].cname;
                        tempData["extnum"] = phonebookData[key].extnum;
                        tempData["employeeid"] = phonebookData[key].employeeid;

                        tempPhonebookData[key] = tempData;
                    }
                });
                $(".phonebookDeleteConfirm").popup("close");
                $('#phonebookEditBtn').hide();
                $('#phonebookEdit').show();
                $('#myPhonebookList').removeClass('editClick');
                $('#phoneDelete').addClass('noneSelect');
            });

            $('body').on('click', 'div[for=phonebookSelectAlert] #confirm', function() {
                $("#viewPopupMsg").popup("close");
            });

            /***********************************************  Validation of input data  ***********************************************/
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
