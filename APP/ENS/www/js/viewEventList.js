
$("#viewEventList").pagecontainer({
    create: function(event, ui) {
        
        /********************************** function *************************************/
        window.getEventList = function() {
            
            var self = this;

            this.successCallback = function(data) {
                loadingMask("hide");

                var resultcode = data['ResultCode'];
                //do something
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                //CustomAPI("POST", true, "APIRequest", self.successCallback, self.failCallback, queryData, "");
                loadingMask("hide");
            }();

        };

        /********************************** page event *************************************/
        $("#viewEventList").one("pagebeforeshow", function(event, ui) {
            var tabData = {
                id: "tabEventList",
                navbar: [{
                    href: "reportDiv",
                    text: "通報動態"
                }, {
                    href: "memberDiv",
                    text: "成員"
                }],
                content: [{
                    id: "reportDiv",
                    text: "reportDiv"
                }, {
                    id: "memberDiv",
                    text: "memberDiv"
                }]
            };

            tplJS.Tab("viewEventList", "content", "append", tabData);
        });

        $("#viewEventList").on("pageshow", function(event, ui) {
            
        });

        /********************************** dom event *************************************/
        $(document).on("click", "#tabEventList", function() {

        });

    }
});
