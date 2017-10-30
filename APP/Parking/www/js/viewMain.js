
var defaultSiteClick = '';
var clickSiteId = '';
var selectedSite = '';
var siteCategoryID = '';
var clickDateId = '';
var clickSpaceId = '';
var clickTraceID = '';
var quickReserveClickDateID = '';
var quickRserveCallBackData = {};
var timeClick = [];
var timeNameClick = [];
var selectMyReserveTime = '';
var reserveDetailLocalData = [];
var bReserveCancelConfirm = false;
var clickAggTarceID = '';
var clickReserveDate = '';
var clickReserveRoom = '';
var arrTempTimeNameClick = [];
var parkingSettingdata = {};
//var parkingSpaceDataExample = ['車位 094', '車位 095', '車位 096', '車位 251'];

$("#viewMain").pagecontainer({
    create: function(event, ui) {
        //page init
        /********************************** function *************************************/
        window.APIRequest = function() {

            var self = this;

            this.successCallback = function(data) {
                loadingMask("hide");

                var resultcode = data['ResultCode'];
                //do something
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                //CustomAPI("POST", true, "APIRequest", self.successCallback, self.failCallback, queryData, "");
            }();

        };
        
        function getSpaceData(siteIndex) {
            htmlContent = '';
            siteIndex = siteIndex == '' ? '0' : siteIndex;
            $('#reserveSpace').find('a').remove();

            for (var i = 0, item; item = JSON.parse(localStorage.getItem('parkingSpaceLocalData'))['content'][i]; i++) {
                if (item.ParkingSpaceSite == siteIndex) {
                    if (item.ParkingSpaceSite == 92) {
                        var strParkingSpaceName = item.ParkingSpaceName.substr(2,3);
                    } else if (item.ParkingSpaceSite == 111){
                        var strParkingSpaceName = item.ParkingSpaceName;
                    }
                    htmlContent += '<a id=' + item.ParkingSpaceID + ' value=' + item.ParkingSpaceID + ' href="#" class="ui-link" IsReserveMulti=' + item.IsReserveMulti + '>' + strParkingSpaceName + '</a>';
                }
            }

            /*for (var i = 0; i < parkingSpaceDataExample.length; i++){             
                htmlContent += '<a id=' + i + ' value=' + i + ' href="#" class="ui-link">' + parkingSpaceDataExample[i] + '</a>';
            }*/

            $('#reserveSpace').append(htmlContent);
            clickSpaceId = $('#reserveSpace a:first-child').attr('id');
            $('#reserveSpace a:first-child').addClass('hover');
            $('#reserveSpace a:first-child').parent().data("lastClicked", $('#reserveSpace a:first-child').attr('id'));
        }

        function setDateList() {
            
            $('#scrollDate a[id^=one]').remove();

            var addOneDate = new Date();
            var htmlContentPageOne = '';
            var arrClass = ['a', 'b', 'c', 'd', 'e'];

            var objDate = new Object()
            objDate.date = '';
            objDate.daysOfWeek = '';

            var j = 0;
            var originItemForPageOne = ['reserveDefault', 'ReserveDay', 'ReserveDict', 'disable'];
            var isSystemRole = JSON.parse(localStorage.getItem('listAllManager')).content;

            if (isSystemRole.length != 0) {
                reserveDays = 120;
            } else {
                reserveDays = 14;
            }

            for (var i = 0; i < reserveDays; i++) {
                if (i != 0) {
                    addOneDate.addDays(1);
                }
                if (addOneDate.getDay() > 0 && addOneDate.getDay() < 6) {

                    var classId = arrClass[j % 5];
                    objDate.id = addOneDate.yyyymmdd('');
                    objDate.date = addOneDate.mmdd('/');
                    objDate.daysOfWeek = dictDayOfWeek[addOneDate.getDay()];

                    var replaceItemForPageOne = ['one' + objDate.id, objDate.date, objDate.daysOfWeek, ''];

                    htmlContentPageOne
                        += replaceStr($('#reserveDefault').get(0).outerHTML, originItemForPageOne, replaceItemForPageOne);
                }
            }
    
            $('#reserveDefault').before(htmlContentPageOne);
            clickDateId = $('#scrollDate a:first-child').attr('id').replaceAll('one', '');
            $('#scrollDate a:first-child').addClass('hover');
            $('#scrollDate a:first-child').parent().data("lastClicked", $('#scrollDate a:first-child').attr('id'));
            
        }
       
        function getParkingStatus() {
            htmlContent = '';
            $('#defaultTimeSelectId').nextAll().remove();
            var arrClass = ['a', 'b', 'c', 'd'];
            var originItem = ['defaultTimeSelectId', 'reserveTimeSelect', '[eName]', 'ui-block-a', 'disable', 'reserve', 'circle-icon', '[msg]', '[ext]', '[email]', '[traceID]', '[pdName]', '[pdCategory]', '[pdRemark]', '[pdCar]'];
            var j = 0;

            var filterTimeBlock = grepData(arrTimeBlockBySite, 'siteCategoryID', siteCategoryID)[0].data;

            for (var item in filterTimeBlock) {
                var classId = arrClass[j % 4];
                var reserveClass = 'ui-color-noreserve';
                var reserveIconClass = 'circleIcon iconSelect';
                var msg = '',
                    eName = '',
                    ext = '',
                    email = '',
                    traceID = '';
                    pdName = '';
                    pdCategory = '';
                    pdRemark = '';
                    pdCar = '';
                var bTime = filterTimeBlock[item].time;
                var timeID = filterTimeBlock[item].timeID;
                var category = filterTimeBlock[item].category;
                var roomName = $('#reserveSpace .hover').text();

                for (var i = 0, arr; arr = arrReserve[i]; i++) {
                    if (arr.detailInfo['bTime'] == bTime) {
                        if (arr.detailInfo['eName'] == loginData['loginid']) {
                            reserveClass = 'ui-color-myreserve';
                        } else {
                            reserveClass = 'ui-color-reserve';
                        }
                        reserveIconClass = '';
                        eName = arr.detailInfo['eName'];
                        ext = arr.detailInfo['ext'];
                        email = arr.detailInfo['email'];
                        traceID = arr.detailInfo['traceID'];
                        pdName = arr.detailInfo['pdName'];
                        pdCategory = arr.detailInfo['pdCategory'];
                        pdRemark = arr.detailInfo['pdRemark'];
                        pdCar = arr.detailInfo['pdCar'];
                        if (category === 10) {
                            msg = arr.date + ',' + roomName + ',' + arr.detailInfo['bTime'] + '-' + addThirtyMins(arr.detailInfo['bTime']) + ',' + eName
                        }else if (category === 28) {
                            msg = arr.date + ',' + roomName + ',' + arr.detailInfo['bTime'] + '-' + addThirtyMins(addThirtyMins(arr.detailInfo['bTime'])) + ',' + eName
                        }
                    }
                }
                var replaceItem = ['time-' + timeID, bTime.trim(), eName, 'ui-block-' + classId, '', reserveClass, reserveIconClass, msg, ext, email, traceID, pdName, pdCategory, pdRemark, pdCar];

                htmlContent
                    += replaceStr($('#defaultTimeSelectId').get(0).outerHTML, originItem, replaceItem);

                msg = '';
                j++;
            } 

            $('#reserveDateSelect > div').append(htmlContent);
        }

        function getReserveData(spaceId, date, data, type) {
            loadingMask("show");
            arrReserve = [];
            for (var i = 0, item; item = data[i]; i++) {
                var newReserve = new reserveObj(spaceId, date);
                newReserve.addDetail('traceID', item.ReserveTraceID);
                newReserve.addDetail('eName', item.EMail.substring(0, item.EMail.indexOf('@')));
                newReserve.addDetail('bTime', item.BTime);
                newReserve.addDetail('ext', item.Ext_No.replace('-', ''));
                newReserve.addDetail('email', item.EMail);
                newReserve.addDetail('pdName', item.PDetailName);
                newReserve.addDetail('pdCategory', item.PDetailCategory);
                newReserve.addDetail('pdRemark', item.PDetailRemark);
                newReserve.addDetail('pdCar', item.PDetailCar);
                arrReserve.push(newReserve);
            }

            if (type === 'dataNotExist') {
                //save to local data
                var reserveDetailLocalData = JSON.parse(localStorage.getItem('reserveDetailLocalData'));
                var newReserveLocalDataObj = new reserveLocalDataObj(spaceId, date, data);
                reserveDetailLocalData.push(newReserveLocalDataObj);
                localStorage.setItem('reserveDetailLocalData', JSON.stringify(reserveDetailLocalData));
            }

            getParkingStatus();
            loadingMask("hide");
        }

        function reserveBtnDefaultStatus() {
            $('#reserveBtn').removeClass('btn-benq');
            $('#reserveBtn').addClass('btn-disable');
            if ($('div[id^=time]').hasClass('hover')) {
                $('div[id^=time]').removeClass('hover');
                $('div[id^=time]').find('.iconSelected').addClass('iconSelect');
                $('div[id^=time]').find('.iconSelected').removeClass('iconSelected');
                $('div[id^=time]').find('.timeRemind').removeClass('timeShow');
            }
            timeClick = [];
            timeNameClick = [];
            bReserveCancelConfirm = false;
        }

        function getAPIQueryReserveDetail(spaceId, date, checkDataExist) {
            //local data exist
            var dataExist = false;
            if (checkDataExist) {
                reserveDetailLocalData = JSON.parse(localStorage.getItem('reserveDetailLocalData'));
                for (var item in reserveDetailLocalData) {
                    var obj = reserveDetailLocalData[item];
                    if ((obj.spaceId === spaceId && obj.date === date) && !checkDataExpired(obj.lastUpdateTime, 1, 'mm')) {
                        getReserveData(spaceId, date, obj.data, 'dataExist');
                        dataExist = true;
                    }
                }
            }

            if (!dataExist) {
                loadingMask('show');
                var self = this;
                var queryData = '<LayoutHeader><ParkingSpaceID>' + spaceId + '</ParkingSpaceID><ReserveDate>' + date + '</ReserveDate></LayoutHeader>';

                this.successCallback = function(data) {
                    if (data['ResultCode'] === "1") {
                        getReserveData(spaceId, date, data['Content'], 'dataNotExist');
                    }
                    loadingMask('hide');
                };

                var __construct = function() {
                    CustomAPI("POST", true, "QueryReserveDetail", self.successCallback, self.failCallback, queryData, "");
                }();
            }
        }

        function getAPIReserveParkingSpace(page, siteId, spaceId, pdName, pdCategory, pdRemark, pdCar, date, timeID) {
            loadingMask('show');
            var self = this;
            var queryData = '<LayoutHeader><ParkingSpaceSite>' + siteId + '</ParkingSpaceSite><ParkingSpaceID>' + spaceId + '</ParkingSpaceID><PDetailName>' + pdName + '</PDetailName><PDetailCategory>' + pdCategory + '</PDetailCategory><PDetailRemark>' + pdRemark + '</PDetailRemark><PDetailCar>' + pdCar + '</PDetailCar><ReserveDate>' + date + '</ReserveDate><ReserveUser>' + loginData['emp_no'] + '</ReserveUser><ReserveTimeID>' + timeID + '</ReserveTimeID></LayoutHeader>';

            this.successCallback = function(data) {

                if (data['ResultCode'] === "042902") {
                    //Reservation Successful
                    var arrCutString = cutStringToArray(date, ['4', '2', '2']);
                    var strDate = arrCutString[1] + '/' + arrCutString[2] + '/' + arrCutString[3];
                    var spaceName = '';
                    var timeName = '';

                    if (page == 'pageOne') {
                        spaceName = $('#reserveSpace').find('.hover').text();
                        //reserve continuous time block, display one time block  
                        var arrTempTime = [];
                        for (var item in timeClick) {
                            var sTime = $('div[id=' + timeClick[item] + '] > div > div:first').text();
                            if (siteId === '92') {
                                var eTime = addThirtyMins(sTime);
                            }else if (siteId === '111'){
                                var eTime = addThirtyMins(addThirtyMins(sTime));
                            }
                            arrTempTime.push(sTime);
                            arrTempTime.push(eTime);
                        }

                        var arrUniqueTime = [];
                        for (var item in arrTempTime) {
                            var index = arrUniqueTime.indexOf(arrTempTime[item]);
                            if (index === -1) {
                                arrUniqueTime.push(arrTempTime[item]);
                            } else {
                                arrUniqueTime.splice(index, 1);
                            }
                        }
                        
                        arrUniqueTime.sort();

                        for (var i = 0; i < arrUniqueTime.length; i = i + 2) {
                            timeName += arrUniqueTime[i] + '-' + arrUniqueTime[i + 1] + '<br />';
                        }

                    } 

                    var msgContent = '<div>' + strDate + '&nbsp;&nbsp;' + timeName + '</div>';
                    popupMsg('reserveSuccessMsg', spaceName + ' 預約成功', msgContent, '', false, '確定', '056_icon_booked_success.png');

                    var isReserveMulti = '';
                    var selectedSite = '';
                    var arrTemp = [];

                    if (page == 'pageOne') {
                        isReserveMulti = $('#' + spaceId).attr('IsReserveMulti');
                        selectedSite = $('#reserveSite').find(":selected").val();
                        arrTemp = timeNameClick;
                        reserveBtnDefaultStatus();
                    } 

                    var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(spaceId, date, false);

                    if (isReserveMulti != 'N') {
                        var jsonData = [];
                        $.each(arrTemp, function(index, value) {
                            jsonData = {
                                space: spaceName,
                                site: selectedSite,
                                date: date,
                                time: value
                            };
                            myReserveLocalData.push(jsonData);
                        });
                    }

                } else if (data['ResultCode'] === "042903") {
                    //Reservation Failed, Repeated a Reservation
                    popupMsg('reserveFailMsg', '預約失敗', '已被預約', '', false, '確定', '068_icon_warm.png');
                }

                loadingMask('hide');
            };

            var __construct = function() {
                CustomAPI("POST", true, "ReserveParkingSpace", self.successCallback, self.failCallback, queryData, "");
            }();
        }

        function getAPIQueryMyReserve(date) {
            loadingMask('show');
            var self = this;
            var today = new Date();
            var queryData = '<LayoutHeader><ReserveUser>' + loginData['emp_no'] + '</ReserveUser><NowDate>' + today.yyyymmdd('') + '</NowDate></LayoutHeader>';

            this.successCallback = function(data) {
                $('div[id^=def-]').remove();

                if (data['ResultCode'] === "1") {  
                    //Successful
                    var htmlContent_today = '';
                    var htmlContent_other = '';
                    var originItem = ['default', '[begin]', '[end]', '[value]', '[space]', '[date]', '[dateformate]', '[site]', '[PDetailName]', 'disable'];

                        //for (var i = 0, timeIDItem; timeIDItem =timeID.split(',')[i]; i++) {
                        for (var i = 0, item; item = data['Content'][i]; i++) {
                            // convert yyyymmdd(string) to yyyy/mm/dd
                            var arrCutString = cutStringToArray(item.ReserveDate, ['4', '2', '2']);
                            var strDate = arrCutString[1] + '/' + arrCutString[2] + '/' + arrCutString[3];

                            // convert date format to mm/dd(day of week)
                            var d = new Date(strDate);
                            var dateFormat = d.mmdd('/');
                            //var sTime = $('div[id=time' + timeIDItem + '] > div > div:first').text();
                            if (item.ParkingSpaceSite === 92) {
                                var siteName = 'QTT';
                                var strParkingSpaceName = item.ParkingSpaceName.substr(2,3);
                                var strReserveName = item.ReserveName;
                            }else if (item.ParkingSpaceSite === 111){
                                var siteName = 'QTY';
                                var strParkingSpaceName = item.ParkingSpaceName;
                                var strReserveName = item.PDetailName;
                            }

                            var replaceItem = ['def-' + item.ReserveTraceAggID, item.ReserveBeginTime, item.ReserveEndTime, item.ReserveTraceAggID, strParkingSpaceName, item.ReserveDate, dateFormat, siteName, strReserveName, ''];

                            if (item.ReserveDate == new Date().yyyymmdd('')) {
                                $('#pageThree :first-child h2').removeClass('disable');
                                htmlContent_today
                                    += replaceStr($('#defaultToday').get(0).outerHTML, originItem, replaceItem);
                            } else {
                                htmlContent_other
                                    += replaceStr($('#defaultOtherDay').get(0).outerHTML, originItem, replaceItem);
                            }
                        }

                    if (htmlContent_today == '') {
                        $('#todayLine').addClass('disable');
                    } else {
                        $('#todayLine').removeClass('disable');
                        $('#todayLine').after(htmlContent_today);
                    }
                    if(htmlContent_other == ''){
                        $('#otherDayLine').addClass('disable');
                    }
                    else{
                        $('#otherDayLine').removeClass('disable');
                        $('#otherDayLine').after(htmlContent_other);
                    }
                } else if (data['ResultCode'] === "042901") {
                    //Not Found Reserve Data
                    popupMsg('noDataMsg', '', '沒有您的預約資料', '', false, '確定', '');
                    $('#todayLine').addClass('disable');
                    $('#otherDayLine').addClass('disable');
                }
                loadingMask('hide');
            };

            var __construct = function() {
                CustomAPI("POST", true, "QueryMyReserve", self.successCallback, self.failCallback, queryData, "");
            }(); 
        }

        function getAPIReserveCancel(date, traceID) {
            loadingMask('show');
            var self = this;
            var queryData = '<LayoutHeader><ReserveDate>' + date + '</ReserveDate><ReserveUser>' + loginData['emp_no'] + '</ReserveUser><ReserveTraceID>' + traceID + '</ReserveTraceID><ReserveTraceAggID></ReserveTraceAggID></LayoutHeader>';

            this.successCallback = function(data) {
                if (data['ResultCode'] === "042904") {
                    //Cancel a Reservation Successful
                    popupMsg('cancelSuccessMsg', '', '取消預約成功', '', false, '確定', '');

                    var selectedSite = $('#reserveSite').find(":selected").val();
                    for (var i = 0; i < myReserveLocalData.length; i++) {
                        if (myReserveLocalData.length != 0 && myReserveLocalData[i].time == selectMyReserveTime && myReserveLocalData[i].date == date && myReserveLocalData[i].site == selectedSite) {
                            myReserveLocalData.splice(i, 1);
                            i = i - 1;
                            i = i < 0 ? 0 : i;
                        }
                    };

                    var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickSpaceId, clickDateId, false);
                    reserveBtnDefaultStatus();

                } else if (data['ResultCode'] === "042905") {
                    //Cancel a Reservation Failed
                    popupMsg('cancelFailMsg', '', '取消預約失敗', '', false, '確定', '');
                }

                loadingMask('hide');
            };

            var __construct = function() {
                CustomAPI("POST", true, "ReserveCancel", self.successCallback, self.failCallback, queryData, "");
            }();
        }

        function getAPIMyReserveCancel(date, traceID) {
            loadingMask('show');
            var self = this;
            var queryData = '<LayoutHeader><ReserveDate>' + date + '</ReserveDate><ReserveUser>' + loginData['emp_no'] + '</ReserveUser><ReserveTraceID></ReserveTraceID><ReserveTraceAggID>' + traceID + '</ReserveTraceAggID></LayoutHeader>';

            this.successCallback = function(data) {
                if (data['ResultCode'] === "042904") {
                    //Cancel a Reservation Successful
                    $('div[id^=def-' + traceID + ']').hide();

                    //delete local data for refresh
                    var reserveDetailLocalData = JSON.parse(localStorage.getItem('reserveDetailLocalData'));
                    reserveDetailLocalData = reserveDetailLocalData.filter(function(item) {
                        return item.date != date;
                    });
                    localStorage.setItem('reserveDetailLocalData', JSON.stringify(reserveDetailLocalData)); 

                    popupMsg('successMsg', '', '取消預約成功', '', false, '確定', '');

                } else if (data['ResultCode'] === "042905") {
                    //Cancel a Reservation Failed
                    popupMsg('failMsg', '', '取消預約失敗', '', false, '確定', '');
                }
                loadingMask('hide');
            };

            var __construct = function() {
                CustomAPI("POST", true, "ReserveCancel", self.successCallback, self.failCallback, queryData, "");
            }(); 
        }

        function checkLocalDataExpired() {
            var parkingSpaceLocalData = JSON.parse(localStorage.getItem('parkingSpaceLocalData'));
            if (parkingSpaceLocalData === null || checkDataExpired(parkingSpaceLocalData['lastUpdateTime'], 7, 'dd') ) {
                var doAPIListAllParkingSpace = new getAPIListAllParkingSpace;
            }
            var doAPIListAllTime = new getAPIListAllTime();
            var doAPIListAllManager = new getAPIListAllManager();

            if(localStorage.getItem("defaultSiteClick") !== null) {
                $("#reserveSite").val(localStorage.getItem("defaultSiteClick"));
                defaultSiteClick = localStorage.getItem("defaultSiteClick");
            }else if (defaultSiteClick === null) {
                defaultSiteClick = '92';
            }

        }

        function setAlertLimitSite(site) {
            $("#alertLimitSiteMsg").addClass('disable');
            $("#alertLimitSiteMsg").html('');
            if (site == '92') { //BQT/QTT
                $("#alertLimitSiteMsg").removeClass('disable');
                $("#alertLimitSiteMsg").html('*僅開放關係企業同仁停車');
                $("#reserveDateSelect").find('.QTY').addClass('disable');
                $("#reserveDateSelect").find('.BQT').removeClass('disable');
            }else if (site == '111') {
                $("#reserveDateSelect").find('.BQT').addClass('disable');
                $("#reserveDateSelect").find('.QTY').removeClass('disable');
            }
        }

        function getInitialData() {
            $("#reserveSite option[value=" + defaultSiteClick + "]").attr("selected", "selected");
            selectedSite = $('#reserveSite').find(":selected").val();
            siteCategoryID = dictSiteCategory[defaultSiteClick];
            getSpaceData(selectedSite);  
        }

        function setInitialData() {
            setAlertLimitSite(defaultSiteClick);
            setDateList();
            setReserveDetailLocalDate();
        }

        function querySettingCarList() {
            $('div[id^=commonCarList-]').remove();
            parkingSettingData = JSON.parse(localStorage.getItem('parkingSettingData'));
            var originItem = ['commonCarList', '[index]', '[title]', '[type]', '[car]'];
            htmlContent = '';
            
            if (parkingSettingData != null) {
                $('#tplCarListNoData').addClass('disable');
                sortDataByKey(parkingSettingData.content, 'id', 'asc');
                for (var i = 0, item; item = parkingSettingData['content'][i]; i++) {
                    var strTitle = item.title;
                    var strType= (item.type == 'setGuest') ? '貴賓' : '關係企業';
                    var strCar = item.car;
                    var replaceItem = ['commonCarList-' + item.id, item.id, strTitle, strType, strCar];
                    htmlContent += replaceStr($('#commonCarList').get(0).outerHTML, originItem, replaceItem);
                }
            } else {
                $('#tplCarListNoData').removeClass('disable');
            }
            $('#commonCarList').after(htmlContent);
            $('div[id^=commonCarList-]').removeClass('disable');

        }

        /********************************** page event *************************************/
        $("#viewMain").one("pagebeforeshow", function(event, ui) {
            //get last update time check date expired
            checkLocalDataExpired();
            getInitialData();
            setInitialData();
            querySettingCarList();
            $('#pageOne').show();
            $('#pageTwo').hide();
            $('#pageThree').hide();
            
        });

        $('#viewMain').on('pagebeforeshow', function(event, ui) {
            reserveBtnDefaultStatus();
            querySettingCarList();
            if (isReloadPage == true) {
                var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickSpaceId, clickDateId, false);
                isReloadPage = false;
            } else {
                var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickSpaceId, clickDateId, true);
            }
        });

        /********************************** dom event *************************************/

        $('#reserveTab').change(function() {
            if ($("#reserveTab :radio:checked").val() == 'tab1') {
                $('#pageOne').show();
                $('#pageTwo').hide();
                $('#pageThree').hide();
                reserveBtnDefaultStatus();
                var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickSpaceId, clickDateId, true);
            } else if ($("#reserveTab :radio:checked").val() == 'tab2'){
                $('#pageOne').hide();
                $('#pageTwo').show();
                $('#pageThree').hide();
            }else {
                $('#pageOne').hide();
                $('#pageTwo').hide();
                $('#pageThree').show();
                var doAPIQueryMyReserve = new getAPIQueryMyReserve(clickDateId);
            }
        });

        $('#reserveSite').change(function() {
            localStorage.setItem('defaultSiteClick', $(this).val());
            siteCategoryID = dictSiteCategory[$(this).val()];
            selectedSite = $('#reserveSite').find(":selected").val();
            setAlertLimitSite(selectedSite);  
            getSpaceData(selectedSite); 
            var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickSpaceId, clickDateId, true);
            reserveBtnDefaultStatus();      
        });

        $('body').on('click', '#scrollDate .ui-link', function() {
            clickDateId = $(this).attr('id').replaceAll('one', '');
            if ($(this).parent().data("lastClicked")) {
                $('#' + $(this).parent().data("lastClicked")).removeClass('hover');
            } else {
                $('#scrollDate .ui-link').removeClass('hover');
            }
            $(this).parent().data("lastClicked", this.id);
            $(this).addClass('hover');
            var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickSpaceId, clickDateId, true);
            reserveBtnDefaultStatus();
        });

        $('body').on('click', '#reserveSpace .ui-link', function() {
            clickSpaceId = $(this).attr('id');
            if ($(this).parent().data("lastClicked")) {
                $('#' + $(this).parent().data("lastClicked")).removeClass('hover');
            } else {
                $('#reserveSpace .ui-link').removeClass('hover');
            }
            $(this).parent().data("lastClicked", this.id);
            $(this).addClass('hover');

            var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickSpaceId, clickDateId, true);
            reserveBtnDefaultStatus();
        });

        $('body').on('click', 'div[id^=time]', function() {
            var bMyReserve = $(this).hasClass('ui-color-myreserve');
            var bReserve = $(this).hasClass('ui-color-reserve');
            var bNoReserve = $(this).hasClass('ui-color-noreserve');
            var bReserveSelect = $(this).find('div:nth-child(2)').hasClass('iconSelected');

            if (bMyReserve || bReserve) {

                var tempEname = $(this).attr('ename');
                var arrMsgValue = $(this).attr('msg').split(',');
                var arrCutString = cutStringToArray(arrMsgValue[0], ['4', '2', '2']);
                var strDate = arrCutString[1] + '/' + arrCutString[2] + '/' + arrCutString[3];
                var msgContent = strDate + '&nbsp;&nbsp;' + arrMsgValue[2] + '</div>';

                if (bMyReserve) {
                    traceID = $(this).attr('traceID');
                    selectMyReserveTime = $(this).find('div > div:nth-child(1)').text();
                    popupMsg('myReserveMsg', tempEname + '已預約 ', arrMsgValue[1]+ '&nbsp;&nbsp;' + msgContent, '關閉', true, '取消預約', '056_icon_booked_success.png');
                } else {
                    var tempMailContent = $(this).attr('email') + '?subject=停車位協調_' + new Date(strDate).mmdd('/') + ' ' + arrMsgValue[1] + ' ' + arrMsgValue[2];
                    popupSchemeMsg('reserveMsg', tempEname + ' 已預約 ', arrMsgValue[1] + '&nbsp;&nbsp' + msgContent, 'mailto:' + tempMailContent, 'tel:' + $(this).attr('ext'), 'select.png');
                }

            } else if (bNoReserve && !bReserveSelect) {

                var timeBlockId = $(this).attr('id');
                timeClick.push(timeBlockId);
                timeNameClick.push($(this).find('div > div:nth-child(1)').text());

                $(this).addClass('hover');
                $(this).find('div:nth-child(2)').removeClass('iconSelect');
                $(this).find('div:nth-child(2)').addClass('iconSelected');
                $(this).find('.timeRemind').addClass('timeShow');
                if (siteCategoryID === "10"){
                    $(this).find('.timeRemind').html('~' + addThirtyMins($(this).find('div > div:nth-child(1)').text()));
                }else if (siteCategoryID === "28"){
                    $(this).find('.timeRemind').html('~' + addThirtyMins(addThirtyMins($(this).find('div > div:nth-child(1)').text())) );
                }


            } else if (bReserveSelect) {

                var timeBlockId = $(this).attr('id');
                var clickIndexOf = timeClick.indexOf(timeBlockId);
                timeClick.splice(clickIndexOf, 1);
                timeNameClick.splice(clickIndexOf, 1);

                $(this).removeClass('hover');
                $(this).find('div:nth-child(2)').removeClass('iconSelected');
                $(this).find('.timeRemind').removeClass('timeShow');
                $(this).find('div:nth-child(2)').addClass('iconSelect');

            }

            var itemCount = 0;
            for (var item in timeClick) {
                itemCount++;
            }
            if (itemCount === 0) {
                $('#reserveBtn').removeClass('btn-benq');
                $('#reserveBtn').addClass('btn-disable');
            } else {
                $('#reserveBtn').removeClass('btn-disable');
                $('#reserveBtn').addClass('btn-benq');
            }
        });

        $("#reserveBtn").on('click', function() {
            if ($(this).hasClass('btn-disable')) {
                popupMsg('noSelectTimeMsg', '', '您尚未選擇時間', '', false, '確定', '');
            } else {
                if (selectedSite === "92"){
                    var timeID = '';
                    for (var item in timeClick) {
                        timeID += timeClick[item] + ',';
                    }                
                    var doAPIReserveParkingSpace = new getAPIReserveParkingSpace('pageOne', selectedSite, clickSpaceId, pdName, pdCategory, pdRemark, pdCar, clickDateId, timeID.replaceAll('time-', '').replace(/,\s*$/, ""));
                }else if (selectedSite === "111"){
                    var objReserve = new Object();
                    var timeName = '';
                    parkingQTYData = JSON.parse(localStorage.getItem('parkingQTYData'));
                    localStorage.removeItem('parkingQTYData');
                    objReserve.spaceName = $('a[id=' + clickSpaceId + ']').text();
                    objReserve.reserveDate = $('a[id=one' + clickDateId + ']').text();

                    var arrTempTime = [];
                    for (var item in timeClick) {
                        var sTime = $('div[id=' + timeClick[item] + '] > div > div:first').text();
                        var eTime = addThirtyMins(addThirtyMins(sTime));
                        arrTempTime.push(sTime);
                        arrTempTime.push(eTime);
                    }   
                    var arrUniqueTime = [];
                    for (var item in arrTempTime) {
                        var index = arrUniqueTime.indexOf(arrTempTime[item]);
                        if (index === -1) {
                            arrUniqueTime.push(arrTempTime[item]);
                        } else {
                            arrUniqueTime.splice(index, 1);
                        }
                    }
                    arrUniqueTime.sort();

                    for (var i = 0; i < arrUniqueTime.length; i = i + 2) {
                         timeName += arrUniqueTime[i] + '-' + arrUniqueTime[i + 1] + ',';
                    }

                    objReserve.timeName = timeName;

                    if (parkingQTYData.length == 0) {
                        jsonData = {
                            content: [objReserve]
                        };
                    }
                    localStorage.setItem('parkingQTYData', JSON.stringify(jsonData));
           
                    $.mobile.changePage('#viewQTYParkingDetail');
                }
            }
        });

        $('body').on('click', 'div[for=myReserveMsg] #confirm', function() {
            if (bReserveCancelConfirm == true) {
                $('div[for=myReserveMsg]').popup('close');
                var doAPIReserveCancel = new getAPIReserveCancel(clickDateId, traceID);
            } else {
                $('div[for=myReserveMsg] span[id=titleText]').text('確定取消預約？');
                $('div[for=myReserveMsg] button[id=confirm]').html('取消');
                $('div[for=myReserveMsg] button[id=cancel]').html('不取消');
                $('div[for=myReserveMsg] img[id=titleImg]').attr('src', 'img/068_icon_warm.png');
                bReserveCancelConfirm = true;
            }
        });
        
        $('body').on('click', 'div[for=myReserveMsg] #cancel', function() {
            bReserveCancelConfirm = false;
        });

        $('body').on('click', 'div[for=cancelSuccessMsg] #confirm', function() {
            $('div[traceid=' + traceID + ']').removeClass('ui-color-myreserve');
            $('div[traceid=' + traceID + '] span').text('');
            $('div[for=cancelSuccessMsg]').popup('close');
        });

        $('body').on('click', 'div[for=reserveSuccessMsg] #confirm, div[for=apiFailMsg] #confirm, div[for=cancelFailMsg] #confirm, div[for=noSelectTimeMsg] #confirm, div[for=selectReserveSameTimeMsg] #confirm, div[for=noTimeIdMsg] #confirm, div[for=successMsg] #confirm, div[for=failMsg] #confirm', function() {
            $('#viewPopupMsg').popup('close');
        });

        $('body').on('click', 'div[for=reserveFailMsg] #confirm', function() {
            var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickSpaceId, clickDateId, false);
            $('div[for=reserveFailMsg]').popup('close');
        });

        // ----------------------------pageTwo function-------------------------------------- 
        $(document).on("click", "#addCarDetail", function() {
            loadingMask("show");
            $(".loader").css("top", "0px");
            $.mobile.changePage('#viewParkingDetailAdd');
        });

        $('body').on('click', '#pageTwo .btn-myreserve', function() {
            $('#pageTwo').addClass('min-height-100');
            clickDeleteID = $(this).attr('value');
            var strTitle = $(this).attr('title');
            popupMsg('deleteMsg', '確定刪除車籍資料?', strTitle, '取消', true, '確定','');
        });

        $('body').on('click', 'div[for=deleteMsg] #confirm', function() {
            var parkingSettingdata = JSON.parse(localStorage.getItem('parkingSettingData'));
            parkingSettingdata.content = parkingSettingdata.content.filter(function(item) {
                return item.id != clickDeleteID;
            });
            localStorage.setItem('parkingSettingData', JSON.stringify(parkingSettingdata));

            $('#commonCarList-' + clickDeleteID).hide('slow');
            $('#commonCarList-' + clickDeleteID).remove();

            $('div[for=deleteMsg]').popup('close');
        });

        $('body').on('click', 'div[id^=commonCarList-]', function(e) {
            if ((e.target.id != "settingDelete") && (e.target.className != "delete-myreserve")){
                clickEditSettingID = $(this).attr('value');
                $.mobile.changePage('#viewParkingDetailAdd');
            }
        });

        // ----------------------------pageThree function-------------------------------------- 
       $('body').on('click', 'div[id^=def-] a', function() {
            //$('#viewMyReserve').addClass('min-height-100');
            clickAggTarceID = $(this).attr('value');
            clickReserveDate = $(this).attr('date');
            clickReserveSpace = $(this).attr('space');
            var clickReserveTime = $(this).attr('time');
            var arrDateString = cutStringToArray(clickReserveDate, ['4', '2', '2']);
            var strDate = arrDateString[2] + '/' + arrDateString[3];

            var sTime = clickReserveTime.split('-')[0];
            var eTime = clickReserveTime.split('-')[1];
            var strTime = sTime;
            if (sTime == eTime) {
                arrTempTimeNameClick.push(strTime);
            } else {
                do {
                    arrTempTimeNameClick.push(strTime);
                    strTime = addThirtyMins(strTime);
                } while (strTime != eTime);
            }

            var msgContent = '<div>' + '&nbsp;&nbsp;' + strDate + '&nbsp;&nbsp;' + clickReserveTime + '</div>';
            popupMsg('cancelMsg', '確定取消預約 ' + clickReserveSpace + '?', msgContent, '取消', true, '確定', '068_icon_warm.png');
        });

        $('body').on('click', 'div[for=cancelMsg] #confirm', function() {
            var doAPIMyReserveCancel = new getAPIMyReserveCancel(clickReserveDate, clickAggTarceID);
            /*var searchRoomNode = searchTree(meetingRoomData, clickReserveSpace, 'MeetingRoomName');
            var searchSiteNode = searchRoomNode.parent.parent.data;*/
            selectedSite = $('#reserveSite').find(":selected").val();

            for (var i = 0; i < myReserveLocalData.length; i++) {
                $.each(arrTempTimeNameClick, function(index, value) {
                    if (myReserveLocalData.length != 0 && myReserveLocalData[i].time == value && myReserveLocalData[i].date == clickReserveDate && myReserveLocalData[i].site == selectedSite) {
                        myReserveLocalData.splice(i, 1);
                        i = i - 1;
                        i = i < 0 ? 0 : i;
                    }
                });
            };

            $('div[for=cancelMsg]').popup('close');
        });

        $('body').on('click', 'div[for=noDataMsg] #confirm, #myReserveBack', function() {
            $.mobile.changePage('#viewReserve');
        });
    }
});
