var widget = {

    init: function(divItem) {

        this.load(0, divItem)
            .then(this.load(1, divItem))
            .then(this.load(2, divItem))
            .then(this.load(3, divItem))
            .then(this.load(4, divItem))
            .then(this.load(5, divItem))
            .then(this.load(6, divItem))
            .then(this.load(7, divItem))
            .then(this.load(8, divItem));
    },
    list: function() {

        return [
            { id: 0, name: 'carousel', enabled: true, lang: langStr['wgt_001'] },
            { id: 1, name: 'weather', enabled: true, lang: langStr['wgt_002'] },
            { id: 2, name: 'reserve', enabled: true, lang: langStr['wgt_003'] },
            { id: 3, name: 'message', enabled: true, lang: langStr['wgt_004'] },
            { id: 4, name: 'applist', enabled: true, lang: langStr['wgt_005'] },
            { id: 5, name: 'qpay', enabled: true, lang: langStr['wgt_009'] },
            { id: 6, name: 'accountingrate', enabled: true, lang: langStr['wgt_070'] },
            { id: 7, name: 'yellowpage', enabled: true, lang: 'Yellow Page' },
            { id: 8, name: 'qstore', enabled: true, lang: 'QStore' }
        ];
    },
    load: function(id, div) {

        var widgetArr = JSON.parse(window.localStorage.getItem('widgetList'));
        if (widgetArr !== null) {
            for (var j = 0; j < widgetArr.length; j++) {
                if (id == widgetArr[j].id) {
                    if (widgetArr[j].enabled == false)
                        return new Promise((resolve, reject) => {});
                    break;
                }
            }
        }

        return new Promise((resolve, reject) => {

            var widgetItem = this.list()[id].name + "Widget";
            var contentItem = $('<div class="' + widgetItem + '"></div>');
            div.append(contentItem);

            $.getScript(serverURL + "/widget/" + this.list()[id].name + "/" + this.list()[id].name + ".js")
                .done(function(script, textStatus) {
                    if (typeof window[widgetItem] != 'undefined')
                        window[widgetItem].init(contentItem);
                });

        });
    },
    show: function() {

        $.each(this.list(), function(key, value) {
            var widgetItem = value.name + "Widget";
            if (value.enabled == true && window[widgetItem] != undefined && window[widgetItem].show != undefined) {
                window[widgetItem].show();
            }
        });
    },
    clear: function() {

        $.each(this.list(), function(key, value) {
            var widgetItem = value.name + "Widget";
            if (value.enabled == true && window[widgetItem] != undefined && window[widgetItem].clear != undefined) {
                window[widgetItem].clear();
            }
        });
    }
};