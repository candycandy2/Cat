

$("#viewChatroom").pagecontainer({
    create: function(event, ui) {
        
        /********************************** function *************************************/
        //For Plugin Camera
        //function setOptions(srcType) {
        window.setOptions = function(srcType) {
            var options = {
                // Some common settings are 20, 50, and 100
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                // In this app, dynamically set the picture source, Camera or photo gallery
                sourceType: srcType,
                encodingType: Camera.EncodingType.JPEG,
                mediaType: Camera.MediaType.PICTURE,
                allowEdit: true//,
                //correctOrientation: true  //Corrects Android orientation quirks
            }
            return options;
        };

        //For Plugin Camera
        //function openFilePicker(selection) {
        window.openFilePicker = function(selection) {
            //var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
            var srcType = Camera.PictureSourceType.PHOTOLIBRARY;
            //var srcType = Camera.PictureSourceType.CAMERA;
            var options = setOptions(srcType);
            var func = createNewFileEntry;

            navigator.camera.getPicture(function cameraSuccess(imageUri) {
                photoUrl = imageUri;

                console.log(photoUrl);
                var imgURL = photoUrl.substr(7);
                console.log(imgURL);

                JM.Message.sendGroupImageMessage(imgURL);

                /*
                $("<img id='myTempImage' style='display:none;' src='" + photoUrl + "'>").load(function() {
                    $(this).appendTo("#tempImage");
                    confirmPhoto($("#myTempImage").width(), $("#myTempImage").height());
                });
                */
            }, function cameraError(error) {
                console.debug("Unable to obtain picture: " + error, "app");

            }, options);
        };

        //For Plugin Camera
        //function createNewFileEntry(imgUri) {
        window.createNewFileEntry = function(imgUri) {
            window.resolveLocalFileSystemURL(cordova.file.cacheDirectory, function success(dirEntry) {

                // JPEG file
                dirEntry.getFile("tempFile.jpeg", { create: true, exclusive: false }, function (fileEntry) {
                    // Do something with it, like write to it, upload it, etc.
                    // writeFile(fileEntry, imgUri);
                    console.log("got file: " + fileEntry.fullPath);
                    // displayFileData(fileEntry.fullPath, "File copied to");
                }, onErrorCreateFile);

            }, onErrorResolveUrl);
        };

        //For Plugin Camera
        //function getFileEntry(imgUri) {
        window.getFileEntry = function(imgUri) {
            window.resolveLocalFileSystemURL(imgUri, function success(fileEntry) {

                // Do something with the FileEntry object, like write to it, upload it, etc.
                // writeFile(fileEntry, imgUri);
                console.log("got file: " + fileEntry.fullPath);
                //displayFileData(fileEntry.nativeURL, "Native URL");

            }, function () {
              // If don't get the FileEntry (which may happen when testing
              // on some emulators), copy to a new FileEntry.
                createNewFileEntry(imgUri);
            });
        };

        /********************************** page event *************************************/
        $("#viewChatroom").one("pagebeforeshow", function(event, ui) {
            //Chatroom Data
            var chatroomDataPopupData = {
                id: "chatroomDataPopup",
                content: $("template#tplChatroomDataPopup").html()
            };

            tplJS.Popup("viewChatroom", "viewChatroomContent", "append", chatroomDataPopupData);

            //Chatroom Member
            var chatroomMemberPopupData = {
                id: "chatroomMemberPopup",
                content: $("template#tplChatroomMemberPopup").html()
            };

            tplJS.Popup("viewChatroom", "viewChatroomContent", "append", chatroomMemberPopupData);
        });

        $("#viewChatroom").on("pageshow", function(event, ui) {
            //Refresh Chatroom Message
            JM.Message.getGroupConversationHistoryMessage();
            JM.Chatroom.clearGroupUnreadCount();
        });

        /********************************** dom event *************************************/
        $(document).on({
            click: function(event) {

                event.preventDefault();

                var msgText = $("#msgText").val();
                JM.Message.sendGroupTextMessage(msgText);

            }
        }, "#msgSend");

        $(document).on({
            click: function(event) {

                event.preventDefault();

                openFilePicker();
            }
        }, "#imgSend");

        $(document).on({
            click: function(event) {

                event.preventDefault();

                JM.Message.deleteGroupConversation();

            }
        }, "#msgClear");

        $(document).on({
            click: function(event) {

                event.preventDefault();

                JM.Chatroom.getGroupInfo(JM.chatroomID, "content");
                $("#chatroomDataPopup").popup("open");

            }
        }, "#groupInfo");

        $(document).on({
            click: function(event) {

                event.preventDefault();

                JM.Chatroom.memberArray(msgText);
                $("#chatroomMemberPopup").popup("open");

            }
        }, "#groupMember");

        $(document).on({
            click: function(event) {

                event.preventDefault();

                JM.friendID = $("#msgText").val();
                JM.Chatroom.addMembers();

            }
        }, "#groupMemberAdd");

        $(document).on({
            click: function(event) {

                event.preventDefault();

                JM.friendID = $("#msgText").val();
                JM.Chatroom.removeMembers();

            }
        }, "#groupMemberRemove");

        $(document).on({
            click: function(event) {

                if ($(event.target).hasClass("confirm")) {
                    $("#chatroomDataPopup").popup("close");
                }

            }
        }, "#chatroomDataPopup");

        $(document).on({
            click: function(event) {

                if ($(event.target).hasClass("confirm")) {
                    $("#chatroomMemberPopup").popup("close");
                }

            }
        }, "#chatroomMemberPopup");

    }
});
