var HR = [{eName:"Anna.W.Wu", site:"Qisda", ext:"8800-2351", time:"星期一至星期五", room:"HR Office", email:"Anna.W.Wu@Qisda.com"}, 
          {eName:"Jill.Lee", site:"BenQ", ext:"8800-7718", time:"星期一至星期五", room:"HR Office", email:"Jill.Lee@BenQ.com"}];
var insurStaff = [{cName:"陳毓慈", site:"台北", ext:"0918-930118", time:"星期二、星期四 12:30~13:30", room:"2F 物理治療室", email:"0094106725@agt.taiwanlife.com"},
                  {cName:"王婷中", site:"台北", ext:"0939-683521", time:"星期二、星期四 12:30~13:30", room:"2F 物理治療室", email:""},
                  {cName:"吳宗穎", site:"台北", ext:"0918-880037", time:"星期二、星期四 12:30~13:30", room:"2F 物理治療室", email:"0094201669@agt.taiwanlife.com"},
                  {cName:"鄭鈞陽", site:"桃園", ext:"0927-261507", time:"星期一、星期四 12:00~13:20", room:"2F OK旁走廊", email:"nickyvi0203@gmail.com"},
                  {cName:"黃千芩", site:"桃園", ext:"0958-946371", time:"星期一、星期四 12:00~13:20", room:"2F OK旁走廊", email:"vivi732329@gmail.com"}];

$("#viewContact").pagecontainer({
    create: function(event, ui) {
        
        /********************************** function *************************************/
        function QueryContactInfo() {
            var hrHtmlContent = "";
            var insurHtmlContent = "";
            for (var i=0; i<HR.length; i++){
                var hrContent = hrHtmlContent
                    + '<li>'
                    +   '<div class="name">'
                    +       '<p><a href="#" value="' + i.toString() + '" name="detailIndex">' + HR[i].eName + '</a></p>'
                    +       '<p><a href="#" value="' + i.toString() + '" name="detailIndex">' + HR[i].site + '</a></p>'
                    +   '</div>'
                    +   '<div class="img-phone divvertical-center">'
                    +       '<div class="tel-num">'
                    +           '<img src = "img/phone.png">'
                    +           '<a rel="external"  href="tel:"' + HR[i].ext + '">' + HR[i].ext + '</a>'
                    +       '</div>'
                    +   '</div>'
                    +   '<div class="img-info divvertical-center">'
                    +       '<div class="tel-num">'
                    +           '<p><a href="#" value="' + i.toString() + '" name="detailIndex"><img src="img/info.png"></a></p>'
                    +       '</div>'
                    +   '</div>'
                    + '</li>';

                hrHtmlContent = hrContent;
            }
            $("#employeeData").html("");
            $("#employeeData").prepend($(hrHtmlContent)).enhanceWithin();
            $('#employeeData').listview('refresh');

            for (var i=0; i<insurStaff.length; i++){
                var insurContent = insurHtmlContent
                    + '<li>'
                    +   '<div class="name">'
                    +       '<p><a href="#" value="' + i.toString() + '" name="detailIndex">' + insurStaff[i].cName + '</a></p>'
                    +       '<p><a href="#" value="' + i.toString() + '" name="detailIndex">' + insurStaff[i].site + '</a></p>'
                    +   '</div>'
                    +   '<div class="img-phone divvertical-center">'
                    +       '<div class="tel-num">'
                    +           '<img src = "img/phone.png">'
                    +           '<a rel="external"  href="tel:"' + insurStaff[i].ext + '">' + insurStaff[i].ext + '</a>'
                    +       '</div>'
                    +   '</div>'
                    +   '<div class="img-info divvertical-center">'
                    +       '<div class="tel-num">'
                    +           '<p><a href="#" value="' + i.toString() + '" name="detailIndex"><img src="img/info.png"></a></p>'
                    +       '</div>'
                    +   '</div>'
                    + '</li>';

                insurHtmlContent = insurContent;
            }
            $("#insranceStaffData").html("");
            $("#insranceStaffData").prepend($(insurHtmlContent)).enhanceWithin();
            $('#insranceStaffData').listview('refresh');
        }      

        /********************************** page event *************************************/
        $("#viewContact").on("pagebeforeshow", function(event, ui){

        });

        $("#viewContact").on("pageshow", function(event, ui) {
            loadingMask("hide");
            QueryContactInfo();
            $('.contact-info').show();
            $('.contact-detail').hide();
        });

        /********************************** dom event *************************************/

        $(document).on("click", "#employeeData .img-info", function() {
            $('.contact-info').hide();
            $('.contact-detail').show();
            $('#backContactInfo').show();
            $('#viewContact .insuranceMenu').hide();
            var hrID = $(this).find('div > p > a:nth-child(1)').attr('value'); 
            var DetailHtmlContent = ""          
            DetailHtmlContent += '<div class="name font-style1">' + HR[hrID].eName + '</div>'                  
                + '<div class="site font-style3">' + HR[hrID].site + '</div>'
                + '<li>'
                +       '<div class="phone font-style7">電話</div>'
                +       '<a rel="external" class="font-style10" href="tel:"' + HR[hrID].ext + '">'+ HR[hrID].ext + '</a>'
                + '</li>'
                + '<li>'
                +       '<div class="other font-style7">駐點時間</div>' 
                +       '<a rel="external" class="font-style10">' + HR[hrID].time + '</a>'
                + '</li>'
                + '<li>'
                +       '<div class="other font-style7">地點</div>'
                +       '<a rel="external" class="font-style10">'  + HR[hrID].room + '</a>'
                + '</li>'
                + '<li>'
                +       '<div class="other font-style7">E-Mail</div>'  
                +       '<a rel="external" class="font-style10" href="mailto:"' + HR[hrID].email + '">' + HR[hrID].email + '</a>'
                + '</li>';   
            $("#detailInfo").html("");
            $("#detailInfo").prepend($(DetailHtmlContent)).enhanceWithin();      
        });

         $(document).on("click", "#insranceStaffData .img-info", function() {
            $('.contact-info').hide();
            $('.contact-detail').show();
            $('#backContactInfo').show();
            $('#viewContact .insuranceMenu').hide();
            var insurID = $(this).find('div > p > a:nth-child(1)').attr('value');   
            var DetailHtmlContent = ""          
            DetailHtmlContent += '<div class="name font-style1">' + insurStaff[insurID].cName + '</div>'                  
                + '<div class="site font-style3">' + insurStaff[insurID].site + '</div>'
                + '<li>'
                +       '<div class="phone font-style7">電話</div>'
                +       '<a rel="external" class="font-style10" href="tel:"' + insurStaff[insurID].ext + '">' + insurStaff[insurID].ext + '</a>'
                + '</li>'
                + '<li>'
                +       '<div class="other font-style7">駐點時間</div>' 
                +       '<a rel="external" class="font-style10">' + insurStaff[insurID].time + '</a>'
                + '</li>'
                + '<li>'
                +       '<div class="other font-style7">地點</div>'
                +       '<a rel="external" class="font-style10">'  + insurStaff[insurID].room + '</a>'
                + '</li>'
                + '<li>'
                +       '<div class="other font-style7">E-Mail</div>'  
                +       '<a rel="external" class="font-style10" href="mailto:"' + insurStaff[insurID].email + '">' + insurStaff[insurID].email + '</a>'
                + '</li>';   
            $("#detailInfo").html("");
            $("#detailInfo").prepend($(DetailHtmlContent)).enhanceWithin();             
        });

        $("#backContactInfo").on("click", function() {
            $('.contact-info').show();
            $('.contact-detail').hide();
            $('#backContactInfo').hide(); 
            $('#viewContact .insuranceMenu').show();         
        });
       
    }
});




