$("#personalLeave").pagecontainer({
    create: function(event, ui) {
        
        /********************************** function *************************************/
        // window.APIRequest = function() {
            
        //     var self = this;

        //     this.successCallback = function(data) {
        //         loadingMask("hide");

        //         var resultcode = data['ResultCode'];
        //         //do something
        //     };

        //     this.failCallback = function(data) {};

        //     var __construct = function() {
        //         //CustomAPI("POST", true, "APIRequest", self.successCallback, self.failCallback, queryData, "");
        //     }();

        // };

        function initSlider() {
            $("#personalLeaveSlider").slick({
                initialSlide: 0,
                autopaly: false,
                dots: false,
                responseive: [{
                    breakpoint: 500,
                    settings: {
                        arrows: true,
                        infinite: false,
                        slidesToShow: 2,
                        slidesToScroll: 2
                    }
                }],
                infinite: false
            });
        }

        /********************************** page event *************************************/
        $("#personalLeave").on("pagebeforeshow", function(event, ui) {
            // initSlider();
            $(document).ready(function() {
                $("#myCalendar").zabuto_calendar({
                    language: "en",
                    year: 2017,
                    month: 5,
                    show_previous: true,
                    show_next: true
                });
            });
        });

        $("#personalLeave").on("pageshow", function(event, ui) {
            initSlider();
        });

        /********************************** dom event *************************************/
        $("#personalLeave").keypress(function(event) {

        });

    }
});
