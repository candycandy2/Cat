var leaveAllData = [
    {id: '1', categroy: '本期特休', leave: '本期特休', introduce: '依照同仁年資天數計算', attachment: '0', basedate: '0'},
    {id: '2', categroy: '去年特休', leave: '去年特休', introduce: '使用期限到2017/12/31止', attachment: '0', basedate: '0'},
    {id: '3', categroy: '去年彈休', leave: '去年彈休', introduce: '使用期限到2017/12/31止', attachment: '0', basedate: '0'},
    {id: '4', categroy: '預支特休', leave: '預支特休', introduce: '7天/年，於發放下期特休或離職時回扣', attachment: '0', basedate: '0'},
    {id: '5', categroy: '病假', leave: '三天病假', introduce: '超過三日以上，須檢附醫師證明方可請假，扣薪條件如半薪病假', attachment: '1', basedate: '0'},
    {id: '6', categroy: '病假', leave: '半薪病假', introduce: '一年有30天日的半薪病假', attachment: '0', basedate: '0'},
    {id: '7', categroy: '病假', leave: '生理假', introduce: '同半薪病假', attachment: '0', basedate: '0'},
    {id: '8', categroy: '病假', leave: '無薪病假', introduce: '一年之30日半薪病假用畢時方可使用', attachment: '1', basedate: '0'},
    {id: '9', categroy: '事假', leave: '事假', introduce: '一年有14天日的事假', attachment: '0', basedate: '0'},
    {id: '10', categroy: '事假', leave: '家庭照顧假', introduce: '同事假，全年以7日爲限，併入事假計算', attachment: '0', basedate: '0'},
    {id: '11', categroy: '事假', leave: '特別事假', introduce: '當一年之14日事假用畢時方可申請使用', attachment: '1', basedate: '0'},
    {id: '12', categroy: '婚嫁', leave: '婚嫁', introduce: '可分開請，結婚生效日前30日及後90日內請畢，基準日爲結婚登記日', attachment: '1', basedate: '1'},
    {id: '13', categroy: '婚嫁', leave: '訂婚假', introduce: '訂婚當日及其前後兩日之五日內請畢', attachment: '0', basedate: '1'},
    {id: '14', categroy: '喪家', leave: '3天喪家', introduce: '可分開請，但須與100日內請畢', attachment: '1', basedate: '1'},
    {id: '15', categroy: '喪家', leave: '6天喪家', introduce: '可分開請，但須與100日內請畢', attachment: '1', basedate: '1'},
    {id: '16', categroy: '喪家', leave: '8天喪家', introduce: '可分開請，但須與100日內請畢', attachment: '1', basedate: '1'},
    {id: '17', categroy: '產假', leave: '有薪產檢假', introduce: '以懷孕日爲基準，請假以小時爲最小單位', attachment: '1', basedate: '1'},
    {id: '18', categroy: '產假', leave: '產假', introduce: '不得分開請假，應與子女出生前後一星期內辦理請假手續', attachment: '1', basedate: '1'},
    {id: '19', categroy: '產假', leave: '半薪產假', introduce: '到職未滿六個月以上者，以半薪計算', attachment: '1', basedate: '1'},
    {id: '20', categroy: '陪產假', leave: '陪產假', introduce: '分娩當日及其前後十五日，擇其中五日請假', attachment: '1', basedate: '1'},
    {id: '21', categroy: '流產假', leave: '流產假（3-6個月）', introduce: '同產假', attachment: '1', basedate: '1'},
    {id: '22', categroy: '流產假', leave: '半薪流產假（3-6個月）', introduce: '到職未滿六個月以上者，以半薪計算', attachment: '1', basedate: '1'},
    {id: '23', categroy: '流產假', leave: '流產假（2-3個月）', introduce: '不給薪', attachment: '1', basedate: '1'},
    {id: '24', categroy: '流產假', leave: '流產假（未滿2個月）', introduce: '不給薪', attachment: '1', basedate: '1'},
    {id: '25', categroy: '公傷假', leave: '半薪公傷假', introduce: '薪資由公司代爲申請勞保傷病給付後，另補其原有薪資差額', attachment: '1', basedate: '1'},
    {id: '26', categroy: '公傷假', leave: '公傷假', introduce: '薪資由公司代爲申請勞保傷病給付後，另補其原有薪資差額', attachment: '1', basedate: '1'},
    {id: '27', categroy: '公假', leave: '公假', introduce: '因政府之召集、集會、選舉等履行其國民權利義務時', attachment: '1', basedate: '0'},
    {id: '28', categroy: '曠職', leave: '曠職', introduce: '', attachment: '0', basedate: '0'},
    {id: '29', categroy: '志工假', leave: '志工假', introduce: '每年給予一天', attachment: '1', basedate: '0'},
    {id: '30', categroy: '派外探親假', leave: '派外探親假', introduce: '派外探親假，僅適用派外同仁申請', attachment: '0', basedate: '0'},
    {id: '31', categroy: '派外急難假', leave: '派外急難假', introduce: '派外...重病或死亡，由Level 2以上主管核定急難假的天數', attachment: '0', basedate: '0'},
    {id: '32', categroy: '民族祭典假', leave: '民族祭典假', introduce: '原住民依據族別不同，有不同的祭典日可請一日', attachment: '1', basedate: '1'}
];

var departmentMemberList = [
    "ABC10 Jack Wang", "ABC10 Jane Xu", "ABC11 Jerry Chen", "ABC11 Sunny Lee", "ABC12 Darren Ben"
    // "ABC12 Andy Liu", "ABC13 Jay Zhou", "ABC13 Mini Yang", "ABC14 Back Wu", "ABC14 Eirc Zhao"
];

var viewLeaveSubmitInit = false;
var categroyList = [];
var LeaveList = [];
var allLeaveList = [];
//var selectCategroy;

var categroyData = {
    id: "categroy-popup",
    option: [],
    title: "",
    defaultText: "請選擇",
    changeDefaultText : true,
    attr: {
        class: "tpl-dropdown-list-icon-arrow"
    }
};

var leaveData = {
    id: "leave-popup",
    option: [],
    title: "",
    defaultText: "請選擇",
    changeDefaultText : true,
    attr: {
        class: "tpl-dropdown-list-icon-arrow"
    }
};

var leaveAgentData = {
    id: "leave-agent-popup",
    option: [],
    title: '<input type="search" id="searchAgent" />',
    defaultText: "請選擇",
    changeDefaultText : true,
    attr: {
        class: "tpl-dropdown-list-icon-arrow"
    }
};

$("#viewLeaveSubmit").pagecontainer({
    create: function(event, ui) {
        
        /********************************** function *************************************/
        function getLeaveCategroy() {
            categroyList = [];
            for(var i in leaveAllData) {
                if (categroyList.indexOf(leaveAllData[i]['categroy']) == -1) {
                    categroyList.push(leaveAllData[i]['categroy']);
                } 
            }
            
            for(var i in categroyList) {
                categroyData["option"][i] = {};
                categroyData["option"][i]["value"] = categroyList[i];
                categroyData["option"][i]["text"] = categroyList[i];
            }

            tplJS.DropdownList("viewLeaveSubmit", "leaveCategroy", "prepend", "typeB", categroyData);
        }

        function getAllLeaveList() {
            allLeaveList = [];
            for(var i in leaveAllData) {
                if (allLeaveList.indexOf(leaveAllData[i]['leave']) == -1) {
                    allLeaveList.push(leaveAllData[i]['leave']);
                }
            }
            
            for(var i in allLeaveList) {
                leaveData["option"][i] = {};
                leaveData["option"][i]["value"] = allLeaveList[i];
                leaveData["option"][i]["text"] = allLeaveList[i];
            }

            tplJS.DropdownList("viewLeaveSubmit", "leaveGenre", "prepend", "typeB", leaveData);
        }

        function getLeaveByCategroy(categroy) {
            leaveList = [];
            for(var i in leaveAllData) {
                if(categroy == leaveAllData[i]['categroy']) {
                    leaveList.push(leaveAllData[i]['leave']);
                }
            }

            for(var i in leaveList) {
                leaveData["option"][i] = {};
                leaveData["option"][i]["value"] = leaveList[i];
                leaveData["option"][i]["text"] = leaveList[i];
            }
        }

        function getDepartmentMember() {
            for(var i in departmentMemberList) {
                leaveAgentData["option"][i] = {};
                leaveAgentData["option"][i]["value"] = departmentMemberList[i];
                leaveAgentData["option"][i]["text"] = departmentMemberList[i];
            }

            tplJS.DropdownList("viewLeaveSubmit", "leaveAgent", "prepend", "typeB", leaveAgentData);
        }

        function leaveDataInit() {
            leaveData = {
                id: "leave-popup",
                option: [],
                title: "",
                defaultText: "請選擇",
                changeDefaultText : true,
                attr: {
                    class: "tpl-dropdown-list-icon-arrow"
                }
            };
        }


        /********************************** page event *************************************/
        $("#viewLeaveSubmit").on("pagebeforeshow", function(event, ui) {
            if(!viewLeaveSubmitInit){
            	$('#applyDay').text(applyDay);
                getLeaveCategroy();
                getAllLeaveList();
                getDepartmentMember();
                viewLeaveSubmitInit = true;
            }
        });

        $("#viewLeaveSubmit").on("pageshow", function(event, ui) {
            
            loadingMask("hide");
        });

        /********************************** dom event *************************************/
        $("#viewLeaveSubmit").keypress(function(event) {
        });

        $(document).on("change", "#categroy-popup", function() {
            var selectCategroy = $(this).val();
            leaveDataInit();
            
        });



    }
});