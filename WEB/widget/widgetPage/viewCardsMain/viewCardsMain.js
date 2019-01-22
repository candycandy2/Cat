
$("#viewCardsMain").pagecontainer({
    create: function(event, ui) {

        /********************************** function *************************************/ 


        /********************************** page event *************************************/

        $("#viewCardsMain").one("pageshow", function(event, ui) {
            var imgURL = "/widget/widgetPage/viewCardsMain/img/";
            $(".allCardsImg").attr("src", serverURL + imgURL + "icon_widget_cards.png");
        });

        $("#viewCardsMain").on("pageshow", function(event, ui) {  
            $(".cards-img").attr("src", "");
            var imgURL = "/widget/widgetPage/viewCardsMain/img/";  
            var postData = JSON.parse(window.sessionStorage.getItem("viewCardsMain_parmData"));
            var cardsTpye = postData.cardsType;
            var cardsImg, headerName;

            switch(cardsTpye) {
                case "qstore":
                    headerName = langStr["wgt_100"];
                    cardsImg = "qstore_card.png";
                    break;
                case "medical":
                    headerName = langStr["wgt_169"];
                    cardsImg = "medical_equip_card.png";
                    break;
                case "quality":
                    headerName = langStr["wgt_170"];
                    cardsImg = "qisda_quality_card.png";
                    break;
                case "safety":
                    headerName = langStr["wgt_171"];
                    cardsImg = "enviro_safety_01.png";
                    break;
            }

            $(".cardsHeaderName").text(headerName);
            $(".cards-img").attr("src", serverURL + imgURL + cardsImg);
           
        });

        /********************************** dom event *************************************/

    }
});
