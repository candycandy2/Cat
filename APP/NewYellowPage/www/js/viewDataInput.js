//$(document).one("pagecreate", "#viewDataInput", function(){

// review
var companyInfoAry = [],
    phoneBookNone = false,
    expiredTime = 3; // expiredTime = 3 months

$("#viewDataInput").pagecontainer({
    create: function(event, ui) {
        var tempPhonebookData = {};
        var doRefresh = false,
            telString = "";

        /****************************************************** function ********************************************************/
        window.QueryCompanyData = function() {

            var self = this,
                storageTime;

            if (localStorage.getItem('QueryCompanyData') === null) {
                this.successCallback = function(data) {
                    loadingMask("hide");
                    var resultcode = data['ResultCode'];
                    if (resultcode === "1") {
                        insertCompanyValue(data['Content']);

                        // save data into localstorage
                        var nowTime = new Date();
                        companyInfoAry.push({ 'result': data['Content'], 'time': nowTime });
                        localStorage.setItem('QueryCompanyData', JSON.stringify(companyInfoAry));
                    }
                };
                this.failCallback = function(data) {};
                var __construct = function() {
                    CustomAPI("POST", true, "QueryCompanyData", self.successCallback, self.failCallback, queryData, "");
                }();
            } else {
                var storageData = JSON.parse(localStorage.getItem("QueryCompanyData"));
                insertCompanyValue(storageData[0].result);
                if (checkDataExpired(storageData[0].time, expiredTime, 'MM')) {
                    localStorage.removeItem("QueryCompanyData");
                }
                loadingMask("hide");
            }
        };

        // insert value into html
        function insertCompanyValue(dataContent) {
            $('#Company').html('');
            $('#CompanyChoose').html('');
            $('#Company').html('<option value="All Company">All Company</option>');
            for (var i = 2; i < dataContent.length; i++) { // ignore 0 and 1, 0: "All Company", 1: ""
                var companyname = dataContent[i].CompanyName;
                companyname = dataContent[i].CompanyName;
                $('#Company').append('<option value="' + companyname + '">' + companyname + '</option>');

            }
            /**/ //20170613
            window.CompanyTypeData = {
                id: "CompanyType",
                option: [{
                    value: "0",
                    text: dataContent[0].CompanyName
                }, {
                    value: "1",
                    text: dataContent[2].CompanyName
                }, {
                    value: "2",
                    text: dataContent[3].CompanyName
                }, {
                    value: "3",
                    text: dataContent[4].CompanyName
                }, {
                    value: "4",
                    text: dataContent[5].CompanyName
                }, {
                    value: "5",
                    text: dataContent[6].CompanyName
                }, {
                    value: "6",
                    text: dataContent[7].CompanyName
                }, ],
            };

            tplJS.DropdownList("viewDataInput", "CompanyChoose", "append", "typeA", CompanyTypeData);
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
                // $('#noQueryCondition').popup('open');
                $('#noQueryConditionRule').popup('open');
                // popupMsg("noQueryCondition", "請輸入查詢條件", "", "", false, "關閉", "");
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

        function phoneBookListHTML(index, company, eName, cName, extNo, mvpn) {
            // check has more than one ext num or not
            if (extNo.indexOf(';') > 0) {
                // check has mvpn num or not
                if (mvpn === ""){
                    telString = " class='chooseNumPop extNumMore'"+ ' ';
                }
                else{
                    if (mvpn.indexOf(';')>0){
                        telString = "class='chooseNumPop extNumMore mvpnNumMore mvpnNum'"+ ' ';
                        for (var i = 0; i < mvpn.match(/;/igm).length+1; i++){
                            telString += "data-mvpnnum" + (i+1) + "='" + mvpn.split(';')[i] + "' " ;
                        }
                    }
                    else{
                        telString = "class='chooseNumPop extNumMore mvpnNum'" + " data-mvpnnum='" + mvpn + "' ";
                    }
                }

                for (var i = 0; i < extNo.match(/;/igm).length + 1; i++) {
                    telString += "data-extnum" + (i + 1) + "='" + extNo.split(';')[i] + "' ";
                }
                telString += 'data-extnum="' + extNo + '"';
                telString += 'data-mvpnnum="' + mvpn + '"';
                extTmpNum = extNo.split(';')[0];

            } else {
                if (mvpn === ""){
                    telString = " href='tel:" + extNo + "'"; 
                }
                else{
                    if (mvpn.indexOf(';')>0){
                        telString = "class='chooseNumPop mvpnNumMore mvpnNum'"+ ' ';
                        for (var i = 0; i < mvpn.match(/;/igm).length+1; i++){
                             telString += "data-mvpnnum" + (i+1) + "='" + mvpn.split(';')[i] + "' " + "' data-extnum='" + extNo + "' ";
                        }
                        telString += 'data-mvpnnum="' + mvpn + '" ';
                    }
                    else{
                        telString = "class='chooseNumPop mvpnNum'" + " data-mvpnnum='" + mvpn + "' data-extnum='" + extNo + "' ";
                    }
                }
                
                extTmpNum = extNo;
            }
            return '<li>' + '<div class="checkbox-area">' + '<input type="checkbox" class="custom" data-mini="true" id="phoneBookList' + index + '">' + '</div>' + '<div class="name">' + '<p><a href="#" value="' + index.toString() + '" name="detailIndex">' + eName + '</a></p>' + '<p><a href="#" value="' + index.toString() + '" name="detailIndex">' + cName + '</a></p>' + '</div>' + '<div class="img-phone divvertical-center">' + '<div class="tel-num">' + '<img src = "img/phone.png">' + '<a rel="external"' + telString + '>' + extTmpNum + '</a>' + '</div>' + '</div>' + '<div class="img-info divvertical-center">' + '<div class="tel-num">' + '<p><a href="#" value="' + index.toString() + '" name="detailIndex"><img src="img/info.png"></a></p>' + '</div>' + '</div>' + '</li>';
        }

        function FillMyPhoneBook(responsecontent) {

            phonebookData = {};
            var htmlContent = "";

            if (responsecontent.length !== 0) {
                $('#phonebookEdit').show();
                phoneBookNone = false;
                $('#viewDataInput .error-msg').addClass('hide');
            }

            for (var i = 0; i < responsecontent.length; i++) {
                var tempData = {};

                tempData["company"] = responsecontent[i].Company;
                tempData["ename"] = responsecontent[i].Name_EN;
                tempData["cname"] = responsecontent[i].Name_CH;
                tempData["extnum"] = responsecontent[i].Ext_No;
                tempData["employeeid"] = responsecontent[i].EmployeeID;
                tempData["mvpn"] = responsecontent[i].Mvpn;

                phonebookData[i] = tempData;

                var content = htmlContent + phoneBookListHTML(i, tempData["company"], tempData["ename"], tempData["cname"], tempData["extnum"], tempData["mvpn"]);
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
        }

        window.QueryMyPhoneBook = function() {
            var self = this;
            var queryData = '<LayoutHeader><User_EmpID>' + loginData["emp_no"] + '</User_EmpID></LayoutHeader>';

            this.successCallback = function(data) {
                var resultcode = data['ResultCode'];

                if (resultcode === "1") {

                    var responsecontent = data['Content'];

                    //1. save to local data
                    window.localStorage.removeItem('QueryMyPhoneBookData');
                    var jsonData = {};
                    jsonData = {
                        lastUpdateTime: new Date(),
                        content: responsecontent
                    };
                    window.localStorage.setItem('QueryMyPhoneBookData', JSON.stringify(jsonData));

                    //2. show data in view
                    FillMyPhoneBook(responsecontent);
                } else {
                    //ResultCode = 001901, [no data]
                    loadingMask("hide");
                    $('#phonebookEdit').hide();
                    phoneBookNone = true;
                    $('#viewDataInput .error-msg').removeClass('hide');
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {

                var lifecycleData = JSON.parse(window.localStorage.getItem('QueryMyPhoneBookData'));
                if (lifecycleData === null || checkDataExpired(lifecycleData['lastUpdateTime'], 7, 'dd')) {
                    CustomAPI("POST", true, "QueryMyPhoneBook", self.successCallback, self.failCallback, queryData, "");
                } else {
                    var responsecontent = JSON.parse(window.localStorage.getItem('QueryMyPhoneBookData'))['content'];
                    FillMyPhoneBook(responsecontent);
                }

            }();

        }

        window.deletePhoneBook = function(actionPage, index) {
            var self = this;
            var company;
            for (var i = 0; i < Object.keys(phonebookData).length; i++) {
                if (index === phonebookData[i].employeeid) {
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
                window.localStorage.removeItem('QueryMyPhoneBookData'); //set dirty
                QueryMyPhoneBook(); //need update list for compare 
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
                var content = htmlContent + phoneBookListHTML(key, phonebookData[key].company, phonebookData[key].ename, phonebookData[key].cname, phonebookData[key].extnum, phonebookData[key].mvpn);
                htmlContent = content;
            });

            $("#myPhonebookList").html(htmlContent).enhanceWithin();
            $('#myPhonebookList').listview('refresh');
            loadingMask("hide");
            doRefresh = false;
            if (Object.keys(phonebookData).length === 0) {
                $('#phonebookEdit').hide();
                phoneBookNone = true;
            } else {
                phoneBookNone = false;
            }
        }

        window.cancelEditMode = function() {
            $('.edit-checkbox').hide();
            $('#myPhonebookList .ui-checkbox').hide();
            $('#phonebookEditBtn').hide();
            $('#myPhonebookList').removeClass('editClick');
        };

        /******************************************************* page event *******************************************************/
        $("#viewDataInput").one("pagebeforeshow", function(event, ui) {
            var eventAddConfirmPopupData2 = {
                id: "phonebookDeleteConfirm",
                content: $("template#tplaskDelPhonebook").html()
            };
            tplJS.Popup("viewDataInput", "DataInputMain", "append", eventAddConfirmPopupData2);

            var eventQueConfirmPopupData = {
                id: "noQueryCondition",
                content: $("template#tplaskQuePhonebook").html()
            };
            tplJS.Popup("viewDataInput", "DataInputMain", "append", eventQueConfirmPopupData);
        });

        var pullControl_Two = null;
        var pullControl_One = null;

        function initpullrefresh_pagetwo() {

            destorypullrefresh_pageone();
            if (pullControl_Two == null) {
                pullControl_Two = PullToRefresh.init({
                    mainElement: '#pageTwo',
                    onRefresh: function() {
                        //do something for refresh
                        window.localStorage.removeItem('QueryMyPhoneBookData'); //set dirty
                        QueryMyPhoneBook(); //force to refresh
                    }
                });
            }
        }

        function destorypullrefresh_pageone() {
            if (pullControl_One != null) {
                pullControl_One.destroy();
                pullControl_One = null;
            }
        }

        function initpullrefresh_pageone() {

            destorypullrefresh_pagetwo();
            if (pullControl_One == null) {
                pullControl_One = PullToRefresh.init({
                    mainElement: '#pageOne',
                    onRefresh: function() {
                        //do something for refresh
                        //review by alan
                        window.localStorage.removeItem('QueryCompanyData'); //set dirty
                        QueryCompanyData(); //force to refresh
                    }
                });
            }
        }

        function destorypullrefresh_pagetwo() {
            if (pullControl_Two != null) {
                pullControl_Two.destroy();
                pullControl_Two = null;
            }
        }

        $("#viewDataInput").on("pagebeforeshow", function(event, ui) {
            if (doClearInputData) {
                clearInputData();
                doClearInputData = true;
            }
            $('#pageOne').show();
            $('#pageTwo').hide();
            var tabValue = $("#reserveTab :radio:checked").val();
            if (tabValue == 'tab2') {
                $('#myPhonebookList').removeClass('editClick');
                $('#phonebookEditBtn').hide();
                if (phoneBookNone) {
                    $('#phonebookEdit').hide();
                    $('#viewDataInput .error-msg').removeClass('hide');
                } else {
                    $('#phonebookEdit').show();
                    $('#viewDataInput .error-msg').addClass('hide');
                }
                $('#pageOne').hide();
                $('#pageTwo').show();
                $('#phoneDelete').addClass('noneSelect');

                QueryMyPhoneBook(); //normal update by lifecycle

                initpullrefresh_pagetwo();
            } else {
                initpullrefresh_pageone();
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

        $(document).on("click", "#noQueryCondition .confirm", function() {
            $("#noQueryCondition").popup("close");
        });

        $(document).on("click", "#noQueryConditionRule .confirm", function() {
            $("#noQueryConditionRule").popup("close");

        });

        $('#reserveTab').change(function() {
            var tabValue = $("#reserveTab :radio:checked").val();
            if (tabValue == 'tab1') {
                $('#pageOne').show();
                $('#pageTwo').hide();
                $('#phonebookEditBtn').hide();
                $('#phonebookEdit').show();
                $('#myPhonebookList').removeClass('editClick');
                $('#phoneDelete').addClass('noneSelect');
                initpullrefresh_pageone()
            } else if (tabValue == 'tab2') {
                $('#pageTwo').show();
                $('#pageOne').hide();
                if (phoneBookNone) {
                    $('#phonebookEdit').hide();
                    $('#viewDataInput .error-msg').removeClass('hide');
                } else {
                    $('#phonebookEdit').show();
                    $('#viewDataInput .error-msg').addClass('hide');
                }
                QueryMyPhoneBook(); //normal update by lifecycle
                initpullrefresh_pagetwo()
            }
        });


        $('body').on('click', '#phonebookEdit', function() {
            if ($('#phonebookEditBtn').hasClass('hide')) {
                $('.edit-checkbox').show();
                $('#myPhonebookList .ui-checkbox').show();
                $('#phonebookEditBtn').show();
                $('#myPhonebookList .edit-checkbox').css('height', '20px');
                $('#pageTwo :checkbox').prop('checked', false);
                $('#myPhonebookList').addClass('editClick');
                $('.img-info').hide();
                $('#phonebookEdit').hide();
                destorypullrefresh_pagetwo();
                destorypullrefresh_pageone();
            } else {
                cancelEditMode();
                initpullrefresh_pagetwo();
            }
        });

        $('#pageTwo #phoneCancelDelete').on('click', function() {
            $('#phonebookEditBtn').hide();
            $('#phonebookEdit').show();
            $('#myPhonebookList').removeClass('editClick');
            $('#phoneDelete').addClass('noneSelect');
            $('.img-info').show();
            initpullrefresh_pagetwo();
        });

        $(document).on("click", "#phoneDelete", function() {
            var checkboxCheckedCount = $('#pageTwo :checkbox:checked').length;
            if (checkboxCheckedCount === 0) {} else {
                $('#phonebookDeleteConfirmRule').popup('open');
            }
        });

        $('body').on('click', '#myPhonebookList .ui-checkbox input', function() {
            if ($('#myPhonebookList .ui-checkbox input:checked').length < 1) {
                $('#phoneDelete').addClass('noneSelect');
            } else {
                $('#phoneDelete').removeClass('noneSelect');
            }
        });

        $(document).on("click", "#phonebookDeleteConfirmRule .cancel", function() {
            $("#phonebookDeleteConfirmRule").popup("close");
        });
        $(document).on("click", '#phonebookDeleteConfirmRule .btn-confirm', function() {
            console.log("561");
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
                    tempData["mvpn"] = phonebookData[key].mvpn;

                    tempPhonebookData[key] = tempData;
                }
            });

            $("#phonebookDeleteConfirmRule").popup("close");
            $('#phonebookEditBtn').hide();
            $('#phonebookEdit').show();
            $('#myPhonebookList').removeClass('editClick');
            $('#phoneDelete').addClass('noneSelect');
            initpullrefresh_pagetwo();
        });

        $('body').on('click', 'div[for=phonebookSelectAlert] #confirm', function() {
            $("#viewPopupMsg").popup("close");
        });

        /***********************************************  Validation of input data  ***********************************************/
        $("#EName").keyup(function(event) {
            var pattern = /([^a-zA-Z\-\.]*)[a-zA-Z\-\.]*([^a-zA-Z\-\.]*)/;
            var maxlength = $("#EName").data('maxlength');
            var residue = event.currentTarget.value.match(pattern);
            if (residue[1] !== "" || residue[2] !== "") {
                $("#EName").val($("#EName").val().replace(residue[1], ""));
                $("#EName").val($("#EName").val().replace(residue[2], ""));
            }
            if ($("#EName").val().length > maxlength - 1)
                $("#EName").val($("#EName").val().substring(0, maxlength));
        });

        $("#Department").keyup(function(event) {
            var pattern = /([^a-zA-Z0-9\-]*)[a-zA-Z0-9\-]*([^a-zA-Z0-9\-]*)/;
            var maxlength = $("#Department").data('maxlength');
            var residue = event.currentTarget.value.match(pattern);
            if (residue[1] !== "" || residue[2] !== "") {
                $("#Department").val($("#Department").val().replace(residue[1], ""));
                $("#Department").val($("#Department").val().replace(residue[2], ""));
            }
            if ($("#Department").val().length > maxlength - 1)
                $("#Department").val($("#Department").val().substring(0, maxlength));
        });

        $("#ExtNum").keyup(function(event) {
            var pattern = /([^0-9\-]*)[0-9\-]*([^0-9\-]*)/;
            var maxlength = $("#ExtNum").data('maxlength');
            var residue = event.currentTarget.value.match(pattern);
            if (residue[1] !== "" || residue[2] !== "") {
                $("#ExtNum").val($("#ExtNum").val().replace(residue[1], ""));
                $("#ExtNum").val($("#ExtNum").val().replace(residue[2], ""));
            }
            if ($("#ExtNum").val().length > maxlength - 1)
                $("#ExtNum").val($("#ExtNum").val().substring(0, maxlength));
        });
    }
});
//});
