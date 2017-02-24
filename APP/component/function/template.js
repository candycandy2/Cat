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
    pageHeight: "",
    tplRender: function(pageID, contentID, renderAction, HTMLContent) {
        if (renderAction === "append") {
            $("#" + pageID + " #" + contentID).append(HTMLContent);
        } else if (renderAction === "prepend") {
            $("#" + pageID + " #" + contentID).prepend(HTMLContent);
        } else if (renderAction === "html") {
            $("#" + pageID + " #" + contentID).html(HTMLContent);
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
        var content = $.mobile.activePage.find("div[data-role='content']:visible:visible");
        var viewport_height = $(window).height();

        var content_height = viewport_height - header.outerHeight() - footer.outerHeight();
        if ((content.outerHeight() - header.outerHeight() - footer.outerHeight()) <= viewport_height) {
            content_height -= (content.outerHeight() - content.height());
        }

        return content_height;
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
    DropdownList: function(pageID, contentID, renderAction, data) {
        var dropdownListHTML = $("template#tplDropdownList").html();
        var dropdownList = $(dropdownListHTML);

        //DropdownList ID
        dropdownList.prop("id", data.id);

        //DropdownList Attr
        if (data.attr !== undefined) {
            this.setDOMAttr(dropdownList, data.attr);
        }

        //DropdownList Option
        var dropdownListOptionHTML = dropdownList.find("template#tplDropdownListOption").html();

        for (var i=0; i<data.option.length; i++) {
            var dropdownListOption = $(dropdownListOptionHTML);

            dropdownListOption.prop("value", data.option[i].value);
            dropdownListOption.prop("text", data.option[i].text);
            dropdownList.append(dropdownListOption);
        }

        //Render Template
        this.tplRender(pageID, contentID, renderAction, dropdownList);

        //Option in Popup
        var popupHTML = $("template#tplPopup").html();
        var popup = $(popupHTML);
        var popupID = data.id + "-option";
        var dropdownListUlID = data.id + "-option-list";

        popup.prop("id", popupID);

        var dropdownListOptionHTML = $("template#tplPopupContentDropdownListOption").html();
        var dropdownList = $(dropdownListOptionHTML);
        var dropdownListClose = $(dropdownList[0]);
        var dropdownListUl = $(dropdownList[2]);

        dropdownListUl.prop("id", dropdownListUlID);

        var dropdownListLiHTML = dropdownList.find("template#tplPopupContentDropdownListLi").html();
        var dropdownListHrHTML = dropdownList.find("template#tplPopupContentDropdownListHr").html();

        for (var i=0; i<data.option.length; i++) {
            var dropdownListLi = $(dropdownListLiHTML);

            dropdownListLi.prop("value", data.option[i].value);
            dropdownListLi.html(data.option[i].text);
            dropdownListUl.append(dropdownListLi);

            if (i !== parseInt(data.option.length - 1, 10)) {
                var dropdownListHr = $(dropdownListHrHTML);
                dropdownListHr.addClass("ui-hr-option");
                dropdownListUl.append(dropdownListHr);
            }
        }

        popup.find("div[data-role='main'] .header").append(dropdownListClose);
        popup.find("div[data-role='main'] .main").append(dropdownListUl);

        //Render Template
        this.tplRender(pageID, contentID, renderAction, popup);

        //When Popup open, Auto Resize height of Popup main,
        //and change height of page, prevent User to scroll the page behind Popup.
        $(document).on("popupafteropen", "#" + popupID, function() {
            var popupHeight = popup.height();
            var popupHeaderHeight = popup.find("div[data-role='main'] .header").height();
            var popupFooterHeight = popup.find("div[data-role='main'] .footer").height();

            //ui-content paddint-top/padding-bottom:2.9vh
            var uiContentPaddingHeight = parseInt(document.documentElement.clientHeight * 2.9 * 2 / 100, 10);

            //Ul margin-top:2.9vh
            var ulMarginTop = parseInt(document.documentElement.clientHeight * 2.9 / 100, 10);

            var popupMainHeight = parseInt(popupHeight - popupHeaderHeight - popupFooterHeight - uiContentPaddingHeight - ulMarginTop, 10);
            $(this).find("div[data-role='main'] .main").height(popupMainHeight);
            $(this).find("div[data-role='main'] .main ul").height(popupMainHeight);
        });

        //Initialize Popup
        $('#' + popupID).popup();

        $(document).on("click", "#" + data.id, function() {
            $('#' + popupID).popup('open');

            preventPageScroll();
        });

        $(document).on("click", "#" + popupID + " .close", function() {
            $('#' + popupID).popup('close');

            reSizeDropdownList(data.id);
            recoveryPageScroll();
        });

        //Click Li to change the value of Dropdown List
        $(document).on("click", "#" + popupID + " ul li", function() {
            $("#" + popupID + " ul li").removeClass("tpl-dropdown-list-selected");
            $(this).addClass("tpl-dropdown-list-selected");
            $("#" + data.id).val($(this).val());

            reSizeDropdownList(data.id);
        });

        //Auto Resize DropdownList Width
        function reSizeDropdownList(ID) {
            $("span[data-id='tmp_option_width']").html($('#' + ID + ' option:selected').text());
            var pxWidth = $("span[data-id='tmp_option_width']").outerWidth();
            //px conver to vw
            var vwWidth = (100 / document.documentElement.clientWidth) * pxWidth + 7;
            $("#" + ID).css('width', vwWidth + 'vw');
        }

        //Prevent Background Page to be scroll, when Option Popup is shown,
        //Change the [height / overflow-y] of Background Page,
        //And then, when Option Popup is close, recovery the [height / overflow-y] of Background Page.
        function preventPageScroll() {
            tplJS.pageHeight = $.mobile.activePage.outerHeight();
            var adjustHeight = tplJS.getRealContentHeight();

            $.mobile.activePage.css({
                "height": adjustHeight,
                "overflow-y": "hidden"
            });
        }

        function recoveryPageScroll() {
            //Padding
            var paddingTop = parseInt($.mobile.activePage.css("padding-top"), 10);
            var paddingBottom = parseInt($.mobile.activePage.css("padding-bottom"), 10);

            var originalHeight = tplJS.pageHeight - paddingTop - paddingBottom;

            $.mobile.activePage.css({
                "height": originalHeight,
                "overflow-y": "auto"
            });
        }
    }
};
