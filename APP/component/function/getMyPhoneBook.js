
//Call API getPhoneBook for yellowpage widget
function getMyPhoneBook(key, secret) {
    var self = this;
    var queryData = '<LayoutHeader><User_EmpID>' + loginData["emp_no"] + '</User_EmpID></LayoutHeader>';

    this.successCallback = function(data) {
        window.sessionStorage.setItem('myPhoneBookList', JSON.stringify(data));
    };

    this.failCallback = function() {};

    var __construct = function() {
        CustomAPIByKey("POST", true, key, secret, "QueryMyPhoneBook", self.successCallback, self.failCallback, queryData, "", 60 * 60, "low");
    }();
}