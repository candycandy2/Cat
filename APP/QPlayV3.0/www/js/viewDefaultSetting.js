$("#viewDefaultSetting").pagecontainer({
    create: function (event, ui) {

        var newSettingIndex = [], changeSetting = false;

        function setDefaultSetting() {
            var settingArr = JSON.parse(window.localStorage.getItem('defaultSetting'));
            var resultArr = [];

            for (var i in settingArr) {
                if (settingArr[i].language == browserLanguage) {
                    resultArr = settingArr[i].settingList;
                    break;
                }
            }

            //console.log(resultArr);
            var content = '';
            for (var i in resultArr) {
                content += '<div class="default-item" data-index="' + i + '"><div>' + resultArr[i] +
                    '</div><div><img src="img/move.png" width="90%"></div></div>';
            }

            $('#defaultList').html('').append(content);
        }


        /********************************** page event ***********************************/
        $("#viewDefaultSetting").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewDefaultSetting").one("pageshow", function (event, ui) {
            $('#viewDefaultSetting .ui-title div').text(langStr['str_083']);
            $('#viewDefaultSetting .ui-title div').removeClass('opacity');

            setDefaultSetting();

            var container = document.getElementById("defaultList");
            Sortable.create(container, {
                handle: '.default-item',
                animation: 150,
                onUpdate: function (event) {
                    changeSetting = true;
                }
            });
        });

        $("#viewDefaultSetting").on("pageshow", function (event, ui) {

        });

        $("#viewDefaultSetting").on("pagehide", function (event, ui) {
            if (changeSetting) {
                //1. 更新index
                newSettingIndex = [];
                $.each($('.default-item'), function (index, item) {
                    newSettingIndex.push($(item).attr('data-index'));
                });

                //2. 更新arr
                var settingArr = JSON.parse(window.localStorage.getItem('defaultSetting'));
                var resultArr = [];

                for (var i in settingArr) {
                    var arr = [];
                    var language = settingArr[i].language;
                    for (var j in newSettingIndex) {
                        var item = settingArr[i].settingList[newSettingIndex[j]];
                        arr.push(item);
                    }
                    var obj = {
                        language: language,
                        settingList: arr
                    }
                    resultArr.push(obj);
                }

                //3. 更新local
                window.localStorage.setItem('defaultSetting', JSON.stringify(resultArr));

                changeSetting = false;
            }


        });


        /********************************** dom event *************************************/




    }
});