
$(document).one("pagecreate", "#viewNewsEvents2-3", function(){
    
    $("#viewNewsEvents2-3").pagecontainer({
        create: function(event, ui) {
            
            /********************************** function *************************************/
            function QueryMessageList() {
                var self = this;

                this.successCallback = function(data) {
                    var resultcode = data['result_code'];
                    
                    if (resultcode == 1) {
                        messagecontent = data['content'];
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
                              
                              eventListItems += "<li><a href='" + "#webnewspage2-3-1'><h2 style=" + "white-space:pre-wrap;" + ">" + title + '</h2><p>' + time + "</p></a></li>";
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
                    apiGetMessageList(self.successCallback, self.failCallback, "1470499200", "1476755108", "1", "200");
                }();
            }

            /********************************** page event *************************************/
            $("#viewNewsEvents2-3").one("pagebeforeshow", function(event, ui) {
                var messageList = new QueryMessageList();
            });

            $("#viewNewsEvents2-3").one("pageshow", function(event, ui) {

            });

            $("#viewNewsEvents2-3").on("pagebeforeshow", function(event, ui) {
                $("#newspage2-3").show();
                $("#eventspage2-3b").hide();
                $("#navNews").addClass("ui-btn-active");
                $("#navEvents").removeClass("ui-btn-active");
            });
            /********************************** dom event *************************************/
        }
    });

});