
$("#viewAddMember").pagecontainer({
    create: function(event, ui) {

        var nowChatroomID;
        var timer;

        /********************************** function *************************************/
        function addQMember(empNumberArray) {
            (function(empNumberArray) {

                var queryDataObj = {
                    emp_no: loginData["emp_no"],
                    group_id: nowChatroomID
                };

                var queryDataParameter = createXMLDataString(queryDataObj);

                var memberList = "";
                for (var i=0; i<empNumberArray.length; i++) {
                    var tempDataObj = {
                        destination_emp_no: empNumberArray[i]
                    };
                    memberList = memberList + createXMLDataString(tempDataObj);
                }
                var memberListParameter = "<member_list>" + memberList + "</member_list>";

                var queryData = "<LayoutHeader>" + queryDataParameter + memberListParameter + "</LayoutHeader>";

                var successCallback = function(data) {
                    var resultCode = data['ResultCode'];

                    if (resultCode === "1") {

                        setTimeout(function(){
                            for (var i=0; i<empNumberArray.length; i++) {
                                $.each(JM.data.chatroom_user, function(name, data){
                                    if (data.emp_no == empNumberArray[i]) {
                                        window.sendTextMessage(loginData["loginid"] + "將" + name + "加入聊天室", true, "memberEvent");
                                    }
                                });
                            }

                            $.mobile.changePage('#viewChatroomInfo');
                            window.getGroupMembers(nowChatroomID, JM.data.chatroom[nowChatroomID].is_group, "chatroomInfo");
                        }, 1000);
                    }
                };

                var failCallback = function(data) {};

                CustomAPI("POST", true, "addQMember", successCallback, failCallback, queryData, "");

            }(empNumberArray));
        }

        function friendListView() {

            $(".data-list-content .user-list").remove();
            $(".data-list-content .ui-hr-list").remove();

            //check download time
            var nowDateTime = new Date();
            var nowTimestamp = nowDateTime.TimeStamp();

            var memberList = [];

            for (var i=0; i<JM.data.chatroom[nowChatroomID].member.length; i++) {
                memberList.push(JM.data.chatroom[nowChatroomID].member[i].username);
            }

            var userListHTML = $("template#tplUserList").html();

            for (var i=0; i<JM.data.chatroom_friend.length; i++) {

                if (memberList.indexOf(JM.data.chatroom_friend[i]) == -1) {
                    var userList = $(userListHTML);

                    userList.prop("id", "userList" + i);
                    userList.find("input").prop("id", "checkUser" + i).val(JM.data.chatroom_user[JM.data.chatroom_friend[i]].emp_no);
                    userList.find(".overlap-label-checkbox").prop("for", "checkUser" + i);

                    //name
                    userList.find(".user-name").html(JM.data.chatroom_friend[i]);

                    $("#userListContentAddMember").append(userList);

                    window.downloadOriginalUserAvatar("addMemberListView", nowTimestamp, JM.data.chatroom_friend[i], i);
                }

            }
        }

        window.addMemberListViewAvatar = function(listViewIndex, avatarPath) {
            $("div#userList" + listViewIndex).find(".img-content svg").hide();
            $("div#userList" + listViewIndex).find(".img-content img").prop("src", avatarPath);
            $("div#userList" + listViewIndex).find(".img-content img").show();
        };

        function setAddMemberButton(status) {

            //status: enable / disable
            if (status === "enable") {
                $("#addMember").removeClass("none-work");
            } else {
                $("#addMember").addClass("none-work");
            }

        }

        function checkSelectedUser() {
            //Set Create Camera Button, check count of User Selected UI
            var selectCount = $('#userListContentAddMember :checkbox:checked').length;
            var dataCount = $("#viewAddMember .new-chatroom-footer .data-list").length;

            if (selectCount == 0 && dataCount == 0) {
                setAddMemberButton("disable");
                $("#viewAddMember .new-chatroom-footer").css("opacity", 0);
            } else {
                setAddMemberButton("enable");
            }
        }

        /********************************** page event *************************************/
        $("#viewAddMember").one("pagebeforeshow", function(event, ui) {
            //search bar
            var searchBar = $($("template#tplSearchBar").html());
            searchBar.find("input").prop({
                "id": "searchAddMember",
                "placeholder": "請輸入姓名"
            });
            $("#viewAddMemberContent").prepend(searchBar);
        });

        $("#viewAddMember").on("pagebeforeshow", function(event, ui) {
            nowChatroomID = JM.chatroomID;

            //Clear Data
            $("#searchAddMember").val("");
            $(".data-list-content .user-list").remove();
            $(".data-list-content .ui-hr-list").remove();
            $("#viewAddMember .new-chatroom-footer .data-list").remove();
            $("#viewAddMember .new-chatroom-footer").css("opacity", 0);
            $("#titleFriendAddMember").show();
            $("#msgNoFoundAddMember").hide();
        });

        $("#viewAddMember").on("pageshow", function(event, ui) {
            //Search Recommend User
            friendListView();
        });

        /********************************** dom event *************************************/

        //Search Friend
        $(document).on({
            keyup: function(event) {

                var text = $(this).val();
                var resultCount = 0;

                if (timer !== null) {
                    clearTimeout(timer);
                }

                timer = setTimeout(function () {

                    resultCount = 0;

                    $("#userListContentAddMember .data-list").each(function(index, dom) {
                        var name = $(dom).find(".user-name").html();

                        if (name.toLowerCase().indexOf(text.toLowerCase()) == -1) {
                            $(dom).addClass("hide");
                            $(dom).next("hr").addClass("hide");
                        } else {
                            $(dom).removeClass("hide");
                            $(dom).next("hr").removeClass("hide");

                            resultCount++;
                        }
                    });

                    $("#userListContentAddMember .data-list.hide").css("display", "");

                    if (resultCount > 0) {
                        $("#titleFriendAddMember").show();
                        $("#msgNoFoundAddMember").hide();
                    } else {
                        $("#titleFriendAddMember").hide();
                        $("#msgNoFoundAddMember").show();
                    }

                }, 1000);

                if (text.length > 0) {
                    $(".search-user-clear-content").show();
                }

            }
        }, "#searchAddMember");

        //Select User
        $(document).on({
            change: function() {

                //Animate
                $("#viewAddMember .new-chatroom-footer").css("opacity", 1);

                var userEmpID = $(this).val();
                var isChecked = $(this).is(":checked");

                if (isChecked) {
                    var offset = $(this).parent().offset();
                    var dataList = $(this).parents(".user-list");
                    var imgContent = dataList.find(".img-content").html();
                    var userName = dataList.find(".user-name").html();

                    var userAnimateHTML = $("template#tplUserAnimate").html();
                    var userAnimate = $(userAnimateHTML);
                    userAnimate.find(".left").html(imgContent);
                    userAnimate.find(".user-name").html(userName);
                    userAnimate.css({
                        top: offset.top,
                        left: offset.left
                    });

                    $("#viewAddMember").append(userAnimate);

                    if ($("#viewAddMember .new-chatroom-footer .data-list").length == 0) {
                        var bottomOffset = $("#viewAddMember .new-chatroom-footer").offset();
                        var bottomDataWidth = 0;
                    } else {
                        var bottomOffset = $("#viewAddMember .new-chatroom-footer .data-list:last-child").offset();
                        var bottomDataWidth = $("#viewAddMember .new-chatroom-footer .data-list:last-child").width();
                    }

                    var footerPaddingTop = parseInt(document.documentElement.clientWidth * (1.945 + 1) / 100, 10);
                    var footerPaddingLeft = parseInt(document.documentElement.clientWidth * (3.71 + 5.4) / 100, 10);

                    userAnimate.animate({
                        top: parseInt(bottomOffset.top + footerPaddingTop, 10)
                    }, 250).animate({
                        left: parseInt(bottomOffset.left + bottomDataWidth + footerPaddingLeft, 10),
                        opacity: 0
                    }, 250, function() {
                        var userDataSelectedHTML = $("template#tplUserDataSelected").html();
                        var userDataSelected = $(userDataSelectedHTML);

                        userDataSelected.prop("id", "emp" + userEmpID);
                        userDataSelected.find(".left").prepend(imgContent);
                        userDataSelected.find(".user-name").html(cutString(15.5, userName, 3.14));
                        userDataSelected.find(".user-name").data("userName", userName);

                        userAnimate.remove();

                        $("#viewAddMember .new-chatroom-footer .data-list:last-child").removeClass("last");
                        $("#viewAddMember .new-chatroom-footer").append(userDataSelected);
                        $("#viewAddMember .new-chatroom-footer .data-list:last-child").addClass("last");

                        checkSelectedUser();
                    });
                } else {
                    var dataCount = $("#viewAddMember .new-chatroom-footer .data-list").length;
                    var leftWidth = parseInt(18.84 * dataCount, 10);

                    if ($("#emp" + userEmpID).length > 0) {
                        $("#emp" + userEmpID).css({
                            position: "relative"
                        }).animate({
                            left: "-" + leftWidth + "vw",
                            opacity: 0
                        }, 500, function() {
                            $("#viewAddMember .new-chatroom-footer #emp" + userEmpID).remove();

                            checkSelectedUser();
                        });
                    }
                }

            }
        }, "#viewAddMemberContent input:checkbox");

        //Delete selected user
        $(document).on({
            click: function() {

                //uncheck checkbox
                var empID = $(this).prop("id").substr(3);

                $("#userListContentAddMember input:checkbox").each(function(index, data) {
                    if ($(data).val() == empID) {
                        $(data).prop("checked", false);
                    }
                });

                //remove user data
                var dataCount = $("#viewAddMember .new-chatroom-footer .data-list").length;
                var leftWidth = parseInt(18.84 * dataCount, 10);

                $(this).css({
                    position: "relative"
                }).animate({
                    left: "-" + leftWidth + "vw",
                    opacity: 0
                }, 500, function() {
                    $("#viewAddMember .new-chatroom-footer #emp" + empID).remove();

                    checkSelectedUser();
                });

            }
        }, "#viewAddMember .new-chatroom-footer .data-list");

        //Create chatroom
        $(document).on({
            click: function() {
                if (!$(this).hasClass("none-work")) {

                    var empNumberArray = [];

                    $("#viewAddMember .new-chatroom-footer .data-list").each(function(index, element) {
                        empNumberArray.push($(element).prop("id").substr(3));
                    });

                    addQMember(empNumberArray);

                }
            }
        }, "#addMember");

        //Clear Search
        $(document).on({
            click: function() {

                $("#titleFriendAddMember").show();
                $("#msgNoFoundAddMember").hide();

                $("#userListContentAddMember .data-list").each(function(index, dom) {
                    $(dom).removeClass("hide");
                    $(dom).next("hr").removeClass("hide");
                });

                $(".searchBar").val("");
                $(this).hide();
            }
        }, ".search-user-clear-content");

    }
});
