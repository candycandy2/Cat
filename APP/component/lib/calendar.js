/**
 * Calendar
 *
 * Dependencies
 * - jQuery (2.0.3)
 * - Twitter Bootstrap (3.0.2)
 */
if (typeof jQuery == 'undefined') {
    throw new Error('jQuery is not loaded');
}
/**
 * Create calendar
 *
 * @param options
 * @returns {*}
 */
function Calendar(options) {
    var $calendarElement, _id, _year, _month, _nextyear, _infoData;
    var _showInfoList = false;
    var opts = $.extend({}, calendar_defaults(), options);
    var languageSettings = calendar_language(opts.language);
    opts = $.extend({}, opts, languageSettings);

    if(opts.renderTo !== undefined) {
        $calendarElement = $(opts.renderTo);
    }else {
        throw new Error("Calendar must be rendered to the specific element!");
    }

    if(opts.id !== "calendar_ID") {
        _id = opts.id; 
    }else {
        throw new Error("There isn't an id in this Calendar!");
    }

    if(opts.showInfoListTo !== undefined) {
        _showInfoList = true;
        if(opts.infoData !== undefined) {
            _infoData = opts.infoData;
        }else {
            throw new Error("You must assign the infoData for this calendar.");       
        }
    }

    $calendarElement.attr('id', _id);
    $calendarElement.addClass("QPlayCalendar");

    $calendarElement.data('initYear', opts.year);
    $calendarElement.data('initMonth', opts.month);
    $calendarElement.data('monthLabels', opts.month_labels);
    $calendarElement.data('weekStartsOn', opts.weekstartson);
    $calendarElement.data('navIcons', opts.nav_icon);
    $calendarElement.data('dowLabels', opts.dow_labels);
    $calendarElement.data('showToday', opts.markToday);
    $calendarElement.data('showWeekend', opts.markWeekend);
    $calendarElement.data('showDays', opts.show_days);
    $calendarElement.data('showPrevious', opts.show_previous);
    $calendarElement.data('showNext', opts.show_next);
    $calendarElement.data('changeDateEventListener', opts.changeDateEventListener);
    $calendarElement.data('cellBorder', opts.cell_border);
    $calendarElement.data('jsonData', opts.data);
    $calendarElement.data('ajaxSettings', opts.ajax);
    $calendarElement.data('legendList', opts.legend);
    $calendarElement.data('actionFunction', opts.action);
    $calendarElement.data('actionNavFunction', opts.action_nav);
    $calendarElement.data('showNextyear', opts.showNextyear);

    var changeDateEventListener = $calendarElement.data('changeDateEventListener');

    drawCalendar();
    
    function drawCalendar() {
        var dateInitYear = parseInt($calendarElement.data('initYear'));
        var dateInitMonth = parseInt($calendarElement.data('initMonth')) - 1;
        var dateInitObj = new Date(dateInitYear, dateInitMonth, 1, 0, 0, 0, 0);
        
        _year = dateInitObj.getFullYear();
        _month = dateInitObj.getMonth();
        _nextyear = _year + 1;

        $calendarElement.data('initDate', dateInitObj);

        $tableObj = $('<table class="table"></table>');
        
        $tableObj = drawTable($calendarElement, $tableObj, dateInitObj.getFullYear(), dateInitObj.getMonth());
        $legendObj = drawLegend($calendarElement);
        $dateScroller = prependMonthHeader($calendarElement, $tableObj, dateInitObj.getFullYear(), dateInitObj.getMonth());
        
        $calendarElement.append($dateScroller);
        $calendarElement.append($legendObj);
        $calendarElement.append($tableObj);
        
        var jsonData = $calendarElement.data('jsonData');
        if (false !== jsonData) {
            checkEvents($calendarElement, dateInitObj.getFullYear(), dateInitObj.getMonth());
        }

        if(_showInfoList) {
            if(_infoData[_year][_month]["status"] == 1) {
                showCalendarHolidayInfo(_year, _month);
            }else {
                $(opts.showInfoListTo).hide();
            }
        }
        if ($calendarElement.data("showNextyear") == false && _month == 11) {
            $("#" + _id + " #right-navigation").css("opacity", "0");
        }
        if (_month == 0) {
            $("#" + _id + " #left-navigation").css("opacity", "0");
        }
    }

    function drawTable($calendarElement, $tableObj, year, month) {
        var dateCurrObj = new Date(year, month, 1, 0, 0, 0, 0);
        $calendarElement.data('currDate', dateCurrObj);

        $tableObj.empty();
        $tableObj = appendDayOfWeekHeader($calendarElement, $tableObj);
        $tableObj = appendDaysOfMonth($calendarElement, $tableObj, year, month);
        checkEvents($calendarElement, year, month);
        return $tableObj;
    }

    function drawLegend($calendarElement) {
        var $legendObj = $('<div class="legend" id="' + $calendarElement.attr('id') + '-legend"></div>');
        var legend = $calendarElement.data('legendList');
        if (typeof(legend) == 'object' && legend.length > 0) {
            $(legend).each(function (index, item) {
                if (typeof(item) == 'object') {
                    if ('type' in item) {
                        var itemLabel = '';
                        if ('label' in item) {
                            itemLabel = item.label;
                        }

                        switch (item.type) {
                            case 'text':
                                if (itemLabel !== '') {
                                    var itemBadge = '';
                                    if ('badge' in item) {
                                        if (typeof(item.classname) === 'undefined') {
                                            var badgeClassName = 'badge-event';
                                        } else {
                                            var badgeClassName = item.classname;
                                        }
                                        itemBadge = '<span class=' + badgeClassName + '>' + item.badge + '</span> ';
                                    }
                                    $legendObj.append('<span class="legend-' + item.type + '">' + itemBadge + itemLabel + '</span>');
                                }
                                break;
                            case 'img-text':
                                if (itemLabel !== '') {
                                    var itemBadge = '';
                                    if ('classname' in item) {
                                        if (typeof(item.classname) === 'undefined') {
                                            var badgeClassName = 'badge-event';
                                        } else {
                                            var badgeClassName = item.classname;
                                        }
                                        itemBadge = '<img class=' + badgeClassName + '>';
                                    }
                                    $legendObj.append('<span class="legend-' + item.type + '">' + itemBadge + itemLabel + '</span>');
                                }
                                break;
                            case 'block':
                                if (itemLabel !== '') {
                                    itemLabel = '<span>' + itemLabel + '</span>';
                                }
                                if (typeof(item.classname) === 'undefined') {
                                    var listClassName = 'event';
                                } else {
                                    var listClassName = 'event-styled ' + item.classname;
                                }
                                $legendObj.append('<span class="legend-' + item.type + '"><ul class="legend"><li class="' + listClassName + '"></li></u>' + itemLabel + '</span>');
                                break;
                            case 'list':
                                if ('list' in item && typeof(item.list) == 'object' && item.list.length > 0) {
                                    var $legendUl = $('<ul class="legend"></u>');
                                    $(item.list).each(function (listIndex, listClassName) {
                                        $legendUl.append('<li class="' + listClassName + '"></li>');
                                    });
                                    $legendObj.append($legendUl);
                                }
                                break;
                            case 'spacer':
                                $legendObj.append('<span class="legend-' + item.type + '"> </span>');
                                break;

                        }
                    }
                }
            });
        }
        return $legendObj;
    }

    function prependMonthHeader($calendarElement, $tableObj, year, month) {
        var navIcons = $calendarElement.data('navIcons');
        var monthLabels = $calendarElement.data('monthLabels');
        var $currMonthLabel = $('<span>' + monthLabels[month] + ' ' + year + '</span>');
        $currMonthLabel.dblclick(function () {
            var dateInitObj = $calendarElement.data('initDate');
            drawTable($calendarElement, $tableObj, dateInitObj.getFullYear(), dateInitObj.getMonth());
        });

        var $currMonthCell = $('<div id="dateTitle"></div>').append($currMonthLabel);
        var $prevMonthNav = $('<span class="calendar-month-navigation"></span>');
        var $nextMonthNav = $('<span class="calendar-month-navigation"></span>');
        if (typeof(navIcons) === 'object') {
            if ('prev' in navIcons) {
                $prevMonthNav.html(navIcons.prev);
            }
            if ('next' in navIcons) {
                $nextMonthNav.html(navIcons.next);
            }
        }

        var prevIsValid = $calendarElement.data('showPrevious');
        if (typeof(prevIsValid) === 'number' || prevIsValid === false) {
            prevIsValid = checkMonthLimit($calendarElement.data('showPrevious'), true);
        }

        $prevMonthNav.addClass($calendarElement.attr('class') + '-navPrev');
        $prevMonthNav.data('navigation', 'prev');
        
        if (prevIsValid !== false) {
            if (typeof($calendarElement.data('actionNavFunction')) === 'function') {
                $prevMonthNav.click($calendarElement.data('actionNavFunction'));
            }
            $prevMonthNav.click(function (e) {
                var enable = false;
                if((_month - 1) >= 0) {
                    _month--;
                    enable = true;
                } else if ($calendarElement.data("showNextyear") == true && _year == _nextyear) {
                    _year--;
                    _month = 11;
                    enable = true;
                }
                if(enable) {
                    drawTable($calendarElement, $tableObj, _year, _month);
                    $("#" + _id + " #right-navigation").css("opacity", "100");
                    $("#" + _id + " #dateTitle span").html(monthLabels[_month] + ' ' + _year);
                    if(_month == 0 && (_year + 1 == _nextyear || $calendarElement.data("showNextyear") == false)) {
                         $("#" + _id + " #left-navigation").css("opacity", "0");
                    }
                    if(_showInfoList) {
                        if(_infoData[_year][_month]["status"] == 1) {
                            showCalendarHolidayInfo(_year, _month);
                        }else {
                            $(opts.showInfoListTo).hide();
                        }
                    }
                    if($calendarElement.data('changeDateEventListener') != undefined) {
                        loadingMask("show");
                        changeDateEventListener(_year, _month + 1);
                    }
                }
            });
        }

        var nextIsValid = $calendarElement.data('showNext');
        if (typeof(nextIsValid) === 'number' || nextIsValid === false) {
            nextIsValid = checkMonthLimit($calendarElement.data('showNext'), false);
        }

        $nextMonthNav.addClass($calendarElement.attr('class') + '-navNext');
        $nextMonthNav.data('navigation', 'next');
        if (nextIsValid !== false) {
            if (typeof($calendarElement.data('actionNavFunction')) === 'function') {
                $nextMonthNav.click($calendarElement.data('actionNavFunction'));
            }
            $nextMonthNav.click(function (e) {
                var enable = false;
                if((_month + 1) <= 11) {
                    _month++;
                    enable = true;
                } else if ($calendarElement.data("showNextyear") == true && ((_year + 1) == _nextyear)) {
                    _year++;
                    _month = 0;
                    enable = true;
                }
                if(enable) {
                    drawTable($calendarElement, $tableObj, _year, _month);
                    $("#" + _id + " #left-navigation").css("opacity", "100");
                    $("#" + _id + " #dateTitle span").html(monthLabels[_month] + ' ' + _year);
                    if(_month == 11 && (_year == _nextyear || $calendarElement.data("showNextyear") == false)) {
                        $("#" + _id + " #right-navigation").css("opacity", "0");
                    }
                    if(_showInfoList) {
                        if(_infoData[_year][_month]["status"] == 1) {
                            showCalendarHolidayInfo(_year, _month);
                        }else {
                            $(opts.showInfoListTo).hide();
                        } 
                    }
                    if($calendarElement.data('changeDateEventListener') != undefined) {
                        loadingMask("show");
                        changeDateEventListener(_year, _month + 1);
                    }
                }
            });
        }

        var $monthHeaderRow = $('<div class="calendar-month-header"></div>').append($prevMonthNav, $currMonthCell, $nextMonthNav);
        return $monthHeaderRow;
    }

    function appendDayOfWeekHeader($calendarElement, $tableObj) {
        if ($calendarElement.data('showDays') === true) {
            var weekStartsOn = $calendarElement.data('weekStartsOn');
            var dowLabels = $calendarElement.data('dowLabels');
            if (weekStartsOn === 0) {
                var dowFull = $.extend([], dowLabels);
                var sunArray = new Array(dowFull.pop());
                dowLabels = sunArray.concat(dowFull);
            }
            var $dowHeaderRow = $('<tr class="calendar-dow-header"></tr>');
            $(dowLabels).each(function (index, value) {
                $day = $("<th></th>");
                if($calendarElement.data('showWeekend') === true) {
                    if(value == "日" || value == "六") {
                        $day.addClass("weekend");
                    }
                }
                $dowHeaderRow.append($day.append(value));
            });
            $tableObj.append($dowHeaderRow);
        }
        return $tableObj;
    }

    function appendDaysOfMonth($calendarElement, $tableObj, year, month) {
        var time = new Date();
        var ajaxSettings = $calendarElement.data('ajaxSettings');
        var weeksInMonth = calcWeeksInMonth(year, month);
        var lastDayinMonth = calcLastDayInMonth(year, month);
        var firstDow = calcDayOfWeek(year, month, 1);
        var lastDow = calcDayOfWeek(year, month, lastDayinMonth);
        var currDayOfMonth = 1;

        var weekStartsOn = $calendarElement.data('weekStartsOn');
        if (weekStartsOn === 0) {
            if (lastDow == 6) {
                weeksInMonth++;
            }
            if (firstDow == 6 && (lastDow == 0 || lastDow == 1 || lastDow == 5)) {
                weeksInMonth--;
            }
            firstDow++;
            if (firstDow == 7) {
                firstDow = 0;
            }
        }

        for (var wk = 0; wk < weeksInMonth; wk++) {
            var $dowRow = $('<tr class="calendar-dow"></tr>');
            for (var dow = 0; dow < 7; dow++) {
                if (dow < firstDow || currDayOfMonth > lastDayinMonth) {
                    $dowRow.append('<td></td>');
                } else {
                    var $dowElement = $("<td></td>"); 
                    var dateId = dateAsString(year, month, currDayOfMonth);
                    var $dayElement = $('<div id="' + currDayOfMonth + '" class="day" >' + currDayOfMonth + '</div>');
                    
                    $dowElement.attr("id", dateId);
                    $dowElement.append($dayElement);

                    $dowElement.data('date', dateAsString(year, month, currDayOfMonth));
                    $dowElement.data('hasEvent', false);
                    
                    if($calendarElement.data('showToday') === true) {
                        if(month === time.getMonth() && currDayOfMonth === time.getDate()) {
                            $dayElement.parent('#' + dateId).addClass("today");
                        }
                    }
                    if($calendarElement.data('showWeekend') === true) {
                        if(dow == 0 || dow == 6) {
                            $dowElement.addClass("weekend");
                        }
                    }
                    if (typeof($calendarElement.data('actionFunction')) === 'function') {
                        $dowElement.addClass('dow-clickable');
                        $dowElement.click(function () {
                            $calendarElement.data('selectedDate', $(this).data('date'));
                        });
                        $dowElement.click($calendarElement.data('actionFunction'));
                    }
                    $dowRow.append($dowElement);
                    currDayOfMonth++;
                }
                if (dow == 6) {
                    firstDow = 0;
                }
            }
            if(wk < weeksInMonth-1) {
                $dowRow.find('td').addClass("td-bottom-border");
            }
            $tableObj.append($dowRow);
        }
        return $tableObj;
    }

    /* ----- Modal functions ----- */

    function createModal(id, title, body, footer) {
        var $modalHeaderButton = $('<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>');
        var $modalHeaderTitle = $('<h4 class="modal-title" id="' + id + '_modal_title">' + title + '</h4>');

        var $modalHeader = $('<div class="modal-header"></div>');
        $modalHeader.append($modalHeaderButton);
        $modalHeader.append($modalHeaderTitle);

        var $modalBody = $('<div class="modal-body" id="' + id + '_modal_body">' + body + '</div>');

        var $modalFooter = $('<div class="modal-footer" id="' + id + '_modal_footer"></div>');
        if (typeof(footer) !== 'undefined') {
            var $modalFooterAddOn = $('<div>' + footer + '</div>');
            $modalFooter.append($modalFooterAddOn);
        }

        var $modalContent = $('<div class="modal-content"></div>');
        $modalContent.append($modalHeader);
        $modalContent.append($modalBody);
        $modalContent.append($modalFooter);

        var $modalDialog = $('<div class="modal-dialog"></div>');
        $modalDialog.append($modalContent);

        var $modalFade = $('<div class="modal fade" id="' + id + '_modal" tabindex="-1" role="dialog" aria-labelledby="' + id + '_modal_title" aria-hidden="true"></div>');
        $modalFade.append($modalDialog);

        $modalFade.data('dateId', id);
        $modalFade.attr("dateId", id);

        return $modalFade;
    }

    /* ----- Event functions ----- */

    function checkEvents($calendarElement, year, month) {
        var jsonData = $calendarElement.data('jsonData');
        var ajaxSettings = $calendarElement.data('ajaxSettings');

        $calendarElement.data('events', false);

        if (false !== jsonData) {
            return jsonEvents($calendarElement);
        } else if (false !== ajaxSettings) {
            return ajaxEvents($calendarElement, year, month);
        }

        return true;
    }

    function jsonEvents($calendarElement) {
        var jsonData = $calendarElement.data('jsonData');
        $calendarElement.data('events', jsonData);
        drawEvents($calendarElement, 'json');
        return true;
    }

    function ajaxEvents($calendarElement, year, month) {
        var ajaxSettings = $calendarElement.data('ajaxSettings');

        if (typeof(ajaxSettings) != 'object' || typeof(ajaxSettings.url) == 'undefined') {
            alert('Invalid calendar event settings');
            return false;
        }

        var data = {year: year, month: (month + 1)};

        $.ajax({
            type: 'GET',
            url: ajaxSettings.url,
            data: data,
            dataType: 'json'
        }).done(function (response) {
            var events = [];
            $.each(response, function (k, v) {
                events.push(response[k]);
            });
            $calendarElement.data('events', events);
            drawEvents($calendarElement, 'ajax');
        });

        return true;
    }

    function drawEvents($calendarElement, type) {
        var jsonData = $calendarElement.data('jsonData');
        var ajaxSettings = $calendarElement.data('ajaxSettings');

        var events = $calendarElement.data('events');
        if (events !== false) {
            $(events).each(function (index, value) {
                var id = $calendarElement.attr('id') + '_' + value.date;
                var $dowElement = $('#' + id);
                var $dayElement = $('#' + id + '_day');

                $dowElement.data('hasEvent', true);

                if (typeof(value.title) !== 'undefined') {
                    $dowElement.attr('title', value.title);
                }

                if (typeof(value.classname) === 'undefined') {
                    $dowElement.addClass('event');
                } else {
                    $dowElement.addClass('event-styled');
                    $dayElement.addClass(value.classname);
                }

                if (typeof(value.badge) !== 'undefined' && value.badge !== false) {
                    var badgeClass = (value.badge === true) ? '' : ' badge-' + value.badge;
                    var dayLabel = $dayElement.data('day');
                    $dayElement.html('<span class="badge badge-event' + badgeClass + '">' + dayLabel + '</span>');
                }

                if (typeof(value.body) !== 'undefined') {
                    var modalUse = false;
                    if (type === 'json' && typeof(value.modal) !== 'undefined' && value.modal === true) {
                        modalUse = true;
                    } else if (type === 'ajax' && 'modal' in ajaxSettings && ajaxSettings.modal === true) {
                        modalUse = true;
                    }

                    if (modalUse === true) {
                        $dowElement.addClass('event-clickable');

                        var $modalElement = createModal(id, value.title, value.body, value.footer);
                        $('body').append($modalElement);

                        $('#' + id).click(function () {
                            $('#' + id + '_modal').modal();
                        });
                    }
                }
            });
        }
    }

    /* ----- Helper functions ----- */
    function showCalendarHolidayInfo(year, month) {
        var holidayList = "";
        var dateArray = _infoData[year][month]["holiday"]["date"].split(",");
        var strArray = _infoData[year][month]["holiday"]["str"];
        $(opts.showInfoListTo).empty();
        for(var i=0; i<dateArray.length; i++) {
            $("#" + _id + " #" + dateArray[i].match(/^\s{0,}(\d*)/)[1]).addClass("holiday");
        }
        for(var i=0; i<strArray.length; i++) {
            holidayList +=  '<li>'
                         +    '<span>'
                         +    strArray[i]
                         +    '</span>'
                         +  '</li>';
        }
        $(opts.showInfoListTo).append($("<ul></ul>").append($(holidayList))).enhanceWithin();
        $(opts.showInfoListTo).show();
    }

    function dateAsString(year, month, day) {
        d = (day < 10) ? '0' + day : day;
        m = month + 1;
        m = (m < 10) ? '0' + m : m;
        return year + '-' + m + '-' + d;
    }

    function calcDayOfWeek(year, month, day) {
        var dateObj = new Date(year, month, day, 0, 0, 0, 0);
        var dow = dateObj.getDay();
        if (dow == 0) {
            dow = 6;
        } else {
            dow--;
        }
        return dow;
    }

    function calcLastDayInMonth(year, month) {
        var day = 28;
        while (checkValidDate(year, month + 1, day + 1)) {
            day++;
        }
        return day;
    }

    function calcWeeksInMonth(year, month) {
        var daysInMonth = calcLastDayInMonth(year, month);
        var firstDow = calcDayOfWeek(year, month, 1);
        var lastDow = calcDayOfWeek(year, month, daysInMonth);
        var days = daysInMonth;
        var correct = (firstDow - lastDow);
        if (correct > 0) {
            days += correct;
        }
        return Math.ceil(days / 7);
    }

    function checkValidDate(y, m, d) {
        return m > 0 && m < 13 && y > 0 && y < 32768 && d > 0 && d <= (new Date(y, m, 0)).getDate();
    }

    function checkMonthLimit(count, invert) {
        if (count === false) {
            count = 0;
        }
        var d1 = $calendarElement.data('currDate');
        var d2 = $calendarElement.data('initDate');

        var months;
        months = (d2.getFullYear() - d1.getFullYear()) * 12;
        months -= d1.getMonth() + 1;
        months += d2.getMonth();

        if (invert === true) {
            if (months < (parseInt(count) - 1)) {
                return true;
            }
        } else {
            if (months >= (0 - parseInt(count))) {
                return true;
            }
        }
        return false;
    }

    this.refreshInfoList = function(data) {
        _infoData = data;
        drawTable($calendarElement, $tableObj, _year, _month);
        if(_showInfoList) {
            if(_infoData[_year][_month]["status"] == 1) {
                showCalendarHolidayInfo(_year, _month);
            }else {
                $(opts.showInfoListTo).hide();
            }
        }
    }
};

/**
 * Default settings
 *
 * @returns object
 *   language:          string,
 *   year:              integer,
 *   month:             integer,
 *   show_previous:     boolean|integer,
 *   show_next:         boolean|integer,
 *   cell_border:       boolean,
 *   today:             boolean,
 *   show_days:         boolean,
 *   weekstartson:      integer (0 = Sunday, 1 = Monday),
 *   nav_icon:          object: prev: string, next: string
 *   ajax:              object: url: string, modal: boolean,
 *   legend:            object array, [{type: string, label: string, classname: string}]
 *   action:            function
 *   action_nav:        function
 */
function calendar_defaults() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var settings = {
        renderTo: undefined,
        id: "calendar_ID",
        language: false,
        year: year,
        month: month,
        show_previous: true,
        show_next: true,
        changeDateEventListener: undefined,
        cell_border: false,
        markToday: false,
        markWeekend: false,
        show_days: true,
        weekstartson: 1,
        nav_icon: false,
        data: false,
        ajax: false,
        legend: false,
        action: false,
        action_nav: false,
        infoData: undefined,
        showInfoListTo: undefined,
        showNextyear: false
    };
    return settings;
};

/**
 * Language settings
 *
 * @param lang
 * @returns {{month_labels: Array, dow_labels: Array}}
 */
function calendar_language(lang) {
    if (typeof(lang) == 'undefined' || lang === false) {
        lang = 'default';
    }

    switch (lang.toLowerCase()) {

        case 'en':
            return {
                month_labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                dow_labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
            };
            break;

        case 'default':
            return {
                month_labels: ["Jan.", "Feb.", "Mar.", "Apr.", "May.", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."],
                dow_labels: ["一", "二", "三", "四", "五", "六", "日"]
            };
            break;
    }
};