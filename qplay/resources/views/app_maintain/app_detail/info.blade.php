<div class="row">
    <div class="col-lg-10 col-xs-12" id="app-mainInfo">
        <form class="form-horizontal" id="mainInfoForm" name="mainInfoForm">
            <div class="form-group">
                <label class="control-label col-sm-2"></label>
                <div class="col-sm-10 js-lang-tool-bar" id="langToolBar">
                    <span class="label-hint" id="hintInfo"></span>
                    <div class="btn-group js-switch-lang-btn"  id="btnLagSwitchController" style="display:@if (count($appLine) <= 1) none @endif">
                        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">{{trans('messages.BTN_LANGUAGE')}}<span class="badge js-lang-count"  style="margin-left: 5px;padding: 2px 5px;" ></span><span class="caret" style="margin-left: 5px"></span></button>
                        
                        <ul class="dropdown-menu js-switchLang" role="menu"  data-source="hintInfo" id="switchLang">
                            
                                @foreach ($appLine as $appData)
                                <li class="js-switch-lang" id="ddlLang_{{$appData->lang_row_id}}" data-toggle="{{$appData->lang_row_id}}"><a href="#">{{$appData->lang_desc}} {{$appData->lang_code}}</a></li>
                                @endforeach
                            
                        </ul>
                    </div>
                    <div class="btn-group">
                        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
                        {{trans('messages.BTN_LANGUAGE_SETTING')}} <span class="caret"></span></button>
                        <ul class="dropdown-menu" role="menu">
                            <li id="btnAddLang"><a href="#" onclick="addLang()">{{trans('messages.BTN_LANGUAGE_NEW')}}</a></li>
                            <li id="btnRemoveLang">
                            <a href="#" onclick="delLang()" >{{trans('messages.BTN_LANGUAGE_REMOVE')}}</a></li>
                            <li id="btnChangeDefaultLang" @if (count($allowLangList) <= 1) 
                                class="disabled" 
                                title="{{trans('messages.MSG_NO_CHANGABLE_LANGUAGE')}}" 
                            @endif>
                            <a href="#" @if (count($allowLangList) > 1) onclick="changDefaultLang()" @endif >{{trans('messages.BTN_LANGUAGE_CHANGE_DEFAULT')}}</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-2" for="appKey">App Key</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="txbAppKey" value="{{$appKey}}" disabled>
                </div>
            </div>
            <div class="info-dymaic-content">
                @foreach ($appLine as $appData)
                <div class="lang js-lang-{{$appData->lang_row_id}}">
                    <div class="form-group">
                        <label class="control-label col-sm-2" for="txbAppName_{{$appData->lang_row_id}}">{{trans('messages.APP_NAME')}}</label>
                        <div class="col-sm-10"> 
                            <input type="text" class="form-control" id="txbAppName_{{$appData->lang_row_id}}" name="txbAppName_{{$appData->lang_row_id}}"placeholder="Enter app name" value="{{$appData->app_name}}">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label col-sm-2" for="txbAppSummary_{{$appData->lang_row_id}}">{{trans('messages.APP_SUMMARY')}}</label>
                        <div class="col-sm-10"> 
                            <input type="text" class="form-control" id="txbAppSummary_{{$appData->lang_row_id}}" name="txbAppSummary_{{$appData->lang_row_id}}" placeholder="Enter app summary" value="{{$appData->app_summary}}">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="control-label col-sm-2" for="txbAppDescription_{{$appData->lang_row_id}}">{{trans('messages.APP_DESCRIPTION')}}</label>
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
                <label class="control-label col-sm-2" for="customApi">{{trans('messages.CUSTOM_API_INFORMATION')}}</label>
                <div class="col-sm-10">
                    <label>API</label>
                    <div id="toolbarNewAppApi">
                        <button type="button" class="btn btn-danger" onclick="deleteCustomApi()" id="btnDeleteCustomApi">
                            {{trans("messages.DELETE")}}
                        </button>
                        <button type="button" class="btn btn-primary" onclick="newCustomApi()" id="btnNewCustomApi">{{trans('messages.NEW_CUSTOM_API')}}</button>
                    </div>
                    <table id="gridCustomApi" class="bootstrapTable" data-toggle="table" data-sort-name="api_action" data-toolbar="#toolbarNewAppApi"
                           data-url="AppMaintain/getCustomApi?app_row_id={{ app('request')->input('app_row_id') }}" data-height="398" data-pagination="true"
                           data-show-refresh="true" data-row-style="rowStyle" data-search="false"
                           data-show-toggle="true"  data-sortable="true"
                           data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
                           data-click-to-select="false" data-single-select="false">
                        <thead>
                        <tr>
                            <th data-field="state" data-checkbox="true"></th>
                            <th data-field="row_id" data-sortable="false" data-visible="false">ID</th>
                            <th data-field="api_action" data-sortable="false" data-formatter="customApiActionFormatter" data-class="grid_warp_column" data-width="200px">{{trans('messages.CUSTOM_API_ACTION')}}</th>
                            <th data-field="api_version" data-sortable="false" data-class="grid_warp_column">{{trans('messages.CUSTOM_API_VERSION')}}</th>
                            <th data-field="api_url" data-sortable="false" data-class="grid_warp_column">{{trans('messages.CUSTOM_API_URL')}}</th>
                            <th data-field="api_action" data-sortable="false" data-formatter="qplayCustomApiUrlFormatter" data-class="grid_warp_column">QPlay Custom API URl</th>
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
                    <label>{{trans('messages.ERROR_CODE')}}</label>  
                    <div id="toolbarNewErrorCode">
                        <div class="form-group">
                            <span class="btn btn-danger btn-file" name="btndDeleteErrorCodeFile" id="btndDeleteErrorCodeFile" onclick="deleteErrorCode()" style="display: none">
                                {{trans('messages.DELETE')}}
                            </span>
                            <span class="btn btn-primary btn-file" name="btnUplErrorCodeFile" id="btnUplErrorCodeFile">
                                {{trans('messages.NEW_ERROR_CODE')}} <input type="file" class="file" name="errorCodeFile" id="errorCodeFile" accept=".json">
                            </span>
                            <small class="text-muted">
                                *{{trans('messages.ERROR_CODE_HINT')}}
                            </small>
                        </div>
                        <div class="form-group table-responsive" id="customApiErrorCode" 
                        @if (!isset($errorCode))
                            style="display: none"
                        @endif
                        >
                            <table  id="gridCustomApiErrorCode" class="costum-table">
                                <tr>
                                    <td width="36px"></td>
                                    <td>{{trans('messages.CURRENT_ERROR_CODE')}}</td>
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
                <label class="control-label col-sm-2" for="email">{{trans('messages.APP_CATEGORY')}}</label>
                <div class="col-sm-10">
                    <select name="ddlAppCategory" class="form-control selectpicker" id="ddlAppCategory">
                    <option value="" disabled selected>{{trans('messages.MSG_SELECT_CATEGORY')}}</option>
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
                <label class="control-label col-sm-2" for="pwd">{{trans('messages.SECURITY_LEVEL')}}</label>
                <div class="col-sm-5"> 
                    <select name="ddlSecurityLevel" class="form-control" id="ddlSecurityLevel">
                        <option value="1" data-hint="*{{trans('messages.SECURITY_HINT_HIGH')}}">{{trans('messages.SECURITY_HIGH')}}</option>
                        <option value="2" data-hint="*{{trans('messages.SECURITY_HINT_MIDDIUM')}}">{{trans('messages.SECURITY_MIDDIUM')}}</option>
                        <option value="3" data-hint="*{{trans('messages.SECURITY_HINT_NORMAL')}}" selected>{{trans('messages.SECURITY_NORMAL')}}</option>
                    </select>
                </div>
                <div class="col-sm-5">
                    <small class="text-muted" id="securityLevelHint"></small>
                </div>
            </div>
            @if($projectCode != '000')
            <div class="form-group">
                <label class="control-label col-sm-2" for="userApp">{{trans('messages.USER_SETTING')}}</label>
                <div class="col-sm-10">
                    <select name="ddlAppUserType" class="form-control" id="ddlAppUserType">
                        <option value="1"
                        @if (isset($companyLabel))
                            selected
                        @endif
                        >{{trans('messages.USER_SETTING_BY_COMPOANY')}}</option>
                        <option value="2"
                        @if (!isset($companyLabel))
                            selected
                        @endif
                        >{{trans('messages.USER_SETTING_BY_ROLE')}}</option>
                    </select>
               {{--  </div> --}}
             {{--    <label class="control-label col-sm-2" for="userApp"></label>
                <div class="col-sm-10"> --}} 
                    <div id="selNormal"  
                    @if (!isset($companyLabel))
                        style="display: none"
                    @endif>
                        <div class="table-responsive" style="margin-top:10px ">
                            <table class="table table-bordered js-role-table"  style="border:1px solid #d6caca;">
                                <tr>

                                    @foreach($allCompanyRoleList as $companyRoles)

                                    <td id="CompanyTable_{{$companyRoles->company}}" class="bg-gray-light col-lg-4 col-xs-4" style="text-align: center;border:1px solid #d6caca;vertical-align: middle;">
                                        <input type="checkbox" name="chkCompany" value="{{$companyRoles->company}}" 
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
            <!--{{$tempFlag++}}-->
                @if(count($companyRoles->roles > 0))
                    <table class="table table-bordered" id="RoleTable_{{$companyRoles->company}}" style="border:1px solid #d6caca;width:60%;">
                        <tr>
                            <td rowspan="{{count($companyRoles->roles)}}" class="bg-gray-light col-lg-4 col-xs-4" style="text-align: center;border:1px solid #d6caca;vertical-align: middle;background-color:@if($tempFlag % 2 == 0) #d9edf7; @else #f9edf7; @endif">
                                <input type="checkbox" data="{{$companyRoles->company}}"
                                       onclick="RoleTableSelectedAll(this)">{{$companyRoles->company}}</input>
                            </td>
                            <td style="border:1px solid #d6caca;padding: 0px;">
                                <div class="col-lg-6 col-xs-6" style="text-align: left;border-right:1px solid #d6caca;padding: 8px;">
                                    <input type="checkbox" data="{{$companyRoles->roles[0]->row_id}}" name="cbxRole" class="cbxRole" 
                                            @if(in_array($companyRoles->roles[0]->row_id, $enableRoleArray))
                                                checked
                                            @endif
                                    >{{$companyRoles->roles[0]->role_description}}</input>
                                </div>
                                    @if(count($companyRoles->roles) > 1)
                                    <div class="col-lg-6 col-xs-6" style="text-align: left;padding: 8px;">
                                        <input type="checkbox" data="{{$companyRoles->roles[1]->row_id}}" name="cbxRole" class="cbxRole" 
                                               @if(in_array($companyRoles->roles[1]->row_id, $enableRoleArray))
                                                    checked
                                               @endif
                                        >{{$companyRoles->roles[1]->role_description}}</input>
                                    </div>
                                    @endif
                            </td>
                        </tr>
                        @if(count($companyRoles->roles) > 2)
                        @for($i = 2; $i < (count($companyRoles->roles) + 1); $i = $i + 2)
                            <tr>
                                <td style="border:1px solid #d6caca;padding: 0px;">
                                    @if(count($companyRoles->roles) > $i)
                                        <div class="col-lg-6 col-xs-6" style="text-align: left;border-right:1px solid #d6caca;padding: 8px;">
                                            <input type="checkbox" data="{{$companyRoles->roles[$i]->row_id}}" name="cbxRole" class="cbxRole" 
                                                   @if(in_array($companyRoles->roles[$i]->row_id, $enableRoleArray))
                                                        checked
                                                   @endif
                                            >{{$companyRoles->roles[$i]->role_description}}</input>
                                        </div>
                                    @endif
                                    @if(count($companyRoles->roles) > $i + 1)
                                            <div class="col-lg-6 col-xs-6" style="text-align: left;padding: 8px;">
                                                <input type="checkbox" data="{{$companyRoles->roles[$i + 1]->row_id}}" name="cbxRole" class="cbxRole"
                                                    @if(in_array($companyRoles->roles[$i + 1]->row_id, $enableRoleArray))
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
            @endif
        </form>
    </div>
</div>

<!--Dymaic Div Content -->
<div id="infoDymaicContent" style="display: none">
    <div class="form-group">
        <label class="control-label col-sm-2" for="txbAppName_{langId}">{{trans('messages.APP_NAME')}}</label>
        <div class="col-sm-10"> 
            <input type="text" class="form-control js-app-name"  id="txbAppName_{langId}" name="txbAppName_{langId}" placeholder="Enter app name">
        </div>
    </div>
    <div class="form-group">
        <label class="control-label col-sm-2" for="txbAppSummary_{langId}">{{trans('messages.APP_SUMMARY')}}</label>
        <div class="col-sm-10"> 
            <input type="text" class="form-control js-app-summary" id="txbAppSummary_{langId}" name="txbAppSummary_{langId}" placeholder="Enter app summary">
        </div>
    </div>
    <div class="form-group">
        <label class="control-label col-sm-2" for="txbAppDescription_{langId}">{{trans('messages.APP_DESCRIPTION')}}</label>
        <div class="col-sm-10"> 
            <textarea class="form-control js-app-description"  id="txbAppDescription_{langId}" name="txbAppDescription_{langId}" placeholder="Enter app description"></textarea>
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
                    <h1 class="modal-title" id="addLangDialogTitle">{{trans('messages.BTN_LANGUAGE_NEW')}}</h1>
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
                    <h1 class="modal-title" id="delLangDialogTitle">{{trans('messages.BTN_LANGUAGE_REMOVE')}}</h1>
                </div>
                 <div class="modal-body" id="removeableLang" style="height: 150px; overflow-y: auto;">
                     @foreach ($allowLangList as $allowLangId => $allowLang)
                        <div class="checkbox @if ($allowLangId == $defaultLang) disabled @endif">
                          <label>
                                @if ($allowLangId == $defaultLang) 
                                    <input type="checkbox" value="{{$allowLangId}}"  disabled >
                                    <span class="text-muted">{{$allowLang}} ({{trans('messages.MSG_DEFAULT_LANGUAGE_CAN_NOT_REMOVE')}})</span>
                                @else
                                    <input type="checkbox" value="{{$allowLangId}}">{{$allowLang}}
                                @endif
                                
                          </label>
                        </div>
                     @endforeach
                </div>
                <div class="modal-footer">
                    <button type="button"  class="btn btn-danger" onclick="saveRemoveLang();">{{trans("messages.CONFIRM")}}</button>
                    <button type="button"  class="btn btn-primary" data-dismiss="modal">{{trans("messages.CANCEL")}}</button>
                </div>
            </div>
        </div>
    </div>

    <div id="changDefaultLangDialog" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h1 class="modal-title" id="changDefaultLangDialogTitle">{{trans('messages.BTN_LANGUAGE_CHANGE_DEFAULT')}}</h1>
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
                            <td>{{trans('messages.CUSTOM_API_ACTION')}}:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" class="form-control" name="tbxApiAction"
                                       id="tbxApiAction" value=""/>
                                <span style="color: red;" class="error" for="tbxApiAction"></span>
                            </td>
                            <td><span style="color: red;">*</span></td>
                        </tr>
                        <tr>
                            <td>{{trans('messages.CUSTOM_API_VERSION')}}:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" class="form-control" name="tbxApiVersion"
                                       id="tbxApiVersion" value=""/>
                                <span style="color: red;" class="error" for="tbxApiVersion"></span>
                            </td>
                            <td><span style="color: red;">*</span></td>
                            
                        </tr>
                         <tr>
                            <td>{{trans('messages.CUSTOM_API_URL')}}:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" class="form-control" name="tbxApiUrl"
                                       id="tbxApiUrl" value=""/>
                                <span style="color: red;" class="error" for="tbxApiUrl"></span>
                            </td>
                            <td><span style="color: red;">*</span></td>
                        </tr>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button"  class="btn btn-danger" id="saveCustomApi" onclick="saveCustomApi()">{{trans("messages.SAVE")}}</button>
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
                           data-url="platform/getUserList" data-height="298" data-pagination="true" data-side-pagination="server"
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
        return '<a href="#" class="editCustomApi" data-rowid="'+ row.row_id  +'"> '+ value +'</a>';
    }

    function qplayCustomApiUrlFormatter(value, row){
        return '{{\Config::get('app.api_url')}}' + '/qplayApi/public/'+row.api_version+'/custom/{{$appKey}}/' + value;
    }

    var deleteCustomApi = function() {
        showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_DELETE_CUSTOM_API")}}", "", function () {
             hideConfirmDialog();
            var $gridList = $("#gridCustomApi");
            var $toolbar  =  $($gridList.data('toolbar'));
            var selectedCustomApi = $gridList.bootstrapTable('getSelections');
            var currentData = $gridList.bootstrapTable('getData');             
           $.each(selectedCustomApi, function(i, api) {
               var index = $gridList.find('input[name=btSelectItem]:checked').first().data('index');
               currentData.splice(index,1);
               $gridList.bootstrapTable('load', currentData);
           });
            $toolbar.find('.btn-danger').fadeOut(300, function() {
                $toolbar.find('.btn-primary').fadeIn(300);
            });
        });
    };
    var newCustomApi = function() {
        $("#tbxApiAction").val("");
        $("#tbxApiVersion").val("");
        $("#tbxApiUrl").val("");
        $("#newCustomApiDialog").find('span.error').html("");
        $("#newCustomApiDialogTitle").text("{{trans("messages.MSG_NEW_CUSTOM_API")}}");
        $("#newCustomApiDialog").find('#saveCustomApi').attr('onclick','saveCustomApi("new")');
        $("#newCustomApiDialog").modal('show');
    };
    var updateCustomApi = function(index,customApiRowId) {

        var currentData = $("#gridCustomApi").bootstrapTable('getData');
        $("#tbxApiAction").val(currentData[index].api_action);
        $("#tbxApiVersion").val(currentData[index].api_version);
        $("#tbxApiUrl").val(currentData[index].api_url);
        $("#newCustomApiDialog").find('span.error').html("");
        $("#newCustomApiDialogTitle").text("{{trans("messages.MSG_EDIT_CUSTOM_API")}}");
        $("#newCustomApiDialog").find('#saveCustomApi').attr('onclick','saveCustomApi("edit",'+index+')');
        $("#newCustomApiDialog").modal('show');
    };
    var saveCustomApi = function(action,index) {    
        var apiAction = $("#tbxApiAction").val();
        var apiVersion = $("#tbxApiVersion").val();
        var apiUrl = $("#tbxApiUrl").val();
        var require = ['tbxApiAction','tbxApiVersion','tbxApiUrl'];
        var errors = new Array();
        errors = validRequired(errors, require);
        var currentData = $("#gridCustomApi").bootstrapTable('getData');
        $.merge(errors,validateDuplicateAPI(currentData, index, apiAction, apiVersion));
        $.each(errors,function(i, error){
            $('span[for='+error.field+']').html(error.msg);
        });

        if(errors.length > 0){
            return false;
        }
       
        if(action == "new"){
            var newCustomApi = new Object();
            newCustomApi.api_action  = apiAction;
            newCustomApi.api_version = apiVersion;
            newCustomApi.api_url = apiUrl;
            currentData.push(newCustomApi);  
        }else{ 
            currentData[index].api_action = apiAction;
            currentData[index].api_version = apiVersion;
            currentData[index].api_url = apiUrl;
        }
        $("#gridCustomApi").bootstrapTable('load', currentData);
        $("#newCustomApiDialog").modal('hide');
    };

    validateDuplicateAPI = function(currentData, index, apiAction, apiVersion){
        var errors = new Array();
        $.each(currentData,function(i,customApi){
            if(index != i && customApi.api_action == apiAction && customApi.api_version == apiVersion){
                var error = new Error;
                error.field = 'tbxApiVersion';
                error.msg = Messages.ERR_DUPLICATE_API_ACTION;
                errors.push(error);
            }
        });
        return errors;
    }
    /*--Custom API End--*/
   

    /*--Add User to App Start --*/
    $('.js-role-table').each(function(){
        if($(this).find(".cbxRole").not(":checked").length == 0){
            $(this).find('.cbxAllRole').prop('checked',true);
        }
    })
    var RoleTableSelectedAll = function (cbx) {
        var companyId = $(cbx).attr("data");
        if($(cbx).is(':checked')) {
            $("#RoleTable_" + companyId).find(".cbxRole").prop("checked",true);
        } else {
            $("#RoleTable_" + companyId).find(".cbxRole").prop("checked", false);
        }

    };

    var DeleteAppUser = function() {
            var selectedUsers = $("#gridUserList").bootstrapTable('getSelections');
            var $toolbar  =  $($("#gridUserList").data('toolbar'));
            var confirmStr = "";
            $.each(selectedUsers, function(i, user) {
                confirmStr += user.login_id + "<br/>";
            });
            showConfirmDialog("{{trans("messages.CONFIRM")}}", "{{trans("messages.MSG_CONFIRM_REMOVE_USER")}}", confirmStr, function () {
                hideConfirmDialog();
                var currentData = $("#gridUserList").bootstrapTable('getData');
                $.each(selectedUsers, function(i, user) {
                    for(var j = 0; j < currentData.length; j++) {
                        if(currentData[j].row_id == user.row_id) {
                            currentData.splice(j,1);
                            break;
                        }
                    }
                });
                $("#gridUserList").bootstrapTable('load', currentData);
                $toolbar.find('.btn-danger').fadeOut(300, function() {
                    $toolbar.find('.btn-primary').fadeIn(300);
                });
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
            newUser.state=false;
            var exist = false;
            $.each(currentData, function(j, cUser) {
                if(cUser.row_id == newUser.row_id) {
                    exist = true;
                    return false;
                }
            });
            if(!exist) {
                currentData.push(newUser);
            }
        });
        $("#gridUserList").bootstrapTable('load', currentData);
        $('#selectUserDialog').modal('hide');
    }
    /*--Add User to App End --*/
    
    /*-- Error Code Start--*/
    var deleteErrorCode = function(){
        $("#customApiErrorCode").remove();
        $("#btndDeleteErrorCodeFile").hide();
        $("#btnUplErrorCodeFile").show();
    }
    /*-- Error Code End--*/
    
    /*--Security Level Start--*/
    var showSecurityLevelHint = function(){
        $('#securityLevelHint').text( $("#ddlSecurityLevel option:selected").data('hint'));
    }

    $(function () {
       
        $("#ddlSecurityLevel > option").each(function() {
            if($(this).val() == {{$securityLevel}}){
                $(this).prop("selected", true);
            }
        });

        showSecurityLevelHint();
        $('#ddlSecurityLevel').change(function(){
            showSecurityLevelHint();
        });

         $('.cbxRole').change(function(){
           var selectRoleList = [$(this).attr('data')];
        })

        $('.cbxRole').change(function(){
           var selectRoleList = [$(this).attr('data')];
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
                $('#selUserRole').find('input[name=cbxRole]','input[name=cbxAllRole').prop('checked',false);
                var currentData = $("#gridUserList").bootstrapTable('getData');
                currentData.splice(0,currentData.length);
                $("#gridUserList").bootstrapTable('load', currentData);
                $('label[for=setAppUser]').remove();
            }else{
                 $('#selNormal').fadeOut('1500',function(){
                    $('#selNormal').find('input[name=chkCompany]').prop('checked',false);
                    $('#selUserRole').fadeIn('1500');
                }); 
                 $('label[for=chkCompany]').remove();
            }
        });

        $('body').on('click','.editCustomApi',function(e) {  
             $currentTarget = $(e.currentTarget);
             var index = $currentTarget.parent().parent().data('index');
             updateCustomApi(index, $currentTarget.data('rowid'));
        });
       
    });
</script>