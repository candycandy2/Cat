
$("#viewCardsMain").pagecontainer({
    create: function(event, ui) {

        /********************************** function *************************************/ 


        /********************************** page event *************************************/

        $("#viewCardsMain").one("pageshow", function(event, ui) {
             var mainHeight = window.sessionStorage.getItem('pageMainHeight');
            $('#viewCardsMain .page-main').css('height', mainHeight);
            
            var imgURL = "/widget/widgetPage/viewCardsMain/img/";
            $(".allCardsImg").attr("src", serverURL + imgURL + "icon_widget_cards.png");
        });

        function showOneImg(cardsUrl) {
            $(".cards-img").attr("src", cardsUrl);
            $(".fixedcard").show();
            $("#viewCardsMain .swipslider").hide();
        }

        $("#viewCardsMain").on("pageshow", function(event, ui) {  
            $(".cards-img").attr("src", "");
            var imgURL = "/widget/widgetPage/viewCardsMain/img/";  
            var postData = JSON.parse(window.sessionStorage.getItem("viewCardsMain_parmData"));
            var cardsTpye = postData.cardsType;
            var cardsImg, headerName, cardsUrl;
            var content = '';

            switch(cardsTpye) {
                case "qstore":
                    headerName = langStr["wgt_100"];
                    cardsImg = "qstore_card.png";
                    cardsUrl = serverURL + imgURL + cardsImg;
                    showOneImg(cardsUrl);
                    break;
                case "medical":
                    headerName = langStr["wgt_169"];
                    cardsImg = "medical_equip_card.png";
                    cardsUrl = serverURL + imgURL + cardsImg;
                    showOneImg(cardsUrl);
                    break;
                case "quality":
                    headerName = langStr["wgt_170"];
                    cardsImg = "qisda_quality_card.png";
                    cardsUrl = serverURL + imgURL + cardsImg;
                    showOneImg(cardsUrl);
                    break;
                case "calendar":
                    headerName = "2019行事曆";
                    cardsImg = "2019_calendar_card.png";
                    cardsUrl = serverURL + imgURL + cardsImg;
                    showOneImg(cardsUrl);
                    break;
                case "safety":
                    headerName = langStr["wgt_171"];
                    for (var i = 0; i < 2; i++) {
                        content += '<li id= "' + i + '" class="sw-slide"><img class="enviro_safety_' + (i + 1) + '" src="' + serverURL + imgURL + 'enviro_safety_' + (i + 1) + '.png"/></li>';
                    } 
                    $("#viewCardsMain .swipslider ul").empty().append(content);
                    $("#viewCardsMain .sw-bullet").remove();
                    $(".fixedcard").hide();
                    $("#viewCardsMain .swipslider").show();
                    $("#viewCardsMain .swipslider").swipeslider({
                        prevNextButtons: false,
                        autoPlay: false
                    });
                    break;
            }

            $(".cardsHeaderName").text(headerName);
                      
        });

        /********************************** dom event *************************************/

        $(document).on('click', '#viewCardsMain #allCardsBtn', function() {
            checkWidgetPage('viewCardsList', pageVisitedList);
        });

    }
});
