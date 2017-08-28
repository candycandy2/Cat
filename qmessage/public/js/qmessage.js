(function (w) {
    /*encryption salt*/
    var RANDOM_STR = "022cd9fd995849b58b3ef0e943421ed9";
    /* auto select:http/https */
    var HTTP_PREFIX = "http://";
    /* global url collection */
    var URL_MAP = {
        "getPwd": "v101/qmessage/pwd"
        , "storeTextHistory": "v101/qmessage/history/text"
        , "storePicHistory": "v101/qmessage/history/pic"
        , "storeFileHistory": "v101/qmessage/history/file"
    };

    /* constructor */
    var QMessage = function (options) {
        return new QMessage.prototype.init(options);
    };

    /* global proxy function */
    QMessage.prototype.init = function (options) {
        var settings
            , pwd
            , JIM
            , defaults
            , self
            /*function*/
            , Init
            , Login
            , GetPwd
            , InitSelf
            , StoreTextHistory
            , StorePicHistory

        defaults = {
            'eventHandler': $.noop,
            'messageHandler': $.noop,
            'debug': false,
            'username': "",
            'message_key': "",
            'message_secret': "",
            'message_api_url_prefix': ""
        };

        //message_key，message_secret检查
        settings = $.extend({}, defaults, options);
        if ($.trim(options.message_key) == "") {
            throw new Error("message key is empty !");
        }
        if ($.trim(options.message_secret) == "") {
            throw new Error("message secret is empty !");
        }
        self = this;
        self.isInited = false;

        //Open CORS
        $.ajaxSetup({
            "beforeSend": function (request) {
                request.setRequestHeader("Access-Control-Allow-Origin", "*");
            }
        });

        //Get Password
        GetPwd = function () {
            var url = $.trim(options["message_api_url_prefix"]);
            url = (url == "") ? URL_MAP["getPwd"] : (HTTP_PREFIX + url + URL_MAP["getPwd"]);
            $.ajax({
                url: url,
                dataType: "json",
                type: "POST",
                async: false,
                contentType: "application/json",
                data: JSON.stringify({ "username": settings.username }),
                success: function (d, status, xhr) {
                    pwd = d['Content'];
                },
                error: function (e) {
                    throw e;
                }
            });
        };

        InitSelf = function () {
            $.when(GetPwd()).then(Login());
        };

        /* Init JIM */
        Init = (function () {
            var appKey = $.trim(options["message_key"]);
            var secret = $.trim(options["message_secret"]);
            var timeStamp = getTimestamp();
            var signature = getSignature(appKey, timeStamp, RANDOM_STR, secret);
            JIM = new JMessage({ debug: settings.debug });
            JIM.init({
                "appkey": appKey,
                "random_str": RANDOM_STR,
                "signature": signature,
                "timestamp": timeStamp
            }).onSuccess(function (data) {
                InitSelf();
            }).onFail(function (data) {
                throw data;
            });
        })();

        /* Login JMessage */
        Login = function () {
            JIM.login({
                'username': settings.username,
                'password': pwd
            })
                .onSuccess(function (data) {
                    JIM.onMsgReceive(function (data) {
                        if (options["messageHandler"] instanceof String) {
                            setTimeout(options["messageHandler"] + "(" + data + ")", 0);
                        }
                        if (options["messageHandler"] instanceof Function) {
                            options["messageHandler"](data);
                        }
                    });
                    JIM.onEventNotification(function (data) {
                        if (options["eventHandler"] instanceof String) {
                            setTimeout(options["eventHandler"] + "(" + data + ")", 0);
                        }
                        if (options["eventHandler"] instanceof Function) {
                            options["eventHandler"](data);
                        }
                    });
                    self.isInited = true;
                })
                .onFail(function (data) {
                    console.log('error:' + JSON.stringify(data));
                    self.isInited = false;
                })
                .onTimeout(function (data) {
                    console.log('timeout:' + JSON.stringify(data));
                    self.isInited = false;
                });
        };

        /* Text history to server */
        StoreTextHistory = function (content, msg) {
            /*var url = $.trim(options["message_api_url_prefix"]);
            url = (url == "") ? URL_MAP["storeTextHistory"] : (HTTP_PREFIX + url + URL_MAP["storeTextHistory"]);
            var json = {
                "msg_id": msg["msg_id"],
                "msg_type": content["msg_type"],
                "from_id": content["from_id"],
                "from_type": "user",
                "target_id": content["target_id"],
                "target_type": content["target_type"],
                "target_name": content["target_name"],
                "ctime": content["create_time"],
                "content": JSON.stringify(content["msg_body"])
            };
            $.post(url, JSON.stringify(json));*/
        };

        /* Picture history to server */
        StorePicHistory = function (content, msg) {
            /*var url = $.trim(options["message_api_url_prefix"]);
            url = (url == "") ? URL_MAP["storePicHistory"] : (HTTP_PREFIX + url + URL_MAP["storePicHistory"]);
            var json = {
                "msg_id": msg["msg_id"],
                "msg_type": content["msg_type"],
                "from_id": content["from_id"],
                "from_type": "user",
                "target_id": content["target_id"],
                "target_type": content["target_type"],
                "target_name": content["target_name"],
                "ctime": content["create_time"],
                "content": JSON.stringify(content["msg_body"]),
                "fname": content["fname"],
                "extras": content["msg_body"]
            };
            $.post(url, JSON.stringify(json));*/
        };

        /* File history to server */
        StoreFileHistory = function (content, msg) {
            /*var url = $.trim(options["message_api_url_prefix"]);
            url = (url == "") ? URL_MAP["storeFileHistory"] : (HTTP_PREFIX + url + URL_MAP["storeFileHistory"]);
            var json = {
                "msg_id": msg["msg_id"],
                "msg_type": content["msg_type"],
                "from_id": content["from_id"],
                "from_type": "user",
                "target_id": content["target_id"],
                "target_type": content["target_type"],
                "target_name": content["target_name"],
                "ctime": content["create_time"],
                "content": JSON.stringify(content["msg_body"]),
                "fname": content["fname"],
                "extras": content["msg_body"]
            };
            $.post(url, JSON.stringify(json));*/
        };

        /* QMessage API */
        QMessage.prototype.SendText = function (gid, gname, txt, success, error) {
            var result = { 'code': -1, 'message': 'QMessage has not been inited' };
            if (!this.isInited) {
                error(result);
                return;
            }
            JIM.sendGroupMsg({
                'target_gid': gid,
                'target_gname': gname,
                'content': txt
            }).onSuccess(function (data) {
                var content = this.data["content"];
                var __args = {
                    result: data,
                    content: content
                };
                StoreTextHistory(content, data);
                if (success instanceof String) {
                    setTimeout(success + "(" + __args + ")", 0);
                }
                if (success instanceof Function) {
                    success(__args);
                }
            }).onFail(function (data) {
                var __args = {
                    result: data,
                    content: ""
                };
                if (error instanceof String) {
                    setTimeout(error + "(" + __args + ")", 0);
                }
                if (error instanceof Function) {
                    error(__args);
                }
            });
        };

        QMessage.prototype.SendImage = function (gid, gname, imgId, success, error) {
            var result = { 'code': -1, 'message': 'QMessage has not been inited' };
            if (!this.isInited) {
                error(result);
                return;
            }
            //为了缓存filename，将getfile方法拆分
            var fd = new FormData();
            var file = $("#" + imgId)[0];
            var filename;
            if (!file.files[0]) {
                throw new Error('获取文件失败');
            } else {
                filename = file.files[0].name;
            }
            fd.append(filename, file.files[0]);

            JIM.sendGroupPic({
                'target_gid': gid,
                'target_gname': gname,
                'image': fd
            }).onSuccess(function (msg) {
                var content = this.data["content"];
                content["fname"] = filename;
                var __args = {
                    result: msg,
                    content: content
                };
                StorePicHistory(content, msg); 
                if (success instanceof String) {
                    setTimeout(success + "(" + __args + ")", 0);
                }
                if (success instanceof Function) {
                    success(__args);
                }
            }).onFail(function (msg) {
                console.log(JSON.stringify(msg));
                if (error instanceof String) {
                    setTimeout(error + "(" + msg + ")", 0);
                }
                if (error instanceof Function) {
                    error(msg);
                }
            });
        };

        QMessage.prototype.SendFile = function (gid, gname, fileId, success, error) {
            var result = { 'code': -1, 'message': 'QMessage has not been inited' };
            if (!this.isInited) {
                error(result);
                return;
            }
            //为了缓存filename，将getfile方法拆分
            var fd = new FormData();
            var file = $("#" + fileId)[0];
            var filename;
            if (!file.files[0]) {
                throw new Error('获取文件失败');
            } else {
                filename = file.files[0].name;
            }
            fd.append(filename, file.files[0]);

            JIM.sendGroupFile({
                'target_gid': gid,
                'target_gname': gname,
                'file': fd
            }).onSuccess(function(msg) {
                var content = this.data["content"];
                content["fname"] = filename;
                var __args = {
                    result: msg,
                    content: content
                };
                StoreFileHistory(content, msg);
                if (success instanceof String) {
                    setTimeout(success + "(" + __args + ")", 0);
                }
                if (success instanceof Function) {
                    success(__args);
                }
            }).onFail(function(data) {
                if (error instanceof String) {
                    setTimeout(error + "(" + msg + ")", 0);
                }
                if (error instanceof Function) {
                    error(msg);
                }
            });
        };

        QMessage.prototype.close = function () {
            JIM.loginOut();
        };

        /* tool functions */
        function getTimestamp() {
            return $.now();
        }

        function getMD5HashValue(value) {
            return md5(value);
        }

        function getSignature(currentAppKey, currentTimeStamp, currentRandomStr, currentSecret) {
            var source = "appkey=" + currentAppKey + "&timestamp=" + currentTimeStamp + "&random_str=" + currentRandomStr + "&key=" + currentSecret;
            return getMD5HashValue(source);
        }

    }

    QMessage.prototype.init.prototype = QMessage.prototype;

    w.QMessage = QMessage;
})(window, undefined);

