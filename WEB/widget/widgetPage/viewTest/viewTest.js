/*var familyArr = [{family_id:"1", name:"王小明", relation:"父母", birthday:"1980/01/01", idtype:"0", idno:"A123456789"},
                {family_id:"2", name:"王小美", relation:"父母", birthday:"1981/01/01", idtype:"0", idno:"A123456788"}]; */


$("#viewTest").pagecontainer({
    create: function (event, ui) {
        /********************************** function *************************************/




    
    
     
        
        /********************************** page event *************************************/
        $("#viewTest").one("pageshow", function (event, ui) {
            var imgURL = "/widget/widgetPage/viewFamilyData/img/";

            //$(".family-add-content").attr("scr", serverURL + imgURL + 'floating_add.png');

        });

        $("#viewTest").on("pageshow", function (event, ui) {

        });

        $(document).on('click', '#viewTest .insuranceMenu', function() {
            $("#mypanel").panel("open");
            $(".page-mask").show();
        })

    }
});