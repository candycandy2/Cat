var year, month, actualValue, budgetHitRate, yoyGrowth, productList;
var ro = "ALL";
var product = "ALL";
var tab = "AMT";
var hcRo = "All";
var hcProduct = "All product";
var hcTitle = "(USD$)";
var monthlyHighchartsData = {
	"Actual QTY" : {},
	"Actual AMT" : {},
	"Actual ASP" : {}, 
	"Budget QTY" : {},
	"Budget AMT" : {},
	"Budget ASP" : {}
};

$("#viewMonthlyHitRate").pagecontainer({
    create: function(event, ui) {

        window.UserAuthority = function() { 
            this.successCallback = function(data) {
                userAuthorityCallBackData = data["Content"]["DataList"];
                length = userAuthorityCallBackData.length;
                productList = '<a id="ALL">ALL</a>';
                var firstProductFlag = true;
                for(var i=0; i<length; i++) {
                    if(userAuthorityCallBackData[i]["PNAME"] == "PRODUCT") {
                        productList += '<a id="' + userAuthorityCallBackData[i]["PVALUE"] + '">' + userAuthorityCallBackData[i]["PVALUE"] + '</a>';
                        if(firstProductFlag) {
                            firstProduct = userAuthorityCallBackData[i]["PVALUE"];
                            firstProductFlag = false;
                        }
                    }
                }
                $(".Product").html("");
                $(".Product").append(productList).enhanceWithin();
                $(".Ro #ALL").addClass('hover');
                $(".Product #ALL").addClass('hover');
                loadingMask("hide");
            };
            this.failCallback = function(data) {
                console.log("api misconnected");
            };
            
            var _construct = function() {
                CustomAPI("POST", true, "UserAuthority", self.successCallback, self.failCallback, UserAuthorityQueryData, "");
            }();
        };

        window.ProductDetail = function() {
            this.successCallback = function(data) {
                productDetailCallBackData = data["Content"]["DataList"];
                length = productDetailCallBackData.length;
                convertData();
                localStorage.setItem("eisdata", JSON.stringify([eisdata, nowTime]));
            }

            this.failCallback = function(data) {
                console.log("api misconnected");
            }

            var _constrcut = function() {
                CustomAPI("POST", true, "ProductDetail", self.successCallback, self.failCallback, productDetailQueryData, "");
            }();
        };

        function getActualValue(ro, product, year, month, type) {
            var actualIndex;
            var Actual = 0;
            var totalAMT = 0;
            var totalQTY = 0;
            if(type == "QTY") {
                actualIndex = 0;
            }else if(type == "AMT") {
                actualIndex = 2;
            }
            if(ro == "ALL" && product == "ALL") {
                for(var i in eisdata[year][month]) {   //ro
                    for(var j in eisdata[year][month][i]) {   //product
                        Actual += eisdata[year][month][i][j][actualIndex];
                        totalQTY += eisdata[year][month][i][j][0];
                        totalAMT += eisdata[year][month][i][j][2];
                    }
                }
            }else if(ro != "ALL" && product == "ALL") {
                for(var i in eisdata[year][month][ro]) {
                    Actual += eisdata[year][month][ro][i][actualIndex];
                    totalQTY += eisdata[year][month][ro][i][0];
                    totalAMT += eisdata[year][month][ro][i][2];
                }
            }else if(ro == "ALL" && product != "ALL") {
                for(var i in eisdata[year][month]) {
                    if(eisdata[year][month][i].hasOwnProperty(product)) {
                        Actual += eisdata[year][month][i][product][actualIndex];
                        totalQTY += eisdata[year][month][i][product][0];
                        totalAMT += eisdata[year][month][i][product][2];
                    }else {
                        Actual += 0;
                        totalQTY += 0;
                        totalAMT += 0;
                    }
                }
            }else {
                if(eisdata[year][month][ro].hasOwnProperty(product)) {
                    Actual = eisdata[year][month][ro][product][actualIndex];
                    totalQTY = eisdata[year][month][ro][product][0];
                    totalAMT = eisdata[year][month][ro][product][2];
                }else {
                    Actual = 0;
                    totalQTY = 0;
                    totalAMT = 0;
                }
            }
            if(type == "ASP") {
                if(totalQTY != 0) {
                    Actual = (totalAMT / totalQTY);
                }else {
                    Actual = 0;
                }
            }
            return Math.round(Actual * Math.pow(10, 2)) / 100;
        }

        function getBudgetHitRate(ro, product, year, month, type) {
            var actualIndex, budgetIndex, result;
            var Actual = 0;
            var Budget = 0;
            var ActualAMT = 0;
            var ActualQTY = 0;
            var BudgetAMT = 0;
            var BudgetQTY = 0;
            if(type == "QTY") {
                actualIndex = 0;
                budgetIndex = 1;
            }else if(type == "AMT") {
                actualIndex = 2;
                budgetIndex = 3;
            }
            if(ro == "ALL" && product == "ALL") {
                for(var i in eisdata[year][month]) {   //ro
                    for(var j in eisdata[year][month][i]) {   //product
                        Actual += eisdata[year][month][i][j][actualIndex];
                        Budget += eisdata[year][month][i][j][budgetIndex];
                        ActualQTY += eisdata[year][month][i][j][0];
                        BudgetQTY += eisdata[year][month][i][j][1];
                        ActualAMT += eisdata[year][month][i][j][2];
                        BudgetAMT += eisdata[year][month][i][j][3];
                    }
                }
            }else if(ro != "ALL" && product == "ALL") {
                for(var i in eisdata[year][month][ro]) {
                    Actual += eisdata[year][month][ro][i][actualIndex];
                    Budget += eisdata[year][month][ro][i][budgetIndex];
                    ActualQTY += eisdata[year][month][ro][i][0];
                    BudgetQTY += eisdata[year][month][ro][i][1];
                    ActualAMT += eisdata[year][month][ro][i][2];
                    BudgetAMT += eisdata[year][month][ro][i][3];
                }
            }else if(ro == "ALL" && product != "ALL") {
                for(var i in eisdata[year][month]) {
                    if(eisdata[year][month][i].hasOwnProperty(product)) {
                        Actual += eisdata[year][month][i][product][actualIndex];
                        Budget += eisdata[year][month][i][product][budgetIndex];
                        ActualQTY += eisdata[year][month][i][product][0];
                        BudgetQTY += eisdata[year][month][i][product][1];
                        ActualAMT += eisdata[year][month][i][product][2];
                        BudgetAMT += eisdata[year][month][i][product][3];
                    }else {
                        Actual += 0;
                        Budget += 0;
                        ActualQTY += 0;
                        BudgetQTY += 0;
                        ActualAMT += 0;
                        BudgetAMT += 0;
                    }
                }
            }else {
                if(eisdata[year][month][ro].hasOwnProperty(product)) {
                    Actual = eisdata[year][month][ro][product][actualIndex];
                    Budget = eisdata[year][month][ro][product][budgetIndex];
                    ActualQTY = eisdata[year][month][ro][product][0];
                    BudgetQTY = eisdata[year][month][ro][product][1];
                    ActualAMT = eisdata[year][month][ro][product][2];
                    BudgetAMT = eisdata[year][month][ro][product][3];
                }else {
                    Actual = 0;
                    Budget = 0;
                    ActualQTY = 0;
                    BudgetQTY = 0;
                    ActualAMT = 0;
                    BudgetAMT = 0;
                }
            }
            if(type == "ASP") {
                if(BudgetQTY != 0 && BudgetAMT != 0 && ActualQTY != 0) {
                    return Math.round(((ActualAMT/ActualQTY) / (BudgetAMT/BudgetQTY)) * Math.pow(10, 4)) / 100;
                }else {
                    return 0;
                }
            }
            if(Budget != 0) {
                return Math.round((Actual / Budget) * Math.pow(10, 4)) / 100;
            }else {
                return 0;
            }
        }

        function getYOYGrowth(ro, product, year, month, type) {
            var actualIndex;
            var Actual = 0;
            var lastActual = 0;
            var ActualAMT = 0;
            var ActualQTY = 0;
            var lastActualAMT = 0;
            var lastActualQTY = 0;
            if(type == "QTY") {
                actualIndex = 0;
            }else if(type == "AMT") {
                actualIndex = 2;
            }
            if (ro == "ALL" && product == "ALL") {
                for(var i in eisdata[year][month]) {    //ro
                    for(var j in eisdata[year][month][i]) {   //product
                        Actual += eisdata[year][month][i][j][actualIndex];
                        ActualQTY += eisdata[year][month][i][j][0];
                        ActualAMT += eisdata[year][month][i][j][2];
                        if(eisdata[year-1][month][i].hasOwnProperty(j)){
                            lastActual += eisdata[year-1][month][i][j][actualIndex];
                            lastActualQTY += eisdata[year-1][month][i][j][0];
                            lastActualAMT += eisdata[year-1][month][i][j][2];
                        }
                    }
                }
            }else if(ro != "ALL" && product == "ALL") {
                for(var i in eisdata[year][month][ro]) {
                    Actual += eisdata[year][month][ro][i][actualIndex];
                    ActualQTY += eisdata[year][month][ro][i][0];
                    ActualAMT += eisdata[year][month][ro][i][2];
                    if(eisdata[year-1][month][ro].hasOwnProperty(i)) {
                        lastActual += eisdata[year-1][month][ro][i][actualIndex];
                        lastActualQTY += eisdata[year-1][month][ro][i][0];
                        lastActualAMT += eisdata[year-1][month][ro][i][2];
                    }
                }
            }else if(ro == "ALL" && product != "ALL") {
                for(var i in eisdata[year][month]) {
                    if(eisdata[year][month][i].hasOwnProperty(product)) {
                        Actual += eisdata[year][month][i][product][actualIndex];
                        ActualQTY += eisdata[year][month][i][product][0];
                        ActualAMT += eisdata[year][month][i][product][2];
                    }
                    if(eisdata[year-1][month][i].hasOwnProperty(product)) {
                        lastActual += eisdata[year-1][month][i][product][actualIndex];
                        lastActualQTY += eisdata[year-1][month][i][product][0];
                        lastActualAMT += eisdata[year-1][month][i][product][2];
                    }
                }
            }else {
                if(eisdata[year][month][ro].hasOwnProperty(product)) {
                    Actual = eisdata[year][month][ro][product][actualIndex];
                    ActualQTY = eisdata[year][month][ro][product][0];
                    ActualAMT = eisdata[year][month][ro][product][2];
                }
                if(eisdata[year-1][month][ro].hasOwnProperty(product)) {
                    lastActual = eisdata[year-1][month][ro][product][actualIndex];                 
                    lastActualQTY = eisdata[year-1][month][ro][product][0];
                    lastActualAMT = eisdata[year-1][month][ro][product][2];
                }
            }
            if(type == "ASP") {
                if(lastActualQTY != 0 && lastActualAMT != 0 && ActualQTY != 0) {
                    return Math.round((((ActualAMT/ActualQTY) / (lastActualAMT/lastActualQTY)) - 1)* Math.pow(10, 4)) / 100;
                }else {
                    return 0;
                }
            }
            if(lastActual != 0){
                return Math.round(((Actual / lastActual) - 1) * Math.pow(10, 4)) / 100;
            }else {
                return 0;
            }
        }

        function getHighchartsData(ro, product) {
            if(ro == "ALL" && product == "ALL") {
                for(var hcYear in eisdata) {
                    for(var i in monthlyHighchartsData) {
                        monthlyHighchartsData[i][hcYear] = [];
                    }
                    for(var month in eisdata[hcYear]) {
                    	for(var i in monthlyHighchartsData) {
                    		monthlyHighchartsData[i][hcYear][Number(month)-1] = 0;
                    	}
                        for(var ro in eisdata[hcYear][month]) {
                            for(var product in eisdata[hcYear][month][ro]) {
                                monthlyHighchartsData["Actual QTY"][hcYear][Number(month)-1] += eisdata[hcYear][month][ro][product][0];
                                monthlyHighchartsData["Budget QTY"][hcYear][Number(month)-1] += eisdata[hcYear][month][ro][product][1];
                                monthlyHighchartsData["Actual AMT"][hcYear][Number(month)-1] += eisdata[hcYear][month][ro][product][2];
                                monthlyHighchartsData["Budget AMT"][hcYear][Number(month)-1] += eisdata[hcYear][month][ro][product][3];
                            }
                        }
                        if(monthlyHighchartsData["Actual QTY"][hcYear][Number(month)-1] != 0) {
	                        monthlyHighchartsData["Actual ASP"][hcYear][Number(month)-1] = (monthlyHighchartsData["Actual AMT"][hcYear][Number(month)-1] / monthlyHighchartsData["Actual QTY"][hcYear][Number(month)-1]);
                    	}
                    	if(monthlyHighchartsData["Budget QTY"][hcYear][Number(month)-1] != 0){
                    		monthlyHighchartsData["Budget ASP"][hcYear][Number(month)-1] = (monthlyHighchartsData["Budget AMT"][hcYear][Number(month)-1] / monthlyHighchartsData["Budget QTY"][hcYear][Number(month)-1]);
                    	}
                    }
                }
            }else if(ro != "ALL" && product == "ALL") {
                for(var hcYear in eisdata) {
                    for(var i in monthlyHighchartsData) {
                        monthlyHighchartsData[i][hcYear] = [];
                    }
                    for(var month in eisdata[hcYear]) {
                        for(var i in monthlyHighchartsData) {
                    		monthlyHighchartsData[i][hcYear][Number(month)-1] = 0;
                    	}
                        for(var product in eisdata[hcYear][month][ro]) {
                        	monthlyHighchartsData["Actual QTY"][hcYear][Number(month)-1] += eisdata[hcYear][month][ro][product][0];
                        	monthlyHighchartsData["Budget QTY"][hcYear][Number(month)-1] += eisdata[hcYear][month][ro][product][1];
                            monthlyHighchartsData["Actual AMT"][hcYear][Number(month)-1] += eisdata[hcYear][month][ro][product][2];
                            monthlyHighchartsData["Budget AMT"][hcYear][Number(month)-1] += eisdata[hcYear][month][ro][product][3];
                        }
                        if(monthlyHighchartsData["Actual QTY"][hcYear][Number(month)-1] != 0) {
	                        monthlyHighchartsData["Actual ASP"][hcYear][Number(month)-1] = (monthlyHighchartsData["Actual AMT"][hcYear][Number(month)-1] / monthlyHighchartsData["Actual QTY"][hcYear][Number(month)-1]);
                    	}
                    	if(monthlyHighchartsData["Budget QTY"][hcYear][Number(month)-1] != 0){
                    		monthlyHighchartsData["Budget ASP"][hcYear][Number(month)-1] = (monthlyHighchartsData["Budget AMT"][hcYear][Number(month)-1] / monthlyHighchartsData["Budget QTY"][hcYear][Number(month)-1]);
                    	}
                    }
                }
            }else if(ro == "ALL" && product != "ALL") {
                for(var hcYear in eisdata) {
                    for(var i in monthlyHighchartsData) {
                        monthlyHighchartsData[i][hcYear] = [];
                    }
                    for(var month in eisdata[hcYear]) {
                    	for(var i in monthlyHighchartsData) {
                    		monthlyHighchartsData[i][hcYear][Number(month)-1] = 0;
                    	}
                        for(var ro in eisdata[hcYear][month]) {
                            if(eisdata[hcYear][month][ro].hasOwnProperty(product)) {
								monthlyHighchartsData["Actual QTY"][hcYear][Number(month)-1] += eisdata[hcYear][month][ro][product][0];
								monthlyHighchartsData["Budget QTY"][hcYear][Number(month)-1] += eisdata[hcYear][month][ro][product][1];
								monthlyHighchartsData["Actual AMT"][hcYear][Number(month)-1] += eisdata[hcYear][month][ro][product][2];
								monthlyHighchartsData["Budget AMT"][hcYear][Number(month)-1] += eisdata[hcYear][month][ro][product][3];
                            }
                        }
                        if(monthlyHighchartsData["Actual QTY"][hcYear][Number(month)-1] != 0) {
	                        monthlyHighchartsData["Actual ASP"][hcYear][Number(month)-1] = (monthlyHighchartsData["Actual AMT"][hcYear][Number(month)-1] / monthlyHighchartsData["Actual QTY"][hcYear][Number(month)-1]);
                    	}
                    	if(monthlyHighchartsData["Budget QTY"][hcYear][Number(month)-1] != 0){
                    		monthlyHighchartsData["Budget ASP"][hcYear][Number(month)-1] = (monthlyHighchartsData["Budget AMT"][hcYear][Number(month)-1] / monthlyHighchartsData["Budget QTY"][hcYear][Number(month)-1]);
                    	}
                    }
                }
            }else {
                for(var hcYear in eisdata) {
                    for(var i in monthlyHighchartsData) {
                        monthlyHighchartsData[i][hcYear] = [];
                    }
                    for(var month in eisdata[hcYear]) {
                    	for(var i in monthlyHighchartsData) {
                    		monthlyHighchartsData[i][hcYear][Number(month)-1] = 0;
                    	}
                        if(eisdata[hcYear][month][ro].hasOwnProperty(product)) {
                        	monthlyHighchartsData["Actual QTY"][hcYear][Number(month)-1] = eisdata[hcYear][month][ro][product][0];
                        	monthlyHighchartsData["Budget QTY"][hcYear][Number(month)-1] = eisdata[hcYear][month][ro][product][1];
                            monthlyHighchartsData["Actual AMT"][hcYear][Number(month)-1] = eisdata[hcYear][month][ro][product][2];
                            monthlyHighchartsData["Budget AMT"][hcYear][Number(month)-1] = eisdata[hcYear][month][ro][product][3];  
                        }
                        if(monthlyHighchartsData["Actual QTY"][hcYear][Number(month)-1] != 0) {
	                        monthlyHighchartsData["Actual ASP"][hcYear][Number(month)-1] = (monthlyHighchartsData["Actual AMT"][hcYear][Number(month)-1] / monthlyHighchartsData["Actual QTY"][hcYear][Number(month)-1]);
                    	}
                    	if(monthlyHighchartsData["Budget QTY"][hcYear][Number(month)-1] != 0){
                    		monthlyHighchartsData["Budget ASP"][hcYear][Number(month)-1] = (monthlyHighchartsData["Budget AMT"][hcYear][Number(month)-1] / monthlyHighchartsData["Budget QTY"][hcYear][Number(month)-1]);
                    	}
                    }
                }
            }
            if(year == thisYear) {
                for(var i=thisYear-3; i<thisYear; i++) {
                    monthlyHighchartsData["Actual QTY"][i].splice(Number(thisMonth), 11);
                    monthlyHighchartsData["Actual AMT"][i].splice(Number(thisMonth), 11);
                    monthlyHighchartsData["Actual ASP"][i].splice(Number(thisMonth), 11);
                    monthlyHighchartsData["Budget QTY"][i].splice(Number(thisMonth), 11);
                    monthlyHighchartsData["Budget AMT"][i].splice(Number(thisMonth), 11);
                    monthlyHighchartsData["Budget ASP"][i].splice(Number(thisMonth), 11);
                }
            }
        }

        function showData() {
            $("#title-content #ActualValue p").text(formatNumber(actualValue));
            $("#title-content #BudgetHitRate p").text(formatNumber(budgetHitRate) + "%");
            if(budgetHitRate < 80) {
                $("#title-content #BudgetHitRate p").css("color", "#ee3839");
            }else if(budgetHitRate > 95) {
                $("#title-content #BudgetHitRate p").css("color", "#48af56");
            }else {
                $("#title-content #BudgetHitRate p").css("color", "#e6be20");
            }
            if(yoyGrowth < 0) {
                $("#title-content #YOYGrowth p").text(formatNumber(yoyGrowth) + "%");
                $("#title-content #YOYGrowth p").css("color", "#ee3839");
            }else {
                $("#title-content #YOYGrowth p").text("+" + formatNumber(yoyGrowth) + "%");
                $("#title-content #YOYGrowth p").css("color", "#48af56");
            }
        }

        function convertData() {
            var rosite, index = 0;
            if(!(productDetailCallBackData[length-1]["YEAR"] in eisdata)) {
                eisdata[productDetailCallBackData[length-1]["YEAR"]] = {};    
            }
            eisdata[productDetailCallBackData[length-1]["YEAR"]][productDetailCallBackData[length-1]["MONTH"]] = {};
            while(index<length) {
                rosite = productDetailCallBackData[index]["RO_SITE"];
                eisdata[productDetailCallBackData[length-1]["YEAR"]][productDetailCallBackData[length-1]["MONTH"]][productDetailCallBackData[index]["RO_SITE"]] = {};
                while(index<length && rosite == productDetailCallBackData[index]["RO_SITE"]) {
                    eisdata [productDetailCallBackData[length-1]["YEAR"]]
                            [productDetailCallBackData[length-1]["MONTH"]]
                            [productDetailCallBackData[index]["RO_SITE"]]
                            [productDetailCallBackData[index]["PRODUCT"]] = [
                            Number(productDetailCallBackData[index]["ACTUAL_QTY"]),
                            Number(productDetailCallBackData[index]["BUDGET_QTY"]),
                            Number(productDetailCallBackData[index]["ACTUAL_ADJ_AMT"]),
                            Number(productDetailCallBackData[index]["BUDGET_AMT"])
                    ];
                    index++;
                }
            }
        }

        function initSlider() {
            if(monthlyPageDateExist) {   
                var index = 0;
                year = thisYear-1;
                month = thisMonth;
                while(index < 13) {
                    monthlyPageDateList += "<div>" + monTable[month] + year + "</div>";
                    monthlyPageDate[index] = month + "." + year;
                    if(month == 12){
                        year++;
                        month = 0;
                    }
                    month++;
                    index++;
                }
                $(".sliderMonthly").html("");
                $(".sliderMonthly").append(monthlyPageDateList).enhanceWithin();
            }
            monthlyPageDateExist = false;
            if($(".sliderMonthly").hasClass("slick-slider") || $(".sliderMonthly").hasClass("slick-initialized")){
                $(".sliderMonthly").slick("unslick");
            }
            $(".sliderMonthly").slick({
                initialSlide: 0,
                autopaly: false,
                dots: false,
                responseive: [{
                    breakpoint: 500,
                    settings: {
                        arrows: true,
                        infinite: false,
                        slidesToShow: 2,
                        slidesToScroll: 2
                    }
                }],
                infinite: false
            });
        }

        $(".sliderMonthly").on('beforeChange', function(event, slick, currentSlide, nextSlide) {
            year = monthlyPageDate[nextSlide].match(/([0-9]{0,2})\.([0-9]{0,4})/)[2];
            month = monthlyPageDate[nextSlide].match(/([0-9]{0,2})\.([0-9]{0,4})/)[1];
            getHighchartsData(ro, product);
            showHighchart();
            actualValue = getActualValue(ro, product, year, month, tab);
            yoyGrowth = getYOYGrowth(ro, product, year, month, tab);
            budgetHitRate = getBudgetHitRate(ro, product, year, month, tab);
            showData();
        });

        function showHighchart() {
            options = {
                chart: {
                    marginBottom: 80,
                    marginTop: 20,
                    marginLeft: 35,
                    marginRight: 10
                },
                title: {
                    text: ''
                },
                xAxis: {
                    title: {
                        text: 'Month',
                        align: 'high',   
                        x: 5,
                        y: -5
                    },
                    tickInterval: 1,
                    max: 12,
                    min: 1,
                    crosshair: true,
                },
                yAxis: [{
                    title: {
                        text: hcTitle,
                        align: 'high',
                        rotation: 0,
                        offset: 0,
                        x: 5,
                        y: -11
                    },
                    labels: {
                        x: -2
                    },
                    min: 0,
                }, {
                    title: {
                        text: '',
                    },
                    labels: {
                        x: 5
                    },
                    opposite: true,
                    min: 0,
                }],
                legend: {
                    align: 'left',
                    float: true,
                    x: -7,
                    y: 13
                },
                credits: {
                    enabled: false
                },
                tooltip: {
                    formatter: function () {
                        var index = 0;
                        var s = '<b>' + hcRo + ' Hit Rate - ' + hcProduct + '</b>';
                        var dollar = "$";
                        var detailInfo = [];
                        if(tab == "QTY"){
                            dollar = "";
                        }
                        $.each(this.points, function () {
                            if(tab == "ASP"){
                                this.y = Math.round(this.y * Math.pow(10, 2)) / 100;
                            }
                            detailInfo[index++] = '<br/>' + hcTable[this.x] + ' ' + this.series.name + ' = ' + dollar + formatNumber(this.y);
                        });
                        for(var i=0; i<detailInfo.length; i++) {
                            s += detailInfo[--index];
                        }
                        return s;
                    },
                    shared: true,
                    useHTML: true,
                    hideDelay: 0,
                    crosshairs: false
                },
                plotOptions: {
                    column: {
                        pointPadding: 0,
                        borderWidth: 0,
                        pointStart: 1
                    },
                    line: {
                        pointStart: 1
                    }
                },
                exporting: {
                    enabled: false
                },
                series: [{
                    name: (year-2) + " Actual " + tab,
                    type: 'column',
                    color: '#0AB5B6',
                    data: monthlyHighchartsData["Actual " + tab][year-2]
                }, {
                    name: (year-1) + " Actual " + tab,
                    type: 'column',
                    color: '#F4A143',
                    data: monthlyHighchartsData["Actual " + tab][year-1]
                }, {
                    name: (year) + " Actual " + tab,
                    type: 'column',
                    color: '#824E9F',
                    data: monthlyHighchartsData["Actual " + tab][year]
                }, {
                    name: (year) + " Budget " + tab,
                    type: 'line',
                    color: '#134A8C',
                    data: monthlyHighchartsData["Budget " + tab][year],
                    lineWidth: 1,
                }]
            };
            options.chart.renderTo = "viewMonthlyHitRate-hc-canvas";
            chart = new Highcharts.Chart(options);
            options.chart.renderTo = "viewMonthlyHitRate-hc-landscape-canvas";
            chartLandscape = new Highcharts.Chart(options);
            chartLandscape.legend.update({itemStyle: {fontSize: 14}, align: "center"});
        }

        /********************************** page event *************************************/
        $("#viewMonthlyHitRate").on("pageshow", function(event, ui) {
            initSlider();
            $("#viewMonthlyHitRate #title-container > #title > #actualValue > p").text("Adj. Sales");
            $("label[for=viewMonthlyHitRate-tab-1]").addClass('ui-btn-active');
            $("label[for=viewMonthlyHitRate-tab-2]").removeClass('ui-btn-active');
            $("label[for=viewMonthlyHitRate-tab-3]").removeClass('ui-btn-active');
            $(".Ro #" + ro).parent('.scrollmenu').find('.hover').removeClass('hover');
            $(".Product #" + product).parent('.scrollmenu').find('.hover').removeClass('hover');
            $(".Product #ALL").removeClass('disableHover');
            $(".Ro #ALL").addClass('hover');
            $(".Product #ALL").addClass('hover');

            ro = "ALL";
            product = "ALL";
            tab = "AMT";
            year = thisYear;
            month = thisMonth;
            hcRo = "All";
            hcProduct = "All product";
            getHighchartsData(ro, product);
            showData();
            $(".sliderMonthly").slick("slickGoTo", monthlyPageDate.length-1, true);
            loadingMask("hide");
        });

        $(".page-tabs #viewMonthlyHitRate-tab-1").on("click", function() {
            $("#title-container > #title > #actualValue > p").text("Adj. Sales");
            tab = "AMT";
            $(".Product #ALL").removeClass('disableHover');
            hcTitle = "(USD$)";
            showHighchart();
            actualValue = getActualValue(ro, product, year, month, tab);
            budgetHitRate = getBudgetHitRate(ro, product, year, month, tab);
            yoyGrowth = getYOYGrowth(ro, product, year, month, tab);
            showData();
        });

        $(".page-tabs #viewMonthlyHitRate-tab-2").on("click", function() {
            $("#title-container > #title > #actualValue > p").text("ASP");
            tab = "ASP";
            $(".Product #" + product).parent('.scrollmenu').find('.hover').removeClass('hover');
            $(".Product #ALL").addClass('disableHover');
            if(product == "ALL") {
                product = firstProduct;
            }
            $(".Product #" + product).addClass('hover');
            hcTitle = "(USD$)";
            getHighchartsData(ro, product);
            showHighchart();
            actualValue = getActualValue(ro, product, year, month, tab);
            budgetHitRate = getBudgetHitRate(ro, product, year, month, tab);
            yoyGrowth = getYOYGrowth(ro, product, year, month, tab);
            showData();
        });

        $(".page-tabs #viewMonthlyHitRate-tab-3").on("click", function() {
            $("#title-container > #title > #actualValue > p").text("Net Quantity");
            tab = "QTY";
            $(".Product #" + product).parent('.scrollmenu').find('.hover').removeClass('hover');
            $(".Product #ALL").addClass('disableHover');
            if(product == "ALL") {
                product = firstProduct;
            }
            $(".Product #" + product).addClass('hover');
            hcTitle = "";
            getHighchartsData(ro, product);
            showHighchart();
            actualValue = getActualValue(ro, product, year, month, tab);
            budgetHitRate = getBudgetHitRate(ro, product, year, month, tab);
            yoyGrowth = getYOYGrowth(ro, product, year, month, tab);
            showData();
        });

        // scroll menu on click
        $(document).on('click', '#viewMonthlyHitRate .Ro > a', function(e) {
            e.preventDefault();
            ro = $(this).context.id;
            if($(this).context.id == "ALL") {
                hcRo = "All";
            }else{
                hcRo = $(this).context.id;
            }
            $(this).parent('.scrollmenu').find('.hover').removeClass('hover');
            $(this).addClass('hover');
            actualValue = getActualValue(ro, product, year, month, tab);
            budgetHitRate = getBudgetHitRate(ro, product, year, month, tab);
            yoyGrowth = getYOYGrowth(ro, product, year, month, tab);
            getHighchartsData(ro, product);
            showHighchart();
            showData();
        });

        $(document).on('click', '#viewMonthlyHitRate .Product > a', function(e) {
            e.preventDefault();
            if(tab == "AMT" || $(this).context.id != "ALL") {
                product = $(this).context.id;
                if($(this).context.id == "ALL") {
                    hcProduct = "All product";
                }else{
                    hcProduct = $(this).context.id;
                }
                $(this).parent('.scrollmenu').find('.hover').removeClass('hover');
                $(this).addClass('hover');
                actualValue = getActualValue(ro, product, year, month, tab);
                budgetHitRate = getBudgetHitRate(ro, product, year, month, tab);
                yoyGrowth = getYOYGrowth(ro, product, year, month, tab);
                getHighchartsData(ro, product);
                showHighchart();
                showData();
            }
        });
    }
});