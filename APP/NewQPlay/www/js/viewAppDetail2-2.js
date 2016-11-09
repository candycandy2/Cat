
$(document).one("pagecreate", "#viewAppDetail2-2", function(){
    
    $("#viewAppDetail2-2").pagecontainer({
        create: function(event, ui) {
            
            /********************************** function *************************************/
             function displayAppDetail() {

                $("#appDetailIcon").attr("src", applist[selectAppIndex].icon_url); 
                

                for (var multilangIndex=0; multilangIndex < appmultilang.length; multilangIndex++)
                {
                    if ((applist[selectAppIndex].app_code == appmultilang[multilangIndex].project_code) &&
                        (appmultilang[multilangIndex].lang == "zh-tw"))
                    {
                        break;
                    }
                }

                if (multilangIndex > appmultilang.length)
                {
                    console.log("find multilang error!!!");
                    //alert("find multilang error!!!");
                    return;
                }

                $("#appDetailAppName").html(appmultilang[multilangIndex].app_name);
                $("#appDetailAppSummary").html(appmultilang[multilangIndex].app_summary);
                $("#appDetailAppVersion").html(applist[selectAppIndex].app_version_name);

                var appDescription = appmultilang[multilangIndex].app_description.replace(/\n/g,"<br>");
                $("#appDetailAppDescription").html(appDescription);

                var appranking = applist[selectAppIndex].avg_score;

                var content = "";
                var piclist = appmultilang[multilangIndex].pic_list;
                for (var listIndex=0; listIndex<piclist.length; listIndex++)
                {
                    (function(indexNow){
                        $('#appDetailPicList').trigger('remove.owl.carousel', indexNow);
                    }(listIndex));
                }

                for (listIndex=0; listIndex<piclist.length; listIndex++)
                {
                    content = "<div class=\"owl-item detail-img-style\"><img src=" + piclist[listIndex].pic_url + "></div>";
                    $('#appDetailPicList').owlCarousel('add', content).owlCarousel('refresh');
                }

                var __construct = function() {
                    
                }();
            }

            /********************************** page event *************************************/
            $("#viewAppDetail2-2").on("pagebeforeshow", function(event, ui) {
                var appDetail = new displayAppDetail();
            });

            $("#viewAppDetail2-2").on("pageshow", function(event, ui) {
                loadingMask("show");

                var timer = setTimeout(function(){
                    //Auto resize detail-description
                    var pageHeight = $("#viewAppDetail2-2").height();
                    var pageHeaderHeight = $("#viewAppDetail2-2 .page-header").height();
                    var mainTopHeight = $("#viewAppDetail2-2 .page-main .top").height();
                    var mainRankHeight = $("#viewAppDetail2-2 .page-main .rank").height();
                    var mainDDescriptionHeight = $("#viewAppDetail2-2 .detail-description").height();
                    var mainOwlCarouselHeight = $("#viewAppDetail2-2 .page-main .owl-carousel").height();

                    var tempHeight = pageHeight - (mainTopHeight + mainRankHeight + mainDDescriptionHeight + mainOwlCarouselHeight);
                    $("#viewAppDetail2-2 .detail-description").css("height", tempHeight + "px");

                    loadingMask("hide");
                    clearTimeout(timer);
                }, 500);

            });

            /********************************** dom event *************************************/
            $("#InstallApp").click(function() {
                if (selectAppIndex != 9999)
                {
                    window.open(applist[selectAppIndex].url, '_self', false);
                }
            });
            
        }
    });

});