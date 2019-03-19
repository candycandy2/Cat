
$(function() {

    //------------------------Initital------------------------
    var URLArr = window.location.origin.split(".");
    var DomainArr = URLArr[0].split("//");
    window.appKey = "app" + DomainArr[1];
    window.serverURL = "https://" + DomainArr[1] + ".benq.com";
    window.appApiPath = "qplayApi";
    window.loginData = {};
    window.timeOutForAction = 1 * 60;
    window.checkTimeOut = 1;
    window.pageNow = 1;

    window.browserLanguage = navigator.language.toLowerCase();
    var languageShortName = browserLanguage.substr(0, 2);

    if (languageShortName === "en") {
        browserLanguage = "en-us";
    }

    //Date Picker
    $(".date-picker").datepicker({
        dateFormat: "yy/mm/dd",
        autoSize: false,
        beforeShow: function() {
            var screenWidth = document.documentElement.clientWidth;
            var datePickerWidth = $(".ui-datepicker").width();
            var positionLeft = parseInt((screenWidth - datePickerWidth) / 2, 10);
            $(".ui-datepicker").css("opacity", "0");

            setTimeout(function() {
                $(".mask").show();

                $(".ui-datepicker").css({
                    "opacity": "1",
                    "left": positionLeft + "px",
                    "z-index": 1001
                });
            }, 300);
        },
        onClose: function(dateText, inst) {
            $(".mask").hide();

            var startTimestamp = parseInt(new Date($("#startDate").val() + " 00:00:00").getTime() / 1000, 10);
            var endTimestamp = parseInt(new Date($("#endDate").val() + " 23:59:59").getTime() / 1000, 10);

            if (endTimestamp < startTimestamp) {
                if (inst.id === "startDate") {
                    var startDate = $("#startDate").datepicker("getDate");
                    var endDate = new Date(startDate.setDate(startDate.getDate() + 7));
                    var endDateStr = formatDate(endDate);

                    $("#endDate").datepicker("setDate", endDateStr);
                } else {
                    var endDate = $("#endDate").datepicker("getDate");
                    var startDate = new Date(endDate.setDate(endDate.getDate() - 5));
                    var startDateStr = formatDate(startDate);

                    $("#startDate").datepicker("setDate", startDateStr);
                }
            }
        }
    });

    //------------------------General Function------------------------
    window.mobilecheck = function() {
      var check = false;
      (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
      return check;
    };

    function callAPI(headerData, requestAction, successCallback, failCallback, queryStr) {
        queryStr = queryStr || "";

        var headers = {
            'content-type': 'application/json; charset=utf-8',
            'app-key': appKey,
            'emp-no': window.loginData["empNO"]
        };

        $.each(headerData, function(key, val){
            headers[key] = val;
        });

        $.ajax({
            type: "GET",
            headers: headers,
            url: serverURL + "/" + appApiPath + "/public/v101/qplay/" + requestAction + "?lang=" + browserLanguage + queryStr,
            dataType: "json",
            cache: false,
            timeout: 30000,
            success: successCallback,
            error: failCallback
        });
    }

    function padLeft(str, length) {
        str = str.toString();

        if (str.length >= length) {
            return str;
        } else {
            return padLeft("0" + str, length);
        }
    }

    Date.prototype.TimeZoneConvert = function() {
        var timeZoneOffset = new Date().getTimezoneOffset();
        var timeZoneFixHour = timeZoneOffset / -60;
        var timeZoneFixSecond = timeZoneFixHour * 60 * 60;

        var dateStrTimestamp = this.getTime();
        var fixedDateStrTimestamp = dateStrTimestamp + timeZoneFixSecond;
        var fixedDateStr = new Date(fixedDateStrTimestamp);

        return fixedDateStr.getFullYear() + "/" + padLeft(parseInt(fixedDateStr.getMonth() + 1, 10), 2) + "/" + padLeft(fixedDateStr.getUTCDate(), 2) + " " +
            padLeft(fixedDateStr.getHours(), 2) + ":" + padLeft(fixedDateStr.getMinutes(), 2) + ":" + padLeft(fixedDateStr.getSeconds(), 2);
    };

    function formatDate(date) {
        return date.getFullYear() + "/" + padLeft(parseInt(date.getMonth() + 1, 10), 2) + "/" + padLeft(date.getUTCDate(), 2);
    }

    function displayDatetime(timestamp) {
        var datetime = new Date();
        datetime.setTime(timestamp * 1000);
        
        var fullString = datetime.TimeZoneConvert();
        var displayString = fullString.replace(/ /g, "<br>");

        return displayString.substring(0, displayString.length - 3);
    }

    function message(action, title, redirect) {
        redirect = redirect || "";

        if (action == "open") {
            $(".message-mask .message .title").html(title);
            $(".message-mask").css("display", "flex");

            if (redirect != "") {
                $(".message-mask .message").data("changePage", redirect);
            }
        } else {
            $(".message-mask").hide();

            if (!($(".message-mask .message").data("changePage") === undefined)) {
                changePage($(".message-mask .message").data("changePage"));
                $(".message-mask .message").removeData("changePage");
            }
        }
    }

    function messageInfo(action, title) {
        if (action == "open") {
            $(".message-info .message .title").html(title);
            $(".message-info").show()
        } else {
            $(".message-info").hide();
        }
    }

    function changePage(pageID) {
        if (pageID == "viewLogin") {
            var change = true;
        } else if (pageID != "viewLogin" && checkLogin()) {
            var change = true;
        } else {
            var change = false;
        }

        if (change) {
            if (window.mobilecheck()) {
                $.mobile.changePage("#" + pageID);
            } else {
                $(".page").hide();
                $(".page").removeClass("ui-page-active");
                $("#" + pageID).addClass("ui-page-active");
                $("#" + pageID).show();
            }
        }
    }

    function checkLogin() {
        if ($.isEmptyObject(window.loginData)) {
            return false;
        } else {
            return true;
        }
    }

    function logout() {
        message("close", "");
        window.loginData = {};

        clearInterval(window.checkout);
        window.checkout = null;

        changePage("viewLogin");
    }

    function initialAPP() {
        //Do not remember input data
        $("input").val("");

        var isMobile = window.mobilecheck();
        if (isMobile) {
            $("#viewRecord .record-content .record-body > .record").remove();
        } else {
            $("#viewRecord .record-content .record-table.desktop tbody > tr").remove();
        }

        //Set Datepicker
        var todayDate = new Date();
        var endDateStr = formatDate(todayDate);

        var startDate = new Date(todayDate.setDate(todayDate.getDate() - 6));
        var startDateStr = formatDate(startDate);

        $("#startDate").datepicker("setDate", startDateStr);
        $("#endDate").datepicker("setDate", endDateStr);
    }
    initialAPP();

    //------------------------General Event------------------------
    //Modify UI
    function modifyUI() {
        if (window.mobilecheck()) {

            $(".page").css("opacity", 0);

            setTimeout(function() {
                var screenHeight = document.documentElement.clientHeight;

                //Page
                $(".page").each(function(index, dom) {
                    if ($(dom).prop("id") == "viewRecord") {
                        $(dom).find(".main").css("margin-top", "26px");
                    } else {
                        var contentHeight = $(dom).find(".main").height();
                        var contentMarginTop = parseInt((screenHeight - contentHeight) / 2, 10);
                        $(dom).find(".main").css("margin-top", contentMarginTop + "px");
                    }
                });

                //Message
                var contentHeight = $(".message").height();
                var contentMarginTop = parseInt((screenHeight - contentHeight) / 2, 10);
                $(".message").css("margin-top", contentMarginTop + "px");

                //Hide number-content
                $("#viewRecord .number-content").hide();

                //Switch Record UI
                $("#viewRecord .mobile").show();
                $("#viewRecord .desktop").hide();

                //Set CSS
                $(".page").css({
                    "opacity": 1,
                    "min-height": screenHeight + "px"
                });

                //Page Event
                changePage("viewLogin");
            }, 100);
        } else {
            //Switch Record UI
            $("#viewRecord .mobile").hide();
            $("#viewRecord .desktop").show();

            //Page Event
            $("#viewLogin").page();
            $("#viewChangePwd").page();
            $("#viewRecord").page();

            //Page
            $(".page").each(function(index, dom) {
                $(dom).css({
                    "min-height": document.documentElement.clientHeight + "px",
                    "padding-top": 0
                });
            });

            changePage("viewLogin");
        }
    }
    modifyUI();

    //Mask
    $(document).on("click", ".mask", function() {
        if ($(this).css("display") != "none") {
            if ($(".ui-datepicker").css("display") != "none") {
                $(this).hide();
            }
        }
    });

    //Re-Count checkTimeOut
    if (window.mobilecheck()) {
        $(document).on({
            tap: function() {
                window.checkTimeOut = 1;
            },
            vmousemove: function() {
                window.checkTimeOut = 1;
            }
        }, "html");
    } else {
        $(document).on("mousemove", "html", function() {
            window.checkTimeOut = 1;
        });
    }

    //message window
    $(document).on("click", "#closeMessage", function() {
        message("close", "");
    });

    //Check orientation
    $(window).on("orientationchange", function(event) {
        setTimeout(function() {

            if (event.orientation === "landscape") {
                var divisor = 3;
                $(".page").css("opacity", 0);
                message("open", "不支援橫向操作");
            } else {
                var divisor = 2;
                $(".page").css("opacity", 1);
                message("close", "");
            }

            //Message
            var contentHeight = $(".message").height();
            var contentMarginTop = parseInt((document.documentElement.clientHeight - contentHeight) / divisor, 10);
            $(".message").css("margin-top", contentMarginTop + "px");

        }, 200);
    });

    //------------------------Page Event------------------------
    //viewLogin
    $("#viewLogin").on("pageshow", function(event, ui) {
        if (checkLogin()) {
            changePage("viewRecord");
        }

        modifyUI();
    });

    function loginQPayWeb (tradePwd) {
        (function(tradePwd) {

            var headerData = {
                "trade-pwd": tradePwd
            };

            var successCallback = function(data) {
                var resultCode = data["result_code"];

                if (resultCode === 1) {
                    $("#empNumber").html(window.loginData["empNO"]);
                    $("#pointNow").html(data["point_now"]);

                    window.loginData["signature"] = data["signature"];
                    window.loginData["signatureTime"] = data["signature_time"];
                    window.loginData["token"] = data["token"];
                    window.loginData["tokenValid"] = data["token_valid"];

                    window.checkout = setInterval(function() {
                        if (checkTimeOut >= timeOutForAction) {
                            logout();
                        } else {
                            checkTimeOut += 5;
                        }
                    }, 5000);

                    initialAPP();
                    changePage("viewRecord");
                    $("#viewRecord .number-content").hide();
                } else {
                    message("open", data["message"]);
                }
            };

            var failCallback = function(data) {};

            callAPI(headerData, "loginQPayWeb", successCallback, failCallback, "");

        }(tradePwd));
    };

    function logoutQPayWeb() {
        (function() {

            var headerData = {
                "signature": window.loginData["signature"],
                "signature-time": window.loginData["signatureTime"],
                "token": window.loginData["token"],
                "token-valid": window.loginData["tokenValid"]
            };

            var successCallback = function(data) {
                console.log(data);
                var resultCode = data["result_code"];

                if (resultCode === 1) {
                    logout();
                } else if (resultCode === "999008") {
                    logout();
                } else {
                    message("open", data["message"]);
                }
            };

            var failCallback = function(data) {};

            callAPI(headerData, "logoutQPayWeb", successCallback, failCallback, "");

        }());
    }

    function checkLoginData() {
        var empNo = $("#empNo").val();
        var tradePwd = $("#tradePwd").val();

        if (empNo.length == 0 || tradePwd.length == 0) {
            message("open", "欄位皆為必填");
        } else if (tradePwd.length != 4) {
            message("open", "密碼長度為4位數");
        } else {
            window.loginData["empNO"] = empNo;
            loginQPayWeb(tradePwd);
        }
    }

    $(document).on("click", "#login", function() {
        checkLoginData();
    });

    $(document).on("keyup", "#empNo", function(event) {
        if (event.keyCode === 13) {
            $("#tradePwd").focus();
        }
    });

    $(document).on("keyup", "#tradePwd", function(event) {
        if (event.keyCode === 13) {
            checkLoginData();
        }
    });

    //viewChangePwd
    $("#viewChangePwd").on("pageshow", function(event, ui) {
        if (!checkLogin()) {
            changePage("viewLogin");
        } else {
            var screenHeight = document.documentElement.clientHeight;
            var contentHeight = $(this).find(".main").height();
            var contentMarginTop = parseInt((screenHeight - contentHeight) / 2, 10);
            $(this).find(".main").css("margin-top", contentMarginTop + "px");
        }
    });

    function changeTradePwdForWeb(oldPwd, newPwd) {
        (function(oldPwd, newPwd) {

            var headerData = {
                "signature": window.loginData["signature"],
                "signature-time": window.loginData["signatureTime"],
                "token": window.loginData["token"],
                "token-valid": window.loginData["tokenValid"],
                "old-trade-pwd": oldPwd,
                "new-trade-pwd": newPwd
            };

            var successCallback = function(data) {
                var resultCode = data["result_code"];

                if (resultCode === 1) {
                    message("open", "交易密碼修改成功", "viewRecord");
                    $("#viewChangePwd input").val("");
                } else if (resultCode === "999008") {
                    logout();
                } else {
                    message("open", data["message"]);
                }
            };

            var failCallback = function(data) {};

            callAPI(headerData, "changeTradePwdForWeb", successCallback, failCallback, "");

        }(oldPwd, newPwd));
    }

    function checkPwdData() {
        var oldPwd = $("#oldPwd").val();
        var newPwd = $("#newPwd").val();
        var newPwd2 = $("#newPwd2").val();

        if (oldPwd.length == 0 || newPwd.length == 0 || newPwd2.length == 0) {
            message("open", "欄位皆為必填");
        } else if (!($.isNumeric(oldPwd)) || !($.isNumeric(newPwd)) || !($.isNumeric(newPwd2))) {
            message("open", "密碼為4位數的數字");
        } else if (oldPwd == newPwd) {
            message("open", "新密碼和舊密碼相同");
        } else if (newPwd != newPwd2) {
            message("open", "兩次新密碼的輸入不一致");
        } else {
            changeTradePwdForWeb(oldPwd, newPwd);
        }
    }

    $(document).on("click", "#actionBack", function() {
        changePage("viewRecord");
    });

    $(document).on("click", "#changePwd", function() {
        checkPwdData();
    });

    $(document).on("keyup", "#oldPwd", function(event) {
        if (event.keyCode === 13) {
            $("#newPwd").focus();
        }
    });

    $(document).on("keyup", "#newPwd", function(event) {
        if (event.keyCode === 13) {
            $("#newPwd2").focus();
        }
    });

    $(document).on("keyup", "#newPwd2", function(event) {
        if (event.keyCode === 13) {
            checkPwdData();
        }
    });

    //viewRecord
    $("#viewRecord").on("pageshow", function(event, ui) {
        if (!checkLogin()) {
            changePage("viewLogin");
        }
    });

    function tradeRecordQPayWeb(startTimestamp, endTimestamp) {
        (function(startTimestamp, endTimestamp) {

            var headerData = {
                "signature": window.loginData["signature"],
                "signature-time": window.loginData["signatureTime"],
                "token": window.loginData["token"],
                "token-valid": window.loginData["tokenValid"]
            };

            var queryStr = "&start_date=" + startTimestamp + "&end_date=" + endTimestamp;

            var successCallback = function(data) {
                var resultCode = data["result_code"];

                if (resultCode === 1) {
                    tradeRecordView(data["content"]["trade_record"]);
                } else if (resultCode === "999008") {
                    logout();
                } else {
                    message("open", data["message"]);
                }
            };

            var failCallback = function(data) {};

            callAPI(headerData, "tradeRecordQPayWeb", successCallback, failCallback, queryStr);

        }(startTimestamp, endTimestamp));
    }

    function tradeRecordView(recordData) {
        var isMobile = window.mobilecheck();

        if (isMobile) {
            $("#viewRecord .record-content .record-body > .record").remove();
            var recordHTML = $("template#tplRecordMobile").html();
        } else {
            $("#viewRecord .record-content .record-table.desktop tbody > tr").remove();
            var recordHTML = $("template#tplRecordDesktop").html();
        }

        if (recordData.length == 0) {
            $("#viewRecord .number-content").hide();
            message("open", "查無資料");
        } else {
            for (var i=0; i<recordData.length; i++) {
                var record = $(recordHTML);
                var displayName = "";
                var pointSymbol = "";
                var displayNote = "";

                if (recordData[i]["trade_type"] == "store") {
                    displayName = recordData[i]["point_type_name"];
                    pointSymbol = "+";
                } else if (recordData[i]["trade_type"] == "trade") {
                    displayName = recordData[i]["shop_name"];

                    if (recordData[i]["trade_success"] == "N") {
                        continue;
                    }

                    //Check if is [cancel trade]
                    if (recordData[i]["cancel_trade"] == "Y") {
                        pointSymbol = "+";
                        displayNote = "退款:" + recordData[i]["cancel_reason"];

                        record.find(".column-4 .info-icon").prop("title", displayNote);
                        record.find(".column-4 .info-icon").css("opacity", 1);
                    } else {
                        pointSymbol = "-";

                        if (isMobile) {
                            record.find(".column-4 .point-number").removeClass("point-add");
                        } else {
                            record.find(".column-4").removeClass("point-add");
                        }
                    }
                }

                record.find(".column-1 .shop-point").html(displayName);
                record.find(".column-2").html(recordData[i]["trade_id"]);
                record.find(".column-3 .datetime").html(displayDatetime(recordData[i]["trade_time"]));
                record.find(".column-4 .point-number").html(pointSymbol + recordData[i]["trade_point"]);

                if (isMobile) {
                    $("#viewRecord .record-content .record-body").append(record);
                } else {
                    $("#viewRecord .record-content .record-table.desktop tbody").append(record);

                    if ((i + 1) == recordData.length) {
                        $("#viewRecord .number-content").show();
                        pageNumberView("prev", 1);
                    }
                }
            }
        }
    }

    function pageNumberView(action, number) {
        number = number || null;

        var dataCount = $("#viewRecord .record-content .record-table.desktop tbody tr").length;
        var pageDataNumber = 10;
        var pageTotal = Math.ceil(dataCount / pageDataNumber);

        if (action == "prev") {
            if (window.pageNow != 1) {
                window.pageNow--;
            }
        } else if (action == "next") {
            if (window.pageNow != pageTotal) {
                window.pageNow++;
            }
        }

        //Page Number
        $("#pageNow").html(window.pageNow);
        $("#pageTotal").html(pageTotal);

        //Arrow
        if (window.pageNow == 1) {
            $("#btnPre").hide();
            $("#btnPreDis").show();
            $("#btnNext").show();
            $("#btnNextDis").hide();
        } else if (window.pageNow == pageTotal) {
            $("#btnPre").show();
            $("#btnPreDis").hide();
            $("#btnNext").hide();
            $("#btnNextDis").show();
        } else {
            $("#btnPre").show();
            $("#btnPreDis").hide();
            $("#btnNext").show();
            $("#btnNextDis").hide();
        }

        //Data Content
        var dataStart = (window.pageNow - 1) * pageDataNumber + 1;
        var dataEnd = window.pageNow * pageDataNumber;

        $("#viewRecord .record-content .record-table.desktop tbody tr").each(function(index, dom) {
            if (((index + 1) >= dataStart) && ((index + 1) <= dataEnd)) {
                $(dom).show();
            } else {
                $(dom).hide();
            }
        });
    }

    $(document).on("click", "#actionChangePwd", function() {
        changePage("viewChangePwd");
    });

    $(document).on("click", "#actionLogout", function() {
        logoutQPayWeb();
    });

    $(document).on("click", "#search", function() {
        var startDate = $("#startDate").val();
        var endDate = $("#endDate").val();
        var startTimestamp = parseInt(new Date(startDate + " 00:00:00").getTime() / 1000, 10);
        var endTimestamp = parseInt(new Date(endDate + " 23:59:59").getTime() / 1000, 10);

        if (startDate.length == 0 || endDate.length == 0) {
            message("open", "請選擇日期");
        } else if (endTimestamp < startTimestamp) {
            message("open", "日期區間不正確");
        } else {
            tradeRecordQPayWeb(startTimestamp, endTimestamp);
        }
    });

    $(document).on("click", "#btnPre", function() {
        pageNumberView("prev");
    });

    $(document).on("click", "#btnNext", function() {
        pageNumberView("next");
    });

    $(document).on("click", ".info-icon", function() {
        var isMobile = window.mobilecheck();
        if (isMobile) {
            messageInfo("open", $(this).prop("title"));
        }
    });

    $(document).on("click", ".message-info .close", function() {
        var isMobile = window.mobilecheck();
        if (isMobile) {
            messageInfo("close", "");
        }
    });
});
