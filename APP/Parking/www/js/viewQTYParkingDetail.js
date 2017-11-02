var carListData = {
    id: "CommonCarList-popup",
    option: [],
    title: "",
    defaultText: "選擇常用車籍"
};

var carListDetailData = {
    option: []
};

$("#viewQTYParkingDetail").pagecontainer({
    create: function(event, ui) {

    	/********************************** function *************************************/
        function setDefaultStatus() {
            $('#newSettingTitle').val('');
            $('#newSettingType input[value=setGuest]').prop("checked", "checked");
            $('#newSettingCar').val('');
            $('#newSettingNotice').val('');
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

        function ddlObj() {
            this.detailInfo = {};
            this.addDetail = function(key, value) {
                this.detailInfo[key] = value;
            };

            //this.addDetail();
            return this;
        };

        function createTemplateDropdownList() {
            $('#CommonCarList-popup').remove();
            $('#CommonCarList-popup-option-placeholder').remove();

            var parkingSettingdata = JSON.parse(localStorage.getItem('parkingSettingData'));
            if (parkingSettingdata != null) {
                for (var i = 0, item; item = parkingSettingData['content'][i]; i++) {
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
                $('#CommonCarList-popup').removeClass('tpl-dropdown-list');
                $('#CommonCarList-popup').addClass('add-event-border');
                $('#CommonCarList-popup-optionn').removeClass('ui-corner-all');
                $('#CommonCarList-popup-option').addClass('CommonCarList-option-corner-all');
            }

            $(document).on("change", "#CommonCarList-popup", function() {
                var selectedValue = $(this).val();

                $("#newSettingTitle").val("");

                $.each(carListDetailData.option, function(key, obj) {
                    if (obj.id == selectedValue) {
                        $("#newSettingTitle").val(obj.title);
                    }
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
        });

        $('#viewQTYParkingDetail').on('pageshow', function(event, ui) {

        });

        /********************************** dom event *************************************/
        $('#QTYSettingBack').on('click', function() {
            setDefaultStatus();
            $.mobile.changePage('#viewMain');
        });

        // click save button
        $('#newSettingSave').on('click', function() {


        });

    }
});
