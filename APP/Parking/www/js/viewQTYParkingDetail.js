
var carListDetailData = {
    option: []
};

$("#viewQTYParkingDetail").pagecontainer({
    create: function(event, ui) {

        var carListTemplateID = 0;

    	/********************************** function *************************************/
        function setDefaultStatus() {
            $('#newSettingTitleQTY').val('');
            $('#newSettingTypeQTY input[value=setGuest]').prop("checked", "checked");
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
            //$('#eventTemplateSelectContent').find('select').remove();
            //$('#eventTemplateSelectContent').find('div').remove();

            var parkingSettingdata = JSON.parse(localStorage.getItem('parkingSettingData'));
            if (parkingSettingdata != null) {
               
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
            }

            $(document).on("change", "#CommonCarList-popup"+ ID, function() {
                var selectedValue = $(this).val();

                $('#newSettingTitleQTY').val("");

                $.each(carListDetailData.option, function(key, obj) {
                    if (obj.id == selectedValue) {
                        $('#newSettingTitleQTY').val(obj.title);
                        $('#newSettingTypeQTY input[id^=set]').removeAttr("checked");
                        $('#newSettingTypeQTY input[value=' + obj.type + ']').prop("checked", "checked");
                        $('#newSettingCarQTY').val(obj.car);
                        $('#newSettingNoticeQTY').val(obj.notice);
                    }
                    reserveQTYBtnDefaultStatus();
                });

            });
        }

        /********************************** page event *************************************/
        $('#viewQTYParkingDetail').one('pagebeforeshow', function(event, ui) {
            queryQTYReserveDetail();
        });

        $('#viewQTYParkingDetail').on('pagebeforeshow', function(event, ui) {          
            queryQTYReserveDetail();
            createTemplateDropdownList();
            setDefaultStatus();
            reserveQTYBtnDefaultStatus();
        });

        $('#viewQTYParkingDetail').on('pageshow', function(event, ui) {

        });

        /********************************** dom event *************************************/
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
                popupMsg('noSelectTimeMsg', '', '您尚未選擇時間', '', false, '確定', '');
            } else {
                var timeID = '';
                for (var item in timeClick) {
                    timeID += timeClick[item] + ',';
                } 
                var pdQTYName = $('#newSettingTitleQTY').val();
                var pdQTYCategory = ($("#newSettingTypeQTY :radio:checked").val() == 'setGuest') ? '貴賓' : '關係企業';
                var pdQTYCar = $('#newSettingCarQTY').val();
                var pdQTYRemark = $('#newSettingNoticeQTY').val();
                //var doAPIReserveQTYParkingSpace = new getAPIReserveQTYParkingSpace('pageOne', selectedSite, clickSpaceId, pdName, pdCategory, pdRemark, pdCar, clickDateId, timeID.replaceAll('time-', '').replace(/,\s*$/, ""));
                //setDefaultStatus();
                //reserveQTYBtnDefaultStatus();    
            }

        });

    }
});
