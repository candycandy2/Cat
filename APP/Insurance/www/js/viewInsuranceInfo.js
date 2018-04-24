

$("#viewInsuranceInfo").pagecontainer({
    create: function(event, ui) {
        
        /********************************** function *************************************/
      

        /********************************** page event *************************************/
        $("#viewInsuranceInfo").on("pagebeforeshow", function(event, ui){

        });

        $("#viewInsuranceInfo").on("pageshow", function(event, ui) {
            loadingMask("hide");
        });

        /********************************** dom event *************************************/
        
        $("#howtobuy").on('click', function() {
            window.open("http://blog.sina.com.tw/46272/article.php?entryid=574630", '_system');          
        });   

        $("#wrongsense").on('click', function() {
            window.open("http://blog.sina.com.tw/46272/article.php?entryid=574630", '_system');          
        }); 

        $("#booklist").on('click', function() {
            window.open("http://blog.sina.com.tw/46272/article.php?entryid=574630", '_system');          
        });  

        $("#QA").on('click', function() {
            window.open("http://blog.sina.com.tw/46272/article.php?entryid=574630", '_system');          
        });            
    }
});




