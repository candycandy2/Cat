//review by alan
//Need to delete for olde version
var widgetList = [
    { id: 0, name: 'carousel', enabled: true, lang: langStr['wgt_001'] },
    { id: 1, name: 'weather', enabled: true, lang: langStr['wgt_002'] },
    { id: 2, name: 'reserve', enabled: true, lang: langStr['wgt_003'] },
    { id: 3, name: 'message', enabled: true, lang: langStr['wgt_004'] },
    { id: 4, name: 'applist', enabled: true, lang: langStr['wgt_005'] }
];

var widget = {
    init: function(divItem) {
        this.load(0, divItem)
            .then(this.load(1, divItem))
            .then(this.load(2, divItem))
            .then(this.load(3, divItem))
            .then(this.load(4, divItem));
    },
    load: function(id, div) {

        return new Promise((resolve, reject) => {

            //2. widget
            var widgetItem = this.list()[id].name + "Widget";

            //3. container
            var contentItem = $('<div class="' + widgetItem + '"></div>');
            div.append(contentItem);

            $.getScript(serverURL + "/widget/" + this.list()[id].name + "/" + this.list()[id].name + ".js")
                .done(function(script, textStatus) {
                    if (window[widgetItem] != null)
                        window[widgetItem].init(contentItem);
                });
        });
    },
    clear: function() {

        $.each(this.list(), function(key, value) {
            var widgetItem = value.name + "Widget";
            if (window[widgetItem] != undefined && window[widgetItem].clear != undefined) {
                window[widgetItem].clear();
            }
        });
    },
    list: function() {
        return [
            { id: 0, name: 'carousel', enabled: true, lang: langStr['wgt_001'] },
            { id: 1, name: 'weather', enabled: true, lang: langStr['wgt_002'] },
            { id: 2, name: 'reserve', enabled: true, lang: langStr['wgt_003'] },
            { id: 3, name: 'message', enabled: true, lang: langStr['wgt_004'] },
            { id: 4, name: 'applist', enabled: true, lang: langStr['wgt_005'] }
        ];
    }
};