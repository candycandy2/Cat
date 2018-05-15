var calendarData = false;
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
var allDeptList = [{site:"BQY", dept:"BI10/BI20/BI30/BI40"},
                    {site:"QTY", dept:"AI10/AI20/AI30/AI40"}];

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

        //取得所有可代理的部門和員工
        function getAllDeptList() {
            //初始化
            var agentDeptLeave = [];
            deptData["option"] = [];
            $("#agentDept").empty();
            $("#dept-popup-option-popup").remove();

            //GetUserAuthority 時就要將Dept循環所有類別，並去重、去空並push into Array: allDeptList
            for (var i in allDeptList) {   
                var splitDeptList = allDeptList[i]["dept"].split("/"); 
                for (var j in splitDeptList) {
                    agentDeptLeave.push(splitDeptList[j]);  
                }              
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

        //根据类别获取假别
        function getLeaveByCategory() {
            var leaveList = [];
            leaveData["option"] = [];
            $("#leaveGenre").empty();
            $("#leave-popup-option-popup").remove();

            //类别分“所有类别”和所选类别
            if (selectCategory === allLeaveCategroyStr) {
                for (var i in allLeaveList) {
                    var obj = {};
                    obj["leaveid"] = allLeaveList[i]["leaveid"];
                    obj["name"] = allLeaveList[i]["name"];
                    leaveList.push(obj);
                }
            } else {
                for (var i in allLeaveList) {
                    if (selectCategory === allLeaveList[i]["category"]) {
                        var obj = {};
                        obj["leaveid"] = allLeaveList[i]["leaveid"];
                        obj["name"] = allLeaveList[i]["name"];
                        leaveList.push(obj);
                    }
                }
            }

            for (var i in leaveList) {
                leaveData["option"][i] = {};
                leaveData["option"][i]["value"] = leaveList[i]["leaveid"];
                leaveData["option"][i]["text"] = leaveList[i]["name"];
            }

            tplJS.DropdownList("viewPersonalLeave", "leaveGenre", "prepend", "typeB", leaveData);

            //假別一旦更改，除了類別的其他選項都需要恢復初始狀態
            $('#leaveIntroduce').empty().hide();
            $('#baseDate').hide();
            $('#uploadAttachment').hide();
            $('#divEmpty').hide();
            //更換假別對基準日有直接影響
            $("#chooseBaseday").text(selectBasedayStr);
            $("#oldBaseday").val("");
            $("#newBaseday").val("");

            leaveid = "";
            leaveType = "";
            baseday = "";
            basedayList = false;
        }

        /********************************** page event *************************************/
        $("#viewAgentLeave").one("pagebeforeshow", function(event, ui) {
            getAllDeptList();
        });

        $("#viewAgentLeave").on("pageshow", function(event, ui) {
            loadingMask("hide");
        });

        /********************************** dom event *************************************/

        $("#toBeAgent").on("click", function() {
            if ($('#toBeAgent').hasClass('leavePreview-active-btn')) {
                myEmpNo = "1607126";
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
                //changepage
                $.mobile.changePage("#viewPersonalLeave");
                //agent
                if(localStorage.getItem("agent") !== null) {
                    //viewPersonalLeave
                    $("#agent-popup option").text(JSON.parse(localStorage.getItem("agent"))[0]);
                    tplJS.reSizeDropdownList("agent-popup", "typeB");
                    //viewLeaveSubmit
                    $("#leave-agent-popup option").text(JSON.parse(localStorage.getItem("agent"))[0]);
                    tplJS.reSizeDropdownList("leave-agent-popup", "typeB");
                }else {
                    $("#agent").text(pleaseSelectStr);
                    $("#leaveAgent").text(pleaseSelectStr);                   
                }

                loadingMask("show");
                // Hide #mypanelviewAgentLeave 
                // Show #mypanelEndAgentLeave
            }
        });

    }
});