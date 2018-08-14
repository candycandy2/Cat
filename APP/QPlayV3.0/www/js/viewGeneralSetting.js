$("#viewGeneralSetting").pagecontainer({
    create: function (event, ui) {

        var widgetArr = null,
            changeSetting = false;

        function setGeneralSetting() {
            var content = '';
            for (var i in widgetArr) {
                if (widgetArr[i].enabled) {
                    content += '<div class="default-item ' +
                        (widgetArr[i].name == 'carousel' ? 'hide' : 'show') +
                        '" data-item="' + widgetArr[i].name + '" data-index="' +
                        i + '"><div>' + widgetArr[i].lang +
                        '</div><div><img src="img/move.png" width="90%"></div></div>';
                }
            }

            $('#defaultList').html('').append(content);

        }


        /********************************** page event ***********************************/
        $("#viewGeneralSetting").on("pagebeforeshow", function (event, ui) {

        });

        $("#viewGeneralSetting").one("pageshow", function (event, ui) {
            //1. title
            $('#viewGeneralSetting .ui-title div').text(langStr['str_083']).removeClass('opacity');
            //2. localstorage
            widgetArr = JSON.parse(localStorage.getItem('widgetList'));
            //3. create content
            setGeneralSetting();
            //4. sort listview
            var container = document.getElementById("defaultList");
            Sortable.create(container, {
                handle: '.default-item',
                animation: 150,
                onUpdate: function (event) {
                    changeSetting = true;
                }
            });
        });

        $("#viewGeneralSetting").on("pageshow", function (event, ui) {

        });

        $("#viewGeneralSetting").on("pagehide", function (event, ui) {
            if (changeSetting) {

                //1. 记录新index
                var newSettingIndex = [];
                $.each($('.default-item'), function (index, item) {
                    newSettingIndex.push(parseInt($(item).attr('data-index')));
                });

                //2. 记录新顺序
                var arr = [];
                for (var j in newSettingIndex) {
                    var item = widgetArr[newSettingIndex[j]];
                    arr.push(item);
                }

                //3. 更新local
                window.localStorage.setItem('widgetList', JSON.stringify(arr));

                //4. 更新首页widget
                for (var i = 0; i < arr.length; i++) {
                    if (i < arr.length - 1) {
                        $('.' + arr[i].name + 'Widget').after($('.' + arr[i + 1].name + 'Widget'));
                    }
                }

                changeSetting = false;
            }

        });


        /********************************** dom event *************************************/




    }
});