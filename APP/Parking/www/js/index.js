var pageList = ["viewMain"];
var htmlContent = '';
var dictDayOfWeek = {
    '1': '(一)',
    '2': '(二)',
    '3': '(三)',
    '4': '(四)',
    '5': '(五)',
    '6': '(六)',
    '0': '(日)'
};
var reserveDays = 14;

window.initialSuccess = function() {
    myEmpNo = localStorage["emp_no"];
    //loadingMask("show");
    $.mobile.changePage('#viewMain');
    if (device.platform === "iOS") {
        $('.page-main').css({'padding-top': '0.1vw'});
    }
}

function getAPIListAllManager() {
    loadingMask('show');
    var self = this;
    var queryData = {};

    this.successCallback = function(data) {
        if (data['ResultCode'] === "1") {
            //save to local data
            localStorage.removeItem('listAllManager');
            var jsonData = {};

            var tempContent = data['Content'].filter(function(item) {
                return item.EmpNo.trim() === loginData['emp_no'];
            });

            jsonData = {
                lastUpdateTime: new Date(),
                content: tempContent
            };

            localStorage.setItem('listAllManager', JSON.stringify(jsonData));
            loadingMask('hide');

        } else {
            loadingMask('hide');
            popupMsg('reservePopupMsg', 'apiFailMsg', '', '請確認網路連線', '', false, '確定', false);
        }
    };

    var __construct = function() {
        CustomAPI("POST", false, "ListAllManager", self.successCallback, self.failCallback, queryData, "");
    }();
}