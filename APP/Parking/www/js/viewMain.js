
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
var parkingSpaceDataExample = ['車位1', '車位2', '車位3', '車位4'];

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
        
        //var MeetingRoomID = JSON.parse(localStorage.getItem('meetingRoomLocalData'))['content'][0]['MeetingRoomID']
        function getSpaceData(siteIndex) {
            htmlContent = '';
            siteIndex = siteIndex == '' ? '0' : siteIndex;
            $('#reserveSpace').find('a').remove();

            /*for (var i = 0, item; item = JSON.parse(localStorage.getItem('parkingSpaceLocalData'))['content'][i]; i++) {
                if (item.ParkingSpaceSite == siteIndex) {
                    htmlContent += '<a id=' + item.ParkingSpaceID + ' value=' + item.ParkingSpaceID + ' href="#" class="ui-link" IsReserveMulti=' + item.IsReserveMulti + '>' + item.ParkingSpaceName + '</a>';
                }
            }*/

            for (var i = 0; i < parkingSpaceDataExample.length; i++){             
                htmlContent += '<a id=' + i + ' value=' + i + ' href="#" class="ui-link">' + parkingSpaceDataExample[i] + '</a>';
            }

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
            /* var isSystemRole = JSON.parse(localStorage.getItem('listAllManager'));

            if (isSystemRole != null) {
                reserveDays = 120;
            } else {
                reserveDays = 14;
            }*/

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
       
        function getMettingStatus() {
            htmlContent = '';
            $('#defaultTimeSelectId').nextAll().remove();
            var arrClass = ['a', 'b', 'c', 'd'];
            var originItem = ['defaultTimeSelectId', 'reserveTimeSelect', '[eName]', 'ui-block-a', 'disable', 'reserve', 'circle-icon', '[msg]', '[ext]', '[email]', '[traceID]'];
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
                var bTime = filterTimeBlock[item].time;
                var timeID = filterTimeBlock[item].timeID;
                var roomName = $('#reserveRoom .hover').text();

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
                        msg = arr.date + ',' + roomName + ',' + arr.detailInfo['bTime'] + '-' + addThirtyMins(arr.detailInfo['bTime']) + ',' + eName

                        //to do 
                        //array pop data
                        //arrReserve.pop(arr);
                    }
                }
                var replaceItem = ['time-' + timeID, bTime.trim(), eName, 'ui-block-' + classId, '', reserveClass, reserveIconClass, msg, ext, email, traceID];

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
                arrReserve.push(newReserve);
            }

            if (type === 'dataNotExist') {
                //save to local data
                var reserveDetailLocalData = JSON.parse(localStorage.getItem('reserveDetailLocalData'));
                var newReserveLocalDataObj = new reserveLocalDataObj(spaceId, date, data);
                reserveDetailLocalData.push(newReserveLocalDataObj);
                localStorage.setItem('reserveDetailLocalData', JSON.stringify(reserveDetailLocalData));
            }

            getMettingStatus();
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
                    if ((obj.roomId === roomId && obj.date === date) && !checkDataExpired(obj.lastUpdateTime, 1, 'mm')) {
                        getReserveData(roomId, date, obj.data, 'dataExist');
                        dataExist = true;
                    }
                }
            }

            if (!dataExist) {
                loadingMask('show');
                var self = this;
                var queryData = '<LayoutHeader><MeetingRoomID>' + spaceId + '</MeetingRoomID><ReserveDate>' + date + '</ReserveDate></LayoutHeader>';

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

        function getAPIReserveParkingSpace(page, siteId, spaceId, date, timeID) {
            //loadingMask('show');
            var self = this;
            //var queryData = '<LayoutHeader><ParkingSpceSite>' + siteId + '</ParkingSpceSite><ParkingSpceID>' + spaceId + '</ParkingSpceID><ReserveDate>' + date + '</ReserveDate><ReserveUser>' + loginData['emp_no'] + '</ReserveUser><ReserveTimeID>' + timeID + '</ReserveTimeID></LayoutHeader>';

            //this.successCallback = function(data) {

                //if (data['ResultCode'] === "002902") {
                    //Reservation Successful
                    var arrCutString = cutStringToArray(date, ['4', '2', '2']);
                    var strDate = arrCutString[1] + '/' + arrCutString[2] + '/' + arrCutString[3];
                    var spaceName = '';
                    var timeName = '';
                    var timeName2 = '';

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
                            //delete when connect to API
                            timeName2 += sTime + '-' + eTime + ',';
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
                        //add Fake Data
                        //delete when connect to API
                        for (var i = 0, timeIDItem; timeIDItem =timeID.split(',')[i]; i++){
                            $("#time" + timeIDItem).removeClass("ui-color-noreserve");
                            $("#time" + timeIDItem).addClass("ui-color-myreserve");
                            $("#time" + timeIDItem).find('.circleIcon').removeClass('circleIcon');
                            $("#time" + timeIDItem).find('.iconSelect').removeClass('iconSelect');
                            $("#time" + timeIDItem + " div:nth-child(2)").text("Jennifer.Y.Wang");
                            var msg =  date
                                     + ","
                                     + spaceName
                                     + ","
                                     + timeName2.split(',')[i]
                                     + ","
                                     + "Jennifer.Y.Wang";
                            $("#time" + timeIDItem).attr("ename", "Jennifer.Y.Wang");
                            $("#time" + timeIDItem).attr("msg", msg);
                            $("#time" + timeIDItem).attr("traceID", timeIDItem);
                        }
                    } 

                /*  var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickSpaceId, date, false);

                    if (isReserveMulti != 'N') {*/
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
                /*  }

                } else if (data['ResultCode'] === "002903") {
                    //Reservation Failed, Someone Made a Reservation
                    reserveBtnDefaultStatus();
                    var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickSpaceId, date, false);
                    popupMsg('reserveFailMsg', '已被預約', '哇！慢了一步～已被預約', '', false, '確定', 'warn_icon.png');

                } else if (data['ResultCode'] === "002904") {
                    //Reservation Failed, Repeated a Reservation
                    popupMsg('reserveFailMsg', '', '預約失敗，重複預約', '', false, '確定', '');
                }

                loadingMask('hide');
            };

            var __construct = function() {
                CustomAPI("POST", true, "ReserveParkingSpace", self.successCallback, self.failCallback, queryData, "");
            }();*/
        }

        // delete parameters when connect to API
        function getAPIQueryMyReserve(page, siteId, spaceId, date, timeID) {
            //loadingMask('show');
            var self = this;
            var today = new Date();
            //var queryData = '<LayoutHeader><ReserveUser>' + loginData['emp_no'] + '</ReserveUser><NowDate>' + today.yyyymmdd('') + '</NowDate></LayoutHeader>';

            //this.successCallback = function(data) {
                $('div[id^=def-]').remove();

                // delete parameters when connect to API
                if (timeID != null) {  
                //if (data['ResultCode'] === "1") {  
                    //Successful
                    var htmlContent_today = '';
                    var htmlContent_other = '';
                    var originItem = ['default', '[begin]', '[end]', '[value]', '[space]', '[date]', '[dateformate]', '[site]', '[PDetailName]', 'disable'];

                    if (page == 'pageThree') {

                    //for (var i = 0, item; item = data['Content'][i]; i++) {
                        for (var i = 0, timeIDItem; timeIDItem =timeID.split(',')[i]; i++) {
                            // convert yyyymmdd(string) to yyyy/mm/dd
                            var arrCutString = cutStringToArray(date, ['4', '2', '2']);
                            var strDate = arrCutString[1] + '/' + arrCutString[2] + '/' + arrCutString[3];

                            // convert date format to mm/dd(day of week)
                            var d = new Date(strDate);
                            var dateFormat = d.mmdd('/');
                            var sTime = $('div[id=time' + timeIDItem + '] > div > div:first').text();

                            if (siteId === '92') {
                                var siteName = 'QTT';
                                var eTime = addThirtyMins(sTime);
                            }else if (siteId === '111'){
                                var siteName = 'QTY';
                                var eTime = addThirtyMins(addThirtyMins(sTime));
                            }

                            var replaceItem = ['def-' + timeIDItem, sTime, eTime, timeIDItem, parkingSpaceDataExample[spaceId], date, dateFormat, siteName, 'BenQ/Jennifer.Y.Wang', ''];

                            if (date == new Date().yyyymmdd('')) {
                                $('#pageThree :first-child h2').removeClass('disable');
                                htmlContent_today
                                    += replaceStr($('#defaultToday').get(0).outerHTML, originItem, replaceItem);
                            } else {
                                htmlContent_other
                                    += replaceStr($('#defaultOtherDay').get(0).outerHTML, originItem, replaceItem);
                            }
                        }
                    //}
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
                // delete parameters when connect to API
                } else {
                //} else if (data['ResultCode'] === "042901") {
                    //Not Found Reserve Data
                    popupMsg('noDataMsg', '', '沒有您的預約資料', '', false, '確定', '');
                    $('#todayLine').addClass('disable');
                    $('#otherDayLine').addClass('disable');
                }
            /*    loadingMask('hide');
            };

            var __construct = function() {
                CustomAPI("POST", true, "QueryMyReserve", self.successCallback, self.failCallback, queryData, "");
            }(); */
        }

        function getAPIMyReserveCancel(date, traceID) {
            /*loadingMask('show');
            var self = this;
            var queryData = '<LayoutHeader><ReserveDate>' + date + '</ReserveDate><ReserveUser>' + loginData['emp_no'] + '</ReserveUser><ReserveTraceID></ReserveTraceID><ReserveTraceAggID>' + traceID + '</ReserveTraceAggID></LayoutHeader>';

            this.successCallback = function(data) {
                if (data['ResultCode'] === "042904") {*/
                    //Cancel a Reservation Successful
                    $('div[id^=def-' + traceID + ']').hide();

                    //delete local data for refresh
            /*        var reserveDetailLocalData = JSON.parse(localStorage.getItem('reserveDetailLocalData'));
                    reserveDetailLocalData = reserveDetailLocalData.filter(function(item) {
                        return item.date != date;
                    });
                    localStorage.setItem('reserveDetailLocalData', JSON.stringify(reserveDetailLocalData)); */

                    popupMsg('successMsg', '', '取消預約成功', '', false, '確定', '');

            /*  } else if (data['ResultCode'] === "042905") {
                    //Cancel a Reservation Failed
                    popupMsg('failMsg', '', '取消預約失敗', '', false, '確定', '');
                }
                loadingMask('hide');
            };

            var __construct = function() {
                CustomAPI("POST", true, "ReserveCancel", self.successCallback, self.failCallback, queryData, "");
            }(); */
        }

        function checkLocalDataExpired() {
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
            //$("#reserveSite option[value=" + defaultSiteClick + "]").attr("selected", "selected");
            selectedSite = $('#reserveSite').find(":selected").val();
            siteCategoryID = dictSiteCategory[defaultSiteClick];
            getSpaceData(selectedSite);  
        }

        function setInitialData() {
            setAlertLimitSite(defaultSiteClick);
            setDateList();
        }

        /********************************** page event *************************************/
        $("#viewMain").one("pagebeforeshow", function(event, ui) {
            //get last update time check date expired
            checkLocalDataExpired();
            //var doAPIQueryMyReserve = new getAPIQueryMyReserve();
            getInitialData();
            setInitialData();

            $('#pageOne').show();
            $('#pageTwo').hide();
            $('#pageThree').hide();
            
        });

        $('#viewMain').on('pagebeforeshow', function(event, ui) {
            reserveBtnDefaultStatus();
            /*if (isReloadPage == true) {
                var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickRomeId, clickDateId, false);
                isReloadPage = false;
            } else {
                var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickRomeId, clickDateId, true);
            }*/
        });

        /********************************** dom event *************************************/

        $('#reserveTab').change(function() {
            if ($("#reserveTab :radio:checked").val() == 'tab1') {
                $('#pageOne').show();
                $('#pageTwo').hide();
                $('#pageThree').hide();
                reserveBtnDefaultStatus();
                //var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickRomeId, clickDateId, true);
            } else if ($("#reserveTab :radio:checked").val() == 'tab2'){
                $('#pageOne').hide();
                $('#pageTwo').show();
                $('#pageThree').hide();
            }else {
                $('#pageOne').hide();
                $('#pageTwo').hide();
                $('#pageThree').show();
            }
        });

        $('#reserveSite').change(function() {
            localStorage.setItem('defaultSiteClick', $(this).val());
            siteCategoryID = dictSiteCategory[$(this).val()];
            selectedSite = $('#reserveSite').find(":selected").val();
            setAlertLimitSite(selectedSite);  
            getSpaceData(selectedSite); 
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
            //var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickSpaceId, clickDateId, true);
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

            //var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickSpaceId, clickDateId, true);
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
                    //ex: 會議室協調_12/01 T01 15:00-15:30
                    var tempMailContent = $(this).attr('email') + '?subject=會議室協調_' + new Date(strDate).mmdd('/') + ' ' + arrMsgValue[1] + ' ' + arrMsgValue[2];
                    //popupSchemeMsg('reserveMsg', tempEname + ' 已預約 ' + arrMsgValue[1], msgContent, 'mailto:' + tempMailContent, 'tel:' + $(this).attr('ext'), 'select.png');
                }

            } else if (bNoReserve && !bReserveSelect) {

                var timeBlockId = $(this).attr('id');
                timeClick.push(timeBlockId);
                timeNameClick.push($(this).find('div > div:nth-child(1)').text());

                $(this).addClass('hover');
                $(this).find('div:nth-child(2)').removeClass('iconSelect');
                $(this).find('div:nth-child(2)').addClass('iconSelected');
                $(this).find('.timeRemind').addClass('timeShow');
                if ($(this).parents('.ui-grid-c').hasClass('BQT')){
                    $(this).find('.timeRemind').html('~' + addThirtyMins($(this).find('div > div:nth-child(1)').text()));
                }else if ($(this).parents('.ui-grid-c').hasClass('QTY')){
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
                var timeID = '';
                for (var item in timeClick) {
                    timeID += timeClick[item] + ',';
                }                
                //var doAPIReserveParkingSpace = new getAPIReserveParkingSpace('pageOne', clickSpaceId, clickDateId, timeID.replaceAll('time-', '').replace(/,\s*$/, ""));
                var doAPIReserveParkingSpace = new getAPIReserveParkingSpace('pageOne', selectedSite, clickSpaceId, clickDateId, timeID.replaceAll('time', '').replace(/,\s*$/, ""));
                //delete 
                var doAPIQueryMyReserve = new getAPIQueryMyReserve('pageThree', selectedSite, clickSpaceId, clickDateId, timeID.replaceAll('time', '').replace(/,\s*$/, ""));
            }
        });

        $('body').on('click', 'div[for=myReserveMsg] #confirm', function() {
            if (bReserveCancelConfirm == true) {
                $('div[for=myReserveMsg]').popup('close');
                //var doAPIReserveCancel = new getAPIReserveCancel(clickDateId, traceID);
                //delete when connect to API
                $('div[traceid=' + traceID + ']').removeClass('ui-color-myreserve');
                $('div[traceid=' + traceID + ']').addClass('ui-color-noreserve');
                $('div[traceid=' + traceID + ']').find('div:nth-child(2)').text('');
                $('div[traceid=' + traceID + ']').find('div:nth-child(2)').addClass('circleIcon');
                $('div[traceid=' + traceID + ']').find('div:nth-child(2)').addClass('iconSelect');
                $('div[traceid=' + traceID + ']').attr("ename", "");
                $('div[traceid=' + traceID + ']').attr("msg", "");
                $('div[traceid=' + traceID + ']').attr("traceID", "");
                popupMsg('cancelSuccessMsg', '', '取消預約成功', '', false, '確定', '');

            } else {
                $('div[for=myReserveMsg] span[id=titleText]').text('確定取消預約？');
                $('div[for=myReserveMsg] button[id=confirm]').html('取消');
                $('div[for=myReserveMsg] button[id=cancel]').html('不取消');
                $('div[for=myReserveMsg] img[id=titleImg]').attr('src', 'img/068_icon_warm.png');
                bReserveCancelConfirm = true;
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

        // ------------------------------------------------------------------
        
        $('body').on('click', 'div[for=myReserveMsg] #cancel', function() {
            bReserveCancelConfirm = false;
        });

        $('body').on('click', 'div[for=cancelSuccessMsg] #confirm', function() {
            //$('div[traceid=' + traceID + ']').removeClass('ui-color-myreserve');
            //delete
            $('div[for=cancelSuccessMsg]').popup('close');
        });

        $('body').on('click', 'div[for=reserveSuccessMsg] #confirm, div[for=apiFailMsg] #confirm, div[for=cancelFailMsg] #confirm, div[for=noSelectTimeMsg] #confirm, div[for=selectReserveSameTimeMsg] #confirm, div[for=noTimeIdMsg] #confirm, div[for=successMsg] #confirm, div[for=failMsg] #confirm', function() {
            $('#viewPopupMsg').popup('close');
        });
    }
});
