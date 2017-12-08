
$("#viewMyInfoEdit").pagecontainer({
    create: function(event, ui) {

        var avatarUploadPath = "";

        /********************************** function *************************************/
        function avatarCrop(imageUploadURL) {

            var buttonHeight = parseFloat($(window).height() * 0.1306).toFixed(2);
            var imageContent = '<div id="avatarCropContent"></div>';

            var buttonContent = '<div class="button-content bottom font-style3"><span id="avatarCancel">重新選擇</span><span id="avatarConfirm">使用照片</span></div>';
            $('<div class="message-photo-full-screen">' + imageContent + buttonContent + '</div').appendTo("body");

            if (device.platform === "iOS") {
                $(".message-photo-full-screen img").css("padding-top", "20px");
            }

            $(".message-photo-full-screen").css("top", $(document).scrollTop());

            $('body').css({
                'overflow': 'hidden',
                'touch-action': 'none'
            });

            $('body').on('touchmove', function(e) {
                e.preventDefault();
            });

            //Photo Cancel - Button Event
            $("#avatarCancel").on("click", function() {
                avatarCropClose();
            });

            //Photo Confirm - Button Event
            $("#avatarConfirm").on("click", function() {
                avatarCropResult();
            });

            $('#avatarCropContent').croppie({
                url: imageUploadURL,
                // viewport options
                viewport: {
                    width: parseInt(document.documentElement.clientWidth * 65 / 100, 10),
                    height: parseInt(document.documentElement.clientWidth * 65 / 100, 10),
                    type: 'circle' //square, circle
                },
                // boundary options
                boundary: {
                    width: parseInt(document.documentElement.clientWidth * 85 / 100, 10),
                    height: parseInt(document.documentElement.clientWidth * 85 / 100, 10)
                },
                // addiontal CSS class
                customClass: 'avatar-crop-content',
                // show image zoom control
                show: true,
                // image zoom with mouse wheel
                mouseWheelZoom: true,
                // callback
                update: function () {}
            });

        }

        function avatarCropResult() {
            $('#avatarCropContent').croppie('result', 'base64').then(function (img) {
                $("#viewMyInfoEditContent .chatroom-info-photo-content svg").hide();
                $("#viewMyInfoEditContent .chatroom-info-photo-content img").prop("src", img);
                $("#viewMyInfoEditContent .chatroom-info-photo-content img").show();

                console.log(img);
                avatarUploadPath = img;

                // Split the base64 string in data and contentType
                var block = avatarUploadPath.split(";");
                // Get the content type
                var dataType = block[0].split(":")[1];// In this case "image/png"
                // get the real base64 content of the file
                var realData = block[1].split(",")[1];// In this case "iVBORw0KGg...."

                // The path where the file will be created
                var folderpath = "file:///storage/emulated/0/";
                // The name of your file, note that you need to know if is .png,.jpeg etc
                var filename = "myimage.png";

                savebase64AsImageFile(folderpath, filename, realData, "image/png");

            });

            avatarCropClose();

            loadingMask("show");
        }

        function b64toBlob(b64Data, contentType, sliceSize) {
                contentType = contentType || '';
                sliceSize = sliceSize || 512;

                var byteCharacters = atob(b64Data);
                var byteArrays = [];

                for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                    var slice = byteCharacters.slice(offset, offset + sliceSize);

                    var byteNumbers = new Array(slice.length);
                    for (var i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i);
                    }

                    var byteArray = new Uint8Array(byteNumbers);

                    byteArrays.push(byteArray);
                }

              var blob = new Blob(byteArrays, {type: contentType});
              return blob;
        }

        function savebase64AsImageFile(folderpath, filename, content, contentType){
            console.log("Starting to write the file");

            // Convert the base64 string in a Blob
            var DataBlob = b64toBlob(content, contentType);

            window.resolveLocalFileSystemURL(folderpath, function(dir) {
                console.log("Access to the directory granted succesfully");

                dir.getFile(filename, {create:true}, function(file) {
                    console.log("File created succesfully.");

                    file.createWriter(function(fileWriter) {
                        console.log("Writing content to file");

                        fileWriter.write(DataBlob);
                        console.log(fileWriter);

                        getAvatarLocalURL(fileWriter.localURL);
                    }, function(){
                        alert('Unable to save file in path '+ folderpath);
                    });
                });
            });
        }

        function getAvatarLocalURL(localURL) {
            window.resolveLocalFileSystemURL(localURL, function(entry) {
                var nativePath = entry.toURL();
                console.log('Native URI: ' + nativePath.substr(7));

                avatarUploadPath = nativePath.substr(7);
                //updateMyAvatar();
            });
        }

        function avatarCropClose() {
            $(".message-photo-full-screen").remove();

            $('body').css({
                'overflow': 'auto',
                'touch-action': 'auto'
            });
            $('body').off('touchmove');
        }

        function setQUserDetail() {
            (function() {

                var queryDataObj = {
                    emp_no: loginData["emp_no"],
                    memo: $("#myInfoStatus").val().substr(0, 19)
                };

                var queryDataParameter = createXMLDataString(queryDataObj);

                var queryData = "<LayoutHeader>" + queryDataParameter + "</LayoutHeader>";

                var successCallback = function(data) {
                    var resultCode = data['ResultCode'];

                    if (resultCode === "1") {
                        updateMyAvatar();
                    }
                };

                var failCallback = function(data) {};

                CustomAPI("POST", true, "setQUserDetail", successCallback, failCallback, queryData, "");

            }());
        }

        function updateMyAvatar() {
            (function() {

                var callback = function(status, data) {

                    if (status === "success") {
                        console.log("=============updateMyAvatar success");
                        loadingMask("hide");
                    }

                };

                JM.User.updateMyAvatar(avatarUploadPath, callback);

            }());
        }

        /********************************** page event *************************************/
        $("#viewMyInfoEdit").on("pagebeforeshow", function(event, ui) {

            if (JM.data.chatroom_user[loginData["loginid"]].avator_download_time != 0) {
                $("#viewMyInfoEditContent .chatroom-info-photo-content svg").hide();
                $("#viewMyInfoEditContent .chatroom-info-photo-content img").prop("src", JM.data.chatroom_user[loginData["loginid"]].avator_path);
                $("#viewMyInfoEditContent .chatroom-info-photo-content img").show();
            }

            $("#myInfoStatus").val(JM.data.chatroom_user[loginData["loginid"]].memo);

        });

        $("#viewMyInfoEdit").on("pageshow", function(event, ui) {
            prevPageID = "viewMyInfoEdit";
        });

        /********************************** dom event *************************************/
        $(document).on({
            click: function() {
                CameraPlugin.openFilePicker("PHOTOLIBRARY", avatarCrop);
            }
        }, "#viewMyInfoEditContent .my-photo-edit");

        $(document).on({
            click: function() {
                setQUserDetail();
            }
        }, "#viewMyInfoEdit #saveMyInfo");

        //Back Button
        $(document).on({
            click: function() {
                $.mobile.changePage('#' + prevPageID);
            }
        }, "#backMyInfoEdit");

    }
});
