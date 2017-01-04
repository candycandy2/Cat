
$(document).one("pagecreate", "#viewAppDetail2-2", function(){
    
    $("#viewAppDetail2-2").pagecontainer({
        create: function(event, ui) {

            var pageHeight = null;

            /********************************** function *************************************/
             function displayAppDetail() {

                $("#appDetailIcon").attr("src", applist[selectAppIndex].icon_url); 

                //Find multilangIndex = "zh-tw"
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

                //APP Name substring
                //zh-tw / zh-cn: string max length is 6
                //en-us / other: string max length is 12
                /*
                var language = navigator.language.toLowerCase();
                var strLength;

                if (language === "zh-tw" || language === "zh-cn") {
                    strLength = 6;
                } else {
                    strLength = 12;
                }

                var appName = appmultilang[multilangIndex].app_name.substr(0, strLength);

                if (appmultilang[multilangIndex].app_name.length > strLength) {
                    appName += "...";
                }
                */
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

                //Auto resize appDetailPicList
                if (device.platform === "iOS") {
                    var tempHeight = $("#appDetailPicList").height();
                    $("#appDetailPicList").css("height", parseInt(tempHeight + 20 ,10) + "px");
                    tempHeight = $("#appDetailPicListContent").height();
                    $("#appDetailPicListContent").css("height", parseInt(tempHeight + 20 ,10) + "px");
                }

                //Auto resize appDetailPicListContent
                var pageWidth = $("#viewAppDetail2-2").width();
                var tempIMG = $(".detail-img-style")[0];
                var imgWidth = tempIMG.clientWidth;
                var picListContentWidth = (imgWidth + 2 + pageWidth * 0.037) * piclist.length;
                $("#appDetailPicListContent").css("width", picListContentWidth + "px");

                //detail-description, the text content can't over 3 lines,
                //if text content is too long, show/hide open button
                var appDescription = appmultilang[multilangIndex].app_description.replace(/\n/g,"<br>");
                $("#appDetailAppDescription").css("height", "auto");
                $("#appDetailAppDescription").html(appDescription);

                var descriptionHeight = $("#appDetailAppDescription").height();
                var textHeight = parseInt(window.screen.height * 0.024, 10);
                var adjustHeight = textHeight * 3 - descriptionHeight;

                if (descriptionHeight >= (textHeight * 3)) {
                    $("#appDetailAppDescription").addClass("detail-description-ellipsis");
                    $("#appDetailAppDescription").css({
                        "max-height": "3.4em",
                        "line-height": "1.2em"
                    });
                    $(".detail-description-open").show();
                } else {
                    $("#appDetailAppDescription").removeClass("detail-description-ellipsis");
                    $("#appDetailAppDescription").css({
                        "max-height": "none",
                        "line-height": "3.4vh"
                    });
                    $(".detail-description-open").hide();

                    $("#appDetailAppDescription").css("height", parseInt(descriptionHeight + adjustHeight, 10) + "px");
                }

                loadingMask("hide");
            }

            /********************************** page event *************************************/
            $("#viewAppDetail2-2").on("pagebeforeshow", function(event, ui) {
                loadingMask("show");
            });

            $("#viewAppDetail2-2").on("pageshow", function(event, ui) {
                displayAppDetail();
            });

            /********************************** dom event *************************************/
            $("#InstallApp").on("click", function() {
                if (selectAppIndex != null) {
                    $("body").append('<a id="downloadAPP" href="' + applist[selectAppIndex].url + '"></a>');
                    document.getElementById("downloadAPP").click();
                    $("#downloadAPP").remove();
                }
            });

            $("#openDescription").on("click", function() {
                $("#appDetailAppDescription").removeClass("detail-description-ellipsis");
                $("#appDetailAppDescription").css({
                    "max-height": "none",
                    "line-height": "3.4vh"
                });
                $(".detail-description-open").hide();
            });
        }
    });

});