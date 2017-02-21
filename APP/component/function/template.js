/****************************************************************************************/
/********************************** Template JS *****************************************/
/****************************************************************************************/

// Render Action:
//1. append
//2. prepend
//3. html

var tplJS = {
    tplRender: function(pageID, contentID, renderAction, HTMLContent) {
        if (renderAction === "append") {
            $("#" + pageID + " #" + contentID).append(HTMLContent);
        } else if (renderAction === "preappend") {
            $("#" + pageID + " #" + contentID).preappend(HTMLContent);
        } else if (renderAction === "html") {
            $("#" + pageID + " #" + contentID).html(HTMLContent);
        }
    },
    Tab: function(pageID, contentID, renderAction, data) {
        var tabHTML = $("template#tplTab").html();
        var tab = $(tabHTML);

        //Navbar
        this.Navbar(tab, data.navbar);

        //Tab
        tab.find("div[data-role='navbar']").prop("id", data.id);

        //Tab content
        var tabContentHTML = tab.find("template#tplTabContent").html();

        for (var i=0; i<data.content.length; i++) {
            var tabContent = $(tabContentHTML);
            tabContent.prop("id", data.content[i].id);
            tabContent.html(data.content[i].text);
            tab.append(tabContent);
        }

        //Initial Tab
        tab.tabs();

        //Render Template
        this.tplRender(pageID, contentID, renderAction, tab);
    },
    Navbar: function(dom, data) {
        var navbarHTML = $("template#tplNavbar").html();
        var navbar = $(navbarHTML);

        //Nvrbar button
        var navbarButtonHTML = navbar.find("template#tplNavbarButton").html();
        navbar.find("ul").empty();

        for (var i=0; i<data.length; i++) {
            var navbarButton = $(navbarButtonHTML);
            var className;

            if (i === 0) {
                className = "ui-btn-active tpl-navbar-button-left";
            } else if (i === parseInt(data.length - 1, 10)) {
                className = "tpl-navbar-button-right";
            }

            navbarButton.find("a").prop("href", "#" + data[i].href);
            navbarButton.find("a").addClass(className);
            navbarButton.find("a").html(data[i].text);
            navbar.find("ul").append(navbarButton);
        }

        //Initial Navbar
        navbar.navbar();

        //Append to DOM
        dom.append(navbar);
    }
};
