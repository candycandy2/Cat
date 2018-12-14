
$("#viewQStoreMain").pagecontainer({
    create: function (event, ui) {

        var food;
        window.myLocate;
        window.myLatLng;
        window.allMarker = [];
        var qstoreMapFromLocal = [];
        var filterQStoreListByCity;

        /********************************** function *************************************/
       
        function geocodeAddress(geocoder, resultsMap, address, name) {
            //var address = document.getElementById('address').value;
            //var address = "台北市內湖區基湖路16號";

            (function(geocoder, resultsMap, address, name) {
                geocoder.geocode({'address': address}, function(results, status) {

                    if (status === 'OK') {
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
                            window.storeInfoPopup(marker);
                        });

                        /*marker.addListener('icon_changed', function() {
                            setTimeout(function(){
                                markerText(marker);
                            }, 500);
                        });*/

                    } else if (status === 'OVER_QUERY_LIMIT'){
                        //alert('Geocode was not successful for the following reason: ' + status);
                        //return new Promise(resolve => setTimeout(resolve, 2000));
                    }

                });
            }(geocoder, resultsMap, address, name));

        }

        function markerInCenter(nowMarker) {
            window.map.setCenter(nowMarker.getPosition());

        }

        window.storeInfoPopup = function(marker) {

            //User Info Popup
            $("#qstoreInfoPopup").popup("destroy").remove();

            var qstoreInfoPopupData = {
                id: "qstoreInfoPopup",
                content: $("template#tplStoreInfoPopup").html()
            };

            tplJS.Popup(null, null, "append", qstoreInfoPopupData);

            $("#qstoreInfoPopup .button").hide();
            $("#qstoreInfoPopup .footer").hide();
            $("#qstoreInfoPopup").popup("open");
        };

        $(document).on({
            click: function(event) {
                $("#qstoreInfoPopup").popup("close");
            }
        }, "#qstoreInfoPopup .close-popup");

        //Show QStore Detail Info
        function markerDetail(nowMarker) {

            $(window.allMarker).each(function(index, item) {

                if (typeof nowMarker !== "undefined") {

                    if (item.attribution.source == nowMarker.attribution.source) {  

                        var title = item.title;

                        $.each($(qstoreMapFromLocal), function (index, item) {
                            if (this.Subject == title) {  
                                var shopDetailInfo = $("#tplShopDetailInfo");
                                shopDetailInfo.find(".name").html(title);
                                shopDetailInfo.find(".address").html(this.Address);
                                $("#detailContentOnMap").append(shopDetailInfo);
                            }
                        });
                    }
                }
            });

            $("#detailContentOnMap").fadeIn();
        }

        /********************************** page event ***********************************/

        $("#viewQStoreMain").one("pageshow", function (event, ui) {

            if (localStorage.getItem(qstoreWidget.QStoreLocalStorageKey) !== null) {
                qstoreMapFromLocal = JSON.parse(localStorage.getItem(qstoreWidget.QStoreLocalStorageKey));
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
                    .then(qstoreMapFromLocal = JSON.parse(localStorage.getItem(qstoreWidget.QStoreLocalStorageKey)));                    
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

                    /*callGeocodeAddress(0)
                    .then(callGeocodeAddress(10))*/

                    filterQStoreListByCity = qstoreMapFromLocal.filter(function(item, index, array) {
                        if (item.County === "台北市") {
                            return item;
                        }
                    });
                    
                    for (var i=0; i<10; i++) {
                        geocodeAddress(window.geocoder, window.map, filterQStoreListByCity[i].Address, filterQStoreListByCity[i].Subject);   
                    } 

                    setTimeout(function() {
                        for (var i=10; i<20; i++) {
                            geocodeAddress(window.geocoder, window.map, filterQStoreListByCity[i].Address, filterQStoreListByCity[i].Subject);   
                        }
                    }, 1000);

                    navigator.geolocation.getCurrentPosition(locationSuccess, locationError, {       
                        enableHighAccuracy: true
                    });
                } else {
                    console.log("---------2");
                }
        });

        function callGeocodeAddress(index) {
            return new Promise(function(resolve, reject) {
                var endIndex = index + 10;
                for (var i=index; i<endIndex; i++) {
                    geocodeAddress(window.geocoder, window.map, allQStoreList[i].Address, allQStoreList[i].Subject);   
                } 
            });
        }

        $("#viewQStoreMain").on("pagehide", function (event, ui) {

        });

        /********************************** dom event *************************************/

    }
});