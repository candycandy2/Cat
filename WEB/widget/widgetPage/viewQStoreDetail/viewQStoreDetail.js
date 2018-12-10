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
            var endDate =  new Date(qstoreDetailData[0].Date2);
            var month = ((endDate.getMonth() + 1 < 10) ? '0' + (endDate.getMonth() + 1) : endDate.getMonth() + 1 );
            var date = ((endDate.getDate() < 10) ? '0' + endDate.getDate() : endDate.getDate());
            var qstoreEndDate = endDate.getFullYear() + '/' + month + '/' + date;
            if (qstoreEndDate.substring(0, 4) === "9999") {
                qstoreEndDate = "無限期"
            } 

            if (qstoreDetailData[0].Distance == undefined) {
                var qstoreDistance = "";
            } else {
                var qstoreDistance = qstoreDetailData[0].Distance;
            }

            var qStoreDetailInfo = ""; 
            qStoreDetailInfo += ' <div class="basic-info font-style10">';
            switch (qstoreCategory) {
                case '食':
                    qStoreDetailInfo += '<div><img src="img/eat.png" class="detail-type-img"></div>';
                    break;
                case '衣':
                    qStoreDetailInfo += '<div><img src="img/cloth.png" class="detail-type-img"></div>';
                    break;
                case '住':
                    qStoreDetailInfo += '<div><img src="img/live.png" class="detail-type-img"></div>';
                    break;
                case '行':
                    qStoreDetailInfo += '<div><img src="img/moving.png" class="detail-type-img"></div>';
                    break;
                case '育':
                    qStoreDetailInfo += '<div><img src="img/education.png" class="detail-type-img"></div>';
                    break;
                case '樂':
                    qStoreDetailInfo += '<div><img src="img/recreation.png" class="detail-type-img"></div>';
                    break;
                case '其他':
                    qStoreDetailInfo += '<div><img src="img/others.png" class="detail-type-img"></div>';
                    break;
                default:
                    qStoreDetailInfo += '<div><img src="img/others.png" class="detail-type-img"></div>';
            }

            qStoreDetailInfo += '<div class="qstore-list-detail read-font-normal"><div>' 
                                + qstoreName
                                + '</div></div><div><div>'
                                + qstoreDistance
                                + '</div></div></div><div class="address-info font-style10"><div><img src="img/pin.png" class="pin-img"></div><div>'
                                + qstoreAddress
                                + '</div></div><div class="phone-info font-style10"><div><img src="img/phone.png" class="phone-img"></div><a class="phone-type" rel="external"  href="tel:"' 
                                + qstorePhone.replace('-', '') 
                                + '">'
                                + qstorePhone
                                + '</a></div><div class="detail-info-line"></div><div class="summary-title font-style11">特約優惠</div><div class="summary-content font-style7">'
                                + qstoreSummary
                                + '</div><div class="date-title font-style11">優惠日期</div><div class="date-content font-style7">'
                                + qstoreEndDate
                                + '</div>'


            $(".qstore-detail-info").empty().append(qStoreDetailInfo); 
        });

        $("#viewQStoreDetail").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/

       

    }
});