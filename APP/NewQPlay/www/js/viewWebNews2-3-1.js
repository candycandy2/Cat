
$(document).one("pagecreate", "#viewWebNews2-3-1", function(){
    
    $("#viewWebNews2-3-1").pagecontainer({
        create: function(event, ui) {
            
            /********************************** function *************************************/
            function QueryMessageDetail() {
                var self = this;

                this.successCallback = function(data) {
                    var resultcode = data['result_code'];
                    
                    if (resultcode == 1) {
                        var responsecontent = data['content'];

                        if (responsecontent.message_type == "news") // 1:news  2:event
                        {
                            var title = responsecontent.message_title;
                            var messagetext = responsecontent.message_text;
                            var messagehtml = responsecontent.message_html;
                            var rowid = responsecontent.message_send_row_id;
                            var time = responsecontent.create_time;
                            var author = responsecontent.create_user;

                            var element = document.getElementById("newsDetailCreateTime");
                            element.textContent = time.substr(0, 10);

                            element = document.getElementById("newsDetailTitle");
                            element.textContent = title;

                            element = document.getElementById("newsAuthor");
                            element.textContent = author;

                            element = document.getElementById("newsContent");
                            element.textContent = messagetext;
                        }
                        else if (responsecontent.message_type == "event")
                        {
                            var title = responsecontent.message_title;
                            var messagetext = responsecontent.message_text;
                            var messagehtml = responsecontent.message_html;
                            var rowid = responsecontent.message_send_row_id;
                        }
                    } // if (resultcode == 1)
                    else {
                        
                    }
                }; 

                this.failCallback = function(data) {};

                var __construct = function() {
                    getMessageDetail(self.successCallback, self.failCallback, messageRowId);
                }();
            }
            
            /********************************** page event *************************************/
            $("#viewWebNews2-3-1").on("pagebeforeshow", function(event, ui) {
                QueryMessageDetail();
            });

            $("#viewWebNews2-3-1").one("pageshow", function(event, ui) {

            });

            /********************************** dom event *************************************/
        }
    });

});