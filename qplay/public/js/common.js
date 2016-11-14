
function htmlEscape(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function ValidateIPaddress(ipaddress)   
{  
 if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress))  
  {  
    return (true)  
  }  
  return (false)  
}

function FormatNumberLength(num, length) {
    var r = "" + num;
    while (r.length < length) {
        r = "0" + r;
    }
    return r;
}

function getUTCDateTime(date){
    var month = FormatNumberLength(date.getUTCMonth() + 1,2); //months from 1-12
    var day = FormatNumberLength(date.getUTCDate(),2);
    var year = FormatNumberLength(date.getUTCFullYear(),2);
    var hours = FormatNumberLength(date.getUTCHours(),2);
    var minutes = FormatNumberLength(date.getUTCMinutes(),2);
    var seconds = FormatNumberLength(date.getUTCSeconds(),2); 
    var newdate = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
    return newdate;
}

function getDateTime(date){
    var month = FormatNumberLength(date.getMonth() + 1,2); //months from 1-12
    var day = FormatNumberLength(date.getDate(),2);
    var year = FormatNumberLength(date.getFullYear(),2);
    var hours = FormatNumberLength(date.getHours(),2);
    var minutes = FormatNumberLength(date.getMinutes(),2);
    var seconds = FormatNumberLength(date.getSeconds(),2); 
    var newdate = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
    return newdate;
}

function convertUTCToLocalDateTime(UTCdate){
   var date = new Date(UTCdate + ' AM UTC');
   return getDateTime(date);
}

function convertLocalToUTCDateTime(dateTime){
   var date = new Date(dateTime);
   return getUTCDateTime(date);
}