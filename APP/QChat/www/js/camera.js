
//cordova-plugin-camera
var CameraPlugin = {
    imageUploadURL: "",
    setOptions: function(srcType) {
        var options = {
            // Some common settings are 20, 50, and 100
            quality: 80,
            destinationType: Camera.DestinationType.FILE_URI,
            // In this app, dynamically set the picture source, Camera or photo gallery
            sourceType: srcType,
            encodingType: Camera.EncodingType.JPEG,
            mediaType: Camera.MediaType.PICTURE,
            targetHeight: document.documentElement.clientHeight,
            targetWidth: document.documentElement.clientWidth,
            allowEdit: false,
            correctOrientation: true  //Corrects Android orientation quirks
        }
        return options;
    },
    openFilePicker: function(openType, callback) {

        //srcType: SAVEDPHOTOALBUM / PHOTOLIBRARY / CAMERA
        if (openType === "PHOTOLIBRARY") {
            var srcType = Camera.PictureSourceType.PHOTOLIBRARY;
        } else {
            var srcType = Camera.PictureSourceType.CAMERA;
        }

        var options = this.setOptions(srcType);

        navigator.camera.getPicture(function cameraSuccess(imageUri) {

            //For JMessage upload image, the path is diff in iOS / Android
            //Android > [/storage/emulated/0/DCIM/Camera/XXX.jpg]
            //iOS > [/var/mobile/Containers/Data/Application/7DC5CDFF-6581-4AD3-B165-B604EBAB1250/tmp/XXX.jpg]
            if (device.platform === "iOS") {
                var imageRealURL = imageUri.substr(7);
            }

            if (device.platform === "Android") {
                var imageRealURL = imageUri.substr(7);
            }

            //cordova-plugin-camera: if select photo from PHOTOLIBRARY, it will return /storage/XXX.jpg?12345678
            //JMessage only accept the path [/storage/XXX.jpg], so, need to ignore the string [?12345678]
            var imageRealURLArray = imageRealURL.split("?");
            CameraPlugin.imageUploadURL = imageRealURLArray[0];

            callback(CameraPlugin.imageUploadURL);

        }, function cameraError(error) {

            console.debug("Unable to obtain picture: " + error, "app");
            loadingMask("hide");

        }, options);
    }
};