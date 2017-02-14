(function (w) {
    var APP_KEY = "3c207a542c715ca5a0c7426d";
    var SECRET = "b15a6140ee8971c7598c3a0b";
    var RANDOM_STR = "022cd9fd995849b58b3ef0e943421ed9";

    var QMessage = function (options) {
        return new QMessage.prototype.init(options);
    };

    QMessage.prototype.init = function (options) {
        var settings, _pwd, _JIM, _defaults, _self
            , __Init, __Login, __GetPwd, __InitSelf
            ,__StoreTextHistory,__StorePicHistory
        _defaults = {
            'eventHandler': $.noop ,
            'messageHandler': $.noop,
            'debug': false,
            'username':""
        };
        settings = $.extend({}, _defaults, options);
        _self = this;
        _self.isInited = false;

        //(1)取密码
        __GetPwd = function () {
            $.ajax({
                url: "v101/qmessage/pwd",
                dataType: "json",
                type: "POST",
                async:false,
                contentType: "application/json",
                data: JSON.stringify({ "username": settings.username }),
                beforeSend: function (request) {
                    request.setRequestHeader("app-key", "appqplay");
                    request.setRequestHeader("signature", "Moses824");
                    request.setRequestHeader("signature-time", "1000000000");
                },
                success: function (d, status, xhr) {
                    console.log(JSON.stringify(d));
                    _pwd = d['Content'];
                },
                error: function (e) {
                    console.log(e);
                }
            });
        };

        __InitSelf = function() {
            $.when(__GetPwd()).then(__Login());
        };

        //(3)登录
        __Login = function(){
            _JIM.login({
                'username': settings.username,
                'password': _pwd
            })
                .onSuccess(function (data) {
                    _JIM.onMsgReceive(function (data) {
                        if (options["messageHandler"] instanceof String) {
                            setTimeout(options["messageHandler"] + "(" + data + ")", 0);
                        }
                        if (options["messageHandler"] instanceof Function) {
                            options["messageHandler"](data);
                        }
                    });
                    _JIM.onEventNotification(function (data) {
                        if (options["eventHandler"] instanceof String) {
                            setTimeout(options["eventHandler"] + "(" + data + ")", 0);
                        }
                        if (options["eventHandler"] instanceof Function) {
                            options["eventHandler"](data);
                        }
                    });
                    _self.isInited = true;
                })
                .onFail(function (data) {
                    console.log('error:' + JSON.stringify(data));
                    _self.isInited = false;
                })
                .onTimeout(function (data) {
                    console.log('timeout:' + JSON.stringify(data));
                    _self.isInited = false;
                });
        };

        //(2)初始化JMessage对象
        __Init = (function () {
            var timeStamp = getTimestamp();
            var signature = getSignature(APP_KEY, timeStamp, RANDOM_STR, SECRET);
            _JIM = new JMessage({ debug: settings.debug });
            _JIM.init({
                "appkey": APP_KEY,
                "random_str": RANDOM_STR,
                "signature": signature,
                "timestamp": timeStamp
            }).onSuccess(function (data) {
                __InitSelf();
            }).onFail(function (data) {
                console.log('error:' + JSON.stringify(data));
            });
        })();

        //存储历史记录
        __StoreTextHistory =  function (content,msg) {
            var url = 'v101/qmessage/history/text';
            var json = {
                "msg_id":msg["msg_id"],
                "msg_type":content["msg_type"],
                "from_id":content["from_id"],
                "from_type":"user",
                "target_id":content["target_id"],
                "target_type":content["target_type"],
                "target_name":content["target_name"],
                "ctime":content["create_time"],
                "content":JSON.stringify(content["msg_body"])
            };
            $.post(url,JSON.stringify(json));
        };

        __StorePicHistory =  function (content,msg) {
            var url = 'v101/qmessage/history/pic';
            var json = {
                "msg_id":msg["msg_id"],
                "msg_type":content["msg_type"],
                "from_id":content["from_id"],
                "from_type":"user",
                "target_id":content["target_id"],
                "target_type":content["target_type"],
                "target_name":content["target_name"],
                "ctime":content["create_time"],
                "content":JSON.stringify(content["msg_body"]),
                "fname":content["fname"],
                "extras":content["msg_body"]
            };
            $.post(url,JSON.stringify(json));
        };

        //调用QMessage API
        QMessage.prototype.SendText = function (gid, gname, txt, success, error) {
            var result = { 'code': -1, 'message': 'QMessage has not been inited' };
            if (!this.isInited) {
                error(result);
                return;
            }
            _JIM.sendGroupMsg({
                'target_gid': gid,
                'target_gname': gname,
                'content': txt
            }).onSuccess(function (data) {
                var content = this.data["content"];
                var __args = {
                    result:data,
                    content:content
                };
                __StoreTextHistory(content,data); //历史记录
                if (success instanceof String) {
                    setTimeout(success + "(" + __args + ")", 0);
                }
                if (success instanceof Function) {
                    success(__args);
                }
            }).onFail(function (data) {
                var __args = {
                    result:data,
                    content:""
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
            var file = $("#"+imgId)[0];
            var filename;
            if(!file.files[0]) {
                throw new Error('获取文件失败');
            }else {
                filename = file.files[0].name;
            }
            fd.append(filename, file.files[0]);

            _JIM.sendGroupPic({
                'target_gid' : gid,
                'target_gname' : gname,
                'image' : fd
            }).onSuccess(function (msg) {
                var content = this.data["content"];
                content["fname"] = filename;
                var __args = {
                    result:msg,
                    content:content
                };
                __StorePicHistory(content,msg); //历史记录
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

        QMessage.prototype.close = function () {
            _JIM.loginOut();
        };

        //工具方法
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
})(window,undefined);

