@extends('testapp')

@section('content')
    <?php
        //echo date("y-m-d h:m:s");
        //echo trim(null);
        //echo empty(null) == true?"Y":"N";
        //echo empty(trim("        ")) == true?"Y":"N";
     ?>
    <fieldset>
        <legend>
             GetPassword
        </legend>
        <label for="txtInputUsername">Username:</label>
        <input id="txtInputUsername" type="text" value="" />
        <label for="txtPwd">Password:</label>
        <input id="txtPwd" type="text" value="" />
        <input type="button" value="Get" onclick="getPwd()" />
    </fieldset>
    <fieldset>
        <legend>
            Register
        </legend>
        <label for="txtUserName">UserName:</label>
        <input id="txtUserName" type="text" value="" />
        <input type="button" value="Register" onclick="register()" />
    </fieldset>
    <fieldset>
        <legend>
            Get GroupList
        </legend>
        <textarea id="txtGroupList" style="float: left;height: 30px;width: 400px;"></textarea>
        <label for="txtOwner" style="margin:0 0 0 10px;">UserName:</label>
        <input id="txtOwner" type="text" value=""/>
        <input type="button" value="GetGroupList" onclick="groupList()" />
    </fieldset>
    <fieldset>
        <legend>
            Add Group
        </legend>
        <label for="txtNewOwner">Owner:</label>
        <input id="txtNewOwner" type="text" value="" />
        <label for="txtGroupMembers">GroupMembers:</label>
        <input id="txtGroupMembers" type="text" value="" style="width:300px;"/>
        <input type="button" value="Add Group" onclick="addGroup()" />
    </fieldset>
    <fieldset>
        <legend>
            Delete Group
        </legend>
        <label for="txtGroupID">Group ID:</label>
        <input id="txtGroupID" type="text" value="" />
        <input type="button" value="Delete Group" onclick="deleteGroup()" />
    </fieldset>
    <fieldset>
        <legend>
            Get Group Member List
        </legend>
        <textarea id="txtGroupMembersList" style="float: left;height: 30px;width: 400px;margin: 0 10px 0 0;"></textarea>
        <label for="txtMemberGroupID">Group ID:</label>
        <input id="txtMemberGroupID" type="text" value="" />
        <input type="button" value="Get Group Member" onclick="getGroupMemberList()" />
    </fieldset>
    <fieldset>
        <legend>
            Add Group Members
        </legend>
        <label for="txtMemberAddGroupID">Group ID:</label>
        <input id="txtMemberAddGroupID" type="text" value="" />
        <label for="txtMember2Add">Members to add :</label>
        <input id="txtMember2Add" type="text" value="" />
        <input type="button" value="Add Group Members" onclick="addGroupMembers()" />
    </fieldset>
    <fieldset>
        <legend>
            Delete Group Members
        </legend>
        <label for="txtMemberDeleteGroupID">Group ID:</label>
        <input id="txtMemberDeleteGroupID" type="text" value="" />
        <label for="txtMember2Delete">Members to delete :</label>
        <input id="txtMember2Delete" type="text" value="" />
        <input type="button" value="Delete Group Members" onclick="deleteGroupMembers()" />
    </fieldset>
    <script type="text/javascript">
        var registerUUID = "CD8C4CBC-FC71-41D1-93D4-FB5547E7AA20";
        var getPwd = function () {
            var username = $.trim($("#txtInputUsername").val());
            $.ajax({
                url: "v101/qmessage/pwd?lang=en-us&uuid=" + registerUUID,//Math.uuid(),
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
                    $("#txtPwd").val(d["Content"]);
                    alert("Success");
                },
                error: function (e) {
                    console.log(e);
                }
            });
        }
        var register = function(){
            var username = $.trim($("#txtUserName").val());
            $.ajax({
                url: "v101/qmessage/register?lang=en-us&uuid=" + registerUUID,//Math.uuid(),
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
                    console.log(JSON.stringify(d))
                    alert("Success");
                },
                error: function (e) {
                    console.log(e);
                }
            });
        };

        var groupList = function(){
            var username = $.trim($("#txtOwner").val());
            $.ajax({
                url: "v101/qmessage/group/list?lang=en-us&uuid=" + registerUUID,//Math.uuid(),
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
                    var result = d["Content"]
                    $("#txtGroupList").val(JSON.stringify(result));
                },
                error: function (e) {
                    console.log(e);
                }
            });
        }

        var addGroup = function(){
            var owner = $.trim($("#txtNewOwner").val());
            var members = $.trim($("#txtGroupMembers").val());
            members = members==""?[]:members.split(',');
            var desc = "Test" + new Date();
            $.ajax({
                url: "v101/qmessage/group/add?lang=en-us&uuid=" + registerUUID,//Math.uuid(),
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:JSON.stringify(
                        { "owner":owner,"members":members,"desc":desc }
                    ),
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "appqplay");
                    request.setRequestHeader("signature", "Moses824");
                    request.setRequestHeader("signature-time", "1000000000");
                },
                success: function (d, status, xhr) {
                    console.log(JSON.stringify(d));
                    var result = d["Content"]
                    if(result instanceof Array){
                        result = result[0];
                    }
                    $("#txtGroupList").val(JSON.stringify(result));
                },
                error: function (e) {
                    console.log(e);
                }
            });
        }
        
        var deleteGroup = function () {
            var gid = $.trim($("#txtGroupID").val());
            $.ajax({
                url: "v101/qmessage/group/delete?lang=en-us&uuid=" + registerUUID,//Math.uuid(),
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:JSON.stringify(
                    { "gid":gid }
                ),
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "appqplay");
                    request.setRequestHeader("signature", "Moses824");
                    request.setRequestHeader("signature-time", "1000000000");
                },
                success: function (d, status, xhr) {
                    console.log(JSON.stringify(d));
                    alert("success");
                },
                error: function (e) {
                    console.log(e);
                }
            });
        }

        var getGroupMemberList = function () {
            var gid = $.trim($("#txtMemberGroupID").val());
            $.ajax({
                url: "v101/qmessage/group/members/list?lang=en-us&uuid=" + registerUUID,//Math.uuid(),
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:JSON.stringify({ "gid":gid}),
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "appqplay");
                    request.setRequestHeader("signature", "Moses824");
                    request.setRequestHeader("signature-time", "1000000000");
                },
                success: function (d, status, xhr) {
                    console.log(JSON.stringify(d));
                    $("#txtGroupMembersList").val(JSON.stringify(d));
                },
                error: function (e) {
                    console.log(e);
                }
        });
        }

        var addGroupMembers = function () {
            var gid = $.trim($("#txtMemberAddGroupID").val());
            var usernames = $.trim($("#txtMember2Add").val());
            usernames = usernames==""?[]:usernames.split(',');
            var desc = "Test" + new Date();
            $.ajax({
                url: "v101/qmessage/group/members/add?lang=en-us&uuid=" + registerUUID,//Math.uuid(),
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:JSON.stringify(
                    { "gid":gid,"usernames":usernames }
                ),
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "appqplay");
                    request.setRequestHeader("signature", "Moses824");
                    request.setRequestHeader("signature-time", "1000000000");
                },
                success: function (d, status, xhr) {
                    console.log(JSON.stringify(d));
                },
                error: function (e) {
                    console.log(e);
                }
            });
        }

        var deleteGroupMembers = function () {
            var gid = $.trim($("#txtMemberDeleteGroupID").val());
            var usernames = $.trim($("#txtMember2Delete").val());
            usernames = usernames==""?[]:usernames.split(',');
            var desc = "Test" + new Date();
            $.ajax({
                url: "v101/qmessage/group/members/delete?lang=en-us&uuid=" + registerUUID,//Math.uuid(),
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data:JSON.stringify(
                    { "gid":gid,"usernames":usernames }
                ),
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "appqplay");
                    request.setRequestHeader("signature", "Moses824");
                    request.setRequestHeader("signature-time", "1000000000");
                },
                success: function (d, status, xhr) {
                    console.log(JSON.stringify(d));
                },
                error: function (e) {
                    console.log(e);
                }
            });
        }
    </script>
@endsection


