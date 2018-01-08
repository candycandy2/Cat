var bReserveCancelConfirm = false;
var year, month, date, trace, reserveCancelMonth, reserveCancelDate, reserveCancelID;
var queryTime = "";
var timeQueue = {};
var myReserver_dirtyFlag = true;

$("#viewReserve").pagecontainer({
    create: function(event, ui) {
        
        /********************************** function *************************************/
        window.QueryReserveDetail = function() {
            
            var self = this;

            this.successCallback = function(data) {
                QueryReserveDetailCallBackData = data["Content"];
                var BTime, status, reserveID;

                for(var i=0; i<QueryReserveDetailCallBackData.length; i++) {
                    BTime = QueryReserveDetailCallBackData[i]["BTime"].replace(":","-");
                    status = QueryReserveDetailCallBackData[i]["Status"];
                    reserveID = QueryReserveDetailCallBackData[i]["ReserveID"];
                    $("#time" + BTime + " .time").text(QueryReserveDetailCallBackData[i]["BTime"]);
                    if((currentMonth + "/" + currentDate === month + "/" + date) && (time+"").match(/.*?\s.*?\s.*?\s.*?\s(.*?)\s/)[1] > QueryReserveDetailCallBackData[i]["BTime"]) {
                        status = "1";
                    }
                    $("#time" + BTime).removeClass("hover");
                    $("#time" + BTime).removeClass("ui-color-disable");
                    $("#time" + BTime).addClass("ui-color-noreserve");
                    $("#time" + BTime).removeClass("ui-color-myreserve");
                    $("#time" + BTime).removeClass("ui-color-reserve");
                    $("#time" + BTime).find('div:nth-child(2)').addClass("circleIcon");
                    $("#time" + BTime).find('div:nth-child(2)').addClass("iconSelect");
                    $("#time" + BTime).find('div:nth-child(2)').removeClass("iconSelected");
                    $("#time" + BTime).find('div:nth-child(2)').html("");
                    $("#time" + BTime).find('.timeRemind').removeClass('timeShow');

                    $("#time" + BTime).attr("ename", "");
                    $("#time" + BTime).attr("email", "");
                    $("#time" + BTime).attr("ext", "");
                    $("#time" + BTime).attr("reserveid", "");
                    $("#time" + BTime).attr("msg", "");
                    if(status === "1") {
                        if(reserveID === "0") {
                            $("#time" + BTime).addClass("ui-color-disable");
                            $("#time" + BTime).removeClass("ui-color-noreserve");
                            $("#time" + BTime).removeClass("ui-color-myreserve");
                            $("#time" + BTime).removeClass("ui-color-reserve");
                            $("#time" + BTime).find('div:nth-child(2)').removeClass("iconSelect");
                        }else if(reserveID !== "0") {
                            if(QueryReserveDetailCallBackData[i]["Emp_No"] === myEmpNo) {
                                $("#time" + BTime).removeClass("ui-color-disable");
                                $("#time" + BTime).removeClass("ui-color-noreserve");
                                $("#time" + BTime).addClass("ui-color-myreserve");
                                $("#time" + BTime).removeClass("ui-color-reserve");
                            }else {
                                $("#time" + BTime).removeClass("ui-color-disable");
                                $("#time" + BTime).removeClass("ui-color-noreserve");
                                $("#time" + BTime).removeClass("ui-color-myreserve");
                                $("#time" + BTime).addClass("ui-color-reserve");
                            }
                            $("#time" + BTime).find('div:nth-child(2)').removeClass("circleIcon");
                            $("#time" + BTime).find('div:nth-child(2)').removeClass("iconSelect");
                            $("#time" + BTime + " div:nth-child(2)").text(QueryReserveDetailCallBackData[i]["Name"]);
                            
                            var msg =  year + "/" + month + "/" + date 
                                     + ","
                                     + QueryReserveDetailCallBackData[i]["BTime"]
                                     + "-"
                                     + addThirtyMins(QueryReserveDetailCallBackData[i]["BTime"])
                                     + ","
                                     + QueryReserveDetailCallBackData[i]["Name"];
                            $("#time" + BTime).attr("ename", QueryReserveDetailCallBackData[i]["Name"]);
                            $("#time" + BTime).attr("email", QueryReserveDetailCallBackData[i]["EMail"]);
                            $("#time" + BTime).attr("ext", QueryReserveDetailCallBackData[i]["Ext_No"]);
                            $("#time" + BTime).attr("reserveid", QueryReserveDetailCallBackData[i]["ReserveID"]);
                            $("#time" + BTime).attr("msg", msg);
                        }
                    }
                }
                $('#reserveBtn').removeClass('btn-enable');
                $('#reserveBtn').addClass('btn-disable');
                loadingMask("hide");
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "QueryReserveDetail", self.successCallback, self.failCallback, QueryReserveDetailQuerydata, "");
            }();
        };

        window.ReserveMassage = function() {
            
            var self = this;

            this.successCallback = function(data) {
                
                ReserveMassageCallBackData = data;
                var resultcode = data['ResultCode'];
                if(resultcode === "039902") {
                    var headerContent = "預約成功";
                        msgContent = year + "/" + month + "/" + date;
                    myReserver_dirtyFlag = true;
                    $('.reserveResultPopup').find('.header-icon img').attr("src", "img/select.png");
                    localStorage.setItem("Site", reserveSite);
                }else if(resultcode === "039903") {
                    var headerContent = "預約失敗";
                        msgContent = "已超出可預約的時數限制";
                    $('.reserveResultPopup').find('.header-icon img').attr("src", "img/warn_icon.png");
                }else if(resultcode === "039904") {
                    var headerContent = "預約失敗";
                        msgContent = "已被預約";
                    $('.reserveResultPopup').find('.header-icon img').attr("src", "img/warn_icon.png");
                }
                QueryReserveDetail();
                $('.reserveResultPopup').find('.header-text').html(headerContent);
                $('.reserveResultPopup').find('.main-paragraph').html(msgContent);
                popupMsgInit('.reserveResultPopup');
                tplJS.preventPageScroll();
                $('#reserveBtn').removeClass('btn-enable');
                $('#reserveBtn').addClass('btn-disable');
                loadingMask("hide");
                timeQueue = {};
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "ReserveMassage", self.successCallback, self.failCallback, ReserveMassageQuerydata, "");
            }();
        };

        window.ReserveCancel = function() {

            var self = this;

            this.successCallback = function(data) {
                $('.hasReservePopup').popup('close');
                if(data['ResultCode'] === "039905") {
                    if ($('#pageOne').css('display') === 'block') {
                        QueryReserveDetail();
                    }else {
                        $('.myReserveCancelResult').find('.main-paragraph').html("取消成功");
                        // myReserver_dirtyFlag = true;
                        QueryMyReserve();
                        popupMsgInit('.myReserveCancelResult');
                        tplJS.preventPageScroll();
                    }
                }else if(data['ResultCode'] === "039906") {
                    $('.myReserveCancelResult').find('.main-paragraph').html("當日預約無法取消");
                    popupMsgInit('.myReserveCancelResult');
                    tplJS.preventPageScroll();
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "ReserveCancel", self.successCallback, self.failCallback, ReserveCancelQuerydata, "");
            }();
        };

        window.QueryMyReserve = function() {

            var self = this;

            this.successCallback = function(data) {
                QueryMyReserveCallBackdata = data["Content"];
                $("#today-reserve-area").html("");
                $("#later-reserve-area").html("");
                var site, beginTime, endTime;
                var nowContent = "";
                var laterContent = "";
                var nowDateHTML = '<div class="reserve-area-time font-style7">本日</div>';
                var laterDateHTML = '<div class="reserve-area-time font-style7">未來</div>';
                var nowDate = currentMonth + "/" + currentDate;
                var reserveBegintimeArry, reserveEndtimeArry, reserveDateArry;
                if(data["ResultCode"] === "1") {
                    // myReserver_dirtyFlag = false;
                    for(var i in QueryMyReserveCallBackdata) {
                        site = QueryMyReserveCallBackdata[i]["Site"];
                        reserveBegintimeArry = QueryMyReserveCallBackdata[i]["ReserveBeginTime"].split(" ");
                        reserveEndtimeArry = QueryMyReserveCallBackdata[i]["ReserveEndTime"].split(" ");
                        reserveDateArry = reserveBegintimeArry[0].split("/");
                        reserveDateArry[0] = reserveDateArry[0] < 10 ? "0"+reserveDateArry[0] : reserveDateArry[0];
                        reserveDateArry[1] = reserveDateArry[1] < 10 ? "0"+reserveDateArry[1] : reserveDateArry[1];
                        reserveDate = reserveDateArry[0] + "/" + reserveDateArry[1];
                        if(reserveBegintimeArry[2] === "PM" && reserveEndtimeArry[1] !== "12:00:00") {
                            beginTime = (12 + Number(reserveBegintimeArry[1].match(/([0-9]+):([0-9]+)/)[1])) + ":"
                                        + reserveBegintimeArry[1].match(/([0-9]+):([0-9]+)/)[2];
                        }else {
                            beginTime = reserveBegintimeArry[1].match(/([0-9]+:[0-9]+)/)[1];
                        }
                        if(reserveEndtimeArry[2] === "PM" && reserveEndtimeArry[1] !== "12:00:00") {
                            endTime = (12 + Number(reserveEndtimeArry[1].match(/([0-9]+):([0-9]+)/)[1])) + ":"
                                        + reserveEndtimeArry[1].match(/([0-9]+):([0-9]+)/)[2];
                        }else {
                            endTime = reserveEndtimeArry[1].match(/([0-9]+:[0-9]+)/)[1];
                        }
                        if(nowDate === reserveDate) {
                            nowContent += '<div class="reserveInfo">'
                                        +     '<div class="reserveInfo-area-left reserveInfo-area" reserveid = "' + QueryMyReserveCallBackdata[i]["ReserveID"] + '">'
                                        +         '<div class="reserveInfo-company">'+ site + '</div>'
                                        +         '<div class="reserveInfo-time">' + beginTime + "&nbsp;-&nbsp;" + endTime + '</div>'
                                        +     '</div>'
                                        +     '<div class="reserveInfo-area-right reserveInfo-area">'
                                        +         '<div class="btn-area">'
                                        +             '<a href="#" class="btn-myreserve-cancel ui-link"><img src="img/delete_empty.png"></a>'
                                        +         '</div>'
                                        +     '</div>'
                                        + '</div>'
                        }else {
                            laterContent += '<div class="reserveInfo">'
                                          +     '<div class="reserveInfo-area-left reserveInfo-area" reserveid = "' + QueryMyReserveCallBackdata[i]["ReserveID"] + '">'
                                          +         '<div class="reserveInfo-company">'+ site + '</div>'
                                          +         '<div class="reserveInfo-time" reserveYear='+ reserveDateArry[2] +'>' + reserveDate + "&nbsp;&nbsp;" + beginTime + "&nbsp;-&nbsp;" + endTime + '</div>'
                                          +     '</div>'
                                          +     '<div class="reserveInfo-area-right reserveInfo-area">'
                                          +         '<div class="btn-area">'
                                          +             '<a href="#" class="btn-myreserve-cancel ui-link"><img src="img/delete_empty.png"></a>'
                                          +         '</div>'
                                          +     '</div>'
                                          + '</div>'
                        }
                    }
                    nowDateHTML += nowContent;
                    $("#today-reserve-area").append($(nowDateHTML)).enhanceWithin();
                    laterDateHTML += laterContent;
                    $("#later-reserve-area").append($(laterDateHTML)).enhanceWithin();
                }else if(data["ResultCode"] === "039901") {
                    $('.queryMyReserveResult').find('.main-paragraph').html("沒有您的預約資料");
                    popupMsgInit('.queryMyReserveResult');
                    tplJS.preventPageScroll();
                }
                loadingMask("hide");
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "QueryMyReserve", self.successCallback, self.failCallback, QueryMyReserveQuerydata, "");
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
            timeQueue = {};
            $('#pageOne').show();
            $('#pageTwo').hide();
            $('#pageThree').hide();
            timeInit();
            /* global PullToRefresh */
            PullToRefresh.init({
                mainElement: '#pageOne',
                onRefresh: function() {
                    time = new Date(Date.now());
                    QueryReserveDetail();
                }
            });
        });

        $("#viewReserve").on("pageshow", function(event, ui) {
            if(localStorage.getItem("Site") !== null) {
                $("#reserveSite").val(localStorage.getItem("Site"));
                reserveSite = localStorage.getItem("Site");
            }
            $("#scrollDate #" + currentYear + currentMonth + currentDate).trigger('click');
        });

        /********************************** dom event *************************************/
        $('#reserveTab').change(function() {
            timeQueue = {};
            var tabValue = $("#reserveTab :radio:checked").val();
            if (tabValue == 'tab1') {
                $('#pageOne').show();
                $('#pageTwo').hide();
                $('#pageThree').hide();
                QueryReserveDetail();
                /* global PullToRefresh */
                PullToRefresh.init({
                    mainElement: '#pageOne',
                    onRefresh: function() {
                        time = new Date(Date.now());
                        QueryReserveDetail();
                    }
                });
            } else if (tabValue == 'tab2') {
                $('#pageTwo').show();
                $('#pageOne').hide();
                $('#pageThree').hide();
                QueryMyReserveQuerydata =   "<LayoutHeader><ReserveUser>"
                                          + myEmpNo
                                          + "</ReserveUser><NowDate>"
                                          + currentYear + currentMonth + currentDate
                                          + "</NowDate></LayoutHeader>"
                // if(myReserver_dirtyFlag === true)
                QueryMyReserve();
                loadingMask("show");
                /* global PullToRefresh */
                PullToRefresh.init({
                    mainElement: '#pageTwo',
                    onRefresh: function() {
                        QueryMyReserve();
                    }
                });
            } else {
                $('#pageThree').show();
                $('#pageOne').hide();
                $('#pageTwo').hide();
            }
        });

        // date pick
        $('body').on('click', '#scrollDate .ui-link', function() {
            timeQueue = {};
            $('#scrollDate').find('.hover').removeClass('hover');
            $(this).addClass('hover');
            year = cutStringToArray($(this).context.id, ["4", "2", "2"])[1];
            month = cutStringToArray($(this).context.id, ["4", "2", "2"])[2];
            date = cutStringToArray($(this).context.id, ["4", "2", "2"])[3];
            queryDate = year + month + date;
            QueryReserveDetailQuerydata =   "<LayoutHeader><Site>"
                                          + reserveSite
                                          + "</Site><ReserveDate>"
                                          + queryDate
                                          + "</ReserveDate></LayoutHeader>";
            QueryReserveDetail();
            loadingMask("show");
        });

        $("#reserveSite").change(function() {
            reserveSite = $("#reserveSite").val();
            QueryReserveDetailQuerydata =   "<LayoutHeader><Site>"
                                          + reserveSite
                                          + "</Site><ReserveDate>"
                                          + queryDate
                                          + "</ReserveDate></LayoutHeader>";
            QueryReserveDetail();
            loadingMask("show");
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
                trace = $(this);
                var arrMsgValue = $(this).attr('msg').split(','),
                    headerContent = arrMsgValue[2] + ' 已預約',
                    msgContent = arrMsgValue[0] + '&nbsp;&nbsp;' + arrMsgValue[1];
                popupMsgInit('.hasReservePopup');
                tplJS.preventPageScroll();
                $('.hasReservePopup').find('.header-text').html(headerContent);
                $('.hasReservePopup').find('.main-paragraph').html(msgContent);
                $('.hasReservePopup').find('.header-icon img').attr('src', 'img/select.png');
                $('.hasReservePopup').find('.btn-cancel').html('關閉');
                $('.hasReservePopup').find('.btn-confirm').html('取消預約');
            }
            // other reserve
            else if($(this).hasClass('ui-color-reserve')) {
                var arrMsgValue = $(this).attr('msg').split(','),
                    headerContent = arrMsgValue[2] + "已預約",
                    msgContent = arrMsgValue[0] + '&nbsp;&nbsp' + arrMsgValue[1];
                    tempMailContent = $(this).attr('email') + '?subject=按摩服務時段協調_' + arrMsgValue[0] + ' ' + arrMsgValue[1],
                popupMsgInit('.otherReservePopup');
                tplJS.preventPageScroll();
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
            var index = 0;
            queryTime = "";
            if ($(this).hasClass('btn-disable')) {
                tplJS.preventPageScroll();
                popupMsgInit('.noSelectTimeMsg');
            } else {
                for(var time in timeQueue) {
                    index++;
                    if(index == Object.keys(timeQueue).length) {
                        queryTime += time;   
                    }else {
                        queryTime += time + ",";
                    }
                }
                ReserveMassageQuerydata =   "<LayoutHeader><Site>"
                                          + reserveSite
                                          + "</Site><ReserveDate>"
                                          + queryDate
                                          + "</ReserveDate><ReserveUser>"
                                          + myEmpNo
                                          + "</ReserveUser><BTime>"
                                          + queryTime
                                          + "</BTime></LayoutHeader>";
                ReserveMassage();
                loadingMask("show");
            }
        });

        // cancel my reserve
        $('body').on('click', 'div[for=hasReservePopup] .btn-confirm', function() {
            var tempMonth, tempDate, tempReserveID;
            // cancel sure
            if (bReserveCancelConfirm == true) {
                if($('#pageOne').css('display') === 'block') {
                    tempYear = year;
                    tempMonth = month;
                    tempDate = date;
                    tempReserveID = $(trace).attr("reserveid");
                }else if($('#pageTwo').css('display') === 'block') {
                    tempYear = reserveCancelYear;
                    tempMonth = reserveCancelMonth;
                    tempDate = reserveCancelDate;
                    tempReserveID = reserveCancelID;
                }
                ReserveCancelQuerydata =   "<LayoutHeader><ReserveDate>"
                                         + tempYear + tempMonth + tempDate
                                         + "</ReserveDate><ReserveUser>"
                                         + myEmpNo
                                         + "</ReserveUser><ReserveID>"
                                         + tempReserveID
                                         + "</ReserveID></LayoutHeader>"
                ReserveCancel();
                bReserveCancelConfirm = false;
                tplJS.recoveryPageScroll();
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
        $('body').on('click', 'div[for=hasReservePopup] .btn-cancel', function() {
            bReserveCancelConfirm = false;
            tplJS.recoveryPageScroll();
        });

        // my reserve cancel btn click
        $('body').on('click', '.reserveInfo .btn-area', function() {
            var tmpParent = $(this).parents('.reserveInfo'),
                tmpCompany = tmpParent.find('.reserveInfo-company').html(),
                msgContent = tmpParent.find('.reserveInfo-time').html(),
                headerContent = '確定取消預約 ' + tmpCompany;
            reserveCancelID = tmpParent.find("div:nth-of-type(1)").attr("reserveid");
            if ($(this).parents('#today-reserve-area').length > 0) {
                msgContent = '今日&nbsp;&nbsp' + msgContent;
                reserveCancelYear = currentYear;
                reserveCancelMonth = currentMonth;
                reserveCancelDate = currentDate;
            }else if($(this).parents('#later-reserve-area').length > 0) {
                reserveCancelYear = tmpParent.find("div:nth-of-type(2)").attr("reserveYear");
                reserveCancelMonth = msgContent.match(/([0-9]+)\/([0-9]+)/)[1];
                reserveCancelDate = msgContent.match(/([0-9]+)\/([0-9]+)/)[2];
            }
            popupMsgInit('.hasReservePopup');
            tplJS.preventPageScroll();
            $('.hasReservePopup').find('.header-text').html(headerContent);
            $('.hasReservePopup').find('.main-paragraph').html(msgContent);
            bReserveCancelConfirm = true;
        });

        // my reserve cancel btn click
        $('body').on('click', 'div[for=queryMyReserveResult] .btn-cancel', function() {
            $("input[id=tab1]").trigger('click');
            $("label[for=tab1]").addClass('ui-btn-active');
            $("label[for=tab2]").removeClass('ui-btn-active');
            $("label[for=tab3]").removeClass('ui-btn-active');
            tplJS.recoveryPageScroll();
        });

        $('body').on('click', 'div[for=reserveResultPopup] .btn-cancel', function() {
            tplJS.recoveryPageScroll();
        });

        $('body').on('click', 'div[for=myReserveCancelResult] .btn-cancel', function() {
            tplJS.recoveryPageScroll();
        });

        $('body').on('click', 'div[for=otherReservePopup] .btn-cancel', function() {
            tplJS.recoveryPageScroll();
        });

        $('body').on('click', 'div[for=noSelectTimeMsg] .btn-cancel', function() {
            tplJS.recoveryPageScroll();
        });
    }
});