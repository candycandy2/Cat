
$("#viewReserve").pagecontainer({
    create: function(event, ui) {
        
        /********************************** function *************************************/
        window.APIRequest = function() {
            
            var self = this;

            this.successCallback = function(data) {
                loadingMask("hide");

                var resultcode = data['ResultCode'];
                //do something
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                //CustomAPI("POST", true, "APIRequest", self.successCallback, self.failCallback, queryData, "");
            }();

        };

        /********************************** page event *************************************/
        $("#viewReserve").on("pagebeforeshow", function(event, ui) {
            $('#pageOne').show();
            $('#pageTwo').hide();
            $('#pageThree').hide();
        });

        /********************************** dom event *************************************/
        $('#reserveTab').change(function() {
            var tabValue = $("#reserveTab :radio:checked").val();
            if (tabValue == 'tab1') {
                console.log('tab1');
                $('#pageOne').show();
                $('#pageTwo').hide();
                $('#pageThree').hide();
                // reserveBtnDefaultStatus();
            } else if (tabValue == 'tab2'){
                console.log('tab2');
                $('#pageTwo').show();
                $('#pageOne').hide();
                $('#pageThree').hide();
            }
            else{
                console.log('tab3');
                $('#pageThree').show();
                $('#pageOne').hide();
                $('#pageTwo').hide();
            }
        });


        function test(){
            if (meetingRoomLocalData === null || checkDataExpired(meetingRoomLocalData['lastUpdateTime'], 7, 'dd')) {
                var doAPIListAllTime = new getAPIListAllTime();
            } else {
                arrTimeBlockBySite = JSON.parse(localStorage.getItem('allTimeLocalData'))['content'];
            }
        }
    }
});
