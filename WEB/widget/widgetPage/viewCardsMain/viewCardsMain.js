
$("#viewCardsMain").pagecontainer({
    create: function(event, ui) {

        /********************************** function *************************************/ 

        function showOneImg(cardsUrl) {
            $("#viewCardsMain .swipslider").hide();
            $(".cards-img").attr("src", cardsUrl);
            $(".fixedcard").show();
        }

        function showSliderImg(countImg, cardsUrl) {
            var content = '';
            for (var i = 0; i < countImg; i++) {
                content += '<li id= "' + i + '" class="sw-slide"><img class="enviro_safety_' + (i + 1) + '" src="' + cardsUrl + (i + 1) + '.png"/></li>';
            } 
            $("#viewCardsMain .swipslider ul").append(content);
            $(".fixedcard").hide();
            $("#viewCardsMain .swipslider").show();
            $("#viewCardsMain .swipslider").swipeslider({
                prevNextButtons: false,
                autoPlay: false
            });
        }

        /********************************** page event *************************************/

        $("#viewCardsMain").on("pagebeforeshow", function(event, ui) {
            //清空前一頁Img URL
            $(".cards-img").attr("src", "");
            $("#viewCardsMain .swipslider ul").remove();
            $("#viewCardsMain .swipslider").append('<ul class="sw-slides"></ul>');

        });

        $("#viewCardsMain").one("pageshow", function(event, ui) {
            var mainHeight = window.sessionStorage.getItem('pageMainHeight');
            $('#viewCardsMain .page-main').css('height', mainHeight);
            var imgURL = "/widget/widgetPage/viewCardsMain/img/";
            $(".allCardsImg").attr("src", serverURL + imgURL + "icon_widget_cards.png");
        });

        $("#viewCardsMain").on("pageshow", function(event, ui) {  
            var imgURL = "/widget/widgetPage/viewCardsMain/img/";  
            var postData = JSON.parse(window.sessionStorage.getItem("viewCardsMain_parmData"));
            var cardsTpye = postData.cardsType;    
            var cardsImg, headerName, cardsUrl;

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
                    cardsUrl = serverURL + imgURL + "enviro_safety_"
                    showSliderImg(2, cardsUrl);
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
