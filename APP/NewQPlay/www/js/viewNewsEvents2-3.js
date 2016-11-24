
$(document).one("pagecreate", "#viewNewsEvents2-3", function(){
    
    $("#viewNewsEvents2-3").pagecontainer({
        create: function(event, ui) {
            
            /********************************** function *************************************/
            window.QueryMessageList = function() {
                var self = this;

                this.successCallback = function(data) {
                    var resultcode = data['result_code'];
                    
                    if (resultcode == 1) {
                        
                        if (loginData["messagecontent"] === null) {
                            loginData["messagecontent"] = data['content'];
                            window.localStorage.setItem("messagecontent", JSON.stringify(data['content']));

                            messagecontent = data['content'];
                        } else {

                            var localContent = JSON.parse(loginData["messagecontent"]);
                            messagecontent = data['content'];

                            if (messagecontent.message_count !== 0) {
                                for (var messageindex=0; messageindex<messagecontent.message_count; messageindex++) {
                                    var message = messagecontent.message_list[messageindex];

                                    localContent.message_count = parseInt(localContent.message_count + 1, 10);
                                    localContent.message_list.unshift(message);
                                }
                            }

                            messagecontent = localContent;
                        }

                        var newsListItems = "";
                        var eventListItems = "";

                        for (var messageindex=0; messageindex<messagecontent.message_count; messageindex++)
                        {
                          var message = messagecontent.message_list[messageindex];
                          if (message.message_type == "news") // 1:news  2:event
                          {
                              var title = message.message_title;
                              var txt = message.message_txt;
                              var rowid = message.message_send_row_id;
                              var time = message.create_time;
                              
                              newsListItems += "<li><a value=" + messageindex.toString() + " id=\"messageindex" + messageindex.toString() + "\"><h2 style=\"white-space:pre-wrap;\">" + title + "</h2><p>" + time + "</p></a></li>";
                          }
                          else if (message.message_type == "event")
                          {
                              var title = message.message_title;
                              var txt = message.message_text;
                              var rowid = message.message_send_row_id;
                              var time = message.create_time;
                              
                              eventListItems += "<li><a value=" + messageindex.toString() + " id=\"messageindex" + messageindex.toString() + "\"><h2 style=\"white-space:pre-wrap;\">" + title + "</h2><p>" + time + "</p></a></li>";
                          }
                        }

                        $("#newslistview").html(newsListItems);
                        $("#newslistview").listview('refresh');
                        $("#eventlistview").html(eventListItems);
                        $("#eventlistview").listview('refresh');

                        $('a[id^="messageindex"]').click(function(e) {
                            e.stopImmediatePropagation();
                            e.preventDefault();
                          
                            var i = this.getAttribute('value');
                            messageRowId = messagecontent.message_list[i].message_send_row_id;
                            $.mobile.changePage("#viewWebNews2-3-1");
                        });
                    } // if (resultcode == 1)
                    else {
                        
                    }
                }; 

                this.failCallback = function(data) {};

                var __construct = function() {

                    var timeStamp = Math.round((new Date()).getTime() / 1000);

                    if (msgDateFromType === "month") {
                        timeStamp = timeStamp - (60 * 60 * 24 * 30);
                    }

                    apiGetMessageList(self.successCallback, self.failCallback);
                }();
            }

            function tabChange() {
                $("#" + activeNvrDiv).show();
                $("#" + inactiveNvrDiv).hide();
                $("#" + activeNvrBar).addClass("ui-btn-active");
                $("#" + inactiveNvrBar).removeClass("ui-btn-active");
            }

            /********************************** page event *************************************/
            $("#viewNewsEvents2-3").one("pagebeforeshow", function(event, ui) {
                activeNvrBar = "navNews";
                activeNvrDiv = "newspage2-3";
                inactiveNvrBar = "navEvents";
                inactiveNvrDiv = "eventspage2-3b";
            });

            $("#viewNewsEvents2-3").one("pageshow", function(event, ui) {

            });

            $("#viewNewsEvents2-3").on("pagebeforeshow", function(event, ui) {
                tabChange();
            });

            /********************************** dom event *************************************/
            $("#navNews").on("click", function() {
                activeNvrBar = "navNews";
                inactiveNvrBar = "navEvents";
                activeNvrDiv = "newspage2-3";
                inactiveNvrDiv = "eventspage2-3b";
                tabChange();
            });

            $("#navEvents").on("click", function() {
                activeNvrBar = "navEvents";
                inactiveNvrBar = "navNews";
                activeNvrDiv = "eventspage2-3b";
                inactiveNvrDiv = "newspage2-3";
                tabChange();
            });
        }
    });

});