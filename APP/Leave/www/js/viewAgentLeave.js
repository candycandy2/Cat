var calendarData = false;
var selectDept = "";
var selectSite = "";
var agent_ID = "", agent_Name = "";
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

var allDeptList = [{site:"BQY", dept:"BI10"},
                   {site:"BQY", dept:"BI20"},
                   {site:"BQY", dept:"BI30"},
                   {site:"BQY", dept:"BI40"},
                   {site:"QTY", dept:"AI10"},
                   {site:"QTY", dept:"AI20"},
                   {site:"QTY", dept:"AI30"},
                   {site:"QTY", dept:"AI40"}];

var fakeCallBackData = "<Record><Department>BI30</Department><Empno>0409132</Empno><name>Ken.Chao</name><Department>BI30</Department><Empno>1607279</Empno><name>Eee.Tsai</name><Department>BI30</Department><Empno>1607126</Empno><name>Mulin.Chuang</name></Record>";

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
        /* window.GetUserAuthority = function() {

            this.successCallback = function(data) {
                console.log(data);

                //如果ResultCode=1且Content>0，说明数据有更新，重新获取数据并存到local
                if (data['ResultCode'] === "1") {    
                    var allLeaveData = data['Content'][0]["Leavelist"];       
                    var allLeaveDom = new DOMParser().parseFromString(allLeaveData, "text/html");
                    var leaveidArr = $("leaveid", allLeaveDom);
                    allLeaveList = [];
                    for (var i = 0; i < leaveidArr.length; i++) {
                        var leaveObject = {};
                        leaveObject["leaveid"] = $(leaveidArr[i]).html();
                        leaveObject["category"] = $(categoryArr[i]).html();
                        leaveObject["name"] = $(nameArr[i]).html();
                        leaveObject["desc"] = $(descArr[i]).html();
                        leaveObject["basedate"] = $(basedateArr[i]).html();
                        leaveObject["attach"] = $(attachArr[i]).html();
  
                        allLeaveList.push(leaveObject);
                    }
                    //获取请假申请，所有类别
                    getAllDeptList();                
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPIEx("POST", true, "GetUserAuthority", self.successCallback, self.failCallback, getUserAuthorityQueryData, "");
            }();

        }; */
        //API: QueryEmployeeData
        /*window.QueryEmployeeData = function(callback) {
            callback = callback || null;

            this.successCallback = function(data) {
                if (data['Content'][0] == undefined){
                    //agentNotExist
                } else {
                    getAgentByDept();
                }
            };

            this.failCallback = function(data) {};

            var __construct = function() {
                CustomAPI("POST", true, "QueryEmployeeData", self.successCallback, self.failCallback, queryDeptEmployeeData, "");
            }();
        };*/

        //取得所有可代理的部門和員工
        function getAllDeptList() {
            //初始化
            var agentDeptLeave = [];
            deptData["option"] = [];
            $("#agentDept").empty();
            $("#dept-popup-option-popup").remove();

            //GetUserAuthority 時就要將Dept循環所有類別，並去重、去空並push into Array: allDeptList
            for (var i in allDeptList) {   
                //var splitDeptList = allDeptList[i]["dept"].split("/"); 
                //for (var j in splitDeptList) {
                    agentDeptLeave.push(allDeptList[i]["dept"]);  
                //}              
            }

            //循环所有类别到popup
            for (var i in agentDeptLeave) {
                deptData["option"][i] = {};
                deptData["option"][i]["value"] = agentDeptLeave[i];
                deptData["option"][i]["text"] = agentDeptLeave[i];
            }

            //生成所有类别dropdownlist
            tplJS.DropdownList("viewAgentLeave", "agentDept", "prepend", "typeB", deptData);
        }

        //根據部門獲取代理人(Move to API:QueryEmployeeData)
        function getAgentByDept() {
            $("#agentName").empty();
            $("#dept-agent-popup-option-list").empty();
            var agentList = "";
            var htmlDom = new DOMParser().parseFromString(fakeCallBackData, "text/html");
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
            tplJS.DropdownList("viewAgentLeave", "agentName", "prepend", "typeB", deptAgentData);
            $("#dept-agent-popup").css("font-family", "Heiti TC");
        }

        /********************************** page event *************************************/
        $("#viewAgentLeave").one("pagebeforeshow", function(event, ui) {
            getAllDeptList();
            tplJS.DropdownList("viewAgentLeave", "agentName", "prepend", "typeB", deptAgentData);
        });

        $("#viewAgentLeave").on("pageshow", function(event, ui) {
            loadingMask("hide");
        });

        /********************************** dom event *************************************/

        //選擇部門——select change
        $(document).on("change", "#dept-popup", function() {
            selectDept = $(this).val();
            var chosenDeptList = allDeptList.find(function(item, index, array){
              return item.dept === selectDept;  
            });
            selectSite = chosenDeptList.site;
            queryDeptEmployeeData = "<LayoutHeader><EmpNo>" +
                myEmpNo +
                "</EmpNo><qSite>" +
                selectSite +
                "</qSite><qDeptCode>" +
                selectDept +
                "</qDeptCode><qEmpno></qEmpno><qName></qName><</LayoutHeader>";
            //QueryEmployeeData(); After connect to API:QueryEmployeeData, delete getAgentByDept()
            getAgentByDept();        
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
            var searchEmpNo = "";
            var searchName = "";
            var searchData = $("#searchDeptAgent").val().match(/^[A-Za-z\.]*/);
            if (searchData[0] != "") {
                searchName = searchData[0];
            } else {
                searchEmpNo = $("#searchDeptAgent").val();
            }
            queryDeptEmployeeData = "<LayoutHeader><EmpNo>" +
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
            //QueryEmployeeData();
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
            getAllDeptList();
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
                //myEmpNo = "1607126";
                
                localStorage.removeItem("leaveDefaultSetting");
                //默认设置GetDefaultSetting
                if(localStorage.getItem("leaveDefaultSetting") == null) {
                    getDefaultSettingQueryData = "<LayoutHeader><EmpNo>"
                                               + myEmpNo
                                               + "</EmpNo><LastModified></LastModified></LayoutHeader>";
                } 

                GetDefaultSetting();
                //选择日期为“请选择”
                $("#startText").text(pleaseSelectStr);
                $("#endText").text(pleaseSelectStr);

                //data scroll menu
                dateInit();        
                viewPersonalLeaveShow = false;

                //1.恢复“请选择”
                var options = '<option hidden>' + pleaseSelectStr + '</option>';
                $("#agent-popup").find("option").remove().end().append(options);
                tplJS.reSizeDropdownList("agent-popup", "typeB");
                $("#leave-agent-popup").find("option").remove().end().append(options);
                tplJS.reSizeDropdownList("leave-agent-popup", "typeB");
                //2.赋值
                agentid = "";
                agentName = "";
                //3.上方出現代理OOO
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
                var light = ['1', '0.5'];
                var currentIndex = 0;
                setInterval(function () {
                    $(".beingAgent").css({
                         //backgroundColor: colors[currentIndex]
                         "background-color":"rgba(220, 220, 220, " + light[currentIndex]+ ")",
                         //"opacity": light[currentIndex]
                    });
                    if (!light[currentIndex]) {
                        currentIndex = 0;
                    } else {
                        currentIndex++;
                    }
                }, 1000);
                $("#mypanelviewAgentLeave").removeAttr("style");
                $("#mypanelviewAgentLeave").hide();
                //changepage                
                $.mobile.changePage("#viewPersonalLeave");
            }
        });

    }
});