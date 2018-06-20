var calendarData = false;
var selectDept = "";
var selectSite = "";
var agent_ID = "", agent_Name = "";
var timoutQueryAgentData = null;
var deptData = {
    id: "dept-popup",
    option: [],
    title: "",
    defaultText: langStr["str_069"],
    changeDefaultText: true,
    attr: {
        class: "tpl-dropdown-list-icon-arrow"
    }
};

var deptAgentData = {
    id: "dept-agent-popup",
    option: [],
    title: '<input type="search" id="searchDeptAgent" />',
    defaultText: langStr["str_069"],
    changeDefaultText: true,
    attr: {
        class: "tpl-dropdown-list-icon-arrow"
    }
};

/*var allDeptList = [{site:"BQY", dept:"BI10"},
                   {site:"BQY", dept:"BI20"},
                   {site:"BQY", dept:"BI30"},
                   {site:"BQY", dept:"BI40"},
                   {site:"QTY", dept:"AI10"},
                   {site:"QTY", dept:"AI20"},
                   {site:"QTY", dept:"AI30"},
                   {site:"QTY", dept:"AI40"}]; */

//var fakeCallBackData = "<Record><Department>BI30</Department><Empno>0409132</Empno><name>Ken.Chao</name><Department>BI30</Department><Empno>1607279</Empno><name>Eee.Tsai</name><Department>BI30</Department><Empno>1607126</Empno><name>Mulin.Chuang</name></Record>";

//檢查是否符合預覽送簽標準
function checkAgentBeforeSend() {
    //必須符合3個條件：1.請假理由不能爲空 2.開始時間和结束时间 3.需要基准日的是否已选择 4.代理人必须选择
    //必須符合2個條件:1.部門 2.代理人
    if ($("#dept-popup option").text().trim() !== pleaseSelectStr &&
        $("#dept-agent-popup option").text().trim() !== pleaseSelectStr ) {     
        $('#toBeAgent').addClass('leavePreview-active-btn');
    } else {
        $('#toBeAgent').removeClass('leavePreview-active-btn');
    }
}

$("#viewAgentLeave").pagecontainer({
    create: function(event, ui) {
        /********************************** function *************************************/
        //GetDefaultSetting
        //API: GetUserAuthority 獲取可代理的Site+Dept
        window.GetAgentDeptAuthority = function() {

            this.successCallback = function(data) {
                //console.log(data);
                if (data['ResultCode'] === "1") {
                    var callbackData = data['Content']["AuthorizedSite"];
                    //初始化
                    var agentDeptLeave = [];
                    deptData["option"] = [];
                    //$("#agentDept").empty();
                    //$("#dept-popup-option-popup").empty();

                    for (var i = 0; i < callbackData.length; i++) {                                                                  
                        var siteList = callbackData[i].Site;
                        var deptList = callbackData[i].Department;
                        for (var j in deptList) {
                            //agentDeptLeave.push(deptList[j]); 
                            var deptObject = {};  
                            deptObject["site"] = siteList;
                            deptObject["dept"] = deptList[j];
                            agentDeptLeave.push(deptObject);
                        }                       
                    }
                    //循环所有类别到popup
                    for (var i in agentDeptLeave) {
                        deptData["option"][i] = {};
                        deptData["option"][i]["site"] = agentDeptLeave[i].site;
                        deptData["option"][i]["value"] = agentDeptLeave[i].dept;
                        deptData["option"][i]["text"] = agentDeptLeave[i].dept;
                    }
                    //生成所有类别dropdownlist
                    tplJS.DropdownList("viewAgentLeave", "agentDept", "prepend", "typeB", deptData);

                    loadingMask("hide");
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "GetUserAuthority", self.successCallback, self.failCallback, getAgentDeptData, "");
            }();
        };

        //根據部門獲取代理人
        window.QueryAgentEmployeeData = function(callback) {
            callback = callback || null;

            this.successCallback = function(data) {
                if (data['ResultCode'] === "1") {
                    var agentList = "";
                    if (data['Content'][0] == undefined) {
                        $("#dept-agent-popup-option").popup("close");                       
                        popupMsgInit('.agentDeptNotExist');
                    } else {
                        var callbackData = data['Content'][0]["result"];
                        var htmlDom = new DOMParser().parseFromString(callbackData, "text/html");
                        var DepArry = $("Department", htmlDom);
                        var nameArry = $("name", htmlDom);
                        var agentIDArry = $("Empno", htmlDom);
                        for (var i = 0; i < DepArry.length; i++) {
                            if ($(agentIDArry[i]).html() !== localStorage["emp_no"]) {
                                agentList += '<li class="tpl-option-msg-list" value="' + $(agentIDArry[i]).html() + '">' +
                                    '<div style="width: 25VW;"><span>' +
                                    $(DepArry[i]).html() +
                                    '</span></div>' +
                                    '<div><span>' +
                                    $(nameArry[i]).html() +
                                    '</span></div>' +
                                    '</li>';
                            }
                        }
                        if (agentList != "") {
                            $("#dept-agent-popup-option-list").empty().append(agentList);
                            resizePopup("dept-agent-popup-option");

                            $("#dept-agent-popup-option-list").show();
                            $("#loaderQueryAgent").hide();
                        } else {
                            $("#dept-agent-popup-option").popup("close");
                            popupMsgInit('.agentDeptNotExist');
                        }                        
                    } 

                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "QueryEmployeeData", self.successCallback, self.failCallback, queryAgentEmployeeData, "");
            }();
        };

        /********************************** page event *************************************/
        $("#viewAgentLeave").one("pagebeforeshow", function(event, ui) {
            $("#agentDept").empty();
            $("#dept-popup-option-popup").empty();
            getAgentDeptData = '<LayoutHeader><EmpNo>' +
                    myEmpNo +
                    '</EmpNo></LayoutHeader>';
            //呼叫API
            GetAgentDeptAuthority();
            tplJS.DropdownList("viewAgentLeave", "agentName", "prepend", "typeB", deptAgentData);
        });

        $("#viewAgentLeave").on("pageshow", function(event, ui) {
            loadingMask("hide");
        });

        /********************************** dom event *************************************/

        //選擇部門——select change
        $(document).on("change", "#dept-popup", function() {
            selectDept = $(this).val();
            var chosenDeptList = deptData["option"].find(function(item, index, array){
              return item.text === selectDept;  
            });
            selectSite = chosenDeptList.site;
            $("#agentName").empty();
            $("#dept-agent-popup-option-list").empty();
            tplJS.DropdownList("viewAgentLeave", "agentName", "prepend", "typeB", deptAgentData);
            $("#dept-popup").css("font-family", "Heiti TC");
            checkAgentBeforeSend();
        });

        //點擊獲取代理人的姓名（去除代理人部門代碼）
        $(document).on("click", "#dept-agent-popup-option ul li", function(e) {
            agent_ID = $(this).attr("value");
            agent_Name = $(this).children("div").eq(1).children("span").text();
        });

        //popup打开以后生成代理人列表
        $(document).on("popupafteropen", "#dept-agent-popup-option", function() {
            $("#searchDeptAgent").val("");
            if ($("#loaderQueryAgent").length <= 0) {
                $("#dept-agent-popup-option-popup .ui-content").append('<img id="loaderQueryAgent" src="img/query-loader.gif" width="15" height="15" style="margin-left:45%; display:none;">');
            } else {
                $("#loaderQueryAgent").hide();
            }
        });

        //代理人选择后检查是否符合预览要求
        $(document).on("popupafterclose", "#dept-agent-popup-option", function() {
            checkAgentBeforeSend();
        });

        $(document).on("keyup", "#searchDeptAgent", function(e) {
            if ($("#searchDeptAgent").val().length == 0) {
                $("#loaderQueryAgent").hide();
                $("#dept-agent-popup-option-list").hide();
                return;
            }
            var searchEmpNo = "";
            var searchName = "";
            var searchData = $("#searchDeptAgent").val().match(/^[A-Za-z\.]*/);
            if (searchData[0] != "") {
                searchName = searchData[0];
            } else {
                searchEmpNo = $("#searchDeptAgent").val();
            }
            queryAgentEmployeeData = "<LayoutHeader><EmpNo>" +
                myEmpNo +
                "</EmpNo><qSite>" +
                selectSite +
                "</qSite><qDeptCode>" +
                selectDept +
                "</qDeptCode><qEmpno>" +
                searchEmpNo +
                "</qEmpno><qName>" +
                searchName +
                "</qName></LayoutHeader>";
            
            if (timoutQueryAgentData != null) {
                clearTimeout(timoutQueryAgentData);
                timoutQueryAgentData = null;
            }
            timoutQueryAgentData = setTimeout(function() {
                //呼叫API
                QueryAgentEmployeeData();
                $("#loaderQueryAgent").show();
                $("#dept-agent-popup-option-list").hide();
            }, 2000);
            if (e.which == 13) {
                $("#searchDeptAgent").blur();
            }
        });

        //點擊代理人
        $("#agentName").on("click", function() {
            //點選“代理人”需要判断“部門”是否選擇
            if ($("#agentDept").text().trim() == pleaseSelectStr) {
                popupMsgInit('.deptFirst');
            } 
        });

        //清除代理請假選項
        $("#emptyAgentForm").on("click", function() {
            //清除部門別&代理人
            $("#agentDept").empty();
            tplJS.DropdownList("viewAgentLeave", "agentDept", "prepend", "typeB", deptData);
            $("#agentName").empty();
            $("#dept-agent-popup-option-list").empty();
            tplJS.DropdownList("viewAgentLeave", "agentName", "prepend", "typeB", deptAgentData);
            $("#dept-popup").css("font-family", "Heiti TC");
            checkAgentBeforeSend();
        });

        $("#toBeAgent").on("click", function() {
            if ($('#toBeAgent').hasClass('leavePreview-active-btn')) {
                loadingMask("show");
                myEmpNo = agent_ID;               
                getUserAuthorityData = '<LayoutHeader><EmpNo>' +
                    myEmpNo +
                    '</EmpNo></LayoutHeader>';
                //呼叫API
                GetUserAuthority();
                //1.恢复“请选择”
                var options = '<option hidden>' + pleaseSelectStr + '</option>';
                $("#agent-popup").find("option").remove().end().append(options);
                tplJS.reSizeDropdownList("agent-popup", "typeB");
                $("#leave-agent-popup").find("option").remove().end().append(options);
                tplJS.reSizeDropdownList("leave-agent-popup", "typeB");
                //2.赋值
                agentid = "";
                agentName = "";
                leaveid = "";
                beginTime = "08:00";
                endTime = "17:00";
                //3.上方出現代理Bar
                var angetStr = langStr["str_187"]; //"代理";
                var endStr = langStr["str_188"]; //"結束";
                var agentHTML = '<div class="agentLeave">' +
                    '<div class="agentName font-style5">' +
                        '<span>'+ angetStr +'</span>' +
                        '<span></span>' +
                    '</div>' +
                    '<div class="agentEnd font-style5">' +
                        '<span>'+ endStr +'</span>' +
                    '</div></div>';
                $(".beingAgent").append(agentHTML).show();
                $(".page-main").css("padding-top", "0");
                $(".agentName > span:nth-of-type(2)").text(agent_Name);
                //changing bar color
                var light = ['1', '0.9', '0.8', '0.7', '0.6', '0.5', '0.6', '0.7', '0.8', '0.9'];
                var currentIndex = 0;
                setInterval(function () {
                    $(".beingAgent").css({
                         //backgroundColor: colors[currentIndex]
                         "background-color":"rgba(201, 201, 201, " + light[currentIndex] + ")",
                         //"opacity": light[currentIndex]
                    });
                    if (!light[currentIndex]) {
                        currentIndex = 0;
                    } else {
                        currentIndex++;
                    }
                }, 200);
                $("#mypanelviewAgentLeave").removeAttr("style");
                $("#mypanelviewAgentLeave").hide();
            }
        });

    }
});