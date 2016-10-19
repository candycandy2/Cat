<div class="row">
    <div class="col-lg-10 col-xs-12" id="app-mainInfo">
        <form class="form-horizontal" id="mainInfoForm" name="mainInfoForm">
            <div class="form-group">
                <label class="control-label col-sm-2"></label>
                <div class="col-sm-10 js-lang-tool-bar" id="langToolBar">
                    <span class="label-hint" id="hintInfo"></span>
                    <div class="btn-group js-switch-lang-btn"  id="btnLagSwitchController" style="display:@if (count($appBasic) <= 1) none @endif">
                        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">語言<span class="badge js-lang-count"  style="margin-left: 5px;padding: 2px 5px;" ></span><span class="caret" style="margin-left: 5px"></span></button>
                        
                        <ul class="dropdown-menu js-switchLang" role="menu"  data-source="hintInfo" id="switchLang">
                            
                                @foreach ($appBasic as $appData)
                                <li class="js-switch-lang" id="ddlLang_{{$appData->lang_row_id}}" data-toggle="{{$appData->lang_row_id}}"><a href="#">{{$appData->lang_desc}} {{$appData->lang_code}}</a></li>
                                @endforeach
                            
                        </ul>
                    </div>
                    <div class="btn-group">
                        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
                        管理語言 <span class="caret"></span></button>
                        <ul class="dropdown-menu" role="menu">
                            <li id="btnAddLang"><a href="#" onclick="addLang()">新增語言</a></li>
                            <li id="btnRemoveLang">
                            <a href="#" onclick="delLang()" >移除語言</a></li>
                            <li id="btnChangeDefaultLang" @if (count($allowLangList) <= 1) 
                                class="disabled" 
                                title="沒有可變更的語言" 
                            @endif>
                            <a href="#" @if (count($allowLangList) > 1) onclick="changDefaultLang()" @endif >變更預設語言</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-2" for="appKey">App Key</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="txbAppKey" value="{{$appData->app_key}}" disabled>
                </div>
            </div>
            <div class="info-dymaic-content">
                @foreach ($appBasic as $appData)
                <div class="lang js-lang-{{$appData->lang_row_id}}">
                    <div class="form-group">
                        <label class="control-label col-sm-2" for="">App 名稱</label>
                        <div class="col-sm-10"> 
                            <input type="text" class="form-control" id="txbAppName_{{$appData->lang_row_id}}" name="txbAppName_{{$appData->lang_row_id}}"placeholder="Enter app name" value="{{$appData->app_name}}">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label col-sm-2" for="">App 摘要</label>
                        <div class="col-sm-10"> 
                            <input type="text" class="form-control" id="txbAppSummary_{{$appData->lang_row_id}}" name="txbAppSummary_{{$appData->lang_row_id}}" placeholder="Enter app summary" value="{{$appData->app_summary}}">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label col-sm-2" for="">App 描述</label>
                        <div class="col-sm-10"> 
                            <textarea class="form-control" id="txbAppDescription_{{$appData->lang_row_id}}" name="txbAppDescription_{{$appData->lang_row_id}}"  placeholder="Enter app description">{{$appData->app_description}}</textarea>
                        </div>
                    </div>
                </div>
                 @endforeach
            </div>
        </form>
    </div>
</div>
<hr class="primary" style="border-top: 1px solid #bbb1b1;">
<div class="row">
    <div class="col-lg-10 col-xs-12" id="app-apiInfo">
        <form class="form-horizontal" id="customApiForm">
            <div class="form-group">
                <label class="control-label col-sm-2" for="customApi">Api 資訊</label>
                <div class="col-sm-10">
                    <label>API</label>
                    <div id="toolbarNewAppApi">
                        <button type="button" class="btn btn-danger" onclick="deleteCustomApi()" id="btnDeleteCustomApi">
                            {{trans("messages.DELETE")}}
                        </button>
                        <button type="button" class="btn btn-primary" onclick="newCustomApi()" id="btnNewCustomApi">新增API</button>
                    </div>
                    <table id="gridCustomApi" class="bootstrapTable" data-toggle="table" data-sort-name="api_action" data-toolbar="#toolbarNewAppApi"
                           data-url="AppMaintain/getCustomApi?app_row_id={{ app('request')->input('app_row_id') }}" data-height="398" data-pagination="true"
                           data-show-refresh="true" data-row-style="rowStyle" data-search="true"
                           data-show-toggle="true"  data-sortable="true"
                           data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
                           data-click-to-select="false" data-single-select="false">
                        <thead>
                        <tr>
                            <th data-field="state" data-checkbox="true"></th>
                            <th data-field="row_id" data-sortable="false" data-visible="false">ID</th>
                            <th data-field="api_action" data-sortable="false" data-formatter="customApiActionFormatter">Api Action</th>
                            <th data-field="api_version" data-sortable="false">Api Version</th>
                            <th data-field="api_url" data-sortable="false">Api Url</th>
                        </tr>
                        </thead>
                    </table>
                </div>
            </div>
        </form>
        <form class="form-horizontal" id="errorCodeForm">
            <div class="form-group">
                <label class="control-label col-sm-2" for=""></label>
                <div class="col-sm-10">
                    <label>錯誤代碼</label>  
                    <div id="toolbarNewErrorCode">
                        <div class="form-group">
                            <span class="btn btn-danger btn-file" name="btndDeleteErrorCodeFile" id="btndDeleteErrorCodeFile" onclick="deleteErrorCode()" style="display: none">
                                刪除
                            </span>
                            <span class="btn btn-primary btn-file" name="btnUplErrorCodeFile" id="btnUplErrorCodeFile">
                                新增錯誤代碼 <input type="file" class="file" name="errorCodeFile" id="errorCodeFile">
                            </span>
                        </div>
                        <div class="form-group table-responsive" id="customApiErrorCode" 
                        @if (!isset($errorCode))
                            style="display: none"
                        @endif
                        >
                            <table  id="gridCustomApiErrorCode" class="costum-table">
                                <tr>
                                    <td width="36px"></td>
                                    <td>目前錯誤代碼</td>
                                </tr>
                                <tr>
                                    <td>
                                        <label>
                                            <input type="checkbox" name="chkErrorCode" id="chkErrorCode">
                                        </label>
                                    </td>
                                    <td  id="errorCodeFileName">
                                        @if (isset($errorCode))
                                            <a href="{{$errorCode}}" class="link" download>{{$errorCode}}</a>
                                        @endif
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>
<hr class="primary" style="border-top: 1px solid #bbb1b1;">
<div class="row">
    <div class="col-lg-10 col-xs-12" id="app-basicInfo">
        <form class="form-horizontal" id="basicInfoForm">
            <div class="form-group">
                <label class="control-label col-sm-2" for="email">應用程式分類</label>
                <div class="col-sm-10">
                    <select name="ddlAppCategory" class="form-control selectpicker" id="ddlAppCategory">
                    <option value="0">未分類</option>
                    @foreach ($categoryList as $category)
                        @if ($category->row_id == $categoryId)
                        <option value="{{$category->row_id}}" selected>{{$category->app_category}}</option>
                        @else
                        <option value="{{$category->row_id}}">{{$category->app_category}}</option>
                        @endif
                    @endforeach
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-2" for="pwd">安全級別</label>
                <div class="col-sm-5"> 
                    <select name="ddlSecurityLevel" class="form-control" id="ddlSecurityLevel">
                        <option value="1" data-hint="*需登入QPlay，且開啟App或Resume時需再次輸入密碼">高階</option>
                        <option value="2" data-hint="*需登入QPlay，且開啟App時需再次輸入密碼">中階</option>
                        <option value="3" data-hint="*登入QPlay即可使用該App" selected>一般</option>
                    </select>
                </div>
                <div class="col-sm-5">
                    <small class="text-muted" id="securityLevelHint"></small>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-2" for="userApp">角色設定</label>
                <div class="col-sm-10">
       
                    <select name="ddlAppUserType" class="form-control" id="ddlAppUserType">
                        <option value="1"
                        @if (isset($companyLabel))
                            selected
                        @endif
                        >依公司選擇</option>
                        <option value="2"
                        @if (!isset($companyLabel))
                            selected
                        @endif
                        >依企業角色選擇</option>
                    </select>
                </div>
    
                <label class="control-label col-sm-2" for="userApp"></label>
                <div class="col-sm-10"> 
                    <div id="selNormal"  
                    @if (!isset($companyLabel))
                        style="display: none"
                    @endif>
                        <div class="table-responsive" style="margin-top:10px ">
                            <table class="table table-bordered js-role-table"  style="border:1px solid #d6caca;">
                                <tr>

                                    @foreach($allCompanyRoleList as $companyRoles)

                                    <td id="CompanyTable_{{$companyRoles->company}}" class="bg-gray-light col-lg-4 col-xs-4" style="text-align: center;border:1px solid #d6caca;vertical-align: middle;">
                                        <input type="checkbox" name="" value="{{$companyRoles->company}}" 
                                        @if (is_array($companyLabel) && in_array($companyRoles->company,$companyLabel))
                                            checked
                                        @endif
                                        >{{$companyRoles->company}} 
                                    </td>
                                    @endforeach
                                </tr>
                            </table>
                        </div>
                    </div><!--end Normal-->
                    <div id="selUserRole" 
                    @if (isset($companyLabel))
                         style="display: none"
                    @endif
                    >
                        <div class="table-responsive" style="margin-top:10px ">
                        @foreach($allCompanyRoleList as $companyRoles)
                            @if(count($companyRoles->roles > 0))
                                <table class="table table-bordered js-role-table" id="RoleTable_{{$companyRoles->company}}" style="border:1px solid #d6caca;">
                                    <tr>
                                        <td rowspan="{{count($companyRoles->roles)}}" class="bg-gray-light col-lg-4 col-xs-4" style="text-align: center;border:1px solid #d6caca;vertical-align: middle;">
                                            <input type="checkbox" data="{{$companyRoles->company}}" class="cbxAllRole" onclick="RoleTableSelectedAll(this)">{{$companyRoles->company}}</input>
                                        </td>
                                        <td style="border:1px solid #d6caca;">
                                            <div class="col-lg-6 col-xs-6" style="text-align: left;">
                                            <input type="checkbox" data="{{$companyRoles->roles[0]->row_id}}" class="cbxRole"
                                                @if(in_array($companyRoles->roles[0]->row_id, $enableRoleArray))
                                                    checked
                                                @endif
                                            >{{$companyRoles->roles[0]->role_description}}</input>
                                            </div>
                                            @if(count($companyRoles->roles) > 1)
                                                <div class="col-lg-6 col-xs-6" style="text-align: left;">
                                                    <input type="checkbox" data="{{$companyRoles->roles[1]->row_id}}" class="cbxRole"
                                                           @if(in_array($companyRoles->roles[1]->row_id, $enableRoleArray))
                                                           checked
                                                            @endif
                                                    >{{$companyRoles->roles[1]->role_description}}</input>
                                                </div>
                                            @endif
                                        </td>
                                    </tr>
                                    @if(count($companyRoles->roles) > 2)
                                    @for($i = 2; $i < (count($companyRoles->roles) + 1) / 2; $i = $i + 2)
                                        <tr>
                                            <td style="border:1px solid #d6caca;">
                                                @if(count($companyRoles->roles) > $i)
                                                    <div class="col-lg-6 col-xs-6" style="text-align: left;">
                                                        <input type="checkbox" data="{{$companyRoles->roles[$i]->row_id}}" class="cbxRole"
                                                               @if(in_array($companyRoles->roles[$i]->row_id, $enableRoleArray ))
                                                               checked
                                                                @endif
                                                        >{{$companyRoles->roles[$i]->role_description}}</input>
                                                    </div>
                                                @endif
                                                    @if(count($companyRoles->roles) > $i + 1)
                                                        <div class="col-lg-6 col-xs-6" style="text-align: left;">
                                                            <input type="checkbox" data="{{$companyRoles->roles[$i + 1]->row_id}}" class="cbxRole"
                                                                   @if(in_array($companyRoles->roles[$i + 1]->row_id, $enableRoleArray ))
                                                                   checked
                                                                    @endif
                                                            >{{$companyRoles->roles[$i + 1]->role_description}}</input>
                                                        </div>
                                                    @endif
                                            </td>
                                        </tr>
                                    @endfor
                                    @endif
                                </table>
                            @endif
                        @endforeach
                    </div>
                    <div id="toolbar">
                        <button type="button" class="btn btn-danger" onclick="DeleteAppUser()" id="btnDeleteAppUser">
                        {{trans("messages.REMOVE")}}
                        </button>
                        <button type="button" class="btn btn-primary" onclick="AddAppUser()" id="btnAddAppUser">
                        {{trans("messages.ADD_USER")}}
                        </button>
                    </div>

                    <table id="gridUserList" class="bootstrapTable" data-toggle="table" data-sort-name="row_id" data-toolbar="#toolbar"
                           data-url="AppMaintain/getAppUser?app_row_id={{ app('request')->input('app_row_id') }}" data-height="398" data-pagination="true"
                           data-show-refresh="false" data-row-style="rowStyle" data-search="false"
                           data-show-toggle="true"  data-sortable="true"
                           data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
                           data-click-to-select="false" data-single-select="false">
                        <thead>
                        <tr>
                            <th data-field="state" data-checkbox="true"></th>
                            <th data-field="row_id" data-sortable="true" data-visible="false">ID</th>
                            <th data-field="login_id" data-sortable="true">{{trans("messages.USER_LOGIN_ID")}}</th>
                            <th data-field="company" data-sortable="true">{{trans("messages.USER_COMPANY")}}</th>
                            <th data-field="department" data-sortable="true">{{trans("messages.USER_DEPARTMENT")}}</th>
                        </tr>
                        </thead>
                    </table>   

                    </div><!--end UserRole-->
                   
                </div>
            </div>
        </form>
    </div>
</div>

<!--Dymaic Div Content -->
<div id="infoDymaicContent" style="display: none">
    <div class="form-group">
        <label class="control-label col-sm-2">App 名稱</label>
        <div class="col-sm-10"> 
            <input type="text" class="form-control js-app-name"  id="" name="" placeholder="Enter app name">
        </div>
    </div>
    <div class="form-group">
        <label class="control-label col-sm-2">App 摘要</label>
        <div class="col-sm-10"> 
            <input type="text" class="form-control js-app-summary" id="" name="" placeholder="Enter app summary">
        </div>
    </div>
    <div class="form-group">
        <label class="control-label col-sm-2">App 描述</label>
        <div class="col-sm-10"> 
            <textarea class="form-control js-app-description"  id="" name="" placeholder="Enter app description"></textarea>
        </div>
    </div>
</div>
<!--Dymaic Div Content -->
@section('dialog_content')
    <div id="addLangDialog" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h1 class="modal-title" id="addLangDialogTitle">新增語言</h1>
                </div>
                 <div class="modal-body " id="addableLang" style="height: 150px; overflow-y: auto;">
                 @foreach ($langList as $lang)
                    @if (!in_array($lang->row_id,array_keys($allowLangList)))
                    <div class="radio" id="radioLang_{{$lang->row_id}}">
                      <label>
                        <input type="radio" name="optionsRadios" value="{{$lang->row_id}}" checked>
                        {{$lang->lang_desc}} {{$lang->lang_code}}
                      </label>
                    </div>
                    @endif  
                 @endforeach
                </div>
                <div class="modal-footer">
                    <button type="button"  class="btn btn-danger" onclick="AddAppAllowLang()">{{trans("messages.SAVE")}}</button>
                    <button type="button"  class="btn btn-primary" data-dismiss="modal">{{trans("messages.CLOSE")}}</button>
                </div>
            </div>
        </div>
    </div>

    <div id="delLangDialog" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h1 class="modal-title" id="delLangDialogTitle">移除語言</h1>
                </div>
                 <div class="modal-body" id="removeableLang" style="height: 150px; overflow-y: auto;">
                     @foreach ($allowLangList as $allowLangId => $allowLang)
                      {{-- @if ($allowLangId != $defaultLang) --}}
                        <div class="checkbox @if ($allowLangId == $defaultLang) disabled @endif">
                          <label>
                                @if ($allowLangId == $defaultLang) 
                                    <input type="checkbox" value="{{$allowLangId}}"  disabled >
                                    <span class="text-muted">{{$allowLang}} (預設語言，無法刪除)</span>
                                @else
                                    <input type="checkbox" value="{{$allowLangId}}">{{$allowLang}}
                                @endif
                                
                          </label>
                        </div>
                       {{-- @endif   --}}
                     @endforeach
                </div>
                <div class="modal-footer">
                    <button type="button"  class="btn btn-danger" onclick="saveRemoveLang();">{{trans("messages.SAVE")}}</button>
                    <button type="button"  class="btn btn-primary" data-dismiss="modal">{{trans("messages.CLOSE")}}</button>
                </div>
            </div>
        </div>
    </div>

    <div id="changDefaultLangDialog" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h1 class="modal-title" id="changDefaultLangDialogTitle">變更預設語言</h1>
                </div>
                 <div class="modal-body" id="defaultableLang" style="height: 150px; overflow-y: auto;">
                 @foreach ($allowLangList as $allowLangId => $allowLang)
                     <div class="radio">
                      <label>
                        <input type="radio" name="optionsRadios" id="optionsRadios_{{$allowLangId}}" value="{{$allowLangId}}" @if ($allowLangId == $defaultLang)
                            checked
                        @endif>
                        {{$allowLang}}
                      </label>
                    </div>
                 @endforeach
                </div>
                <div class="modal-footer">
                    <button type="button"  class="btn btn-danger" onclick="saveChangeDefaultanlg()">{{trans("messages.SAVE")}}</button>
                    <button type="button"  class="btn btn-primary" data-dismiss="modal">{{trans("messages.CLOSE")}}</button>
                </div>
            </div>
        </div>
    </div>

    <div id="newCustomApiDialog" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h1 class="modal-title" id="newCustomApiDialogTitle">新增API</h1>
                </div>
                 <div class="modal-body">
                    <table style="width: 100%">
                        <tr>
                            <td>Api Action:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" class="form-control" name="tbxApiAction"
                                       id="tbxApiAction" value=""/>
                            </td>
                            <td><span style="color: red;">*</span></td>
                        </tr>
                        <tr>
                            <td>Api Version:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" class="form-control" name="tbxApiVersion"
                                       id="tbxApiVersion" value=""/>
                            </td>
                            <td><span style="color: red;">*</span></td>
                        </tr>
                         <tr>
                            <td>Api Url:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" class="form-control" name="tbxApiUrl"
                                       id="tbxApiUrl" value=""/>
                            </td>
                            <td><span style="color: red;">*</span></td>
                        </tr>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button"  class="btn btn-danger" onclick="saveCustomApi()">{{trans("messages.SAVE")}}</button>
                    <button type="button"  class="btn btn-primary" data-dismiss="modal">{{trans("messages.CLOSE")}}</button>
                </div>
            </div>
        </div>
    </div>

    <div id="selectUserDialog" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h1 class="modal-title" id="roleDetailMaintainDialogTitle">{{trans("messages.SELECT_USER")}}</h1>
                </div>
                <div class="modal-body">
                    <table id="gridAllUserList" class="bootstrapTable" data-toggle="table" data-sort-name="row_id"
                           data-url="platform/getUserList" data-height="298" data-pagination="true"
                           data-show-refresh="true" data-row-style="rowStyle" data-search="true"
                           data-show-toggle="true"  data-sortable="true"
                           data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
                           data-click-to-select="false" data-single-select="false">
                        <thead>
                        <tr>
                            <th data-field="state" data-checkbox="true"></th>
                            <th data-field="row_id" data-sortable="true" data-visible="false">ID</th>
                            <th data-field="department" data-sortable="true">{{trans("messages.USER_DEPARTMENT")}}</th>
                            <th data-field="emp_no" data-sortable="true">{{trans("messages.USER_EMP_NO")}}</th>
                            <th data-field="login_id" data-sortable="true" >{{trans("messages.USER_LOGIN_ID")}}</th>
                            <th data-field="emp_name" data-sortable="true">{{trans("messages.USER_EMP_NAME")}}</th>
                        </tr>
                        </thead>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button"  class="btn btn-danger" onclick="SelectUser()">{{trans("messages.SELECT")}}</button>
                    <button type="button"  class="btn btn-primary" data-dismiss="modal">{{trans("messages.CLOSE")}}</button>
                </div>
            </div>
        </div>
    </div>

@endsection


<script>

    /*--Custom API Start--*/

    function customApiActionFormatter(value, row){
        return '<a href="#" onclick="updateCustomApi(' + row.row_id + ')">' + value + '</a>';
    }

    var deleteCustomApi = function() {
        showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_DELETE_CUSTOM_API")}}", "", function () {
            hideConfirmDialog();
            var selectedCustomApi = $("#gridCustomApi").bootstrapTable('getSelections');
            var check = true;
            var customApiIdList = new Array();
            $.each(selectedCustomApi, function(i, api) {
                customApiIdList.push(api.row_id);
            });
            var mydata = {customApiIdList:customApiIdList};
            var mydataStr = $.toJSON(mydata);
            $.ajax({
                url: "AppMaintain/deleteCustomApi",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data: mydataStr,
                success: function (d, status, xhr) {
                    if(d.result_code != 1) {
                        showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_DELETE_CUSTOM_API_FAILED")}}");
                    }  else {
                        $("#gridCustomApi").bootstrapTable('refresh');
                        showMessageDialog("{{trans("messages.MESSAGE")}}","{{trans("messages.MSG_OPERATION_SUCCESS")}}");
                    }
                },
                error: function (e) {
                    showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_DELETE_CUSTOM_API_FAILED")}}", e.responseText);
                }
            });
        });
    };

    var currentCustomApiId = null;
    var isNewCustomApi = false;
    var newCustomApi = function() {
        $("#tbxApiAction").val("");
        $("#tbxApiVersion").val("");
        $("#tbxApiUrl").val("");
        $("#newCustomApiDialogTitle").text("{{trans("messages.MSG_NEW_CUSTOM_API")}}");
        $("#newCustomApiDialog").modal('show');
        currentCustomApiId = null;
        isNewCustomApi = true;
    };

    var updateCustomApi = function(customApiRowId) {
        var allCustomApiList = $("#gridCustomApi").bootstrapTable('getData');
        $.each(allCustomApiList, function(i, api) {
            if(api.row_id == customApiRowId) {
                $("#tbxApiAction").val(api.api_action);
                $("#tbxApiVersion").val(api.api_version);
                $("#tbxApiUrl").val(api.api_url);
                return false;
            }
        });

        $("#newCustomApiDialogTitle").text("{{trans("messages.MSG_EDIT_CUSTOM_API")}}");
        $("#newCustomApiDialog").modal('show');
        currentCustomApiId = customApiRowId;
        isNewCustomApi = false;
    };

    var saveCustomApi = function() {
        var apiAction = $("#tbxApiAction").val();
        var apiVersion = $("#tbxApiVersion").val();
        var apiUrl = $("#tbxApiUrl").val();
        var appKey = $('#txbAppKey').val();
        if(apiAction == "" ||　apiVersion == "" || apiUrl == "") {
            showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_REQUIRED_FIELD_MISSING")}}");
            return false;
        }

        showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_SAVE")}}", "", function () {
            hideConfirmDialog();
            var mydata = {
                isNewCustomApi:'Y',
                customApiRowId:-1,
                apiAction:apiAction,
                apiVersion:apiVersion,
                apiUrl:apiUrl,
                appKey:appKey,
                appRowId:{{ app('request')->input('app_row_id') }}
            };
            if(!isNewCustomApi) {
                mydata.isNewCustomApi = 'N';
                mydata.customApiRowId = currentCustomApiId;
            }
            var mydataStr = $.toJSON(mydata);
            $.ajax({
                url: "AppMaintain/saveCustomApi",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data: mydataStr,
                success: function (d, status, xhr) {
                    if(d.result_code != 1) {
                        showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_SAVE_CUSTOM_API_FAILED")}}");
                    }  else {
                        $("#gridCustomApi").bootstrapTable('refresh');
                        $("#newCustomApiDialog").modal('hide');
                        showMessageDialog("{{trans("messages.MESSAGE")}}","{{trans("messages.MSG_OPERATION_SUCCESS")}}");
                    }
                },
                error: function (e) {
                    showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_SAVE_CUSTOM_API_FAILED")}}", e.responseText);
                }
            });
        });
    };

    /*--Custom API End--*/

    /*--Category Start --*/
    
    var SaveCategoryApps = function(categoeyId) {
        var mydata = {app_id_list:[{{ app('request')->input('app_row_id') }}], category_id:categoeyId};
        var mydataStr = $.toJSON(mydata);
            $.ajax({
                url: "AppMaintain/saveCategoryApps",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data: mydataStr,
                success: function (d, status, xhr) {
                    if(d.result_code != 1) {
                        showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_OPERATION_FAILED")}}");
                    }
                },
                error: function (e) {
                    showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_OPERATION_FAILED")}}", e.responseText);
                }
            });
        }

    /*--Category End --*/

    /*--Security Level Start--*/
    var SaveSecurityLevel = function(securityLevel){
        var mydata = {appRowId:{{ app('request')->input('app_row_id') }}, securityLevel:securityLevel};
        var mydataStr = $.toJSON(mydata);
        $.ajax({
                url: "AppMaintain/saveSecurityLevel",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data: mydataStr,
                success: function (d, status, xhr) {
                    if(d.result_code != 1) {
                        showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_OPERATION_FAILED")}}");
                    }
                },
                error: function (e) {
                    showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_OPERATION_FAILED")}}", e.responseText);
                }
            });
    }
    /*--Security Level End--*/

    /*--Add User to App Start --*/
    $('.js-role-table').each(function(){
        if($(this).find(".cbxRole").not(":checked").length == 0){
            $(this).find('.cbxAllRole').prop('checked',true);
        }
    })
    var RoleTableSelectedAll = function (cbx) {
        var companyId = $(cbx).attr("data");
        var chkRoleList = new Array();
        var unCheckRoleList = new Array();
        if($(cbx).is(':checked')) {
            $("#RoleTable_" + companyId).find(".cbxRole").prop("checked",true);
            $("#RoleTable_" + companyId).find(".cbxRole:checked").each(function(){
                chkRoleList.push($(this).attr('data'));
            });
        } else {
            $("#RoleTable_" + companyId).find(".cbxRole").prop("checked", false);
            $("#RoleTable_" + companyId).find(".cbxRole").not(":checked").each(function(){
                unCheckRoleList.push($(this).attr('data'));
            })
        }
        if(chkRoleList.length > 0){
            SaveAppRole(chkRoleList);
        }
        if(unCheckRoleList.length > 0){
            DelAppRole(unCheckRoleList);
        }
    };
    var SaveAppRole = function(chkRoleList){
        var mydata = {appRowId:{{ app('request')->input('app_row_id') }}, roleRowIdList:chkRoleList};
        var mydataStr = $.toJSON(mydata);
        $.ajax({
            url: "AppMaintain/saveAppRole",
            dataType: "json",
            type: "POST",
            contentType: "application/json",
            data: mydataStr,
            success: function (d, status, xhr) {
                if(d.result_code != 1) {
                    showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_OPERATION_FAILED")}}");
                }
            },
            error: function (e) {
                showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_OPERATION_FAILED")}}", e.responseText);
            }
        });
    }
    var DelAppRole = function(unCheckRoleList){
        var mydata = {appRowId:{{ app('request')->input('app_row_id') }}, roleRowIdList:unCheckRoleList};
        var mydataStr = $.toJSON(mydata);
        $.ajax({
                url: "AppMaintain/deleteAppRole",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data: mydataStr,
                success: function (d, status, xhr) {
                    if(d.result_code != 1) {
                        showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_OPERATION_FAILED")}}");
                    }
                },
                error: function (e) {
                    showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_OPERATION_FAILED")}}", e.responseText);
                }
            });
    }

    var SaveAppUser = function(currentData){
        var appUserList = new Array();
         $.each(currentData, function(i, data) {
            if(data.state==false){
               appUserList.push(data.row_id);
            }
         });
        if(appUserList.length > 0){
            var mydata = {appRowId:{{ app('request')->input('app_row_id') }}, appUserList:appUserList};
            var mydataStr = $.toJSON(mydata);
            $.ajax({
                url: "AppMaintain/saveAppUser",
                dataType: "json",
                type: "POST",
                contentType: "application/json",
                data: mydataStr,
                success: function (d, status, xhr) {
                    if(d.result_code != 1) {
                        showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_SAVE_APP_USER_FAILED")}}");
                    }
                    $("#gridAllUserList").bootstrapTable('refresh');
                },
                error: function (e) {
                    showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_SAVE_APP_USER_FAILED")}}", e.responseText);
                }
            });
        }
    }

    var DeleteAppUser = function() {
        showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_DELETE_APP_USER")}}", "", function () {
            hideConfirmDialog();
            var selectedUsers = $("#gridUserList").bootstrapTable('getSelections');
            var check = true;
            var appUserList = new Array();
            $.each(selectedUsers, function(i, user) {
                appUserList.push(user.row_id);
            });
            var mydata = {appRowId:{{ app('request')->input('app_row_id') }}, appUserList:appUserList};
            var mydataStr = $.toJSON(mydata);
            if(appUserList.length > 0){
                $.ajax({
                    url: "AppMaintain/deleteAppUser",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json",
                    data: mydataStr,
                    success: function (d, status, xhr) {
                        if(d.result_code != 1) {
                            showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_DELETE_APP_USER_FAILED")}}");
                        }  else {
                            $("#gridUserList").bootstrapTable('refresh');
                            showMessageDialog("{{trans("messages.MESSAGE")}}","{{trans("messages.MSG_OPERATION_SUCCESS")}}");
                        }
                    },
                    error: function (e) {
                        showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_DELETE_APP_USER_FAILED")}}", e.responseText);
                    }
                });
            }
        });
    };

    var AddAppUser = function() {
        $("#gridAllUserList").bootstrapTable('uncheckAll');
        $("#gridAllUserList").bootstrapTable('refresh');
        $("#selectUserDialog").modal('show');
    };
     var SelectUser = function() {
            var currentData = $("#gridUserList").bootstrapTable('getData');
            var selectedUsers = $("#gridAllUserList").bootstrapTable('getSelections');
            $.each(selectedUsers, function(i, newUser) {
                var exist = false;
                $.each(currentData, function(j, cUser) {
                    if(cUser.row_id == newUser.row_id) {
                        exist = true;
                        return false;
                    }
                });
                if(!exist) {
                    if(newUser.state) {
                        newUser.state = false;
                    }
                    currentData.push(newUser);
                }
            });
            SaveAppUser(currentData);
            $("#gridUserList").bootstrapTable('load', currentData);
            $("#selectUserDialog").modal('hide');

           
        }
    /*--Add User to App End --*/
    
    /*-- Error Code Start--*/
    var showErrorCodeTable = function($target){
        var fileName;
        fileName = $target.val();
        if (!!$target.prop('files') && $target.prop('files').length > 1) {
            fileName =$target[0].files.length+' files';
        }
        else {
            fileName = fileName.substring(fileName.lastIndexOf('\\') + 1, fileName.length);
        }
        if (!fileName) {
            return;
        }
        if(fileName){
            saveErrorCode();
        }

     }
     $('#errorCodeFile').change(function(){
        showErrorCodeTable($(this))
     })


    var saveErrorCode = function(){
     
       var formData = new FormData($('#errorCodeForm')[0]);
       formData.append("appRowId", {{app('request')->input('app_row_id')}});
         $.ajax({
            url: "AppMaintain/saveErrorCode",
            type: "POST",
            contentType: false,
            data: formData,
            processData: false,
            success: function (d, status, xhr) {
                if(d.result_code != 1) {
                    showMessageDialog("{{trans("messages.ERROR")}}",d.message);
                }  else {
                     $('#customApiErrorCode').find('#errorCodeFileName').html('<a href="'+d.content+'" class="link" download>' + d.content + '</a>');
                    $('#customApiErrorCode').show();
                }
            },
            error: function (e) {
                showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_OPERATION_FAILED")}}", e.responseText)
                ;
            }
        });

    }

    var deleteErrorCode = function(){
       
        var mydata = {appRowId:{{ app('request')->input('app_row_id') }}};
        var mydataStr = $.toJSON(mydata);
        $.ajax({
            url: "AppMaintain/deleteErrorCode",
            dataType: "json",
            type: "POST",
            contentType: "application/json",
            data: mydataStr,
            success: function (d, status, xhr) {
                if(d.result_code != 1) {
                    showMessageDialog("{{trans("messages.ERROR")}}","{{trans("messages.MSG_SAVE_APP_USER_FAILED")}}");
                }
                $("#customApiErrorCode").hide();
                $("#btndDeleteErrorCodeFile").hide();
                $("#btnUplErrorCodeFile").show();
            },
            error: function (e) {
                showMessageDialog("{{trans("messages.ERROR")}}", "{{trans("messages.MSG_SAVE_APP_USER_FAILED")}}", e.responseText);
            }
        });
    
    }

     /*-- Error Code End--*/

    $(function () {
       
        $('#ddlAppCategory').change(function(){
            SaveCategoryApps($(this).select().val());
        });

        $("#ddlSecurityLevel > option").each(function() {
            if($(this).val() == {{$securityLevel}}){
                $(this).prop("selected", true);
            }
        });

        $("#ddlSecurityLevel").change(function() {
            SaveSecurityLevel($(this).select().val());
            $('#securityLevelHint').text( $("#ddlSecurityLevel option:selected").data('hint'));
        });
        $('#securityLevelHint').text( $("#ddlSecurityLevel option:selected").data('hint'));

        $('.cbxRole').change(function(){
           var selectRoleList = [$(this).attr('data')];
           if($(this).prop('checked')){
             SaveAppRole(selectRoleList);
           }else{
             DelAppRole(selectRoleList);
           }

        })

        $('body').on('click','#chkErrorCode',function(){
            $obj = $('#toolbarNewErrorCode');
            if($(this).prop("checked")){
                $obj.find('span.btn-primary').hide();
                $obj.find('span.btn-danger').show();
            }else{
                $obj.find('span.btn-primary').show();
                $obj.find('span.btn-danger').hide();
            }
        });

        $('#ddlAppUserType').change(function(){
            if($(this).val() == 1){
                 $('#selUserRole').fadeOut('1500',function(){
                    $('#selNormal').fadeIn('1500');
                }); 
            }else{
                 $('#selNormal').fadeOut('1500',function(){
                    $('#selUserRole').fadeIn('1500');
                }); 
            }
        });
       
    });
</script>