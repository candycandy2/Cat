
$("#viewMain").pagecontainer({
    create: function(event, ui) {

        var timer;
        var food;
        var market;
        window.myLocate;
        window.myLatLng;
        window.allMarker = [];
        var currentPositionMarker;
        var directionsDisplay;
        /********************************** viewMain *************************************/
        function geocodeAddress(geocoder, resultsMap, address, name) {
            //var address = document.getElementById('address').value;
            //var address = "台北市內湖區基湖路16號";

            (function(geocoder, resultsMap, address, name) {
                geocoder.geocode({'address': address}, function(results, status) {

                    if (status === 'OK') {
                        resultsMap.setCenter(results[0].geometry.location);

                        /*
                        var iconImage = {
                            url: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
                            size: new google.maps.Size(20, 32),
                            origin: new google.maps.Point(0, 0),
                            anchor: new google.maps.Point(0, 32)
                        }

                        var shape = {
                            coords: [1, 1, 1, 20, 18, 20, 18, 1],
                            type: 'poly'
                        };
                        */

                        var marker = new google.maps.Marker({
                        //window.marker = new google.maps.Marker({
                            map: resultsMap,
                            position: results[0].geometry.location,
                            title: name,
                            attribution: {
                                source: results[0].geometry.location.toString()
                            },
                            //icon: iconImage,
                            //shape: shape
                            icon: "img/markerA.png"
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
                            markerIcon(marker);

                            markerInCenter(marker);

                            markerDetail(marker);
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

        //Add by Jennifer
        //Show QStore Detail Info
        function markerDetail(nowMarker) {

            $(window.allMarker).each(function(index, item) {

                if (typeof nowMarker !== "undefined") {

                    if (item.attribution.source == nowMarker.attribution.source) {  

                        var title = item.title;

                        $.each($(food), function (index, item) {
                            if (this.name == title) {  
                                var shopDetailInfo = $("#tplShopDetailInfo");
                                shopDetailInfo.find(".name").html(title);
                                shopDetailInfo.find(".address").html(this.address);
                                //$("#detailContentOnMap").append(shopDetailInfo);
                            }
                        });
                    }
                }
            });

            $("#detailContentOnMap").fadeIn();
        }

        /*function markerText() {

            //jQuery bind Marker title
            $(".gmnoprint").each(function(index, dom) {

                var title = $(dom).prop("title");

                if (title.length > 0) {

                    //marker.setIcon will recovery the css style,
                    //so need to change it after every action.
                    $(dom).css({
                        opacity: 1,
                        overflow: "visible"
                    });

                    $(dom).find("img").css({
                        opacity: 0
                    });

                    if ($(dom).find(".test").length > 0) {
                        return;
                    }

                    $("<div class='test'>[ " + title + " ]</div>").appendTo($(dom));
                }
            });
        }*/

        //Show Marker Label
        /*function markerText(nowMarker) {
            //jQuery bind Marker title
            $(window.allMarker).each(function(index, item) {

                  if (typeof nowMarker !== "undefined") {

                    if (item.attribution.source == nowMarker.attribution.source) {  

                        var title = item.title;

                        if (title.length > 0) {
                            $("#map").find(".gm-style").find("img").each(function(i, dom) {
                                var markerSrc = $(dom).context.src;
                                var srcSection = markerSrc.split(/[\s/]+/);
                                var imgSrc = srcSection[srcSection.length-2] + '/' + srcSection[srcSection.length-1];
                                if (imgSrc == "img/markerB.png") {
                                    $("<div class='test'>[ " + title + " ]</div>").appendTo(dom.parentNode.parentNode);
                                }

                            });
                            
                        }
                    }
                }
            });
        }*/

        function markerIcon(nowMarker) {
            $(window.allMarker).each(function(index, marker) {
                //recovery the icon of all marker
                marker.setIcon("img/markerA.png");
            });

            nowMarker.setIcon("img/markerB.png");
        }

        function markerInCenter(nowMarker) {
            window.map.setCenter(nowMarker.getPosition());
        }

        function positionInCenter(position) {

            $(window.allMarker).each(function(index, marker) {
                //find the marker which need to be set in center
                if (position == marker.getAttribution().source) {
                    window.map.setCenter(marker.getPosition());

                    markerIcon(marker);
                }
            });

        }

        function clearAllMarker() {
            $(window.allMarker).each(function(index, marker) {
                marker.setMap(null);
            });
        }

        /********************************** function *************************************/

        function menuChange(type) {

            $("#searchList .list-item").hide();
            $("#searchList ." + type).show();
            $("#searchList").fadeIn();

            $("#menuList").panel("close");

            $(".page-header .q-btn-header").hide();
            $("#closeDataList").show();

            //change marker in map
            clearAllMarker();

            markerChange(type);
        }

        function markerChange(type) {

            if (type === "food") {
                for (var i=0; i<food.length; i++) {
                    geocodeAddress(window.geocoder, window.map, food[i].address, food[i].name);

                    if ((i+1) == food.length) {
                        setTimeout(function(){
                            if (typeof myLocate !== "undefined") {
                                myLocate.setMap(null);
                            }

                            myLocate = new google.maps.Marker({
                                position: myLatLng,
                                map: window.map,
                                //icon: icons["info"].icon,
                                label: "!A!"
                            });

                            window.map.setCenter(myLatLng);
                        }, 500);
                    }

                }
            } else if (type === "market") {
                for (var i=0; i<market.length; i++) {
                    geocodeAddress(window.geocoder, window.map, market[i].address, market[i].name);

                    if ((i+1) == market.length) {
                        setTimeout(function(){
                            if (typeof myLocate !== "undefined") {
                                myLocate.setMap(null);
                            }

                            myLocate = new google.maps.Marker({
                                position: myLatLng,
                                map: window.map,
                                //icon: icons["info"].icon,
                                label: "!A!"
                            });

                            window.map.setCenter(myLatLng);
                        }, 500);
                    }

                }
            }

        }

        function detailInfo(action) {

            if (action === "open") {
                $("#searchList").hide();
                $("#detailContent").fadeIn();

                $("#closeDataList").hide();
                $("#closeDetailContent").show();
            } else if (action === "close") {
                $("#searchList").fadeIn();
                $("#detailContent").hide();

                $("#closeDataList").show();
                $("#closeDetailContent").hide();
            }

        }

        window.QueryStoreList = function() {
            loadingMask("show");
            var self = this;
            this.successCallback = function(data) { 
                if (data['ResultCode'] === "1") {
                    QueryStoreListCallBackData = data['Content'];
                    loadingMask("hide");
                } else if (data['ResultCode'] === "044901") {
                    QueryStoreListCallBackData = data['Content'];
                    loadingMask("hide");
                } 
            };   

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "StoreList", self.successCallback, self.failCallback, QueryStoreListQueryData, "");
            }();
        };

        /********************************** page event *************************************/
        $("#viewMain").one("pagebeforeshow", function(event, ui) {

            $("#menuList").panel({
                display: "overlay",
                swipeClose: false,
                dismissible: true,
                open: function() {
                    $(".ui-panel").css({
                        "min-height": "100vh",
                        "max-height": "100vh",
                        "touch-action": "none"
                    });

                    $("<div class='ui-panel-background'></div>").appendTo("body");

                    if (device.platform === "iOS") {
                        var heightView = parseInt(document.documentElement.clientHeight * 100 / 100, 10);
                        var heightPanel = heightView - iOSFixedTopPX();

                        $("#menu").css({
                            'min-height': heightPanel + 'px',
                            'max-height': heightPanel + 'px',
                            'margin-top': iOSFixedTopPX() + 'px'
                        });
                    }

                    tplJS.preventPageScroll();
                },
                close: function() {
                    $(".ui-panel-background").remove();
                    tplJS.recoveryPageScroll();
                }
            });

            $("#settingList").panel({
                display: "overlay",
                position: "right",
                swipeClose: false,
                dismissible: true,
                open: function() {
                    $(".ui-panel").css({
                        "min-height": "100vh",
                        "max-height": "100vh",
                        "touch-action": "none"
                    });

                    $("<div class='ui-panel-background'></div>").appendTo("body");

                    if (device.platform === "iOS") {
                        var heightView = parseInt(document.documentElement.clientHeight * 100 / 100, 10);
                        var heightPanel = heightView - iOSFixedTopPX();

                        $("#menu").css({
                            'min-height': heightPanel + 'px',
                            'max-height': heightPanel + 'px',
                            'margin-top': iOSFixedTopPX() + 'px'
                        });
                    }

                    tplJS.preventPageScroll();
                },
                close: function() {
                    $(".ui-panel-background").remove();
                    tplJS.recoveryPageScroll();
                }
            });

            var categoryVal = '';
            var updateDate = '';
            var today = new Date();
            
            QueryStoreListQueryData = '<LayoutHeader><Category>' + 
                categoryVal + 
                '</Category><UpdateDate>' + 
                updateDate + 
                '</UpdateDate></LayoutHeader>';
            QueryStoreList();

            //Menu data list
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

            market = [{
                name: "全家便利商店-新瑞店",
                distance: 0.3,
                position: "(25.081055, 121.56342700000005)",
                address: "台北市內湖區堤頂大道二段407巷26號",
                phone: "02 2659 2842"
            }, {
                name: "萊爾富便利商店",
                distance: 0.2,
                position: "(25.079826, 121.56514659999993)",
                address: "台北市內湖區基湖路35巷11號",
                phone: "02 8751 8529"
            }, {
                name: "7-ELEVEN 堤頂店",
                distance: 0.4,
                position: "(25.0805365, 121.56295460000001)",
                address: "台北市內湖區堤頂大道二段411號",
                phone: "02 2659 7738"
            }, {
                name: "7-ELEVEN 瑞鑫門市",
                distance: 0.2,
                position: "(25.0801026, 121.56640049999999)",
                address: "台北市內湖區瑞光路580號",
                phone: "02 2657 9574"
            }];

            var searchListItemHTML = $("template#tplSearchListItem").html();

            for (var i=0; i<food.length; i++) {
                var searchListItem = $(searchListItemHTML);

                searchListItem.addClass("food");
                searchListItem.find(".name").html(food[i].name);
                searchListItem.find(".distance").html(food[i].distance + "公里");
                searchListItem.find(".marker-icon").data("position", food[i].position);
                searchListItem.find(".address").html(food[i].address);
                searchListItem.find(".phone").html(food[i].phone);

                $("#searchList").append(searchListItem);
            }

            for (var i=0; i<market.length; i++) {
                var searchListItem = $(searchListItemHTML);

                searchListItem.addClass("market");
                searchListItem.find(".name").html(market[i].name);
                searchListItem.find(".distance").html(market[i].distance + "公里");
                searchListItem.find(".marker-icon").data("position", market[i].position);
                searchListItem.find(".address").html(market[i].address);
                searchListItem.find(".phone").html(market[i].phone);

                $("#searchList").append(searchListItem);
            }

            $("#searchList").hide();
            $("#searchList .list-item").hide();
            $("#closeDataList").hide();

            $("#detailContent").hide();
            $("#closeDetailContent").hide();

            //searchStore event
            $(document).on({
                keyup: function() {

                    var text = $(this).val();

                    if (text.length == 0) {

                        if (timer !== null) {
                            clearTimeout(timer);
                        }

                        window.map.setCenter(myLatLng);
                    } else {

                        if (timer !== null) {
                            clearTimeout(timer);
                        }

                        timer = setTimeout(function() {

                            $(window.allMarker).each(function(index, marker) {
                                if (marker.getTitle().indexOf(text) != -1) {

                                    markerIcon(marker);
                                    markerInCenter(marker);

                                }
                            });

                        }, 2000);

                    }
                }
            }, "#searchStore");
        });

        function setCurrentPosition(position) {

            console.log("--------success");

            //Google Map Marker
            window.myLatLng = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            if (typeof myLocate !== "undefined") {
                myLocate.setMap(null);
            }

            currentPositionMarker = new google.maps.Marker({
                position: myLatLng,
                map: window.map,
                //icon: icons["info"].icon,
                label: "!A!"
            });

            setTimeout(function(){
                //set center
                window.map.setCenter(myLatLng);
            }, 2000);

        }

        function watchCurrentPosition() {
            var positionTimer = navigator.geolocation.watchPosition(
            function (position) {
                setMarkerPosition(
                    currentPositionMarker,
                    position
                );
            });
        }

        function setMarkerPosition(marker, position) {
            /*marker.setPosition(
                new google.maps.LatLng(
                    position.coords.latitude,
                    position.coords.longitude)
            );*/
            //Test Direction
            var origin1 = { lat: position.coords.latitude, lng: position.coords.longitude };
            var destination1 = { lat: 25.037906, lng: 121.549781 };  
            var directionsService = new google.maps.DirectionsService;

            if(typeof directionsDisplay !== "undefined") {
                directionsDisplay.setMap(null);
            }

            directionsDisplay = new google.maps.DirectionsRenderer({
                map: window.map,
                preserveViewport: true
            });

            //var onChangeHandler = function() {
                calculateAndDisplayRoute(directionsService, directionsDisplay, origin1, destination1);
            //};                  
        }

        function calculateAndDisplayRoute(directionsService, directionsDisplay, origin1, destination1) {
            directionsService.route({
                origin: origin1,
                destination: destination1,
                travelMode: 'WALKING'
            }, function(response, status) {
                console.log("===========1111");
                console.log(status);
                console.log(response);
                if (status === 'OK') {
                    directionsDisplay.setDirections(response);
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            });
        }

        function displayAndWatch(position) {
            // set current position
            setCurrentPosition(position);
            // watch position
            watchCurrentPosition();
        }

        function locationError(error) {
            console.log(error);
            alert("------error");
        }

        function initLocationProcedure() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(displayAndWatch, locationError, {       
                        enableHighAccuracy: true
                });
            } else {
                alert("Your browser does not support the Geolocation API");
            }
        }

        $("#viewMain").on("pagebeforeshow", function(event, ui) {

            //$(document).ready(function() {

                console.log("=========== ready");

                initLocationProcedure();  

            //});

        });

        /********************************** dom event *************************************/
        
        //header button
        $(document).on({
            click: function() {
                $("#menuList").panel("open");
            }
        }, "#menu");

        $(document).on({
            click: function() {
                $("#settingList").panel("open");
            }
        }, "#setting");

        //menu button
        $(document).on({
            click: function() {
                menuChange("food");
            }
        }, "#food");

        $(document).on({
            click: function() {
                menuChange("market");
            }
        }, "#market");

        //data list close
        $(document).on({
            click: function() {

                $("#searchList").fadeOut();

                $(".page-header .q-btn-header").show();
                $("#closeDataList").hide();
                $("#closeDetailContent").hide();

            }
        }, "#closeDataList");

        //function list click item
        $(document).on({
            click: function(event) {

                var functionName = $(event.target).parents(".function-list").prop("id");

                if (functionName === "settingList") {
                    $("#settingList").panel("close");
                }

            }
        }, ".function-list .item");

        //searchList click detail info
        $(document).on({
            click: function(event) {
                detailInfo("open");
            }
        }, "#searchList .list-item .button");

        //searchList click marker icon
        $(document).on({
            click: function(event) {
                console.log($(this).data("position"));
                positionInCenter($(this).data("position"));

                $("#searchList").fadeOut();

                $(".page-header .q-btn-header").show();
                $("#closeDataList").hide();
                $("#closeDetailContent").hide();
            }
        }, "#searchList .list-item .marker-icon");

        //close detail info
        $(document).on({
            click: function(event) {
                detailInfo("close");
            }
        }, "#closeDetailContent");

    }
});
