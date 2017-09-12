
var defaultSiteClick = '';

$("#viewMain").pagecontainer({
    create: function(event, ui) {
        //page init
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

        function checkLocalDataExpired() {

            defaultSiteClick = localStorage.getItem('defaultSiteClick');
            if (defaultSiteClick === null) {
                defaultSiteClick = 92; //default site = 92(BQT/QTT)
            }
        }

        function setAlertLimitSite(site) {
            $("#alertLimitRoomMsg").addClass('disable');
            $("#alertLimitRoomMsg").html('');
            if (site == '92') { //BQT/QTT
                $("#alertLimitRoomMsg").removeClass('disable');
                $("#alertLimitRoomMsg").html('*僅開放關係企業同仁停車');
            } 
        }

        function getInitialData() {
            $("#reserveSite option[value=" + defaultSiteClick + "]").attr("selected", "selected");

        }

        

        /********************************** page event *************************************/
        $("#viewMain").on("pagebeforeshow", function(event, ui) {
            //get last update time check date expired
            checkLocalDataExpired();


            $('#pageOne').show();
            $('#pageTwo').hide();
        });

        /********************************** dom event *************************************/
        $('#viewMain').keypress(function(event) {

        });

        $('#reserveSite').change(function() {
            localStorage.setItem('defaultSiteClick', $(this).val());
            var selectedSite = $('#reserveSite').find(":selected").val();
            setAlertLimitSite(selectedSite);
        });
    }
});
