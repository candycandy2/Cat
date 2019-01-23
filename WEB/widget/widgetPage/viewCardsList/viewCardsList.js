
$("#viewCardsList").pagecontainer({
    create: function(event, ui) {

        /********************************** function *************************************/ 


        /********************************** page event *************************************/

        $("#viewCardsList").on("pageshow", function(event, ui) {  
           
        });

        /********************************** dom event *************************************/

        $(document).on('click', '#viewCardsList .qstore-card', function() {
            let postData = {
                'cardsType': "qstore"
            }
            checkWidgetPage('viewCardsMain', pageVisitedList, postData);
        });

        $(document).on('click', '#viewCardsList .medical-card', function() {
            let postData = {
                'cardsType': "medical"
            }
            checkWidgetPage('viewCardsMain', pageVisitedList, postData);
        });

        $(document).on('click', '#viewCardsList .quality-card', function() {
            let postData = {
                'cardsType': "quality"
            }
            checkWidgetPage('viewCardsMain', pageVisitedList, postData);
        });

        $(document).on('click', '#viewCardsList .safety-card', function() {
            let postData = {
                'cardsType': "safety"
            }
            checkWidgetPage('viewCardsMain', pageVisitedList, postData);
        });

    }
});
