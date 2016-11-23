$(document).one('pagecreate', '#viewNewSetting', function() {

    $('#viewNewSetting').pagecontainer({
        create: function(event, ui) {

            /********************************** function *************************************/

            function queryNewSetting(value) {

                var self = this;

                this.successCallback = $.getJSON('../js/ListAllMeetingRoom', function(data) {

                    if (data['result_code'] === '1') {

                        //filter RoomSite data
                        var filterData = $.grep(data.content, function(element, index) {
                            return element.MeetingRoomSite == value;
                        });

                        // distinct floor data
                        var distinctData = $.unique(filterData.map(function(d) {
                            return d.MeetingRoomFloor;
                        }));

                        // console.log(distinctData);

                        distinctData.sort();

                        var htmlContent = '';
                        var arrClass = ['b', 'c', 'a'];

                        for (var i = 0, item; item = distinctData[i]; i++) {
                            var j = i % 3;
                            htmlContent
                                += replace_str($('#default').get(0).outerHTML, item, arrClass[j]);

                        }

                        $('#default').after(htmlContent);
                        $('#default div').addClass('ui-btn-active');

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
            $('#viewNewSetting').on('pagebeforeshow', function(event, ui) {
                // loadingMask("show");
                queryNewSetting('1');
            });

            /********************************** dom event *************************************/
            var cntClick = 0;

            $('#Site').change(function() {
                cntClick = 0;
                $('#default div').removeClass('ui-btn-active');
                $('#default').nextAll().remove();
                queryNewSetting($(this).val());
            });

            var seqClick = [];

            $('body').on('click', '.ui-bar', function() {

                var id = $(this).parent().attr('id');

                if (id == 'default') {
                    seqClick = [];
                    $('#default div').addClass('ui-btn-active');
                    $('#default').nextAll().find('.ui-bar').removeClass('ui-btn-active');
                    $('div[id*=cntIcon]').remove();

                } else {
                    if ($(this).hasClass('ui-btn-active')) {
                        seqClick.splice(seqClick.indexOf(id), 1);
                        $(this).removeClass('ui-btn-active');
                        $(this).find('#cntIcon').remove();

                    } else {
                        seqClick.push(id);
                        $('#default div').removeClass('ui-btn-active');
                        $(this).addClass('ui-btn-active');
                        $(this).append('<div id=cntIcon class=btn-benq></div>');
                    }
                }

                if (seqClick.length() == 0) {
                    $('#default div').addClass('ui-btn-active');
                } else {
                    seqClick.each(function(i, obj) {
                        $('#grid-select').find('#' + seqClick[i]).text();
                    });
                }
            });

            function replace_str(content, item, classid) {
                return content
                    .replace('不限', item + 'F')
                    .replace('default', item)
                    .replace('ui-block-a', 'ui-block-' + classid)
            }

        }
    });

});
