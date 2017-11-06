
var carListDetailData = {
    option: []
};

$("#viewQTYParkingDetail").pagecontainer({
    create: function(event, ui) {

        var carListTemplateID = 0;

    	/********************************** function *************************************/
        function setDefaultStatus() {
            $('#newSettingTitleQTY').val('');
            $('#newSettingTypeQTY input[value=setGuestQTY]').prop("checked", "checked");
            $('#newSettingCarQTY').val('');
            $('#newSettingNoticeQTY').val('');
        }

        function queryQTYReserveDetail() {
            $('div[id^=parkingQTYData]').remove();
            parkingQTYData = JSON.parse(localStorage.getItem('parkingQTYData'));
            var originItem = ['QTYReserveDetail', '[space]', '[date]', '[time]'];
            htmlContent = '';
            if (parkingQTYData.length != 0) {
                var item = parkingQTYData['content'][0];
                var replaceItem = ['parkingQTYData', item.spaceName, item.reserveDate, item.timeName];
                htmlContent += replaceStr($('#QTYReserveDetail').get(0).outerHTML, originItem, replaceItem);               
            }            
            $('#QTYReserveDetail').after(htmlContent);
            $('#parkingQTYData').removeClass('disable');
        }

        function reserveQTYBtnDefaultStatus() {
            if ( !($('#newSettingTitleQTY').val().length == 0) && !($('#newSettingCarQTY').val().length == 0) &&  !($('#newSettingNoticeQTY').val().length == 0))
            {
                $('#reserveQTYBtn').removeClass('btn-disable');
                $('#reserveQTYBtn').addClass('btn-benq');
            }else {
                if (!$(this).hasClass('btn-disable')){
                    $('#reserveQTYBtn').addClass('btn-disable');
                }
            }
        }

        function createTemplateDropdownList() {

            parkingSettingdata = JSON.parse(localStorage.getItem('parkingSettingData'));
                          
            var ID = carListTemplateID;
            var oldID = parseInt(ID) - 1;
            carListTemplateID++;

            if ($("#CommonCarList-popup" + oldID).length) {
                $("#CommonCarList-popup" + oldID).remove();
                $("#CommonCarList-popup" + oldID + "-option").popup("destroy").remove();
            }

            var carListData = {
                id: "CommonCarList-popup"+ ID,
                option: [],
                title: "",
                defaultText: "選擇常用車籍"
            };

            for (var i = 0, item; item = parkingSettingdata['content'][i]; i++) {
                carListData["option"][i] = {};
                carListData["option"][i]["value"] = item.id;
                carListData["option"][i]["text"] = item.title + '<br>' + item.car;

                carListDetailData["option"][i] = {};
                carListDetailData["option"][i]["id"] = item.id;
                carListDetailData["option"][i]["type"] = item.type;
                carListDetailData["option"][i]["car"] = item.car;
                carListDetailData["option"][i]["notice"] = item.notice;
                carListDetailData["option"][i]["title"] = item.title; 
            }

            tplJS.DropdownList("viewQTYParkingDetail", "eventTemplateSelectContent", "append", "typeB", carListData);
            $('#CommonCarList-popup'+ID).removeClass('tpl-dropdown-list');
            $('#CommonCarList-popup'+ID).addClass('add-event-border');
            $('#CommonCarList-popup'+ID+'-option').removeClass('ui-corner-all');
            $('#CommonCarList-popup'+ID+'-option').addClass('CommonCarList-option-corner-all');

            $(document).on("change", "#CommonCarList-popup"+ ID, function() {
                var selectedValue = $(this).val();
                $('#newSettingTitleQTY').val("");
                $.each(carListDetailData.option, function(key, obj) {
                    if (obj.id == selectedValue) {
                        $('#newSettingTitleQTY').val(obj.title);
                        $('#newSettingTypeQTY input[id^=set]').removeAttr("checked");
                        $('#newSettingTypeQTY input[value=' + obj.type + 'QTY]').prop("checked", "checked");
                        $('#newSettingCarQTY').val(obj.car);
                        $('#newSettingNoticeQTY').val(obj.notice);
                    }
                    reserveQTYBtnDefaultStatus();
                });

            });
            
        }

        function getAPIReserveQTYParkingSpace(siteId, spaceId, pdName, pdCategory, pdRemark, pdCar, date, timeID) {
            loadingMask('show');
            var self = this;
            var queryData = '<LayoutHeader><ParkingSpaceSite>' + siteId + '</ParkingSpaceSite><ParkingSpaceID>' + spaceId + '</ParkingSpaceID><PDetailName>' + pdName + '</PDetailName><PDetailCategory>' + pdCategory + '</PDetailCategory><PDetailRemark>' + pdRemark + '</PDetailRemark><PDetailCar>' + pdCar + '</PDetailCar><ReserveDate>' + date + '</ReserveDate><ReserveUser>' + loginData['emp_no'] + '</ReserveUser><ReserveTimeID>' + timeID + '</ReserveTimeID></LayoutHeader>';

            this.successCallback = function(data) {
                if (data['ResultCode'] === "042902") {
                    var arrCutString = cutStringToArray(date, ['4', '2', '2']);
                    var strDate = arrCutString[1] + '/' + arrCutString[2] + '/' + arrCutString[3];
                    var spaceName = '';
                    var timeName = '';
                    spaceName = $('#reserveSpace').find('.hover').text();
                    //reserve continuous time block, display one time block  
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
                        timeName += arrUniqueTime[i] + '-' + arrUniqueTime[i + 1] + '<br />';
                    }

                    var msgContent = '<div>' + strDate + '&nbsp;&nbsp;' + timeName + '</div>';
                    popupMsg('reserveQTYSuccessMsg', spaceName + ' 預約成功', msgContent, '', false, '確定', '056_icon_booked_success.png');

                    var isReserveMulti = '';
                    var selectedSite = '';
                    var arrTemp = [];

                    isReserveMulti = $('#' + spaceId).attr('IsReserveMulti');
                    selectedSite = $('#reserveSite').find(":selected").val();
                    arrTemp = timeNameClick;
                    reserveQTYBtnDefaultStatus();

                    //var doAPIQueryReserveDetail = new getAPIQueryReserveDetail(spaceId, date, false);

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

                }else if (data['ResultCode'] === "042903") {
                    popupMsg('reserveFailMsg', '預約失敗', '已被預約', '', false, '確定', '068_icon_warm.png');
                }
                loadingMask('hide');
            };
            var __construct = function() {
                CustomAPI("POST", true, "ReserveParkingSpace", self.successCallback, self.failCallback, queryData, "");
            }();
        }

        /********************************** page event *************************************/
        $('#viewQTYParkingDetail').one('pagebeforeshow', function(event, ui) {
            queryQTYReserveDetail();
        });

        $('#viewQTYParkingDetail').on('pagebeforeshow', function(event, ui) { 
            parkingSettingdata = JSON.parse(localStorage.getItem('parkingSettingData'));         
            queryQTYReserveDetail();
            if (parkingSettingdata.content.length != 0) {
                $('#commonQTYCarList').removeClass('disable');
                $('#nonCarList').addClass('disable');
                createTemplateDropdownList();
            }else {
                $('#commonQTYCarList').addClass('disable');
                $('#nonCarList').removeClass('disable');
            }
            setDefaultStatus();
            reserveQTYBtnDefaultStatus();
        });

        $('#viewQTYParkingDetail').on('pageshow', function(event, ui) {
            footerFixed();
        });

        /********************************** dom event *************************************/
        $('#nonCarListTemplate').on("click", function() {
            $("#nonCommonCarListMsg.toast-style").fadeIn(100).delay(2000).fadeOut(100);
        });

        $('#QTYSettingBack').on('click', function() {
            setDefaultStatus();
            $.mobile.changePage('#viewMain');
        });

        $('#viewMainBack').on('click', function() {
            setDefaultStatus();
            $.mobile.changePage('#viewMain');
        });

        $(document).keyup(function(e) {
            reserveQTYBtnDefaultStatus();
        });

        // click save button
        $('#reserveQTYBtn').on('click', function() {
            if ($(this).hasClass('btn-disable')) {
                popupMsg('noSelectTimeMsg', '', '*號為必填欄位', '', false, '確定', '');
            } else {
                var timeID = '';
                for (var item in timeClick) {
                    timeID += timeClick[item] + ',';
                } 
                var pdQTYName = $('#newSettingTitleQTY').val();
                var pdQTYCategory = ($("#newSettingTypeQTY :radio:checked").val() == 'setGuestQTY') ? '貴賓' : '關係企業';
                var pdQTYCar = $('#newSettingCarQTY').val();
                var pdQTYRemark = $('#newSettingNoticeQTY').val();

                var doAPIReserveQTYParkingSpace = new getAPIReserveQTYParkingSpace(selectedSite, clickSpaceId, pdQTYName, pdQTYCategory, pdQTYRemark, pdQTYCar, clickDateId, timeID.replaceAll('time-', '').replace(/,\s*$/, ""));
                isReloadPage = true;
            }
        });

        $('body').on('click', 'div[for=reserveQTYSuccessMsg] #confirm', function() {
            $('#viewPopupMsg').popup('close');
            $.mobile.changePage('#viewMain');
        });

    }
});
