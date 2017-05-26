$("#viewPersonalLeave").pagecontainer({
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
            if(personalLeaveDateExist) {   
                var index = 0;
                year = thisYear-1;
                month = thisMonth;
                while(index < 13) {
                    monthlyPageDateList += "<div>" + monTable[month] + year + "</div>";
                    monthlyPageDate[index] = month + "." + year;
                    if(month == 12){
                        year++;
                        month = 0;
                    }
                    month++;
                    index++;
                }
                $(".personalLeaveSlider").html("");
                $(".personalLeaveSlider").append(monthlyPageDateList).enhanceWithin();
            }
            personalLeaveDateExist = false;
            if($(".personalLeaveSlider").hasClass("slick-slider") || $(".personalLeaveSlider").hasClass("slick-initialized")){
                $(".personalLeaveSlider").slick("unslick");
            }
            $(".personalLeaveSlider").slick({
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

        $(document).ready(function() {
            $("#myCalendar").zabuto_calendar({
                language: "en",
            });
        });

        /********************************** page event *************************************/
        $("#viewPersonalLeave").on("pagebeforeshow", function(event, ui) {
            // initSlider();
        });

        $("#viewPersonalLeave").on("pageshow", function(event, ui) {
            // initSlider();
            loadingMask("hide");
        });

        /********************************** dom event *************************************/
        $("#viewPersonalLeave").keypress(function(event) {

        });

    }
});
