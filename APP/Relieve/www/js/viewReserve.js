var bReserveCancelConfirm = false;
var month, date;
var queryTime = "";
var timeQueue = {};

$("#viewReserve").pagecontainer({
    create: function(event, ui) {
        
        /********************************** function *************************************/
        window.QueryReserveDetail = function() {
            
            var self = this;

            this.successCallback = function(data) {
                QueryReserveDetailCallBackData = data["Content"];
                var BTime;
                for(var i=0; i<QueryReserveDetailCallBackData.length; i++) {
                    BTime = QueryReserveDetailCallBackData[i]["BTime"].replace(":","-");
                    $("#time" + BTime + " .time").text(QueryReserveDetailCallBackData[i]["BTime"]);

                    if(QueryReserveDetailCallBackData[i]["Emp_No"] === "") {
                        $("#time" + BTime).addClass("ui-color-noreserve");
                        $("#time" + BTime).removeClass("ui-color-myreserve");
                        $("#time" + BTime).removeClass("ui-color-reserve");
                        $("#time" + BTime).find('div:nth-child(2)').addClass("circleIcon");
                        $("#time" + BTime).find('div:nth-child(2)').addClass("iconSelect");
                        $("#time" + BTime).find('div:nth-child(2)').html("");

                    }else if(QueryReserveDetailCallBackData[i]["Emp_No"] === myEmpNo) {
                        $("#time" + BTime).removeClass("ui-color-noreserve");
                        $("#time" + BTime).addClass("ui-color-myreserve");
                        $("#time" + BTime).removeClass("ui-color-reserve");
                        $("#time" + BTime).find('div:nth-child(2)').removeClass("circleIcon");
                        $("#time" + BTime).find('div:nth-child(2)').removeClass("iconSelect");
                        $("#time" + BTime + " div:nth-child(2)").text(QueryReserveDetailCallBackData[i]["Name"]);
                        
                        var msg =  currentYear + "/" + month + "/" + date
                                 + ","
                                 + QueryReserveDetailCallBackData[i]["BTime"]
                                 + "-"
                                 + addThirtyMins(QueryReserveDetailCallBackData[i]["BTime"])
                                 + ","
                                 + QueryReserveDetailCallBackData[i]["Name"];
                        $("#time" + BTime).attr("ename", QueryReserveDetailCallBackData[i]["Name"]);
                        $("#time" + BTime).attr("email", QueryReserveDetailCallBackData[i]["EMail"]);
                        $("#time" + BTime).attr("ext", QueryReserveDetailCallBackData[i]["Ext_No"]);
                        $("#time" + BTime).attr("msg", msg);
                    }else {
                        $("#time" + BTime).removeClass("ui-color-noreserve");
                        $("#time" + BTime).removeClass("ui-color-myreserve");
                        $("#time" + BTime).addClass("ui-color-reserve");
                        $("#time" + BTime).find('div:nth-child(2)').removeClass("circleIcon");
                        $("#time" + BTime).find('div:nth-child(2)').removeClass("iconSelect");
                        $("#time" + BTime + " div:nth-child(2)").text(QueryReserveDetailCallBackData[i]["Name"]);
                        
                        var msg =  currentYear + "/" + month + "/" + date 
                                 + ","
                                 + QueryReserveDetailCallBackData[i]["BTime"]
                                 + "-"
                                 + addThirtyMins(QueryReserveDetailCallBackData[i]["BTime"])
                                 + ","
                                 + QueryReserveDetailCallBackData[i]["Name"];
                        $("#time" + BTime).attr("ename", QueryReserveDetailCallBackData[i]["Name"]);
                        $("#time" + BTime).attr("email", QueryReserveDetailCallBackData[i]["EMail"]);
                        $("#time" + BTime).attr("ext", QueryReserveDetailCallBackData[i]["Ext_No"]);
                        $("#time" + BTime).attr("msg", msg);
                    }
                }
                loadingMask("hide");
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "QueryReserveDetail", self.successCallback, self.failCallback, QueryReserveDetailQuerydata, "");
            }();
        };

        window.ReserveRelieve = function() {
            
            var self = this;

            this.successCallback = function(data) {
                
                ReserveRelieveCallBackData = data;
                var resultcode = data['ResultCode'];
                if(resultcode === "023902") {
                    var strDate = currentYear + "/" + month + "/" + date, 
                        timeName = timeQueue,
                        headerContent = "預約成功";
                        // msgContent = strDate + '&nbsp;&nbsp' + timeName;
                        msgContent = strDate;
                    popupMsgInit('.reserveResultPopup');
                    $('.reserveResultPopup').find('.header-text').html(headerContent);
                    $('.reserveResultPopup').find('.main-paragraph').html(msgContent);
                    $('#reserveDateSelect').find('.hover').find('.timeShow').removeClass('timeShow');
                    $('#reserveDateSelect').find('.hover').find('.circleIcon').remove();
                    $('<div>' + userID + '</div>').insertAfter($('#reserveDateSelect').find('.hover').find('.ui-bar>div:nth-of-type(1)'));
                    $('#reserveDateSelect').find('.hover').removeClass('hover').removeClass('ui-color-noreserve').addClass('ui-color-myreserve');
                
                }else if(resultcode === "023903") {
                    var headerContent = "預約失敗";
                        msgContent = "已超出可預約的時數限制";
                    $('.reserveResultPopup').find('.header-icon img').attr("src", "img/warn_icon.png");
                    popupMsgInit('.reserveResultPopup');
                    $('.reserveResultPopup').find('.header-text').html(headerContent);
                    $('.reserveResultPopup').find('.main-paragraph').html(msgContent);

                    $('#reserveDateSelect').find('.hover').find('.timeShow').removeClass('timeShow');
                    $('#reserveDateSelect').find('.hover').find(".ui-bar>div:nth-of-type(2)").removeClass("iconSelected");
                    $('#reserveDateSelect').find('.hover').find(".ui-bar>div:nth-of-type(2)").addClass("iconSelect");
                    $('#reserveDateSelect').find('.hover').removeClass("hover");

                }else if(resultcode === "023904") {
                    var headerContent = "預約失敗";
                        msgContent = "已被預約";
                    $('.reserveResultPopup').find('.header-icon img').attr("src", "img/warn_icon.png");
                    popupMsgInit('.reserveResultPopup');
                    $('.reserveResultPopup').find('.header-text').html(headerContent);
                    $('.reserveResultPopup').find('.main-paragraph').html(msgContent);

                    $('#reserveDateSelect').find('.hover').find('.timeShow').removeClass('timeShow');
                    $('#reserveDateSelect').find('.hover').find(".ui-bar>div:nth-of-type(2)").removeClass("iconSelected");
                    $('#reserveDateSelect').find('.hover').find(".ui-bar>div:nth-of-type(2)").addClass("iconSelect");
                    $('#reserveDateSelect').find('.hover').removeClass("hover");
                }
                $('#reserveBtn').removeClass('btn-enable');
                $('#reserveBtn').addClass('btn-disable');
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "ReserveRelieve", self.successCallback, self.failCallback, ReserveRelieveQuerydata, "");
            }();
        };

        window.ReserveCancel = function() {
            
            var self = this;

            this.successCallback = function(data) {
                ReserveCancelCallBackData = data;
                var resultcode = data['ResultCode'];
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "ReserveCancel", self.successCallback, self.failCallback, ReserveCancelQuerydata, "");
            }();
        };

        function timeInit() {
            $('.timeRemind').each(function() {
                var oriTime = $(this).parent('div').find('>div:nth-of-type(1)').text();
               $(this).html('~' + addThirtyMins(oriTime)); 
            });
        }

        /********************************** page event *************************************/
        $("#viewReserve").on("pagebeforeshow", function(event, ui) {
            $('#pageOne').show();
            $('#pageTwo').hide();
            $('#pageThree').hide();
            timeInit();
            /* global PullToRefresh */
            // PullToRefresh.init({
            //     mainElement: '#pageOne',
            //     onRefresh: function() {
            //         //do something for refresh
            //     }
            // });
        });

        $("#viewReserve").on("pageshow", function(event, ui) {
            $("#scrollDate #" + currentMonth + currentDate).trigger('click');
        });

        /********************************** dom event *************************************/
        $('#reserveTab').change(function() {
            var tabValue = $("#reserveTab :radio:checked").val();
            if (tabValue == 'tab1') {
                $('#pageOne').show();
                $('#pageTwo').hide();
                $('#pageThree').hide();
                
                /* global PullToRefresh */
                PullToRefresh.init({
                    mainElement: '#pageOne',
                    onRefresh: function() {
                        //do something for refresh
                    }
                });
            } else if (tabValue == 'tab2') {
                $('#pageTwo').show();
                $('#pageOne').hide();
                $('#pageThree').hide();
                
                /* global PullToRefresh */
                PullToRefresh.init({
                    mainElement: '#pageTwo',
                    onRefresh: function() {
                        //do something for refresh
                    }
                });
            } else {
                $('#pageThree').show();
                $('#pageOne').hide();
                $('#pageTwo').hide();
                
                /* global PullToRefresh */
                // PullToRefresh.init({
                //     mainElement: '#scrollDate',
                //     onRefresh: function() {
                //         //do something for refresh
                //     }
                // });
            }
        });

        // date pick
        $('body').on('click', '#scrollDate .ui-link', function() {
            $('#scrollDate').find('.hover').removeClass('hover');
            $(this).addClass('hover');
            month = cutStringToArray($(this).context.id, ["2", "2"])[1];
            date = cutStringToArray($(this).context.id, ["2", "2"])[2];
            queryDate = currentYear.toString() + month + date;
            QueryReserveDetailQuerydata =   "<LayoutHeader><Site>"
                                          + reserveSite
                                          + "</Site><ReserveDate>"
                                          + queryDate
                                          + "</ReserveDate></LayoutHeader>";
            QueryReserveDetail();
        });

        $("#reserveSite").change(function() {
            reserveSite = $("#reserveSite").val();
            QueryReserveDetailQuerydata =   "<LayoutHeader><Site>"
                                          + reserveSite
                                          + "</Site><ReserveDate>"
                                          + queryDate
                                          + "</ReserveDate></LayoutHeader>";
            QueryReserveDetail();
        });

        // time pick
        $('body').on('click', 'div[id^=time]', function() {
            if ($(this).hasClass("hover")) {
                $(this).removeClass("hover");
                $(this).find('div:nth-child(2)').addClass('iconSelect');
                $(this).find('div:nth-child(2)').removeClass('iconSelected');
                $(this).find('.timeRemind').removeClass('timeShow');
                delete timeQueue[$(this).find('div:nth-child(1)')[1].textContent];
            }
            // no reserve
            else if ($(this).hasClass('ui-color-noreserve')) {
                $(this).addClass('hover');
                $(this).find('div:nth-child(2)').removeClass('iconSelect');
                $(this).find('div:nth-child(2)').addClass('iconSelected');
                $(this).find('.timeRemind').addClass('timeShow');
                timeQueue[$(this).find('div:nth-child(1)')[1].textContent] = $(this).find('div:nth-child(1)')[1].textContent;
            }
            // my reserve
            else if ($(this).hasClass('ui-color-myreserve')) {
                $(this).addClass('trace');
                var tempEname = userID,
                    strDate = currentYear + "/" + month + "/" + date, 
                    timeName = $(this).find('div:nth-child(1)')[1].textContent,
                    headerContent = tempEname + ' 已預約',
                    msgContent = strDate + '&nbsp;&nbsp;' + timeName;
                popupMsgInit('.hasReservePopup');
                $('.hasReservePopup').find('.header-text').html(headerContent);
                $('.hasReservePopup').find('.main-paragraph').html(msgContent);
            }
            // other reserve
            else {
                var arrMsgValue = $(this).attr('msg').split(','),
                    tempMailContent = $(this).attr('email') + '?subject=會議室協調_' + new Date(strDate).mmdd('/') + ' ' + arrMsgValue[1] + ' ' + arrMsgValue[2],
                    headerContent = arrMsgValue[2] + "已預約",
                    msgContent = arrMsgValue[0] + '&nbsp;&nbsp' + arrMsgValue[1];
                popupMsgInit('.otherReservePopup');
                $('.otherReservePopup').find('.header-text').html(headerContent);
                $('.otherReservePopup').find('.main-paragraph').html(msgContent);
                $('.btn-mail').attr('href', 'mailto:' + tempMailContent);
                $('.btn-tel').attr('href', 'tel:' + $(this).attr('ext'));
            }
            if ($('#reserveDateSelect').find('.timeShow').length > 0) {
                $('#reserveBtn').removeClass('btn-disable');
                $('#reserveBtn').addClass('btn-enable');
            }else {
                $('#reserveBtn').removeClass('btn-enable');
                $('#reserveBtn').addClass('btn-disable');
            }
        });

        // reserve btn click
        $('body').on('click', '#reserveBtn', function() {
            if ($(this).hasClass('btn-disable')) {
                popupMsg('noSelectTimeMsg', '', '您尚未選擇時間', '', false, '確定', '');
            } else {
                for(var time in timeQueue) {
                    queryTime += time + ",";
                }
                ReserveRelieveQuerydata =   "<LayoutHeader><Site>"
                                          + reserveSite
                                          + "</Site><ReserveDate>"
                                          + queryDate
                                          + "</ReserveDate><ReserveUser>"
                                          + myEmpNo
                                          + "</ReserveUser><BTime>"
                                          + queryTime
                                          + "</BTime></LayoutHeader>";
                ReserveRelieve();
            }
        });

        // cancel my reserve
        $('body').on('click', 'div[for=myReserveMsg] .btn-confirm', function() {
            // cancel sure
            if (bReserveCancelConfirm == true) {
                if ($('#pageOne').css('display') === 'block'){
                    $('.trace').find('.ui-bar>div:nth-of-type(2)').remove();
                    $('<div class="circleIcon iconSelect"</div>').insertAfter($('.trace').find('.ui-bar>div:nth-of-type(1)'));
                    $('.trace').removeClass('ui-color-myreserve').addClass('ui-color-noreserve').removeClass('trace');
                    $('.hasReservePopup').popup('close');
                }
                else{
                    $('.myReserveCancel').parents('.reserveInfo').remove();
                    $('.myReservePopupMsg').popup('close');
                    popupMsgInit('.myReserveCancelSuccessPopupMsg');
                }
                bReserveCancelConfirm = false;
            }
            // cancel cancel
            else {
                $('.hasReservePopup').find('.header-icon img').attr('src', 'img/warn_icon.png');
                $('.hasReservePopup').find('.header-text').html('確定取消預約？');
                $('.hasReservePopup').find('.btn-cancel').html('不取消');
                $('.hasReservePopup').find('.btn-confirm').html('取消');
                bReserveCancelConfirm = true;
            }
        });

        // close canel popup
        $('body').on('click', 'div[for=myReserveMsg] .btn-cancel', function() {
            bReserveCancelConfirm = false;
            if ($('#pageTwo').css('display') === 'block'){
                $('.myReserveCancel').removeClass('myReserveCancel');
            }
        });

        // my reserve cancel btn click
        $('body').on('click', '.reserveInfo .btn-area', function() {
            var tmpParent = $(this).parents('.reserveInfo'), 
                tmpCompany = tmpParent.find('.reserveInfo-company').html(), 
                msgContent = tmpParent.find('.reserveInfo-time').html(), 
                headerContent = '確定取消預約 ' + tmpCompany;
            if ($(this).parents('#today-reserve-area').length > 0){
                msgContent = '今日&nbsp;&nbsp' + msgContent;
            }
            popupMsgInit('.myReservePopupMsg');
            $('.myReservePopupMsg').find('.header-text').html(headerContent);
            $('.myReservePopupMsg').find('.main-paragraph').html(msgContent);
            $(this).addClass('myReserveCancel');
            bReserveCancelConfirm = true;
        });

        // close popup msg
        $('body').on('click', 'div[for=apiFailMsg] #confirm, div[for=cancelFailMsg] #confirm, div[for=noSelectTimeMsg] #confirm, div[for=selectReserveSameTimeMsg] #confirm, div[for=noTimeIdMsg] #confirm', function() {
            $('#viewPopupMsg').popup('close');
        });
    }
});