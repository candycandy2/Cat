$("#viewMessageList").pagecontainer({
    create: function(event, ui) {

        var messageType = "news",
            allChecked = false,
            deleteType,
            msgUpdateDate,
            currentPage = 1, //当前页
            sumPage = 0, //总页数
            numPerPage = 10, //每页数据量
            responsecontent,
            imgURL = '/widget/widgetPage/viewMessageList/img/';

        //获取portal
        function QueryPortalList(type) {
            (function(type) {

                //type: Announcement, Communication, CIP, CSD, ITS
                var queryData = "<LayoutHeader><PortalCategory>" + type + "</PortalCategory></LayoutHeader>";

                var successCallback = function(data) {

                    if (data["ResultCode"] === "1") {
                        //save to local data
                        window.localStorage.removeItem(queryData);
                        var jsonData = {};
                        jsonData = {
                            lastUpdateTime: new Date(),
                            content: data['Content']
                        };
                        window.localStorage.setItem(queryData, JSON.stringify(jsonData));

                        //record APP all data
                        responsecontent = jsonData['content'];
                        if (responsecontent.length > 0) {
                            if (type == 'IDEA') {
                                //获取idea portal总页数，向上取整
                                sumPage = Math.ceil(responsecontent.length / numPerPage);
                                createIdeaPortal(responsecontent, currentPage, sumPage, numPerPage);
                            } else {
                                createPortalByType(responsecontent, type.toLowerCase());
                            }
                        }
                    }

                    //portal update date
                    $('.msg-update-date').text(langStr['str_079'] + new Date().yyyymmdd('/'));
                    loadingMask("hide");
                };

                var failCallback = function(data) {
                    $('.msg-update-date').text(langStr['str_079'] + new Date().yyyymmdd('/'));
                    loadingMask("hide");
                };

                //review by alan
                var localdata = window.localStorage.getItem(queryData);
                var QueryData = null;
                if (localdata == null) {
                    QueryData = null;
                } else {
                    QueryData = JSON.parse(localdata);
                }
                if (QueryData === null || checkDataExpired(QueryData['lastUpdateTime'], 30, 'mm')) {
                    loadingMask("show");
                    CustomAPI("POST", true, "PortalList", successCallback, failCallback, queryData, "");
                } else {
                    responsecontent = QueryData['content'];
                    if (responsecontent.length > 0) {
                        if (type == 'IDEA') {
                            //获取idea portal总页数，向上取整
                            sumPage = Math.ceil(responsecontent.length / numPerPage);
                            createIdeaPortal(responsecontent, currentPage, sumPage, numPerPage);
                        } else {
                            createPortalByType(responsecontent, type.toLowerCase());
                        }
                    }

                    //portal update date
                    $('.msg-update-date').text(langStr['str_079'] + new Date(QueryData['lastUpdateTime']).yyyymmdd('/'));
                }

            }(type));
        };

        //创建portal list
        function createPortalByType(arr, type) {
            var content = '';
            for (var i in arr) {
                content += '<li data-icon="false" data-rowid="' + arr[i].PortalID + '"><a href="#" class="ui-portal ui-btn"><div class="msg-check-icon">' +
                    '<img src="img/checkbox.png" data-src="checkbox" class="msg-check-btn"></div><div class="msg-content-title read-font-normal"><div>' +
                    arr[i].PortalDate.replaceAll('/', '-') + '</div><div>' + arr[i].PortalSubject + '</div></div><div class="msg-next-icon">' +
                    '<img src="img/nextpage.png" class="msg-next-btn"></div><input type="hidden" value="' + arr[i].PortalURL + '"></a></li>';
            }

            $("." + type + "-content ul").html('').append(content);
        }

        //創意園地
        function createIdeaPortal(arr, cur, sum, num) {
            var content = '';

            for (var i = (cur - 1) * num; i < (cur < sum ? cur * num : arr.length); i++) {
                content += '<li data-icon="false" data-rowid="' + arr[i].PortalID + '"><a href="#" class="ui-portal ui-btn">' +
                    '<div class="msg-thumbnail" style="background:url(' + arr[i].PortalImageURL + ') 0% / cover;"></div><div class="msg-idea-title read-font-normal"><div>' +
                    arr[i].PortalSubject + '</div><div><span>' + arr[i].PortalSource + '</span>&nbsp;&nbsp;<span>' + new Date(arr[i].PortalDate).yyyymmdd('/') +
                    '</span></div></div><input type="hidden" value="' + arr[i].PortalURL + '"></a></li>';
            }

            $(".idea-content ul").append(content);
        }

        function checkPortalByFunctionList() {
            if (window.localStorage.getItem('FunctionData') !== null) {
                var function_list = JSON.parse(window.localStorage.getItem('FunctionData'))['function_list'];
                for (var i in function_list) {
                    //1. 先找到News
                    if (function_list[i].function_variable == 'News') {
                        //2. 再检查是否可用
                        if (function_list[i].function_content.right == 'Y') {
                            $('div[data-item="idea"]').show();
                            $('div[data-item="announcement"]').show();
                            $('div[data-item="communication"]').show();
                            $('div[data-item="cip"]').show();
                            $('div[data-item="csd"]').show();
                            $('div[data-item="its"]').show();
                        } else {
                            $('div[data-item="idea"]').hide();
                            $('div[data-item="announcement"]').hide();
                            $('div[data-item="communication"]').hide();
                            $('div[data-item="cip"]').hide();
                            $('div[data-item="csd"]').hide();
                            $('div[data-item="its"]').hide();
                        }
                        break;
                    }
                }
            } else {
                $('div[data-item="idea"]').hide();
                $('div[data-item="announcement"]').hide();
                $('div[data-item="communication"]').hide();
                $('div[data-item="cip"]').hide();
                $('div[data-item="csd"]').hide();
                $('div[data-item="its"]').hide();
            }
        }

        //根据不同类型显示不同消息
        function showDiffMessageByType(type) {
            $.each($('.message-type > div'), function(index, item) {
                if ($(item).attr('class') == type + '-content') {
                    $(item).show();
                } else {
                    $(item).hide();
                }
            });
        }

        //根据message数据，动态生成html
        function createMessageByType() {
            //1. html
            //var resultArr = loginData['messagecontent']['message_list'];
            var messagecontent_ = JSON.parse(window.localStorage.getItem('messagecontentEx'));
            var resultArr = null;
            if (messagecontent_ != null)
                resultArr = messagecontent_.content.message_list;
            //console.log(resultArr);

            var newsContent = '';
            var eventContent = '';
            for (var i in resultArr) {
                if (resultArr[i]['message_type'] == 'event' && resultArr[i].read != 'D') {
                    eventContent += '<li data-icon="false" data-rowid="' + resultArr[i].message_send_row_id +
                        '"><div class="behind"><a href="#" class="ui-btn delete-btn"><img src="img/delete.png" class="msg-delete-btn"></a></div><a href="#" class="ui-message ui-btn">' +
                        '<div class="msg-check-icon"><img src="img/checkbox.png" data-src="checkbox" class="msg-check-btn"></div><div class="msg-content-title' +
                        (resultArr[i].read == "Y" ? " read-font-normal" : "") + '"><div>' +
                        resultArr[i].create_time.split(' ')[0] + '</div><div>' +
                        resultArr[i].message_title + '</div></div><div class="msg-next-icon"><img src="img/nextpage.png" class="msg-next-btn"></div></a></li>';

                } else if (resultArr[i]['message_type'] == 'news' && resultArr[i].read != 'D') {
                    newsContent += '<li data-icon="false" data-rowid="' + resultArr[i].message_send_row_id +
                        '"><div class="behind"><a href="#" class="ui-btn delete-btn"><img src="img/delete.png" class="msg-delete-btn"></a></div><a href="#" class="ui-message ui-btn">' +
                        '<div class="msg-check-icon"><img src="img/checkbox.png" data-src="checkbox" class="msg-check-btn"></div><div class="msg-content-title' +
                        (resultArr[i].read == "Y" ? " read-font-normal" : "") + '"><div>' +
                        resultArr[i].create_time.split(' ')[0] + '</div><div>' +
                        resultArr[i].message_title + '</div></div><div class="msg-next-icon"><img src="img/nextpage.png" class="msg-next-btn"></div></a></li>';
                }
            }

            $(".news-content ul").html('').append(newsContent);
            $(".event-content ul").html('').append(eventContent);

            //2. swipe
            var x;
            $('.swipe-delete li > a')
                .on('touchstart', function(event) {
                    //console.log(event.originalEvent.pageX)
                    $('.swipe-delete li > a').css('left', '0px') // close em all
                    $(event.currentTarget).addClass('open')
                    //x为手指接触屏幕的点与屏幕左侧的边距，初始值（0~360）
                    x = event.originalEvent.targetTouches[0].pageX // anchor point
                })
                .on('touchmove', function(event) {
                    //结束位置 - 起始位置 = 滑动距离（-360~360），小于零表示左滑，反之右滑
                    var change = event.originalEvent.targetTouches[0].pageX - x;
                    if (change < -50) {
                        disable_scroll() // disable scroll once we hit 10px horizontal slide
                    } else {
                        //(-100~0),右滑为0,左滑为距离
                        change = Math.min(Math.max(-100, change), 0) // restrict to -100px left, 0px right
                        event.currentTarget.style.left = change + 'px';
                    }

                })
                .on('touchend', function(event) {
                    var left = parseInt(event.currentTarget.style.left)
                    var itemWidth = $(this).prev().children("a").width()
                    var new_left;
                    if (left < (itemWidth - itemWidth * 2) / 3) {
                        new_left = '-' + itemWidth.toString() + 'px';
                    } else if (left > itemWidth / 3) {
                        new_left = itemWidth.toString() + 'px';
                    } else {
                        new_left = '0px';
                    }

                    // event.currentTarget.style.left = new_left
                    $(event.currentTarget).animate({ left: new_left }, 200)
                    enable_scroll()
                });

            //3. fixed top
            var msgHeaderTop = parseInt(document.documentElement.clientWidth * 13 / 100, 10);
            if (device.platform == 'iOS') {
                msgHeaderTop += iOSFixedTopPX();
            }
            $('.select-type').css('top', msgHeaderTop + 'px');
            $('.handle-msg').css('top', msgHeaderTop + 'px');

            //4. message update date
            msgUpdateDate = new Date(messagecontent_['lastUpdateTime']).yyyymmdd('/');
            $('.msg-update-date').text(langStr['str_079'] + msgUpdateDate);
        }

        //跳转详情事件
        function changeToDetail($target) {
            messageFrom = 'viewMessageList';
            messageRowId = $target.parents('li').attr('data-rowid');
            checkWidgetPage('viewWebNews2-3-1', pageVisitedList);
        }

        function updateListReadDelete(type, status, messageRowId_) {
            var self = this;

            var queryStr = "&message_send_row_id=" + messageRowId_ + "&message_type=" + type + "&status=" + status;

            this.successCallback = function(data) {
                //console.log(data);
                var doUpdateLocalStorage = false;

                messagecontent_ = JSON.parse(window.localStorage.getItem('messagecontentEx'));
                messagecontent = messagecontent_.content;

                if (type === "event") {
                    var resultcode = data.result_code;

                    if (resultcode === 1) {
                        doUpdateLocalStorage = true;
                    } else if (resultcode === "000910") {
                        //message not exist
                        doUpdateLocalStorage = true;
                    }
                } else if (type === "news") {
                    doUpdateLocalStorage = true;
                } else if (type === "all") {
                    doUpdateLocalStorage = true;
                }

                //Update [read / delete] status in Local Storage
                if (doUpdateLocalStorage) {

                    //Single / Multiple message update check
                    var singleMessage = true;
                    var i, j;

                    messageRowId_ = messageRowId_.toString();

                    if (messageRowId_.indexOf(",") !== -1) {
                        singleMessage = false;
                    }

                    if (singleMessage) {
                        if (messageArrIndex === null) {
                            for (i = 0; i < messagecontent.message_list.length; i++) {
                                if (messagecontent.message_list[i].message_send_row_id.toString() === messageRowId_) {
                                    messageArrIndex = i;
                                    break;
                                }
                            }
                        }

                        if (messageArrIndex !== null) {
                            if (status === "read") {
                                messagecontent.message_list[messageArrIndex].read = "Y";
                            } else if (status === "delete") {
                                messagecontent.message_list[messageArrIndex].read = "D";
                            }
                        }
                    } else {
                        var messageRowIdArr = messageRowId_.split(",");

                        for (i = 0; i < messageRowIdArr.length; i++) {

                            for (j = 0; j < messagecontent.message_list.length; j++) {
                                if (messagecontent.message_list[j].message_send_row_id.toString() === messageRowIdArr[i]) {
                                    messageArrIndex = j;
                                }
                            }

                            if (messageArrIndex !== null) {
                                if (status === "read") {
                                    messagecontent.message_list[messageArrIndex].read = "Y";
                                } else if (status === "delete") {
                                    messagecontent.message_list[messageArrIndex].read = "D";
                                }
                            }
                        }
                    }

                    UpdateMessageListContent(messagecontent, false); //from component/function

                    loginData.messagecontent = messagecontent;
                    messageArrIndex = null;

                    updateMessageListUI(type, status, messageRowId_);

                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {

                //[event] need to update [read / delete] status both in Server / Local Storage
                //[news] just update [read / delete] in Local Storage
                if (type === "event") {
                    QPlayAPI("GET", "updateMessage", self.successCallback, self.failCallback, null, queryStr);
                } else if (type === "news") {
                    this.successCallback();
                } else if (type === "all") {
                    this.successCallback();
                }
            }();
        };

        function updateMessageListUI(type, status, messageRowId_) {
            if (status == 'delete') {
                $('.' + type + '-content li[data-rowid=' + messageRowId_ + ']').remove();
            } else if (status == 'read') {
                $('.' + type + '-content li[data-rowid=' + messageRowId_ + ']').find('.msg-content-title').addClass('read-font-normal');
            }

            var count = checkIconCount(type);
            if (count == 0) {
                $('.msg-delete').removeClass('enabled-font');
                $('.msg-readed').removeClass('enabled-font');
            }
        }

        //记录已选消息数量
        function checkIconCount(type) {
            var count = 0;
            $.each($('.' + type + '-content li'), function(index, item) {
                if ($(item).find('.msg-check-btn').attr('data-src') == 'checkbox_green') {
                    count++;
                }
            })
            return count;
        }

        //swipe to delete function
        function prevent_default(event) {
            event.preventDefault();
        }

        function disable_scroll() {
            $(document).on('touchmove', prevent_default);
        }

        function enable_scroll() {
            $(document).unbind('touchmove', prevent_default);
        }

        //page-main height
        function getPageMainHeight_(view) {
            var win = $(window).height();
            var header = $('#' + view + ' .page-header').height();
            var main;
            if (device.platform === "iOS") {
                main = win - header - iOSFixedTopPX();
            } else {
                main = win - header;
            }
            return main.toString();
        }

        /********************************** page event ***********************************/
        $("#viewMessageList").on("pagebeforeshow", function(event, ui) {

        });

        $("#viewMessageList").one("pageshow", function(event, ui) {
            var mainHeight = getPageMainHeight_('viewMessageList');
            $('.message-scroll').css('height', mainHeight + 'px');
            //filter placeholder
            $('#msgFilter').attr('placeholder', langStr['str_080']);
            $('.idea-loading-img').attr('src', serverURL + imgURL + 'loading.gif');
            //check can not use portal
            checkPortalByFunctionList();
            //content
            createMessageByType();
        });

        $("#viewMessageList").on("pageshow", function(event, ui) {
            //open idea portal from idea widget
            var openIdea = window.sessionStorage.getItem('openIdeaPortal');
            if (openIdea != null) {
                $('div[data-item="idea"]').trigger('click');
                window.sessionStorage.removeItem('openIdeaPortal');
            }
        });

        $("#viewMessageList").on("pagehide", function(event, ui) {

        });


        /********************************** dom event *************************************/
        //idea 分页
        $('.message-scroll').on('scroll', function() {
            if (messageType == 'idea') {
                var winHeight = $(window).height();
                var loadingTop = $('.idea-loading').offset().top;
                var loadingShow = $('.idea-loading').css('display') == 'block' ? true : false;

                //loading图片小于表示在可是区域内，可以添加下一页数据
                if (loadingTop < winHeight && loadingShow && currentPage < sumPage) {
                    currentPage++;
                    createIdeaPortal(responsecontent, currentPage, sumPage, numPerPage);
                }

                //如果相等，表示所有数据加载完成，隐藏loading
                if (currentPage == sumPage) {
                    $('.idea-loading').css('display', 'none');
                }
            }
        });

        //弹出message下拉菜单
        $("#viewMessageList .ui-title").on("click", function() {
            $(".select-type").slideToggle(200);
        });

        //选择message类型
        $(".select-type > div").on("click", function() {
            var self = this;
            var currentType = $(self).text();
            var lowerCase = $(self).attr('data-item');

            if (lowerCase != messageType) {
                //save type
                messageType = lowerCase;
                //change title
                $(".dropdown-title").text(currentType);

                if (messageType == 'news' || messageType == 'event') {
                    //news和event可以已读或删除
                    $('#editListview').show();
                    showDiffMessageByType(messageType);
                    //change update date
                    $('.msg-update-date').text(langStr['str_079'] + msgUpdateDate);

                } else {
                    //portal不用编辑
                    $('#editListview').hide();
                    showDiffMessageByType(messageType);
                    if (lowerCase == 'idea') {
                        QueryPortalList(lowerCase.toUpperCase());
                    } else {
                        QueryPortalList(currentType);
                    }
                }
            }

            $(".select-type").slideUp(200);
        });

        //编辑listview
        $('#editListview').on('click', function() {
            if ($('.select-type').css('display') == 'block') {
                $('.select-type').slideUp();
            }

            //header
            $('.dropdown-title').addClass('opacity');
            $('.dropdown-news').hide();
            $('#viewMessageList .q-btn-header').hide();
            $('#editListview').hide();
            $('#searchListview').hide();
            $('#cancelEdit').show();

            //listview
            $('.msg-next-icon').hide();
            $('.msg-check-icon').show();
            $('.handle-msg').show();
            $('.fill-handle-blank').show();
            $('#viewMessageList .ui-title').off('click');
            //取消绑定跳转详情
            $(document).off('click', 'a.ui-message .msg-content-title,a.ui-message .msg-next-icon');
        });

        //取消编辑listview
        $('#cancelEdit').on('click', function() {
            //header
            $('.dropdown-title').removeClass('opacity');
            $('.dropdown-news').show();
            $('#viewMessageList .q-btn-header').show();
            $('#cancelEdit').hide();
            $('#editListview').show();
            $('#searchListview').show();

            //listview
            $('.msg-check-icon').hide();
            $('.msg-next-icon').show();
            $('.handle-msg').hide();
            $('.fill-handle-blank').hide();
            $('#viewMessageList .ui-title').on('click', function() {
                $(".select-type").slideToggle(200);
            });

            //再次绑定跳转详情
            $(document).on('click', 'a.ui-message .msg-content-title,a.ui-message .msg-next-icon', function() {
                changeToDetail($(this));
            });

            //已选全部变为未选
            $.each($('.msg-check-btn'), function(index, item) {
                if ($(item).attr('data-src') == 'checkbox_green') {
                    $(item).attr('data-src', 'checkbox');
                    $(item).attr('src', 'img/checkbox.png');
                }
            });
            allChecked = false;

            //删除和已读不可用
            $('.msg-delete').removeClass('enabled-font');
            $('.msg-readed').removeClass('enabled-font');
        });

        //搜索listview
        $('#searchListview').on('click', function() {
            if ($('.select-type').css('display') == 'block') {
                $('.select-type').slideUp();
            }

            $('#viewMessageList .q-btn-header').hide();
            $('.header-search').show();
            $('#editListview').hide();
            $('#searchListview').hide();
            $('#cancelSearch').show();
        });

        //取消搜索listview
        $('#cancelSearch').on('click', function() {
            $('#msgFilter').val('');
            $('#msgFilter').blur();

            $('.header-search').hide();
            $('#viewMessageList .q-btn-header').show();
            $('#cancelSearch').hide();
            if (messageType == 'news' || messageType == 'event') {
                $('#editListview').show();
            }
            $('#searchListview').show();

            $('.message-type ul').listview('refresh');
        });

        //编辑
        $('.message-scroll').on('click', '.msg-check-btn', function() {
            var $self = $(this);

            if ($self.attr('data-src') == 'checkbox') {
                $self.attr('data-src', 'checkbox_green');
                $self.attr('src', 'img/checkbox_green.png');

            } else {
                $self.attr('data-src', 'checkbox');
                $self.attr('src', 'img/checkbox.png');

            }

            if (checkIconCount(messageType) > 0) {
                $('.msg-delete').addClass('enabled-font');
                $('.msg-readed').addClass('enabled-font');

            } else {
                $('.msg-delete').removeClass('enabled-font');
                $('.msg-readed').removeClass('enabled-font');

            }
        });

        //全选
        $('.msg-select span').on('click', function() {
            if (!allChecked) {
                $('.' + messageType + '-content .msg-check-btn').attr('src', 'img/checkbox_green.png');
                $('.' + messageType + '-content .msg-check-btn').attr('data-src', 'checkbox_green');
                allChecked = true;
                $('.msg-delete').addClass('enabled-font');
                $('.msg-readed').addClass('enabled-font');

            } else {
                $('.' + messageType + '-content .msg-check-btn').attr('src', 'img/checkbox.png');
                $('.' + messageType + '-content .msg-check-btn').attr('data-src', 'checkbox');
                allChecked = false;
                $('.msg-delete').removeClass('enabled-font');
                $('.msg-readed').removeClass('enabled-font');

            }
        });

        //标记已读
        $('.msg-readed span').on('click', function() {
            var has = $(this).parent().hasClass('enabled-font');
            if (has) {
                $.each($('.' + messageType + '-content .msg-check-btn'), function(index, item) {
                    var src = $(item).attr('data-src');
                    var readed = $(item).parent().next().hasClass('read-font-normal');

                    if (src == 'checkbox_green' && !readed) {
                        messageRowId = $(item).parents('li').attr('data-rowid');
                        updateListReadDelete(messageType, 'read', messageRowId);
                    }
                })
            }
        });

        //标记删除
        $('.msg-delete span').on('click', function() {
            var has = $(this).parent().hasClass('enabled-font');
            if (has) {
                $('#confirmDeleteMsg').popup('open');
                $('#confirmDeleteMsg .header-title-main .header-text').text(messageType == 'news' ? langStr["str_039"] : langStr["str_042"]);
                deleteType = 'checkbox';
            }
        });

        //左滑删除
        $('.swipe-delete').on('click', 'a.delete-btn', function() {
            messageRowId = $(this).parents('li').attr('data-rowid');
            $('#confirmDeleteMsg').popup('open');
            $('#confirmDeleteMsg .header-title-main .header-text').text(messageType == 'news' ? langStr["str_039"] : langStr["str_042"]);
            deleteType = 'swipe';
        });

        //取消删除
        $('#viewMessageList .btn-cancel').on('click', function() {
            $('#confirmDeleteMsg').popup('close');
            if ($(this).attr('id') != 'confirmDeleteBtn') {
                $('.swipe-delete li[data-rowid="' + messageRowId + '"] > a').animate({ left: '0px' }, 200);
            }
        });

        //确定删除：分为swipe（单个）删除和checkbox（群体）删除
        $('#confirmDeleteBtn').on('click', function() {

            if (deleteType == 'swipe') {

                updateListReadDelete(messageType, 'delete', messageRowId);

            } else if (deleteType == 'checkbox') {

                $.each($('.' + messageType + '-content .msg-check-btn'), function(index, item) {
                    if ($(item).attr('data-src') == 'checkbox_green') {
                        messageRowId = $(item).parents('li').attr('data-rowid');
                        updateListReadDelete(messageType, 'delete', messageRowId);
                    }
                })

            }

            //after delete，refresh message widget
            //$('.messageWidget').message('refresh');
            var evalString = '$(".messageWidget").message("refresh");';
            window.sessionStorage.setItem('needRefreshWidget', evalString);
        });

        //news & event 跳转到详情
        $(document).on('click', 'a.ui-message .msg-content-title,a.ui-message .msg-next-icon', function() {
            changeToDetail($(this));
        });

        //portal 跳转到详情
        $(document).on("click", 'a.ui-portal', function(e) {
            e.stopImmediatePropagation();
            e.preventDefault();

            if (messageType != "Event" && messageType != "News") {
                messageFrom = 'viewMessageList';
                portalURL = $(this).find("input").val();
                //console.log(portalURL)
                checkWidgetPage('viewWebNews2-3-1', pageVisitedList);
            }
        });


    }
});