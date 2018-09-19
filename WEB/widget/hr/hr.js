//widget naming rule widget.js/list()[].name + "Widget"
var hrWidget = {

    init: function(contentItem) {

        function createContent() {
            var content = '<div><a href="http:\/\/www.myqisda.com\/innovation\/index.asp">TEST</a></div>';

            contentItem.html('').append(content);
        }

        createContent();
    }
}