
$("#viewQStoreMain").pagecontainer({
    create: function (event, ui) {

        window.myLocate;
        window.myLatLng;
        window.allMarker = [];
        var qstoreMapFromLocal = [];
        var filterQStoreListByCity;

        /********************************** function *************************************/
       
        function geocodeAddress(geocoder, resultsMap, address, name, category) {
            //var address = document.getElementById('address').value;
            //var address = "台北市內湖區基湖路16號";

            (function(geocoder, resultsMap, address, name, category) {
                geocoder.geocode({'address': address}, function(results, status) {

                    if (status === 'OK') {
                        var categoryIconUrl = "";
                        var imgURL = "/widget/widgetPage/viewQStoreMain/img/";

                        switch (category) {
                            case '食':
                                categoryIconUrl = serverURL + imgURL + 'icon_eatpin.png';
                                break;
                            case '衣':
                                categoryIconUrl = serverURL + imgURL + 'icon_clothpin.png';
                                break;
                            case '住':
                                categoryIconUrl = serverURL + imgURL + 'icon_livepin.png';
                                break;
                            case '行':
                                categoryIconUrl = serverURL + imgURL + 'icon_movingpin.png';
                                break;
                            case '育':
                                categoryIconUrl = serverURL + imgURL + 'icon_educationpin.png';
                                break;
                            case '樂':
                                categoryIconUrl = serverURL + imgURL + 'icon_recreationpin.png';
                                break;
                            case '其他':
                                categoryIconUrl = serverURL + imgURL + 'icon_otherspin.png';
                                break;
                            default:
                                categoryIconUrl = serverURL + imgURL + 'icon_otherspin.png';
                        }

                        var iconImage = {
                            url: categoryIconUrl,
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
            }(geocoder, resultsMap, address, name, category));

        }

        function markerInCenter(nowMarker) {
            window.map.setCenter(nowMarker.getPosition());
        }

        window.storeInfoPopup = function(nowMarker) {

            //User Info Popup
            $("#qstoreInfoPopup").popup("destroy").remove();

            var qstoreInfoPopupData = {
                id: "qstoreInfoPopup",
                content: $("template#tplStoreInfoPopup").html()
            };

            tplJS.Popup(null, null, "append", qstoreInfoPopupData);

            $("hr").remove(".ui-hr-bottom");
            $("#qstoreInfoPopup .button").hide();
            $("#qstoreInfoPopup .footer").hide();

            $(window.allMarker).each(function(index, item) {

                if (typeof nowMarker !== "undefined") {

                    if (item.attribution.source == nowMarker.attribution.source) {  

                        var title = item.title;

                        $.each($(qstoreMapFromLocal), function (index, item) {
                            if (this.Subject == title) {  
                                var imgURL = "/widget/widgetPage/viewQStoreMain/img/";
                                var selectCategory = this.Category;
                                var categoryImgUrl = "";
                                var pinImgUrl = serverURL + imgURL + 'pin.png';
                                var phoneImgUrl = serverURL + imgURL + 'phone.png';
                                switch (selectCategory) {
                                    case '食':
                                        categoryImgUrl = serverURL + imgURL + 'eat.png';
                                        break;
                                    case '衣':
                                        categoryImgUrl = serverURL + imgURL + 'cloth.png';
                                        break;
                                    case '住':
                                        categoryImgUrl = serverURL + imgURL + 'live.png';
                                        break;
                                    case '行':
                                        categoryImgUrl = serverURL + imgURL + 'moving.png';
                                        break;
                                    case '育':
                                        categoryImgUrl = serverURL + imgURL + 'education.png';
                                        break;
                                    case '樂':
                                        categoryImgUrl = serverURL + imgURL + 'recreation.png';
                                        break;
                                    case '其他':
                                        categoryImgUrl = serverURL + imgURL + 'others.png';
                                        break;
                                    default:
                                        categoryImgUrl = serverURL + imgURL + 'others.png';
                                }

                                $("#qstoreInfoPopup .detail-type-img").attr("src", categoryImgUrl);
                                $("#qstoreInfoPopup .pin-img").attr("src", pinImgUrl);
                                $("#qstoreInfoPopup .phone-img").attr("src", phoneImgUrl);
                                $("#qstoreInfoPopup .qstore-list-detail").html(title);
                                $("#qstoreInfoPopup .address-detail").html(this.Address);
                                var phoneUrl = "tel:" + this.Phone;
                                $("#qstoreInfoPopup .phone-type").attr("href", phoneUrl);
                                $("#qstoreInfoPopup .phone-type").html(this.Phone);
                                $("#qstoreInfoPopup .summary-content").html(this.Summary);

                                var endDate = new Date(this.Date2);
                                var month = ((endDate.getMonth() + 1 < 10) ? '0' + (endDate.getMonth() + 1) : endDate.getMonth() + 1);
                                var date = ((endDate.getDate() < 10) ? '0' + endDate.getDate() : endDate.getDate());
                                var qstoreEndDate = endDate.getFullYear() + '/' + month + '/' + date;
                                if (qstoreEndDate.substring(0, 4) === "9999") {
                                    qstoreEndDate = "無限期";
                                }
                                $("#qstoreInfoPopup .date-content").html(qstoreEndDate);
                            }
                        });
                    }
                }
            });

            

            $("#qstoreInfoPopup").popup("open");
        };

        $(document).on({
            click: function(event) {
                $("#qstoreInfoPopup").popup("close");
            }
        }, "#qstoreInfoPopup .close-popup");

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
                        geocodeAddress(window.geocoder, window.map, filterQStoreListByCity[i].Address, filterQStoreListByCity[i].Subject, filterQStoreListByCity[i].Category);   
                    } 

                    setTimeout(function() {
                        for (var i=10; i<20; i++) {
                            geocodeAddress(window.geocoder, window.map, filterQStoreListByCity[i].Address, filterQStoreListByCity[i].Subject, filterQStoreListByCity[i].Category);   
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