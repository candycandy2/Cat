$("#viewDefaultSetting").pagecontainer({
    create: function (event, ui) {

        var newSettingIndex = [], changeSetting = false;

        function setGeneralSetting() {
            var settingArr = JSON.parse(window.localStorage.getItem('generalSetting'));
            var content = '';
            for (var i in settingArr[browserLanguage]) {
                content += '<div class="default-item" data-index="' + i + '"><div>' + settingArr[browserLanguage][i] +
                    '</div><div><img src="img/move.png" width="90%"></div></div>';
            }

            $('#defaultList').html('').append(content);
        }


        /********************************** page event ***********************************/
        $("#viewDefaultSetting").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewDefaultSetting").one("pageshow", function (event, ui) {
            $('#viewDefaultSetting .ui-title div').text(langStr['str_083']).removeClass('opacity');

            setGeneralSetting();

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
                    newSettingIndex.push(parseInt($(item).attr('data-index')));
                });

                //2. 更新arr
                var settingArr = JSON.parse(window.localStorage.getItem('generalSetting'));

                for (var i in settingArr) {
                    var arr = [];

                    for (var j in newSettingIndex) {
                        var item = settingArr[i][newSettingIndex[j]];
                        arr.push(item);
                    }

                    settingArr[i] = arr;
                }

                //3. 更新local
                window.localStorage.setItem('generalSetting', JSON.stringify(settingArr));

                changeSetting = false;
            }


        });


        /********************************** dom event *************************************/




    }
});