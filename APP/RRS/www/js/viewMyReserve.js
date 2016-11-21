$(document).one("pagecreate", "#viewMyReserve", function() {

    var myReserveData = {};
    var date = new Date();

    $("#viewMyReserve").pagecontainer({
        create: function(event, ui) {

            /********************************** function *************************************/
            function myReserveHTML(index, BeginTime, EndTime, room) {
                return '<div class="ui-btn ui-shadow ui-corner-all ui-margin-10"><div class="ui-grid-b">'
                        +   '<div class="ui-block-a ui-padding-8 col-5"><h1 class="ui-benq-color">' + room + ' - ' + room + '</h1></div'
                        +   '<div class="ui-block-b col-3"><h1 class="ui-benq-color">' + room + '</h1></div>'
                        +   '<div class="ui-block-c col-2"><a href="#Cancel" value="' + index.toString() + '" name="cancelIndex" class="btn-benq ui-btn ui-shadow ui-corner-all">取消</a></div>'
                        + '</div></div>';
            }

            function queryMyReserve() {

                var self = this;

                this.successCallback = $.getJSON('../js/MyReserve', function(data) {

                    myReserveData = data['content'];
                    // var asc = 'asc';
                    // sortResults('ReserveDate', asc);

                    if (data['result_code'] === "1") {

                        var htmlContent = "";

                        // today
                        if (data['ReserveDate'] == date.yyyymmdd()) {

                            for (var i = 0; i < data['Content'].length; i++) {

                                var content = htmlContent + myReserveHTML(
                                    data['Content'][i].ReserveTraceAggID, 
                                    data['Content'][i].ReserveBeginTime, 
                                    data['Content'][i].ReserveEndTime, 
                                    data['Content'][i].MeetingRoomName);

                                htmlContent = content;
                            }

                            $("#myReserve").html(htmlContent).enhanceWithin();

                        }

                    } else {
                        //ResultCode = 001901, [no data]
                    }
                });

                this.failCallback = function(data) {};

                // var __construct = function() {
                //     QPlayAPI("POST", "QueryMyPhoneBook", self.successCallback, self.failCallback, queryData);
                // }();

            }

            /********************************** page event *************************************/
            $("#viewMyReserve").on("pagebeforeshow", function(event, ui) {
                // loadingMask("show");
                queryMyReserve();
            });

            /********************************** dom event *************************************/
            function sortResults(prop, asc) {
                myReserveData = myReserveData.sort(function(a, b) {
                    if (asc) return (a[prop] > b[prop]);
                    else return (b[prop] > a[prop]);
                });
            }

            Date.prototype.yyyymmdd = function() {
                var yyyy = this.getFullYear().toString();
                var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based 
                var dd = this.getDate().toString();
                return yyyy + "/" + (mm[1] ? mm : "0" + mm[0]) + "/" + (dd[1] ? dd : "0" + dd[0]); // padding 
            };
        }
    });

});
