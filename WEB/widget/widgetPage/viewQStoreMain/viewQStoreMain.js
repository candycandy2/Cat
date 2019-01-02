$("#viewQStoreMain").pagecontainer({
    create: function(event, ui) {

        window.myLocate;
        window.myLatLng;
        window.allMarker = [];
        var locatedCity = "";
        var cityList = ["所有縣市", "基隆市", "台北市", "新北市", "宜蘭縣", "桃園市", "新竹市", "新竹縣", "苗栗縣", "台中市", "彰化縣", "南投縣", "雲林縣", "嘉義市", "嘉義縣", "台南市", "高雄市", "屏東縣", "花蓮縣", "台東縣", "澎湖縣", "金門縣", "連江縣"];
        var cityList_english = ["所有縣市", "基隆市", "Taipei City", "新北市", "宜蘭縣", "桃園市", "新竹市", "新竹縣", "苗栗縣", "台中市", "彰化縣", "南投縣", "雲林縣", "嘉義市", "嘉義縣", "台南市", "高雄市", "屏東縣", "花蓮縣", "台東縣", "澎湖縣", "金門縣", "連江縣"];

        /*
        Object = $2
        Address: "台北市松山區復興北路315號"
        Category: "住"
        ContactPerson: "Leo"
        County: "台北市"
        Date1: "10/25/2018 12:00:00 AM"
        Date2: "12/31/2019 12:00:00 AM"
        Email: "marketing.fullerton@gmail.com"
        Images: ["", "", "", "", "", "", "", "", "", ""] (10)
        MIndex: 254
        Phone: "02-2713-8181"
        Position: "(22.7664711,121.13097040000002)"
        Subject: "台北馥敦飯店"
        Summary: "詳如附件"
        Township: "松山區"
        UpdateDate: "12/31/2018 3:42:55 PM"
        Object Prototype
        */
        /********************************** function *************************************/
        // Adds a marker to the map and push to the array.
        function addMarker(location_, map_, name_, iconImage_, address_) {
            var marker = new google.maps.Marker({
                map: map_,
                position: location_,
                title: name_,
                attribution: {
                    source: location_.toString()
                },
                icon: iconImage_
            });
            markers.push(marker);

            var contentString = '<div id="content"> 這個地址是:' + address_ + '</div>';
            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });
            marker.addListener('click', function() {
                window.map.setCenter(marker.getPosition());
                window.storeInfoPopup(marker);
            });
        }

        // Sets the map on all markers in the array.
        function setMapOnAll(map) {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(map);
            }
        }

        // Removes the markers from the map, but keeps them in the array.
        function clearMarkers() {
            setMapOnAll(null);
        }

        // Shows any markers currently in the array.
        function showMarkers() {
            setMapOnAll(map);
        }

        // Deletes all markers in the array by removing references to them.
        function deleteMarkers() {
            clearMarkers();
            markers = [];
        }

        function addToMarks(QStoreList_) {
            $.each($(QStoreList_), function(index, item) {
                var categoryIconUrl = "";
                var imgURL = "/widget/widgetPage/viewQStoreMain/img/";

                switch (item.Category) {
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

                var pos = [0, 0];
                if (item.Position != "") {
                    item.Position = item.Position.replace('(', '[');
                    item.Position = item.Position.replace(')', ']');
                    pos = JSON.parse(item.Position);
                    var latlng = new google.maps.LatLng(pos[0], pos[1]);
                    addMarker(latlng, window.map, item.Subject, iconImage, item.Address);
                }
            });
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

            $(markers).each(function(index, item) {

                if (typeof nowMarker !== "undefined") {

                    if (item.attribution.source == nowMarker.attribution.source) {

                        var title = item.title;

                        $.each($(qstoreWidget.allQStoreList), function(index, item) {
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

        $("#viewQStoreMain").one("pageshow", function(event, ui) {
            var imgURL = "/widget/widgetPage/viewQStoreMain/img/";
            $(".searchImg").attr("scr", serverURL + imgURL + "nav_search.png");

            if (localStorage.getItem(qstoreWidget.QStoreLocalStorageKey) !== null) {
                qstoreWidget.allQStoreList = JSON.parse(localStorage.getItem(qstoreWidget.QStoreLocalStorageKey));
                addToMarks(qstoreWidget.allQStoreList);
            } else {
                //第一次進入
                //將QStoreList按七種類別，存入localStorage
                loadingMask("show");
                qstoreWidget.QueryStoreList(1)
                    .then(qstoreWidget.QueryStoreList(2))
                    .then(qstoreWidget.QueryStoreList(3))
                    .then(qstoreWidget.QueryStoreList(4))
                    .then(qstoreWidget.QueryStoreList(5))
                    .then(qstoreWidget.QueryStoreList(6))
                    .then(qstoreWidget.QueryStoreList(7))
                    .then(addToMarks(qstoreWidget.allQStoreList));
            }

        });

        $("#viewQStoreMain").on("pageshow", function(event, ui) {
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

                    window.myLocate = new google.maps.Marker({
                        position: myLatLng,
                        map: window.map,
                        icon: iconImage,
                        mapTypeControl: false,
                        streetViewControl: false,
                        rotateControl: false,
                        fullscreenControl: false
                    });

                    window.map.setCenter(myLatLng);
                };

                window.locationError = function(error) {
                };

                navigator.geolocation.getCurrentPosition(locationSuccess, locationError, {
                    enableHighAccuracy: true
                });
            } else {
                console.log("---------2");
            }
        });

        $("#viewQStoreMain").on("pagehide", function(event, ui) {

        });

        /********************************** dom event *************************************/
        $("#search").on("click", function () {
            checkWidgetPage('viewQStoreSearchList', pageVisitedList);
        });      
    }
});