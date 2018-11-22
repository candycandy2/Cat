$("#viewQStoreSearchList").pagecontainer({
    create: function (event, ui) {

        /********************************** function *************************************/
        var cityData = {
            id: "city-popup",
            option: [],
            title: '',
            defaultText: langStr["wgt_108"],
            changeDefaultText: true,
            attr: {
                class: "ddl-select-img"
            }
        };
        function getAllCityList() {

        }

        /********************************** page event ***********************************/
        $("#viewQStoreSearchList").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewQStoreSearchList").one("pageshow", function (event, ui) {

        });

        $("#viewQStoreSearchList").on("pageshow", function (event, ui) {

        });

        $("#viewQStoreSearchList").on("pagehide", function (event, ui) {

        });


        /********************************** dom event *************************************/


    }
});