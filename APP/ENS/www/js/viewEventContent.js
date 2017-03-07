
$("#viewEventContent").pagecontainer({
    create: function(event, ui) {
        
        var photoUrl;
        var resizePhotoWidth;
        var resizePhotoHeight;
        var uploadPhoto = false;
        /********************************** function *************************************/

        //For Plugin Camera
        function setOptions(srcType) {
            var options = {
                // Some common settings are 20, 50, and 100
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                // In this app, dynamically set the picture source, Camera or photo gallery
                sourceType: srcType,
                encodingType: Camera.EncodingType.JPEG,
                mediaType: Camera.MediaType.PICTURE,
                allowEdit: true,
                correctOrientation: true  //Corrects Android orientation quirks
            }
            return options;
        }

        //For Plugin Camera
        function openFilePicker(selection) {
            var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
            var options = setOptions(srcType);
            var func = createNewFileEntry;

            navigator.camera.getPicture(function cameraSuccess(imageUri) {

                photoUrl = imageUri;
                //var image = document.getElementById('myImage');
                //image.src = imageUri;

                /*
                var canvas = document.createElement('canvas');
                var context = canvas.getContext('2d');
                var img = document.getElementById('myImage');
                canvas.width = img.width;
                canvas.height = img.height;
                context.drawImage(img, 0, 0 );
                var myData = context.getImageData(0, 0, img.width, img.height);
                */

                $("<img id='myTempImage' style='display:none;' src='" + photoUrl + "'>").load(function() {
                    $(this).appendTo("#tempImage");
                    confirmPhoto($("#myTempImage").width(), $("#myTempImage").height());
                });

            }, function cameraError(error) {
                console.debug("Unable to obtain picture: " + error, "app");

            }, options);
        }

        //For Plugin Camera
        function createNewFileEntry(imgUri) {
            window.resolveLocalFileSystemURL(cordova.file.cacheDirectory, function success(dirEntry) {

                // JPEG file
                dirEntry.getFile("tempFile.jpeg", { create: true, exclusive: false }, function (fileEntry) {

                    // Do something with it, like write to it, upload it, etc.
                    // writeFile(fileEntry, imgUri);
                    console.log("got file: " + fileEntry.fullPath);
                    // displayFileData(fileEntry.fullPath, "File copied to");

                }, onErrorCreateFile);

            }, onErrorResolveUrl);
        }

        //Full-screen Photo to confirm > cancel or confirm
        function confirmPhoto(imageWidth, imageHeight) {
            var clientHeight = document.documentElement.clientHeight;
            var clientWidth = document.documentElement.clientWidth;
            var resizeWidthPercent = parseFloat(clientWidth / imageWidth).toFixed(2)

            resizePhotoWidth = parseInt(imageWidth * resizeWidthPercent, 10);
            resizePhotoHeight = parseInt(imageHeight * resizeWidthPercent, 10);

            var imageContent = '<img src="' + photoUrl + '" width="' + resizePhotoWidth + '" height="' + resizePhotoHeight + '">';

            var buttonContent = '<div class="button-content bottom font-style3"><span id="photoCancel">重新選擇</span><span id="photoConfirm">使用照片</span></div>';
            $('<div class="event-content-photo-full-screen">' + imageContent + buttonContent + '</div').appendTo("body");

            tplJS.preventPageScroll();
        }

        function confirmPhotoClose() {
            $(".event-content-photo-full-screen").remove();
        }

        function confirmPhotoOK() {
            var image = document.getElementById('finalImage');
            image.src = photoUrl;
            uploadPhoto = true;

            $(".previewImageDiv").show();
            $(".previewImageDiv-AddHeight").show();

            $(".event-content-photo-full-screen").remove();

            tplJS.recoveryPageScroll();
        }

        function fullScreenPhoto() {
            var imageContent = '<img src="' + photoUrl + '" width="' + resizePhotoWidth + '" height="' + resizePhotoHeight + '">';
            var buttonContent = '<div class="button-content top"><div class="back-button"><span class="back"></span></div></div>';
            $('<div class="event-content-photo-full-screen">' + imageContent + buttonContent + '</div').appendTo("body");

            tplJS.preventPageScroll();
        }

        /********************************** page event *************************************/
        $("#viewEventContent").one("pagebeforeshow", function(event, ui) {

            //Event List Msg
            var eventListMsgHTML = $("template#tplEventListMsg").html();
            var eventListMsg = $(eventListMsgHTML);
            $("#contentEventContent").prepend(eventListMsg);

        });

        $("#viewEventContent").on("pageshow", function(event, ui) {
            /*
            //Open Camera in Mobile Phone
            navigator.camera.getPicture(onSuccess, onFail, {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI
            });

            function onSuccess(imageURI) {
                console.log(imageURI);
                var image = document.getElementById('myImage');
                image.src = imageURI;
            }

            function onFail(message) {
                alert('Failed because: ' + message);
            }
            */
        });
        /********************************** dom event *************************************/

        //Open Photo Library
        $(document).on("click", "#viewEventContent #cameraButton", function() {
            openFilePicker();
        });

        //Photo Confirm - Button Event
        $(document).on("click", "#photoCancel", function() {
            confirmPhotoClose();
            openFilePicker();
        });

        $(document).on("click", "#photoConfirm", function() {
            confirmPhotoOK();
        });

        //Photo - Small Preview
        $(document).on("click", ".previewImageDiv .delete-button", function() {
            uploadPhoto = false;
            $(".previewImageDiv").hide();
            $(".previewImageDiv-AddHeight").hide();

            $(".event-content-footer").removeClass("ui-fixed-hidden");
        });

        //Photo - FullScreen Preview
        $(document).on("click", "#finalImage", function() {
            fullScreenPhoto();
        });

        $(document).on("click", ".button-content .back-button", function() {
            $(".event-content-photo-full-screen").remove();
            $(".event-content-footer").removeClass("ui-fixed-hidden");

            tplJS.recoveryPageScroll();
        });
    }
});
