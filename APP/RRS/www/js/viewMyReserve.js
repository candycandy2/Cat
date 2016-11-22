    $(document).one("pagecreate", "#viewMyReserve", function() {

        var dict = {
            "1": "(一)",
            "2": "(二)",
            "3": "(三)",
            "4": "(四)",
            "5": "(五)"
        };

        $("#viewMyReserve").pagecontainer({
            create: function(event, ui) {

                /********************************** function *************************************/

                function queryMyReserve() {

                    var self = this;

                    this.successCallback = $.getJSON('../js/MyReserve', function(data) {

                        if (data['result_code'] === "1") {

                            var htmlContent_today = "";
                            var htmlContent_other = "";

                            sortResults(data['content'], 'ReserveDate', 'asc');

                            for (var i = 0, item; item = data['content'][i]; i++) {
                                if (item.ReserveDate == new Date().yyyymmdd()) {

                                    htmlContent_today
                                        += replace_str($('#today').get(0).outerHTML, item);
                                } else {
                                    htmlContent_other
                                        += replace_str($('#other-day').get(0).outerHTML, item);
                                }
                            }

                            $("#today").remove();
                            $("#other-day").remove();
                            $("#today-line").after(htmlContent_today);
                            $("#other-day-line").after(htmlContent_other);

                        } else {
                            //ResultCode = 001901, [no data]
                        }
                    });

                    // this.failCallback = function(data) {};

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
                function replace_str(content, item) {

                    // convert yyyymmdd to yyyy/mm/dd
                    var match = item.ReserveDate.match(/(\d{4})(\d{2})(\d{2})/);
                    var newDateStr = match[2] + '/' + match[3] + '/' + match[1];

                    // convert date format to mm/dd(day of week)
                    var d = new Date(newDateStr);
                    var date_format =
                        d.getMonth() + 1 + '/' +
                        d.getDate() +
                        dict[d.getDay()];

                    return content
                        .replace('Begin', item.ReserveBeginTime)
                        .replace('End', item.ReserveEndTime)
                        .replace('room', item.MeetingRoomName)
                        .replace('index', item.ReserveTraceAggID)
                        .replace('date', date_format);
                }

                function sortResults(data, prop, asc) {
                    data = data.sort(function(a, b) {
                        if (asc) return (a[prop] > b[prop]);
                        else return (b[prop] > a[prop]);
                    });
                }

                Date.prototype.yyyymmdd = function() {
                    var yyyy = this.getFullYear().toString();
                    var mm = (this.getMonth() + 1).toString();
                    var dd = this.getDate().toString();
                    return yyyy + (mm[1] ? mm : "0" + mm[0]) + (dd[1] ? dd : "0" + dd[0]);
                };
            }
        });

    });