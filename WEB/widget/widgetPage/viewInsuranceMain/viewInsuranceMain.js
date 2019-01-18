var files = ["InsuranceRights.pdf"];
var url = "";
var mimeType = "application/pdf";
var options = {};
var tab1ScrollHeight = false, tab2ScrollHeight = false, tab3ScrollHeight = false;

$("#viewInsuranceMain").pagecontainer({
    create: function(event, ui) {
        //page init
        /********************************** function *************************************/ 

        function insurBackKey() {
            //1. close panel
            var panelShow = $('.insuranceMenu').css('display') == 'block' ? true : false;
            if(panelShow) {
                $('.insuranceMenu .staff-menu-main').animate({right: '100vw'}, 300, function(){
                    $('.insuranceMenu').hide();
                });
            }

            //2. change menu class
            var curPage = visitedPageList[visitedPageList.length - 1];
            $.each($('.insuranceMenu .staff-menu-list li'), function(index, item) {
                if(curPage == $(item).data('view')) {
                    $('.insuranceMenu .staff-menu-list').find('.active-menu').removeClass('active-menu');
                    $('.insuranceMenu .staff-menu-list li[data-view="' + curPage + '"]').addClass('active-menu');
                }
            })
        }

        /********************************** page event *************************************/

        $("#viewInsuranceMain").one("pageshow", function(event, ui) {  
            /*$.get(serverURL + "/widget/widgetPage/viewInsurancePanel/viewInsurancePanel.html", function(data) {
                $.mobile.pageContainer.append(data);
                //ios top
                if(device.platform === "iOS") {
                    $('.insuranceMenu').css('top', iOSFixedTopPX().toString() + 'px');
                }
            }, "html");*/
        });

        $("#viewInsuranceMain").on("pageshow", function(event, ui) {  
            $('#pageOne').show();
            $('#pageTwo').hide();
            $('#pageThree').hide();
            $("label[for=tab3]").removeClass('ui-btn-active');
            $("label[for=tab2]").removeClass('ui-btn-active');
            $("label[for=tab1]").addClass('ui-btn-active');
            //去除上一頁菜單樣式
            var prevPage = visitedPageList[visitedPageList.length - 2];
            $("#mypanel" + " #mypanel" + prevPage).css("background", "#f6f6f6");
            $("#mypanel" + " #mypanel" + prevPage).css("color", "#0f0f0f");
            //此頁添加菜單樣式
            var nowPage = visitedPageList[visitedPageList.length - 1];
            $("#mypanel" + " #mypanel" + nowPage).css("background", "#503f81");
            $("#mypanel" + " #mypanel" + nowPage).css("color", "#fff");

            activePageListID = visitedPageList[visitedPageList.length - 1];   
            scrollClassName = 'insur-main-scroll';       
            if (!tab1ScrollHeight) {         
                scrollHeightByTab(activePageListID, scrollClassName, '2');
                $("#" + activePageListID + ">.page-header").css({
                    'position': 'fixed'
                });       
                tab1ScrollHeight = true;
            }
            loadingMask("hide");
        });

        /********************************** dom event *************************************/
        $('#mainTab').change(function() {
            var tabValue = $("#mainTab :radio:checked").val();
            if (tabValue == 'tab1') {
                $('#pageOne').show();
                $('#pageTwo').hide();
                $('#pageThree').hide();
            } else if (tabValue == 'tab2') {
                $('#pageTwo').show();
                $('#pageOne').hide();
                $('#pageThree').hide();
                if (!tab2ScrollHeight) {  
                    scrollHeightByTab(activePageListID, scrollClassName, '3');
                    tab2ScrollHeight = true;
                }
            } else {
                $('#pageThree').show();
                $('#pageOne').hide();
                $('#pageTwo').hide();
                if (!tab3ScrollHeight) {  
                    scrollHeightByTab(activePageListID, scrollClassName, '4');
                    tab3ScrollHeight = true;
                }
            }
        });

        $("#groupIndurancePDF").on('click', function() {
            var insurPDFUrl = serverURL + "/Insurance/GroupInsurance.pdf";
            window.open(encodeURI(insurPDFUrl), '_system');          
        });  

        //调出菜单(如果需要在其他頁面使用，必須添加樣式insur-menu-btn)
        /*$(document).on('click', '.insur-menu-btn', function() {
            $('.insuranceMenu').show();
            $('.insuranceMenu .staff-menu-main').animate({left: '40vw'}, 300);
        });

        //右滑隐藏菜单
        $(document).on('swipeleft', '.insuranceMenu', function() {
            $('.insuranceMenu .staff-menu-main').animate({right: '100vw'}, 300, function(){
                $('.insuranceMenu').hide();
            });
        });

        //点击非菜单区域隐藏菜单
        $(document).on('tap', '.insuranceMenu', function(e) {
            if(e.target != this) {
                return;
            } else {
                $('.insuranceMenu .staff-menu-main').animate({right: '100vw'}, 300, function(){
                    $('.insuranceMenu').hide();
                });
            }
        });

        //選擇菜單
        $(document).on('tap', '.insuranceMenu .staff-menu-list li', function(e) {
            //1. get active page & target page
            var activePage = $.mobile.pageContainer.pagecontainer("getActivePage")[0].id;
            var targetPage = $(this).data('view');
            if(activePage != targetPage) {
                //2. remove class
                $('.insuranceMenu .staff-menu-list').find('.active-menu').removeClass('active-menu');
                //3. add class
                $(this).addClass('active-menu');
            }

            //4. close panel
            $('.insuranceMenu .staff-menu-main').animate({right: '100vw'}, 300, function(){
                $('.insuranceMenu').hide();
            });

            //5. change page
            if(activePage != targetPage) {
                checkWidgetPage(targetPage, visitedPageList);
            }
        });

        //sync menu when back key
        $(document).on('click', '.staff-back', function() {
            insurBackKey();
        });
        document.addEventListener("backbutton", insurBackKey, false); */

        $(document).on('click', '#viewInsuranceMain .insuranceMenu', function() {
            $("#mypanel").panel("open");
            $(".page-mask").show();
        })          

    }
});
