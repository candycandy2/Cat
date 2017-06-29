/****************************************************************************************/
/********************************** Template JS *****************************************/
/****************************************************************************************/

// Override jQuery Funciton
// Every time when call jQuery (append, prepend, hmtl) funciton,
// do tplJS.setMultiLanguage()

function overridejQueryFunction() {

    function checkValToSetLang(value) {
        if (typeof value != 'undefined') {
            tplJS.setMultiLanguage(value);
        }
    };

    var originalAppend = $.fn.append;
    $.fn.append = function(value) {
        checkValToSetLang(value);
        return originalAppend.call(this, value);
    };

    var originalPrepend = $.fn.prepend;
    $.fn.prepend = function(value) {
        checkValToSetLang(value);
        return originalPrepend.call(this, value);
    };

    var originalAppenTo = $.fn.appendTo;
    $.fn.appendTo = function(value) {
        checkValToSetLang(value);
        return originalAppenTo.call(this, value);
    };

    var originalPrependTo = $.fn.prependTo;
    $.fn.prependTo = function(value) {
        checkValToSetLang(value);
        return originalPrependTo.call(this, value);
    };
    /*
    var originalHTML = $.fn.html;
    $.fn.html = function(value) {
        if (typeof value != 'undefined') {
            checkValToSetLang(value);
            return originalHTML(value);
        } else {
            return $(this)[0].innerHTML;
        }
    };
    */
}


// Render Action:
//1. append
//2. prepend
//3. html

var tplJS = {
    tplRender: function(pageID, contentID, renderAction, HTMLContent) {
        if (pageID == null) {
            if (renderAction === "append") {
                $("body").append(HTMLContent);
            } else if (renderAction === "prepend") {
                $("body").prepend(HTMLContent);
            } else if (renderAction === "html") {
                $("body").html(HTMLContent);
            }
        } else {
            if (renderAction === "append") {
                $("#" + pageID + " #" + contentID).append(HTMLContent);
            } else if (renderAction === "prepend") {
                $("#" + pageID + " #" + contentID).prepend(HTMLContent);
            } else if (renderAction === "html") {
                $("#" + pageID + " #" + contentID).html(HTMLContent);
            }
        }

        this.setMultiLanguage(HTMLContent);
    },
    setDOMAttr: function(dom, data) {
        $.each(data, function(key, value){
            if (key === "class") {
                dom.addClass(value);
            } else {
                dom.prop(key, value);
            }
        });
    },
    setMultiLanguage: function(dom) {
        if ($(dom).find(".langStr").length > 0) {
            $(dom).find(".langStr").each(function(index, element){
                var id = $(element).data("id");
                $(element).html(langStr[id]);
            });
        }
    },
    getRealContentHeight: function() {
        var header = $.mobile.activePage.find("div[data-role='header']:visible");
        var footer = $.mobile.activePage.find("div[data-role='footer']:visible");
        //var content = $.mobile.activePage.find("div[data-role='content']:visible:visible");
        var content = $.mobile.activePage.find("div[data-role='main']:visible:visible");
        var viewport_height = $(window).height();

        var content_height = viewport_height - header.outerHeight();

        if ((content.outerHeight() - header.outerHeight() - footer.outerHeight()) <= viewport_height) {
            //content_height -= (content.outerHeight() - content.height());
        }

        return content_height;
    },
    preventPageScroll: function() {
        //Prevent Background Page to be scroll, when Option Popup is shown,
        //Change the [height / overflow-y] of Background Page,
        //And then, when Option Popup is close, recovery the [height / overflow-y] of Background Page.
        /*
        var adjustHeight = this.getRealContentHeight();
        var adjustPaddingBottom = 0;

        if (device.platform === "iOS") {
            adjustPaddingBottom = 20;
        }

        $.mobile.activePage.outerHeight(adjustHeight);

        $.mobile.activePage.css({
            "height": adjustHeight,
            "min-height": adjustHeight,
            "padding-bottom": adjustPaddingBottom + "px",
            "overflow-y": "hidden"
        });

        if (checkPopupShown()) {
            var header = $.mobile.activePage.find("div[data-role='header']:visible");
            var popupScreenHeight = adjustHeight + header.outerHeight();

            if (device.platform === "iOS") {
                popupScreenHeight += 20;
            }

            $(".ui-popup-screen.in").height(popupScreenHeight);
        }
        */
        tplJS.originalScrollTop = $("body").scrollTop();
        tplJS.originalUIPageHeight = $(".ui-page-active.ui-page").height();
        tplJS.originalUIPageScrollHeight = $("body").prop("scrollHeight");
        tplJS.originalUIPageMinHeight = parseInt($(".ui-page-active.ui-page").css("min-height"), 10);
        tplJS.originalPageMainHeight = $(".ui-page-active .page-main").height();
        tplJS.originalUITabsHeight = $(".ui-page-active .ui-tabs").height();
        var windowHeight = $(window).height();
        var headerHeight = $(".ui-page-active .ui-header").height();
        var footerHeight = $(".ui-page-active .ui-footer").height();
        var tempHeight = windowHeight - headerHeight - footerHeight;

        if (tplJS.originalPageMainHeight < tempHeight) {
            tplJS.originalPageMainHeight = tempHeight;
        }
        if (tplJS.originalUITabsHeight < tempHeight) {
            tplJS.originalUITabsHeight = tempHeight;
        }
        tplJS.originalUIPageScrollHeight = tplJS.originalUIPageScrollHeight - headerHeight - footerHeight;

        $('.ui-page-active.ui-page, .ui-page-active .page-main, .ui-page-active .ui-tabs').css({
            'height': tempHeight,
            'overflow-y': 'hidden',
            'touch-action': 'none'
        });

        $('.ui-page-active.ui-page').css({
            'min-height': tempHeight
        });

        $('body').css('overflow', 'hidden').on('touchmove', function(e) {
            var preventScroll = true;
            var offsetParent = e.target.offsetParent;

            if ($(offsetParent).hasClass("ui-datebox-container")) {
                preventScroll = false;
            } else if ($(e.target).closest(".ui-popup").length > 0) {
                var headerLength = $(e.target).closest(".header").length;
                var footerLength = $(e.target).closest(".footer").length;
                var listview = $(offsetParent).find("ul[data-role=listview]");

                if ($(listview).prop("scrollHeight") > parseInt($(listview).height() + 6, 10)) {
                    preventScroll = false;
                }
                if (footerLength > 0) {
                    preventScroll = true;
                }
                if (headerLength > 0) {
                    preventScroll = true;
                }
            }

            if (preventScroll) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
    },
    recoveryPageScroll: function() {
        //Padding
        /*
        var paddingTop = parseInt($.mobile.activePage.css("padding-top"), 10);
        var paddingBottom = parseInt($.mobile.activePage.css("padding-bottom"), 10);

        var header = $.mobile.activePage.find("div[data-role='header']:visible");
        var footer = $.mobile.activePage.find("div[data-role='footer']:visible");
        var originalHeight = $.mobile.activePage.outerHeight() - paddingTop - paddingBottom + header.outerHeight() + footer.outerHeight();

        $.mobile.activePage.outerHeight($.mobile.activePage.outerHeight());

        $.mobile.activePage.css({
            "height": originalHeight,
            "padding-bottom": 0,
            "overflow-y": "auto"
        });
        */
        $('body').css('overflow', 'auto').off('touchmove');
        $('.ui-page-active.ui-page').css({
            'height': tplJS.originalUIPageScrollHeight,
            'min-height': tplJS.originalUIPageMinHeight
        });
        $('.ui-page-active .page-main').css({
            'height': tplJS.originalPageMainHeight
        });
        $('.ui-page-active .ui-tabs').css({
            'height': tplJS.originalUITabsHeight
        });
        $('.ui-page-active.ui-page, .ui-page-active .page-main, .ui-page-active .ui-tabs').css({
            'overflow-y': 'auto',
            'touch-action': 'auto'
        });
        $('html, body').animate({
            scrollTop: tplJS.originalScrollTop
        }, 0);
    },
    Tab: function(pageID, contentID, renderAction, data) {
        var tabHTML = $("template#tplTab").html();
        var tab = $(tabHTML);

        //Navbar
        this.Navbar(null, null, null, data.navbar, tab);

        //Tab Attr
        if (data.attr !== undefined) {
            this.setDOMAttr(tab, data.attr);
        }

        //Tab content
        var tabContentHTML = tab.find("template#tplTabContent").html();

        for (var i=0; i<data.content.length; i++) {
            var tabContent = $(tabContentHTML);
            tabContent.prop("id", data.content[i].id);

            //Set Attr
            this.setDOMAttr(tabContent, data.content[i].attr);
            tab.append(tabContent);
        }

        //Initial Tab
        tab.tabs();

        //Render Template
        this.tplRender(pageID, contentID, renderAction, tab);
    },
    Navbar: function(pageID, contentID, renderAction, data, dom) {
        //Navbar can be created:
        //1. append inside [ Tab ]
        //2. just display button group
        pageID = pageID || null;
        contentID = contentID || null;
        renderAction = renderAction || null;
        dom = dom || null;

        var navbarHTML = $("template#tplNavbar").html();
        var navbar = $(navbarHTML);

        //Navbar Attr
        if (data.attr !== undefined) {
            this.setDOMAttr(navbar, data.attr);
        }

        //Nvrbar button
        var navbarButtonHTML = navbar.find("template#tplNavbarButton").html();
        navbar.find("ul").empty();

        for (var i=0; i<data.button.length; i++) {
            var navbarButton = $(navbarButtonHTML);
            var className;

            if (i === 0) {
                //First Button
                className = "ui-btn-active tpl-navbar-button-left";
            } else if (i === parseInt(data.button.length - 1, 10)) {
                //Last Button
                className = "tpl-navbar-button-right";
            }

            if (data.button[i].href !== undefined && data.button[i].href.length > 0) {
                navbarButton.find("a").prop("href", "#" + data.button[i].href);
            }

            navbarButton.find("a").addClass(className);
            navbarButton.find("a").html(data.button[i].text);

            //Set Attr
            if (data.button[i].attr !== undefined) {
                this.setDOMAttr(navbarButton.find("a"), data.button[i].attr);
            }

            navbar.find("ul").append(navbarButton);
        }

        //Initial Navbar
        navbar.navbar();

        if (dom !== null) {
            //Append to DOM
            dom.append(navbar);
        } else {
            //Render Template
            this.tplRender(pageID, contentID, renderAction, navbar);
        }
    },
    DropdownList: function(pageID, contentID, renderAction, type, data) {
        var dropdownListHTML = $("template#tplDropdownList").html();
        var dropdownList = $(dropdownListHTML);

        //DropdownList ID
        dropdownList.prop("id", data.id);

        //DropdownList Default Selected Option Value
        var defaultValue = "";
        if (data.defaultValue !== undefined) {
            defaultValue = data.defaultValue;
            $("#" + data.id).data("multiVal", defaultValue);
        }

        //DropdownList AutoResize
        var autoResize = true;
        if (data.autoResize !== undefined) {
            autoResize = data.autoResize;
        }

        //DropdownList Multiple Select
        var multiSelect = false;
        if (data.multiSelect !== undefined) {
            multiSelect = data.multiSelect;
            dropdownList.data("multiple", multiSelect);
        }

        
        var changeDefaultText = false;
        if (data.changeDefaultText !== undefined) {
            changeDefaultText = data.changeDefaultText;
        }

        //DropdownList Background IMG
        if (type === "typeB") {
            dropdownList.addClass("tpl-dropdown-list-icon-add");
        }

        //DropdownList Attr
        if (data.attr !== undefined) {
            this.setDOMAttr(dropdownList, data.attr);
        }

        //DropdownList Option
        var dropdownListOptionHTML = dropdownList.find("template#tplDropdownListOption").html();

        if (type === "typeA") {
            for (var i=0; i<data.option.length; i++) {
                var dropdownListOption = $(dropdownListOptionHTML);

                dropdownListOption.prop("value", data.option[i].value);
                dropdownListOption.prop("text", data.option[i].text);

                if (defaultValue == data.option[i].value) {
                    dropdownListOption.prop("selected", "selected");
                }

                dropdownList.append(dropdownListOption);
            }
        } else if (type === "typeB") {
            var dropdownListOption = $(dropdownListOptionHTML);
            dropdownListOption.prop("text", data.defaultText);
            dropdownList.append(dropdownListOption);
        }

        //Render Template
        this.tplRender(pageID, contentID, renderAction, dropdownList);

        //Option in Popup
        var popupHTML = $("template#tplPopup").html();
        var popup = $(popupHTML);
        var popupID = data.id + "-option";
        var dropdownListUlID = data.id + "-option-list";

        popup.find("div[data-role='main']").html("");
        popup.prop("id", popupID);

        var dropdownListOptionHTML = $("template#tplPopupContentDropdownListOption").html();
        var dropdownList = $(dropdownListOptionHTML);

        //Header: typeA / typeB
        var dropdownListHeader = dropdownList.siblings(".header." + type);
        if (type === "typeB") {
            dropdownListHeader.find(".title").html(data.title);
        }

        var dropdownListUl = dropdownList.siblings(".main");

        dropdownListUl.prop("id", dropdownListUlID);

        var dropdownListLiHTML = dropdownList.find("template#tplPopupContentDropdownListLi").html();
        var dropdownListHrHTML = dropdownList.find("template#tplPopupContentDropdownListHr").html();

        for (var i=0; i<data.option.length; i++) {
            var dropdownListLi = $(dropdownListLiHTML);
            dropdownListLi.data("value", data.option[i].value);
            dropdownListLi.html(data.option[i].text);
            dropdownListUl.append(dropdownListLi);

            if (defaultValue == data.option[i].value) {
                dropdownListLi.addClass("tpl-dropdown-list-selected");
            }

            if (i !== parseInt(data.option.length - 1, 10)) {
                var dropdownListHr = $(dropdownListHrHTML);
                dropdownListHr.addClass("ui-hr-option");
                dropdownListUl.append(dropdownListHr);
            }
        }

        popup.find("div[data-role='main']").append(dropdownListHeader);
        popup.find("div[data-role='main']").append(dropdownListUl);

        //Render Template
        this.tplRender(pageID, contentID, renderAction, popup);

        //When Popup open, Auto Resize height of Popup main,
        //and change height of page, prevent User to scroll the page behind Popup.
        $(document).one("popupafteropen", "#" + popupID, function() {
            var popup = $(this);
            var popupHeight = popup.height();
            var popupHeaderHeight = $("#" + popupID + " .header").height();
            var popupFooterHeight = popup.find("div[data-role='main'] .footer").height();

            //ui-content paddint-top/padding-bottom:3.07vw
            var uiContentPaddingHeight = parseInt(document.documentElement.clientWidth * 3.07 * 2 / 100, 10);

            //Ul margin-top:2.17vw
            var ulMarginTop = parseInt(document.documentElement.clientWidth * 2.17 / 100, 10);

            var popupMainHeight = parseInt(popupHeight - popupHeaderHeight - popupFooterHeight - uiContentPaddingHeight - ulMarginTop, 10);
            $(this).find("div[data-role='main'] .main").height(popupMainHeight);
            $(this).find("div[data-role='main'] .main ul").height(popupMainHeight);

            $('.ui-popup-screen.in').animate({
                'overflow-y': 'hidden',
                'touch-action': 'none',
                'height': $(window).height()
            }, 0, function() {
                var top = $(".ui-popup-screen.in").offset().top;
                if (top < 0) {
                    $('.ui-popup-screen.in').css({
                        'top': Math.abs(top) + "px"
                    });
                }
            });

            var viewHeight = $(window).height();
            var popupHeight = $(this).outerHeight();
            var top = (viewHeight - popupHeight) / 2;
            $(this).parent().css("top", top + "px");
        });

        $(document).off("popupbeforeposition", "#" + popupID);
        $(document).on("popupbeforeposition", "#" + popupID, function() {
            tplJS.preventPageScroll();
        });

        //Initialize Popup
        $('#' + popupID).popup();

        $(document).on("click", "#" + data.id, function() {
            //Scroll Page to top
            /*
            $("#" + pageID).animate({
                "scrollTop": 0
            }, 0, function() {
                $('#' + popupID).popup('open');
                tplJS.preventPageScroll();
            });
            */
            $('#' + popupID).popup('open');
        });

        (function(dropdownListID){
            $(document).on("click", "#" + popupID + " .close", function() {
                if (type === "typeA") {
                    if (multiSelect) {
                        $("#" + dropdownListID).trigger("change");
                    }
                }

                $('#' + popupID).popup('close');

                if (type === "typeA") {
                    if (autoResize) {
                        tplJS.reSizeDropdownList(dropdownListID, type);
                    }
                }
                tplJS.recoveryPageScroll();
            });
        }(data.id));

        //Click Li to change the value of Dropdown List
        (function(dropdownListID){
            $(document).on("click", "#" + popupID + " ul li", function() {
                if (!multiSelect) {
                    $("#" + popupID + " ul li").removeClass("tpl-dropdown-list-selected");
                    $(this).addClass("tpl-dropdown-list-selected");
                } else {
                    $(this).toggleClass("tpl-dropdown-list-selected");
                }

                if (type === "typeA") {
                    if (!multiSelect) {
                        $("#" + dropdownListID).val($(this).data("value"));
                        if (autoResize) {
                            tplJS.reSizeDropdownList(dropdownListID, type);
                        }
                    } else {
                        //Drowdown List set Multiple Value
                        var multiVal = $("#" + dropdownListID).data("multiVal");
                        if (multiVal !== undefined && multiVal.length > 0) {
                            var dataString = "";
                            var selectAll = false;
                            var dataArray = multiVal.split("|");
                            var optionValue = $(this).data("value");
                            var index = dataArray.indexOf(optionValue);
                            var indexAll = dataArray.indexOf("all");

                            if (optionValue === "all") {
                                if (indexAll === -1) {
                                    selectAll = true;
                                } else {
                                    dataArray.splice(indexAll, 1);
                                }
                            } else {
                                if (index > -1) {
                                    dataArray.splice(index, 1);
                                } else {
                                    dataArray.push($(this).data("value"));

                                    if (indexAll > -1) {
                                        dataArray.splice(indexAll, 1);
                                    }
                                }
                            }

                            if (selectAll) {
                                $("#" + dropdownListID).data("multiVal", "all");
                                $("#" + popupID + " ul li").removeClass("tpl-dropdown-list-selected");
                                $("#" + popupID + " ul li:eq(0)").addClass("tpl-dropdown-list-selected");
                            } else {
                                $("#" + popupID + " ul li:eq(0)").removeClass("tpl-dropdown-list-selected");

                                if (dataArray.length > 0) {
                                    dataString = dataArray.join("|");
                                }
                                $("#" + dropdownListID).data("multiVal", dataString);
                            }

                        } else {
                            $("#" + dropdownListID).data("multiVal", $(this).data("value"));
                        }
                    }
                } else if (type === "typeB") {
                    //Find drowdown list, set selected option value
                    var defaultText;
                    if(!changeDefaultText) {
                        $("#" + dropdownListID + " option").each(function(index, el) {
                            if (index === 0) {
                                defaultText = $(el).text();
                            }
                        });
                    }else {
                        $("#" + dropdownListUlID + " li").each(function(index, value) {
                            if($(value).hasClass("tpl-dropdown-list-selected")){
                                defaultText = $(value).text();
                            }
                        });
                    }

                    var newOption = '<option value="' + $(this).data("value") + '" hidden selected>' + defaultText + '</option>';

                    $("#" + dropdownListID).find("option").remove().end().append(newOption);
                }

                if (!multiSelect) {
                    //Trigger drowdown list 'change' event
                    $("#" + dropdownListID).trigger("change");

                    //Close Popup
                    $('#' + popupID).popup('close');

                    tplJS.recoveryPageScroll();
                }
            });
        }(data.id));

        //Auto Resize DropdownList Width
        this.reSizeDropdownList = function(ID, type, setWidth) {
            type = type || null;
            var tempWidth;
            //Background Image Width
            var imgWidth;

            if (type === "typeA") {
                tempWidth = 3.54;
                imgWidth = 8;
            } else if (type === "typeB") {
                tempWidth = 4.04;
                imgWidth = 5;
            }

            if (type !== null) {
                $("span[data-id='tmp_option_width']").html($('#' + ID + ' option:selected').text());
                var pxWidth = $("span[data-id='tmp_option_width']").outerWidth();
                //px conver to vw
                var vwWidth = (100 / document.documentElement.clientWidth) * pxWidth + tempWidth + imgWidth;
                $("#" + ID).css('width', vwWidth + 'vw');
            } else {
                $("#" + ID).css('width', setWidth + 'vw');
            }
        };

        this.reSizeDropdownList(data.id, type);

    },
    Popup: function(pageID, contentID, renderAction, data) {
        var showMain = false;
        var popupHTML = $("template#tplPopup").html();
        var popup = $(popupHTML);
        var HRHTML = $("template#tplPopupContentHr").html();
        
        //Popup ID
        popup.prop("id", data.id);
        popup.addClass("msg");

        //Popup Content
        var contentHTML = data.content;
        var content = $(contentHTML);

        //Header
        var headerHTML = content.siblings(".header");
        if (headerHTML.length !== 0) {
            var header = headerHTML.clone();

            popup.find("div.header").append(header);
        }

        //Main
        var mainHTML = content.siblings(".main");
        if (mainHTML.length !== 0) {
            showMain = true;

            //HR Top
            var HRTop = $(HRHTML);
            HRTop.addClass("ui-hr-top");
            popup.find("div.header:first").after(HRTop);

            var main = mainHTML.clone();

            popup.find("div.main").append(main);
        }

        //HR Bottom
        var HRBottom = $(HRHTML);
        HRBottom.addClass("ui-hr-bottom");
        popup.find("div.main:first").after(HRBottom);

        //Footer
        var footerHTML = content.siblings(".footer");
        if (footerHTML.length !== 0) {
            var footer = footerHTML.clone();

            popup.find("div.footer").append(footer);
        }

        //Render Template
        this.tplRender(pageID, contentID, renderAction, popup);

        //Initialize Popup
        $('#' + data.id).popup();

        $(document).one("popupafteropen", "#" + data.id, function() {
            var popupHeight = popup.height();
            var popupHeaderHeight = popup.find("div[data-role='main'] .header").height();
            var popupFooter = popup.find("div[data-role='main'] .footer")[0];
            var popupFooterHeight = popupFooter.offsetHeight;

            //ui-content paddint-top:5.07vw
            var uiContentPaddingHeight = parseInt(document.documentElement.clientWidth * 5.07 / 100, 10);

            //Ul margin-top:5.07vw
            var ulMarginTop = parseInt(document.documentElement.clientWidth * 5.07 / 100, 10);

            //Ul margin-bottom:5.07vw
            var ulMarginBottom = parseInt(document.documentElement.clientWidth * 5.07 / 100, 10);

            //Resize Height of Main
            if (showMain) {
                var popupMainHeight = parseInt(popupHeight - popupHeaderHeight - popupFooterHeight - uiContentPaddingHeight - ulMarginTop - ulMarginBottom, 10);
                $(this).find("div[data-role='main'] .main").height(popupMainHeight);
                $(this).find("div[data-role='main'] .main ul").height(popupMainHeight);
            } else {
                $(this).find("div[data-role='main'].ui-content").css("padding-top", "0");
                $(this).find("div[data-role='main'] .main").height(0);
                var popupHeaderHeight = parseInt(popupHeight - popupFooterHeight, 10);
                $(this).find("div[data-role='main'] > .header").height(popupHeaderHeight);
                $(this).find("div[data-role='main'] .header .header").addClass("all-center");
            }
        });

        $(document).on("popupafteropen", "#" + data.id, function() {
            $('.ui-popup-screen.in').animate({
                'overflow-y': 'hidden',
                'touch-action': 'none',
                'height': $(window).height()
            }, 0, function() {
                var top = $(".ui-popup-screen.in").offset().top;
                if (top < 0) {
                    $('.ui-popup-screen.in').css({
                        'top': Math.abs(top) + "px"
                    });
                }
            });

            var viewHeight = $(window).height();
            var popupHeight = $(this).outerHeight();
            var top = (viewHeight - popupHeight) / 2;
            $(this).parent().css("top", top + "px");
        });

        $(document).off("popupbeforeposition", "#" + data.id);
        $(document).on("popupbeforeposition", "#" + data.id, function() {
            //Scroll Page to top
            /*
            $.mobile.activePage.animate({
                "scrollTop": 0
            }, 0, function() {
                tplJS.preventPageScroll();
            });
            */
            tplJS.preventPageScroll();
        });

        $(document).on("popupafterclose", "#" + data.id, function() {
            tplJS.recoveryPageScroll();
        });
    }
};


function popupMsgInit(popupClass){
    $(popupClass).popup(); //initialize the popup
    $(popupClass).show();
    $(popupClass).popup('open');
    popupMsgCloseInit(popupClass);
}

function popupMsgCloseInit(popupClass){
    $('body').one('click', popupClass  + ' .btn-cancel', function() {
        $(popupClass).popup('close');
    });
}