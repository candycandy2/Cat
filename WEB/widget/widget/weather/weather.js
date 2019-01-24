var weatherWidget = {

    init: function(contentItem) {

        function createContent() {
            $.get(serverURL + "/widget/widget/weather/weather.html", function(data) {
                contentItem.html('').append(data);
                setWeatherData();

            }, "html");
        }

        function setWeatherData() {
            // if (navigator.geolocation) {
            //     navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
            // }
            var pos = { "coords": { "latitude": 25.0811469, "longitude": 121.56481370000006 } }; //QTT
            // var pos = {"coords":{"latitude":31.305428,"longitude":120.525748}};//QCS
            locationSuccess(pos);
        }

        function locationSuccess(position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            $.getJSON("http://api.openweathermap.org/data/2.5/weather?units=metric&lang=zh_tw&q=taipei,tw&lat=" + lat + "&lon=" + lon + "&APPID=efc3a7bc381b3a08366d87a686e01812").success(
                function(data) {
                    //{"coord":{"lon":139,"lat":35},"weather":[{"id":520,"main":"Rain","description":"light intensity shower rain","icon":"09d"}],"base":"stations","main":{"temp":282.19,"pressure":1023,"humidity":100,"temp_min":281.15,"temp_max":283.15},"visibility":10000,"wind":{"speed":1,"deg":330},"clouds":{"all":75},"dt":1547512020,"sys":{"type":1,"id":8024,"message":0.0051,"country":"JP","sunrise":1547502702,"sunset":1547538895},"id":1851632,"name":"Shuzenji","cod":200}
                    //http://jsoneditoronline.org/
                    //https://openweathermap.org/current
                    //http://openweathermap.org/img/w/10d.png
                    //<img src="//openweathermap.org/themes/openweathermap/assets/vendor/owm/img/widgets/04d.png" width="128" height="128" alt="Weather in Taipei, TW" class="weather-left-card__img">
                    $(".current-temp").text(Math.round(data.main.temp));
                    $(".high-temp").text(Math.round(data.main.temp_max));
                    $(".low-temp").text(Math.round(data.main.temp_min));
                    $(".loca-city").text(data.name);
                    $(".loca-text").text(data.weather[0].description);
                    //$('.weather-img').html('').append('http://openweathermap.org/img/w/' + data.weather[0].icon + '.png');

                    var weatherImg = $('<img>').attr('src', 'https://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/widgets/' + data.weather[0].icon + '.png');
                    $('.weather-img').html('').append(weatherImg);
                }
            );
        }

        function locationError(error) {
            console.warn('ERROR(' + error.code + '): ' + error.message);
        }

        $.fn.weather = function(options) {
            options = options || {};

            return this.each(function() {
                var state = $.data(this, 'weather');
                if (state) {
                    $.extend(state.options, options);
                } else {
                    $.data(this, 'weather', {
                        options: $.extend({}, $.fn.weather.defaults, options)
                    });
                }

                createContent();

            });
        }

        $.fn.weather.defaults = {}

        $('.weatherWidget').weather();

    }
};