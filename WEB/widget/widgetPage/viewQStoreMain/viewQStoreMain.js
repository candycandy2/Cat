
$("#viewQStoreMain").pagecontainer({
    create: function (event, ui) {

        var food;
        window.myLocate;
        window.myLatLng;
        window.allMarker = [];

        /********************************** function *************************************/
       
        function geocodeAddress(geocoder, resultsMap, address, name) {
            //var address = document.getElementById('address').value;
            //var address = "台北市內湖區基湖路16號";

            (function(geocoder, resultsMap, address, name) {
                geocoder.geocode({'address': address}, function(results, status) {

                    if (status === 'OK') {
                        resultsMap.setCenter(results[0].geometry.location);

                        var iconImage = {
                            url: "img/storepin.png",
                            scaledSize: new google.maps.Size(34, 40),
                            origin: new google.maps.Point(0, 0),
                            anchor: new google.maps.Point(0, 40)
                        }

                        var marker = new google.maps.Marker({
                        //window.marker = new google.maps.Marker({
                            map: resultsMap,
                            position: results[0].geometry.location,
                            title: name,
                            attribution: {
                                source: results[0].geometry.location.toString()
                            },
                            icon: iconImage
                        });

                        window.allMarker.push(marker);

                        //Info Window
                        var contentString = '<div id="content"> 這個地址是:' + address +'</div>';

                        var infowindow = new google.maps.InfoWindow({
                            content: contentString
                        });

                        marker.addListener('click', function() {
                            //infowindow.open(resultsMap, marker);

                            //marker.setIcon("img/markerB.png");
                            //markerIcon(marker);

                            markerInCenter(marker);

                            //markerDetail(marker);
                        });

                        /*marker.addListener('icon_changed', function() {
                            setTimeout(function(){
                                markerText(marker);
                            }, 500);
                        });*/

                        /*
                        setTimeout(function(){
                            window.marker.setMap(null);
                        }, 10000);
                        */

                    } else {
                        //alert('Geocode was not successful for the following reason: ' + status);
                    }

                });
            }(geocoder, resultsMap, address, name));

        }

        function markerInCenter(nowMarker) {
            window.map.setCenter(nowMarker.getPosition());
            marker.setOpacity(1.0);
        }

        /********************************** page event ***********************************/

        $("#viewQStoreMain").one("pageshow", function (event, ui) {
            if (localStorage.getItem(qstoreWidget.QStoreLocalStorageKey) !== null) {
                allQStoreList = JSON.parse(localStorage.getItem(qstoreWidget.QStoreLocalStorageKey));
            } else {
                //第一次進入
                //將QStoreList按七種類別，存入localStorage
                loadingMask("show");
                QueryStoreList(1)
                    .then(QueryStoreList(2))
                    .then(QueryStoreList(3))
                    .then(QueryStoreList(4))
                    .then(QueryStoreList(5))
                    .then(QueryStoreList(6))
                    .then(QueryStoreList(7))
                    .then(showQStoreList(allQStoreList));
            }
            food = [{
                name: "丹提咖啡",
                distance: 0.3,
                position: "(25.0810692, 121.5636862)",
                address: "台北市內湖區堤頂大道二段407巷24號",
                phone: "02 2658 4755"
            }, {
                name: "西雅圖極品咖啡",
                distance: 0.017,
                position: "(25.0810089, 121.56473299999993)",
                address: "台北市內湖區基湖路18號",
                phone: "02 8751 2128"
            }, {
                name: "星巴克",
                distance: 0.074,
                position: "(25.0803921, 121.56507120000003)",
                address: "台北市內湖區基湖路25號",
                phone: "02 2799 9334"
            }, {
                name: "珮斯坦咖啡館",
                distance: 0.092,
                position: "(25.0813135, 121.56576429999996)",
                address: "台北市內湖區基湖路3巷1號1樓",
                phone: "02 8797 8027"
            }];

        });

        $("#viewQStoreMain").on("pageshow", function (event, ui) {
                   console.log("=========== ready");

                if (navigator.geolocation) {
                    console.log("---------1");

                    window.locationSuccess = function(position) {
                        console.log("--------success");

                        var pos = {
                          lat: position.coords.latitude,
                          lng: position.coords.longitude
                        };

                        console.log(pos);

                        var iconImage = {
                            url: "img/icon_locationpin.png",
                            scaledSize: new google.maps.Size(34, 40),
                            origin: new google.maps.Point(0, 0),
                            anchor: new google.maps.Point(0, 40)
                        }

                        //Google Map Marker
                        window.myLatLng = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };

                        if (typeof myLocate !== "undefined") {
                            myLocate.setMap(null);
                        }

                        window.myLocate = new google.maps.Marker({
                            position: myLatLng,
                            map: window.map,
                            icon: iconImage
                            //icon: "img/icon_locationpin.png"
                            //label: ""
                        });

                        setTimeout(function(){
                            //set center
                            window.map.setCenter(myLatLng);
                        }, 2000);

                    };

                    window.locationError = function(error) {
                        console.log(error);
                    };

                    //set food in marker
                    for (var i=0; i<food.length; i++) {
                        geocodeAddress(window.geocoder, window.map, food[i].address, food[i].name);
                    }

                    navigator.geolocation.getCurrentPosition(locationSuccess, locationError, {       
                        enableHighAccuracy: true
                    });
                } else {
                    console.log("---------2");
                }
        });

        $("#viewQStoreMain").on("pagehide", function (event, ui) {

        });

        /********************************** dom event *************************************/

    }
});