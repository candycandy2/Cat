$("#viewStaffUserMain").pagecontainer({
    create: function(event, ui) {

        var imgURL = '/widget/widgetPage/viewStaffUserMain/img/',
            forumKey = 'appqforum',
            forumSecret = 'c40a5073000796596c2ba5e70579b1e6';

        function getBoardType() {
            var self = this;

            var queryData = "<LayoutHeader><emp_no>" +
                loginData["emp_no"] + "</emp_no><source>appempservicedev</source></LayoutHeader>";

            this.successCallback = function(data) {
                console.log(data);
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPIByKey("POST", true, forumKey, forumSecret, "getBoardList", self.successCallback, self.failCallback, queryData, "", 60 * 60, "low");
            }();
        }

        function createXMLDataToString(data) {
            var XMLDataString = "";

            $.each(data, function(key, value) {
                XMLDataString += "<" + key + ">" + htmlspecialchars(value) + "</" + key + ">";
            });

            return XMLDataString;
        }

        /********************************** page event ***********************************/
        $("#viewStaffUserMain").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewStaffUserMain").one("pageshow", function(event, ui) {
            var mainHeight = window.sessionStorage.getItem('pageMainHeight');
            $('#viewStaffUserMain .page-main').css('height', mainHeight);

            $('.tea-user-photo').attr('src', serverURL + imgURL + 'default_photo.png');
            $('.tea-user-name').text(loginData['loginid']);
            $('.tea-user-today').text(new Date().toLocaleDateString(browserLanguage, {month: 'long', day: 'numeric', weekday:'long'}));

            $('.need-cup').attr('src', serverURL + imgURL + 'radio_true.png');
            $('.need-water').attr('src', serverURL + imgURL + 'radio_false.png');

            $('.subtract').attr('src', serverURL + imgURL + 'subtraction_gray.png');
            $('.add').attr('src', serverURL + imgURL + 'addition_blue.png');
            $('.room-refresh').attr('src', serverURL + imgURL + 'loading.png');
            //
            getBoardType();
        });

        $("#viewStaffUserMain").on("pageshow", function(event, ui) {
            
        });

        $("#viewStaffUserMain").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/
        

    }
});