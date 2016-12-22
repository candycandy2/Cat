
$(document).one("pagecreate", "#viewAppDetail2-2", function(){
    
    $("#viewAppDetail2-2").pagecontainer({
        create: function(event, ui) {

            var pageHeight = null;

            /********************************** function *************************************/
             function displayAppDetail() {

                $("#appDetailIcon").attr("src", applist[selectAppIndex].icon_url); 
                
                for (var multilangIndex=0; multilangIndex < appmultilang.length; multilangIndex++) {
                    if ((applist[selectAppIndex].app_code == appmultilang[multilangIndex].project_code) &&
                        (appmultilang[multilangIndex].lang == "zh-tw"))
                    {
                        break;
                    }
                }

                if (multilangIndex > appmultilang.length) {
                    console.log("find multilang error!!!");
                    return;
                }

                $("#appDetailAppName").html(appmultilang[multilangIndex].app_name);
                $("#appDetailAppSummary").html(appmultilang[multilangIndex].app_summary);
                $("#appDetailAppVersion").html(applist[selectAppIndex].app_version_name);
                var appSize =  new Number(applist[selectAppIndex].size / 1024.0 / 1024.0);
                $("#appDetailAppSize").html(appSize.toFixed(2) + " M");

                var appranking = applist[selectAppIndex].avg_score;

                var platform = device.platform.toLowerCase();
                var content = "";
                var piclist = appmultilang[multilangIndex].pic_list;
                var indexNow = 0;

                $('#appDetailPicListContent').html("");

                for (var listIndex=0; listIndex<piclist.length; listIndex++) {
                    if (piclist[listIndex].pic_type === platform + "_screenshot") {
                        content += "<div class='detail-img-style'><img src=" + piclist[listIndex].pic_url + " width='100%' height='100%'></div>";
                    }
                }

                $('#appDetailPicListContent').append(content);

                //Auto resize appDetailPicListContent
                var tempIMG = $(".detail-img-style")[0];
                var imgWidth = tempIMG.clientWidth;
                var picListContentWidth = (imgWidth + 2) * piclist.length;
                $("#appDetailPicListContent").css("width", picListContentWidth + "px");

                //Auto resize detail-description
                pageHeight = (pageHeight === null) ? $("#viewAppDetail2-2").height() : pageHeight;
                var pageHeaderHeight = $("#viewAppDetail2-2 .page-header").height();
                var mainTopHeight = $("#viewAppDetail2-2 .page-main .top").height();
                var mainRankHeight = $("#viewAppDetail2-2 .page-main .rank").height();
                var appDetailPicListHeight = $("#viewAppDetail2-2 #appDetailPicList").height();
                if (device.platform === "iOS") {
                    var fixHeight = 40;
                } else {
                    var fixHeight = 20;
                }

                var tempHeight = pageHeight - (mainTopHeight + mainRankHeight + pageHeaderHeight + appDetailPicListHeight + fixHeight);
                $("#viewAppDetail2-2 .detail-description").css("height", tempHeight + "px");

                var appDescription = appmultilang[multilangIndex].app_description.replace(/\n/g,"<br>");
                $("#appDetailAppDescription").html(appDescription);

                loadingMask("hide");

                var __construct = function() {

                }();
            }

            /********************************** page event *************************************/
            $("#viewAppDetail2-2").on("pageshow", function(event, ui) {
                var appDetail = new displayAppDetail();
            });

            $("#viewAppDetail2-2").on("pagebeforeshow", function(event, ui) {
                loadingMask("show");
            });

            /********************************** dom event *************************************/
            $("#InstallApp").on("click", function() {
                if (selectAppIndex != null) {
                    $("body").append('<a id="downloadAPP" href="' + applist[selectAppIndex].url + '"></a>');
                    document.getElementById("downloadAPP").click();
                    $("#downloadAPP").remove();
                }
            });
        }
    });

});