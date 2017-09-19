
var defaultSiteClick = '';
var clickSiteId = '';
var selectedSite = '';
var siteCategoryID = '';
var clickDateId = '';
var clickRomeId = '';
var clickTraceID = '';
var quickReserveClickDateID = '';
var quickRserveCallBackData = {};
var timeClick = [];
var timeNameClick = [];
var selectMyReserveTime = '';
var reserveDetailLocalData = [];
var bReserveCancelConfirm = false;
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
            clickRomeId = $('#reserveSpace a:first-child').attr('id');
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

        function getReserveData(roomId, date, data, type) {
            loadingMask("show");
            arrReserve = [];
            for (var i = 0, item; item = data[i]; i++) {
                var newReserve = new reserveObj(roomId, date);
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
                var newReserveLocalDataObj = new reserveLocalDataObj(roomId, date, data);
                reserveDetailLocalData.push(newReserveLocalDataObj);
                localStorage.setItem('reserveDetailLocalData', JSON.stringify(reserveDetailLocalData));
            }

            getMettingStatus();
            loadingMask("hide");
        }

        function checkLocalDataExpired() {
            defaultSiteClick = localStorage.getItem('defaultSiteClick');
            if (defaultSiteClick === null) {
                defaultSiteClick = 92; //default site = 92(BQT/QTT)
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
        }

        /********************************** page event *************************************/
        $("#viewMain").one("pagebeforeshow", function(event, ui) {
            //get last update time check date expired
            checkLocalDataExpired();
            getInitialData();
            setInitialData();

            $('#pageOne').show();
            $('#pageTwo').hide();
        });

        /********************************** dom event *************************************/
        $('#viewMain').keypress(function(event) {

        });

        $('#reserveSite').change(function() {
            localStorage.setItem('defaultSiteClick', $(this).val());
            siteCategoryID = dictSiteCategory[$(this).val()];
            selectedSite = $('#reserveSite').find(":selected").val();
            setAlertLimitSite(selectedSite);  
            getSpaceData(selectedSite);       
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
            //var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickRomeId, clickDateId, true);
            //reserveBtnDefaultStatus();
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

            //var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(clickRomeId, clickDateId, true);
            //reserveBtnDefaultStatus();
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
                    //popupMsg('myReserveMsg', tempEname + ' 已預約 ' + arrMsgValue[1], msgContent, '關閉', true, '取消預約', 'select.png');
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
    }
});
