
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
    
    var month = FormatNumberLength(date.getMonth()+1,2); //months from 1-12
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
    var dateArr = UTCdate.split(" ");
    var dateStr = dateArr[0];
    var timeStr = dateArr[1];
    var dateArr = dateStr.split("-");
    var timeArr = timeStr.split(":"); 
    var date =  new Date(Date.UTC(dateArr[0], dateArr[1]-1, dateArr[2], timeArr[0], timeArr[1], timeArr[2]));
    return getDateTime(date);
}

function convertLocalToUTCDateTime(dateTime){
    var dateArr = dateTime.split(" ");
    var dateStr = dateArr[0];
    var timeStr = dateArr[1];
    var dateArr = dateStr.split("-");
    var timeArr = timeStr.split(":"); 
    var date =  new Date(dateArr[0], dateArr[1]-1, dateArr[2], timeArr[0], timeArr[1], timeArr[2]);
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

function getUrlVar(name){

    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }

    return vars[name];

}

function handleAJAXError(ajax,error) {
    if(error.status ==401 &&  error.responseText == "Unauthorized."){
        window.location.href = "auth/login";
        return true;
    }else {
        return false;
    }
}

function dateToUTC(value){
     var dateTimeParts = value.split(' '),
        dateParts = dateTimeParts[0].split('-'),
        timeString = '00:00:00';
        if(typeof dateTimeParts[1] != 'undefined'){
            timeString = dateTimeParts[1];
        }
        timeParts = timeString.split(':');

    return Date.UTC(
         parseInt(dateParts[0]),
         parseInt(dateParts[1], 10) - 1,
         parseInt(dateParts[2]),
         timeParts[0],
         timeParts[1],
         timeParts[2]
        );
}

function sortObject(obj){
    obj = obj.sort(function (a, b) {
     return a[0] < b[0] ? -1 : 1;
    });
    return obj;
}

function unionArrays(x, y) {
  var obj = {};
  for (var i = x.length-1; i >= 0; -- i)
     obj[x[i]] = x[i];
  for (var i = y.length-1; i >= 0; -- i)
     obj[y[i]] = y[i];
  var res = []
  for (var k in obj) {
    if (obj.hasOwnProperty(k))
      res.push(obj[k]);
  }
  return res;
}