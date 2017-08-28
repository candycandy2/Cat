@extends('testapp')

@section('content')
    <?php

     ?>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>QMessage</title>
    <style>
        #message-box{
            max-height:75vh;
        }
        #message-box-table{
            font-family:'Gill Sans MT';
            padding-top:1em;
        }
        #message-box-table tr:nth-child(even) {
            background: #e9e9e9;
        }
        .message-box-avatar{
            width:10vw;
            height:10vw;
            vertical-align: middle;
        }
        .meaasge-box-title{
            font-size:0.8em;
            overflow:hidden;
            height: 1em;
            line-height: 1em;
            color:#666;
        }
        .umeaasge-box-title::after{
            content:'.';
            clear:both;
        }
        .meaasge-box-title-name{
            float:left;
        }
        .meaasge-box-title-date{
            float:right;
        }
        #input-message,#input-message-image,#login-box,.ui-input-text{
            float:left;
            width:75%;
        }
        #login-box{
            width:20vw;
        }
        #drpGroup{
            width:50vw;
        }
        #btnQMessageSend,#btnQMessageImageSend{
            margin: 0.5em 0 0 1vh;
            padding: .4em 1em;
            float: right;
        }
        #input-box{
            position: fixed;
            bottom: 0;
            padding: 1em;
            left: 0;
            right: 0;
        }
        .message-box-content{
            word-break: break-all;
        }
        .ui-select {
            width: 19.5vh;
            float: left;
        }
    </style>
    </head>
    <body>
    <div data-role="main" class="ui-content">
        <div id="message-box">
            <div id="login-bar">
                <select id="login-box">
                    <option value="Sammi.Yao">Sammi.Yao</option>
                    <option value="Moses.zhu">Moses.zhu</option>
                    <option value="Steven.Yan">Steven.Yan</option>
                    <option value="NewUserA">NewUserA</option>
                </select>
                <select id="drpGroup">

                </select>
                <a href="javascript:void(0);" id="btnLogin" data-role="button" data-inline="true">Login</a>
            </div>
            <table data-role="table" data-mode="columntoggle:none" class="ui-responsive ui-shadow" id="message-box-table">
                <tbody>
                </tbody>
            </table>
        </div>
        <div id="input-box">
            <input type="file" name="input-message-image" id="input-message-image" class="ui-btn-inline">
            <a href="javascript:void(0);" id="btnQMessageImageSend" data-role="button" data-inline="true">Send</a>
            <a href="javascript:void(0);" id="btnQMessageFileSend" data-role="button" data-inline="true">File Send</a>
            <input type="text" name="input-message" id="input-message" class="ui-btn-inline">
            <a href="javascript:void(0);" id="btnQMessageSend" data-role="button" data-inline="true">Send</a>
            <input type="text" name="history-count" id="history-count" class="ui-btn-inline">
            <a href="javascript:void(0);" id="btnHistory" data-role="button" data-inline="true">History</a>
        </div>
    </div>
    <script src="{{ asset('/js/qmessage.js') }}"></script>
    <script type="text/javascript">
        var msgController,opts;
        $(function(){
           $("#btnQMessageSend").on("click",clickHandler);
            $("#btnQMessageImageSend").on("click",imageClickHandler);
            $("#btnQMessageFileSend").on("click",fileClickHandler);
            $("#btnLogin").on("click",login);
            $("#btnHistory").on("click",getHistory);
        });
        function login(){
            var username = $('#login-box > option:selected').val();
            $.ajax({
                url: "v101/qmessage/group/list",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:JSON.stringify({ "username":username}),
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "appqplay");
                    request.setRequestHeader("signature", "Moses824");
                    request.setRequestHeader("signature-time", "1000000000");
                },
                success: function (d, status, xhr) {
                    console.log(JSON.stringify(d));
                    var result = d["Content"];
                    var html = "";
                    $.each(result,function (i,v){
                        html +="<option value='"+v["gid"]+"'>"+v["name"]+"</option>";
                    });
                    $("#drpGroup").children().remove();
                    $("#drpGroup").append(html);
                    Init(username);
                },
                error: function (e) {
                    console.log(e);
                }
            });
        }
        function Init(username){
            opts = {
                'eventHandler': eventHandler,
                'messageHandler': messageHandler,
                'debug': false,
                'username':username,
                'message_key':"{{Config::get("app.appKey")}}",
                'message_secret':"{{Config::get("app.masterSecret")}}",
                'message_api_url_prefix':"qplaydev.benq.com/qmessage/public/index.php/"
            };
            msgController = window.QMessage(opts);
        }

        //Event Register
        function clickHandler(){
            var  gname= $('#drpGroup > option:selected').text();
            var  gid = $('#drpGroup > option:selected').val();
            var text = $("#input-message").val();
            text = $.trim(text);
            sendText(gid,gname,text);
        }
        function imageClickHandler(){
            var  gname= $('#drpGroup > option:selected').text();
            var  gid = $('#drpGroup > option:selected').val();
            sendPic(gid,gname,"input-message-image");
        }

        function fileClickHandler(){
            var  gname= $('#drpGroup > option:selected').text();
            var  gid = $('#drpGroup > option:selected').val();
            sendFile(gid,gname,"input-message-image");
        }
        function eventHandler(data){

        }
        function messageHandler(data){
            /*
             {"uid":19259602,"messages":[{"ctime_ms":1485133070669,"from_gid":19454745,"msg_type":4,"ctime":1485133070,"msg_id":229094014,"msg_level":0,"from_uid":19257151,
             "content":{"from_type":"user","from_id":"Moses.zhu","set_from_name":0,"target_name":"6233ED9C-7107-76F4-14C4-C0FD75356C7F","create_time":1485133070428,"target_type":"group","msg_body":{"text":"Test API"},"from_platform":"web","msg_type":"text","target_id":"19454745","from_name":"Moses.zhu","version":1}}],"rid":229094014,"event":"msg_sync"}
             */
            var msg = data["messages"][0];
            var now = msg.ctime_ms;
            if(msg["msg_type"]=="file"){
                now =  msg.create_time;
            }
            now = timestamp2Normal(now);
            msg = msg["content"];
            var fromId = msg["from_id"];
            var content = "";
            if(msg["msg_type"]=="text"){
                content = msg["msg_body"]["text"];
                Render('msg',content,now,fromId);
            }
            if(msg["msg_type"]=="image"){
                content = msg["msg_body"]["media_url"];
                Render('image',content,now,fromId);
            }
            if(msg["msg_type"]=="file"){
                content = "http://media.file.jpush.cn/" + msg["msg_body"]["media_id"];
                Render('file',content,now,fromId);
            }
        }
        //Function
        function sendText(gid,gname,text){
            if(msgController.isInited){
                var now = getTime();
                msgController.SendText(gid,gname,text, function(result){
                    Render('msg',text,now,opts["username"]);
                }, function(result){});
            }
        }
        function sendPic(gid,gname,fid){
            if(msgController.isInited){
                var now = getTime();
                msgController.SendImage(gid,gname,fid, function(result){
                    var content = result["content"];
                    var url = "http://media.file.jpush.cn/"+content["msg_body"].media_id;
                    Render('image',url,now,opts["username"]);
                }, function(){});
            }
        }

        function sendFile(gid,gname,fid){
            if(msgController.isInited){
                var now = getTime();
                msgController.SendFile(gid,gname,fid, function(result){
                    var content = result["content"];
                    var url = "http://media.file.jpush.cn/"+content["msg_body"].media_id;
                    Render('file',url,now,opts["username"]);
                }, function(){});
            }
        }
        var cursor;
        function getHistory(){
            var gid,count;
            gid = $('#drpGroup > option:selected').val();
            count = parseInt($('history-count').val(),10);
            count = isNaN(count)?5:count;
            $.ajax({
                url: "v101/qmessage/history/list",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:JSON.stringify({
                    "gid": gid,//"19454745",
                    "count":count,
                    "cursor":cursor||""
                }),
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "appqplay");
                    request.setRequestHeader("signature", "Moses824");
                    request.setRequestHeader("signature-time", "1000000000");
                },
                success: function (d, status, xhr) {
                    console.log(JSON.stringify(d));
                    for (var i = 0;i<d["count"];i++){
                        var entry  = d["msgList"][i];
                        if(entry.msg_type=="text"){
                            Render('msg',entry["content"],timestamp2Normal(entry["ctime"]),entry["from_id"]);
                        }
                        if(entry.msg_type=="image"){
                            Render('image',entry["content"],timestamp2Normal(entry["ctime"]),entry["from_id"]);
                        }
                    }
                    cursor = d["cursor"];
                },
                error: function (e) {
                    console.log(e);
                }
            });
        }
        function close() {
            if(msgController.isInited){
                msgController.close();
            }
        }

        //tools
        function timestamp2Normal(timestamp){
            var date = new Date(timestamp);
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            var D = date.getDate() + ' ';
            var h = date.getHours() + ':';
            var m = date.getMinutes() + ':';
            var s = date.getSeconds();
            return Y+M+D+h+m+s;
        }
        function getTime(){
            var date = new Date();
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            var D = date.getDate() + ' ';
            var h = date.getHours() + ':';
            var m = date.getMinutes() + ':';
            var s = date.getSeconds();
            return Y+M+D+h+m+s;
        }
        function Render(type,content,time,from){
            var tb = $("#message-box-table tbody");
            var html;
            if (type=='msg'){
                html  = $("#template-message").html();
                html = html
                    .replace("@@content",content)
                    .replace("@@time",time)
                    .replace("@@from",from);
            }
            if (type=='event'){
                html  = $("#template-event").html();
                html = html
                    .replace("@@content",content)
                    .replace("@@time",time);
            }
            if (type=='image'){
                html  = $("#template-message").html();
                html = html
                    .replace("@@content","<img src='"+content+"' />")
                    .replace("@@time",time)
                    .replace("@@from",from);
            }
            if (type=='file'){
                html  = $("#template-message").html();
                html = html
                    .replace("@@content","<div style='width:20px;height:10px;background-color: #fffd6c' src='"+content+"' ></div>")
                    .replace("@@time",time)
                    .replace("@@from",from);
            }
            tb.append(html);
        }
    </script>
    <script id="template-message" type="text/template">
        <tr>
            <td><img class="message-box-avatar" src="{{ asset('styles/images/user.jpg')}}" alt="" ></td>
            <td>
                <div class="meaasge-box-title"><span class="meaasge-box-title-name">@@from</span><span class="meaasge-box-title-date">@@time</span></div>
                <div class="message-box-content">@@content</div>
            </td>
        </tr>
    </script>
    <script id="template-event" type="text/template">
        <tr>
            <td>
                <div class="message-box-content">@@content</div>
                <div>@@time</div>
            </td>
        </tr>
    </script>
    <!--
<fieldset>
    <lengend>Send Image</lengend>
    <input type="file" id="imgPic">
    <button onclick="sendPic()">Send Image</button>
</fieldset>
<fieldset>
    <lengend>Send Text</lengend>
    <input type="text" id="txtInput">
    <button onclick="sendText()">Send Text</button>
</fieldset>
<fieldset>
    <lengend>History:</lengend>
    <br>
    <label for="txtCount">Count</label>
    <input  type="text" id="txtCount" />
    <label for="txtCursor">Cursor</label>
    <input  type="text" id="txtCursor" />
    <br/>
    <label for="txtHistory">History List</label>
    <textarea id="txtHistory"></textarea>
    <button onclick="getHistory()">Get Histroy</button>
    <br>
    <table id="tbMessage"></table>
</fieldset>
-->
@endsection


