var qstoreDetailData = [];

$("#viewQStoreDetail").pagecontainer({
    create: function (event, ui) {

        /********************************** function *************************************/
       

        /********************************** page event ***********************************/

        $("#viewQStoreDetail").one("pageshow", function (event, ui) {

        });

        $("#viewQStoreDetail").on("pageshow", function (event, ui) {
            var qstoreListArr = JSON.parse(localStorage.getItem("allQstoreListData"));           
            qstoreDetailData = qstoreListArr.filter(function(item, index, array){
                if (item.MIndex === parseInt(qstoreNo)) {
                    return item;
                }
            });
            var qstoreName = qstoreDetailData[0].Subject.toString().replace(/[\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g,"");
            $(".qstore-name-title").empty().append(qstoreName);
            var qstoreAddress = qstoreDetailData[0].Address.toString();
            var qstorePhone = qstoreDetailData[0].Phone.toString();
            var qstoreCategory = qstoreDetailData[0].Category.toString();
            var qstoreSummary = qstoreDetailData[0].Summary.toString();

        });

        $("#viewQStoreDetail").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/

       

    }
});