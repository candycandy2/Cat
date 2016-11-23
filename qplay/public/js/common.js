
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
   if(UTCdate == '0000-00-00 00:00:00'){
        return '-';
   }
   var date = new Date(UTCdate + ' AM UTC');
   return getDateTime(date);
}

function convertLocalToUTCDateTime(dateTime){
   var date = new Date(dateTime);
   return getUTCDateTime(date);
}

function formatFloat(num, pos)
{
  var size = Math.pow(10, pos);
  return Math.round(num * size) / size;
}

function formatSizeUnits(bytes)
{
    if (bytes >= 1073741824)
    {
        bytes = formatFloat(bytes / 1073741824, 2) + ' GB';
    }
    else if (bytes >= 1048576)
    {
        bytes = formatFloat(bytes / 1048576, 2) + ' MB';
    }
    else if (bytes >= 1024)
    {
        bytes = formatFloat(bytes / 1024, 2) + ' kB';
    }
    else if (bytes > 1)
    {
        bytes = bytes + ' bytes';
    }
    else if (bytes == 1)
    {
        bytes = bytes + ' byte';
    }
    else
    {
        bytes = '0 bytes';
    }

    return bytes;
}