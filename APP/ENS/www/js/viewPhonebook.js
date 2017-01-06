
$(document).one("pagecreate", "#viewPhonebook", function(){
    
    $("#viewPhonebook").pagecontainer({
        create: function(event, ui) {

            var tempPhonebookData = {};
            var doRefresh = false;

            /********************************** function *************************************/
            function phoneBookListHTML(index, company, eName, cName, extNo) {
                return '<li>'
                        +   '<div class="company">'
                        +       '<p class="edit-checkbox">'
                        +           '<input type="checkbox" class="custom" data-mini="true" id="phoneBookList' + index + '">'
                        +       '</p>'
                        +       '<p>' + company + '</p>'
                        +   '</div>'
                        +   '<div class="e-name">'
                        +       '<p><a href="#" value="' + index.toString() + '" name="detailIndex">' + eName + '</a></p>'
                        +       '<p><a rel="external" href="tel:' + extNo + '" style="color:red;">' + extNo + '</a></p>'
                        +   '</div>'
                        +   '<div class="c-name">'
                        +       '<p><a href="#" value="' + index.toString() + '" name="detailIndex">' + cName + '</a></p>'
                        +   '</div>'
                        + '</li>';
            }

            function QueryMyPhoneBook() {
                
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

                            prevPageID = "viewPhonebook";
                            employeeSelectedIndex = $(this).attr("value");
                            $.mobile.changePage('#viewDetailInfo');
                        });
                    } else if (resultcode === "000908" || resultcode === "000907" || resultcode === "000914") {
                        getServerData();
                    } else {
                        //ResultCode = 001901, [no data]
                        loadingMask("hide");
                        $('#phonebookEdit').hide();
                    }
                };

                this.failCallback = function(data) {};

                var __construct = function() {
                    QPlayAPI("POST", "QueryMyPhoneBook", self.successCallback, self.failCallback, queryData);
                }();

            }

            window.deletePhoneBook = function(actionPage, index) {

                var self = this;
                var queryData = '<LayoutHeader><User_EmpID>' + loginData["emp_no"] + '</User_EmpID>' +
                                '<Delete_EmpID>' + phonebookData[index].employeeid + '</Delete_EmpID>' + 
                                '<Delete_Company>' + phonebookData[index].company + '</Delete_Company></LayoutHeader>';

                this.successCallback = function(data) {
                    if (data['ResultCode'] === "001904") {
                        if (actionPage === "viewPhonebook") {
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
                };

                this.failCallback = function(data) {};

                var __construct = function() {
                    QPlayAPI("POST", "DeleteMyPhoneBook", self.successCallback, self.failCallback, queryData);
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

                $("#phonebookDelectConfirm").popup('close');
                doRefresh = false;

                if(Object.keys(phonebookData).length === 0){
                    $('#phonebookEdit').hide();
                }
            }

            window.cancelEditMode = function() {
                $('.edit-checkbox').hide();
                $('#myPhonebookList .ui-checkbox').hide();
                $('#phonebookEditBtn').hide();
            };
            /********************************** page event *************************************/
            $("#viewPhonebook").on("pagebeforeshow", function(event, ui){
                loadingMask("show");
                var myPhoneBook = new QueryMyPhoneBook();

                $('.edit-checkbox').hide();
                $('.ui-checkbox').hide();
                $('#phonebookEditBtn').hide();
                $('#phonebook_page #selectAll').show();
            });

            /********************************** dom event *************************************/
            $('#phonebookEdit').on('click', function() {
               if ($('#phonebookEditBtn').is(':hidden')) {
                    $('.edit-checkbox').show();
                    $('#myPhonebookList .ui-checkbox').show();
                    $('#phonebookEditBtn').show();
                    $('#myPhonebookList .edit-checkbox').css('height','20px');
                    $('#viewPhonebook :checkbox').prop('checked', false);
                    $('#viewPhonebook #unselectAll').hide();
                    $('#viewPhonebook #selectAll').show();
               } else {
                    cancelEditMode();
               }
            });

            $('#viewPhonebook #selectAll').on('click', function(){
                $('#viewPhonebook :checkbox').prop('checked', true);
                $(this).hide();
                $('#viewPhonebook #unselectAll').show();
            });

            $('#viewPhonebook #unselectAll').on('click', function(){
                $('#viewPhonebook :checkbox').prop('checked', false);
                $(this).hide();
                $('#viewPhonebook #selectAll').show();
            });

            $('#viewPhonebook #myPhonebookList').on('click', function(){
                var checkboxTotalCount = $('#viewPhonebook :checkbox').length;
                var checkboxCheckedCount = $('#viewPhonebook :checkbox:checked').length;

                if (checkboxTotalCount === checkboxCheckedCount) {
                    $('#viewPhonebook #unselectAll').show();
                    $('#viewPhonebook #selectAll').hide();
                } else {
                    $('#viewPhonebook #unselectAll').hide();
                    $('#viewPhonebook #selectAll').show();
                }
            });

            $('#phoneDelete').on('click', function(){
                var checkboxCheckedCount = $('#viewPhonebook :checkbox:checked').length;

                if (checkboxCheckedCount === 0) {
                    $('#phonebookDelectAlert').popup('open');
                } else {
                    $('#phonebookDelectConfirm').popup('open');
                }

                $("#phonebookEditBtn").hide();
            });

            $("#phonebookDelectAlert #cancel").on('click', function(){
                $("#phonebookEditBtn").show();
                $("#phonebookDelectAlert").popup('close');
            });

            $("#phonebookDelectConfirm #cancel").on('click', function(){
                $("#phonebookEditBtn").show();
                $("#phonebookDelectConfirm").popup('close');
            });

            $("#phonebookDelectConfirm #confirm").on('click', function(){
                var doDeleteCount = 0;
                var checkboxCheckedCount = $('#viewPhonebook :checkbox:checked').length;
                loadingMask("show");

                $.map(phonebookData, function(value, key) {
                    var tempData = {};
                    
                    if ($("#phoneBookList" + key).prop("checked")) {
                        doDeleteCount++;
                        
                        if (checkboxCheckedCount === doDeleteCount) {
                            doRefresh = true;
                        }

                        deletePhoneBook("viewPhonebook", key);

                    } else {
                        tempData["company"] = phonebookData[key].company;
                        tempData["ename"] = phonebookData[key].ename;
                        tempData["cname"] = phonebookData[key].cname;
                        tempData["extnum"] = phonebookData[key].extnum;
                        tempData["employeeid"] = phonebookData[key].employeeid;

                        tempPhonebookData[key] = tempData;
                    }
                });

            });
        }
    });
    
});
