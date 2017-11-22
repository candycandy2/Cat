$(function () {
    $('#goBack').click(function(){
        window.location='../report';
    });
    Highcharts.setOptions({
     lang: {
       rangeSelectorZoom: '' //have no word 'zoom' before range selector
     }
    }); 
    $('.dropdown-menu > li > a ,.signle-page > a').click(function(){
        $('.nav-tabs > li.active').removeClass('active');
        $('.dropdown-menu > li.active').removeClass('active');
        var openId = $(this).data('tabid');
        $(this).parents('li').addClass('active');
        setActiveTab(openId, appKey);
    });
    var $defaultTab = $('#navReport>li>a').first()
    if( $defaultTab.parents('li').hasClass('dropdown')){
        $defaultTab = $('#navReport>li>ul>li>a').first();   
    }
    setActiveTab($defaultTab.data('tabid'), appKey);
    $defaultTab.parents('li').addClass('active');
});

var setActiveTab = function(openId, appKey){

    switch (openId) {
        case 'api_call_frequency':
            iniApiCallFrequencyReport(appKey);
            break;
        case 'api_operation_time':
            iniApiOperationTimeReport(appKey);
            break;
        case 'register_daily':
            iniRegisterDailyReport(appKey);
            break;
        case 'register_cumulative':
            iniRegisterCumulativeReport(appKey);
            break;
        case 'summary_report':
            iniSummaryReport(appKey);
            break;
        case 'push_service_hours':
            pushServiceHours.iniReport(appKey);
            break;
        case 'message_read_rate':
            messageReadRate.iniReport(appKey);
            break;
    }

    $('.tab-content > div.active').removeClass('active').removeClass('in');
    $('#' + openId).addClass('active').addClass('in');
};

var sortTable = function(table){
    var rows = $('#' + table).find('table tbody  tr').not('.js-total').get();

    rows.sort(function(a, b) {

    var A = $(a).children('td').eq(0).text().toUpperCase();
    var B = $(b).children('td').eq(0).text().toUpperCase();
    A=parseInt(A.split('(')[0]);
    B=parseInt(B.split('(')[0]);

    if(A < B) {
    return -1;
    }

    if(A > B) {
    return 1;
    }

    return 0;

    });

    $.each(rows, function(index, row) {
    $('#' + table).find('table > tbody').prepend(row);
    });
};