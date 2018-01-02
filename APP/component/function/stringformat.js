/****************************************************************************************/
/********************************** String function *************************************/
/****************************************************************************************/

//string function
function replaceStr(content, originItem, replaceItem) {
    $.each(originItem, function(index, value) {
        content = content.replaceAll(value.toString(), replaceItem[index].toString())
    });
    return content;
}

String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};

// convert yyyymmdd to [yyyy, mm, dd]
function cutStringToArray(string, array) {
    var strMatch = '';
    $.each(array, function(index, value) {
        strMatch += '(\\d{' + value + '})'; //like '/(\d{4})(\d{2})(\d{2})/'
    });
    var reg = new RegExp(strMatch);
    var result = string.match(reg);
    return result;
}

function padLeft(str, length) {
    str = str.toString();

    if (str.length >= length)
        return str;
    else
        return padLeft("0" + str, length);
}

//API - XML data need to do [ PHP htmlspecialchars() ]
function htmlspecialchars(text) {
    if (typeof text === "string") {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    } else {
        return text;
    }
}