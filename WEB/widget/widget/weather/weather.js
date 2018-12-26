var weatherWidget = {

    init: function(contentItem) {

        function createContent() {
            $.get(serverURL + "/widget/widget/weather/weather.html", function(data) {
                contentItem.html('').append(data);
                setWeatherData();

            }, "html");
        }

        function setWeatherData() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(locationSuccess, locationError, { enableHighAccuracy: true });
            }
        }

        function locationSuccess(position) {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            var searchtext = "select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='(" + lat + "," + lon + ")') and u='c'"
            $.getJSON("https://query.yahooapis.com/v1/public/yql?q=" + searchtext + "&format=json").success(function(data) {
                //console.log(data.query.results.channel);
                var result = data.query.results.channel;
                var city = result.location.city;
                var region = result.location.region;
                var wea = result.item.condition.text;
                var temp = result.item.condition.temp;
                var high = result.item.forecast[0].high;
                var low = result.item.forecast[0].low;
                var img = result.item.description.split('CDATA[')[1].split('<BR />')[0];

                $(".current-temp").text(temp);
                $(".high-temp").text(high);
                $(".low-temp").text(low);
                $(".loca-city").text(city);
                $(".loca-text").text(wea);
                $('.weather-img').html('').append(img);
            });
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