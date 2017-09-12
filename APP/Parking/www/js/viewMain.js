
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

        function setDateList() {
            
            $('#scrollDate a[id^=one]').remove();

            var addOneDate = new Date();
            var htmlContentPageOne = '';
            var arrClass = ['a', 'b', 'c', 'd', 'e'];

            var objDate = new Object()
            objDate.date = '';
            objDate.daysOfWeek = '';

            var j = 0;
            var originItemForPageOne = ['reserveDefault', 'ReserveDay', 'ReserveDict', 'disable'];
            /* var isSystemRole = JSON.parse(localStorage.getItem('listAllManager'));

            if (isSystemRole != null) {
                reserveDays = 120;
            } else {
                reserveDays = 14;
            }*/

            for (var i = 0; i < reserveDays; i++) {
                if (i != 0) {
                    addOneDate.addDays(1);
                }
                if (addOneDate.getDay() > 0 && addOneDate.getDay() < 6) {

                    var classId = arrClass[j % 5];
                    objDate.id = addOneDate.yyyymmdd('');
                    objDate.date = addOneDate.mmdd('/');
                    objDate.daysOfWeek = dictDayOfWeek[addOneDate.getDay()];

                    var replaceItemForPageOne = ['one' + objDate.id, objDate.date, objDate.daysOfWeek, ''];

                    htmlContentPageOne
                        += replaceStr($('#reserveDefault').get(0).outerHTML, originItemForPageOne, replaceItemForPageOne);
                }
            }
    
            $('#reserveDefault').before(htmlContentPageOne);
            clickDateId = $('#scrollDate a:first-child').attr('id').replaceAll('one', '');
            $('#scrollDate a:first-child').addClass('hover');
            $('#scrollDate a:first-child').parent().data("lastClicked", $('#scrollDate a:first-child').attr('id'));
            
        }
       

        function checkLocalDataExpired() {
            defaultSiteClick = localStorage.getItem('defaultSiteClick');
            if (defaultSiteClick === null) {
                defaultSiteClick = 92; //default site = 92(BQT/QTT)
            }
        }

        function setAlertLimitSite(site) {
            $("#alertLimitSiteMsg").addClass('disable');
            $("#alertLimitSiteMsg").html('');
            if (site == '92') { //BQT/QTT
                $("#alertLimitSiteMsg").removeClass('disable');
                $("#alertLimitSiteMsg").html('*僅開放關係企業同仁停車');
            } 
        }

        function getInitialData() {
            $("#reserveSite option[value=" + defaultSiteClick + "]").attr("selected", "selected");
        }

        function setInitialData() {
            setAlertLimitSite(defaultSiteClick);
            setDateList();
        }

        /********************************** page event *************************************/
        $("#viewMain").one("pagebeforeshow", function(event, ui) {
            //get last update time check date expired
            checkLocalDataExpired();
            getInitialData();
            setInitialData();

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
