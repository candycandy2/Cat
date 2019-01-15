var files = ["InsuranceRights.pdf"];
var url = "";
var mimeType = "application/pdf";
var options = {};
var tab1ScrollHeight = false, tab2ScrollHeight = false, tab3ScrollHeight = false;

$("#viewInsuranceMain").pagecontainer({
    create: function(event, ui) {
        //page init
        /********************************** function *************************************/
        

        /********************************** page event *************************************/

        $("#viewInsuranceMain").one("pageshow", function(event, ui) {  
            $.get(serverURL + "/widget/widgetPage/viewInsurancePanel/viewInsurancePanel.html", function(data) {
                $.mobile.pageContainer.append(data);
                //ios top
                if(device.platform === "iOS") {
                    $('.insuranceMenu').css('top', iOSFixedTopPX().toString() + 'px');
                }
            }, "html");
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

        $(document).on('click', '#viewInsuranceMain .insuranceMenu', function() {
            $("#mypanel").panel("open");
            $(".page-mask").show();
        })           

    }
});
