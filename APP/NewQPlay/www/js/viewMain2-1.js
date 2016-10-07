
$(document).one("pagecreate", "#viewMain2-1", function(){
    
    $("#viewMain2-1").pagecontainer({
        create: function(event, ui) {
            
            /********************************** function *************************************/
            function QueryAppList() {
                var self = this;

                this.successCallback = function(data) {
                    var resultcode = data['result_code'];
                    
                    if (resultcode == 1) {
                        var responsecontent = data['content'];
                        appcategorylist = responsecontent.app_category_list;
                        applist = responsecontent.app_list;
                        appmultilang = responsecontent.multi_lang;
                        
                        $('#appcontent').html(""); // empty html content
                        var carouselItem;
                        
                        var carousel_Settings = {
                            touchDrag: false,
                            mouseDrag: false,
                            loop:false,
                            nav:false,
                            margin:0,
                            responsive:{
                                0:{
                                    items:1
                                },
                                100:{
                                    items:2
                                },
                                350:{
                                    items:4
                                }
                            }
                        };
                        
                        for (var categoryindex=0; categoryindex<appcategorylist.length; categoryindex++) {
                          var catetoryname = appcategorylist[categoryindex].app_category;
                          $('#appcontent').append('<h4>' + catetoryname + '</h4>');
                          $('#appcontent').append('<div class="owl-carousel owl-theme"' + 'id=qplayapplist' + categoryindex.toString() + '></div>');
                          var owl = $("#qplayapplist"+ categoryindex.toString()), i = 0, textholder, booleanValue = false;
                          //init carousel
                          owl.owlCarousel(carousel_Settings);
                          
                          for (var appindex=0; appindex<applist.length; appindex++) {
                            var appcategory = applist[appindex].app_category;
                            if (appcategory == catetoryname){
                              var appurl = applist[appindex].url;
                              var appurlicon = applist[appindex].icon_url;
                              var packagename = applist[appindex].package_name;
                              
                              carouselItem = "<div class=\"owl-item\"><a value=" + appindex.toString() + " id=\"application" + appindex.toString() + "\"  href=\"#appdetail2-2\"><img src=\"" + applist[appindex].icon_url + "\" style=\"width:50px;height:50px;\"></a><p style=\"font-size:0.8em;margin-top:0px;text-align:center;\">" + packagename.substr(5) + "</p></div>";
                              
                              $("#qplayapplist"+ categoryindex.toString()).owlCarousel('add', carouselItem).owlCarousel('refresh');
                              
                              // fix me !!!!
                              //if (packagename == "benq.qplay") {
                              //    app.changeLevel(applist[appindex].security_level);
                              //}
                            } // if (appcategory == catetoryname)
                          } // for appindex
                        } // for categoryindex
                        
                        $('a[id^="application"]').click(function(e) {
                            e.stopImmediatePropagation();
                            e.preventDefault();
                            
                            selectAppIndex = this.getAttribute('value');
                            //callDisplayAppDetail(selectAppIndex);
                            $.mobile.changePage('#viewAppDetail2-2');
                        });
                    } // if (resultcode == 1)
                    else {
                        alert(data['message']);
                    }
                }; 

                this.failCallback = function(data) {};

                var __construct = function() {
                    QPlayAPI("GET", "getAppList", self.successCallback, self.failCallback);
                }();

            }

            /********************************** page event *************************************/
            $("#viewMain2-1").one("pagebeforeshow", function(event, ui) {
                QueryAppList();
            });

            $("#viewMain2-1").one("pageshow", function(event, ui) {

            });

            /********************************** dom event *************************************/
        }
    });

});