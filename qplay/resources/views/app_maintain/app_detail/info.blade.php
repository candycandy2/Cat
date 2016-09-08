<div class="row">
    <div class="col-lg-8 col-xs-12" id="app-mainInfo">
        <form class="form-horizontal" id="MainInfoForm">
            <div class="form-group">
                <label class="control-label col-sm-2"></label>
                <div class="col-sm-10">
                    <span class="label-hint" id="hintInfo">繁體中文 zh-tw</span>
                    <div class="btn-group">
                        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">語言<span class="badge"  style="margin-left: 5px;padding: 2px 5px;">3</span><span class="caret" style="margin-left: 5px"></span></button>
                        <ul class="dropdown-menu" role="menu"  data-source="hintInfo">
                            <li class="js-switch-lang" data-toggle="1"><a href="#">English en-us</a></li>
                            <li class="js-switch-lang" data-toggle="2"><a href="#">簡體中文 zh-cn</a></li>
                            <li class="js-switch-lang" data-toggle="3"><a href="#">繁體中文 zh-tw</a></li>
                        </ul>
                    </div>
                    <div class="btn-group">
                        <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
                        管理語言 <span class="caret"></span></button>
                        <ul class="dropdown-menu" role="menu">
                            <li><a href="#" onclick="addLang()">新增語言</a></li>
                            <li><a href="#" onclick="delLang()">移除語言</a></li>
                            <li><a href="#" onclick="changDefaultLang()">變更預設語言</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-2" for="appKey">App Key</label>
                <div class="col-sm-10">
                    <select name="ddlAppKey" id="ddlAppKey" class="form-control" onchange="">
                        <option value="1">qplay</option>
                        <option value="2">YellowPage</option>
                        <option value="3">RRS</option>
                    </select>
                </div>
            </div>
            
            <div class="form-group lang js-lang-1">
                <label class="control-label col-sm-2" for="">App Name(en-us)</label>
                <div class="col-sm-10"> 
                    <input type="text" class="form-control" id="" placeholder="Enter app name">
                </div>
            </div>
            <div class="form-group lang js-lang-1">
                <label class="control-label col-sm-2" for="">App 描述(en-us)</label>
                <div class="col-sm-10"> 
                    <input type="text" class="form-control" id="" placeholder="Enter app description">
                </div>
            </div>

            <div class="form-group lang js-lang-2">
                <label class="control-label col-sm-2" for="">App Name(zh-cn)</label>
                <div class="col-sm-10"> 
                    <input type="text" class="form-control" id="" placeholder="Enter nter app name">
                </div>
            </div>
            <div class="form-group lang js-lang-2">
                <label class="control-label col-sm-2" for="">App 描述(zh-cn)</label>
                <div class="col-sm-10"> 
                    <input type="text" class="form-control" id="" placeholder="Enter app description">
                </div>
            </div>

            <div class="form-group lang js-lang-3">
                <label class="control-label col-sm-2" for="">App Name(zh-tw)</label>
                <div class="col-sm-10"> 
                    <input type="text" class="form-control" id="" placeholder="Enter nter app name">
                </div>
            </div>
            <div class="form-group lang js-lang-3">
                <label class="control-label col-sm-2" for="">App 描述(zh-tw)</label>
                <div class="col-sm-10"> 
                    <input type="text" class="form-control" id="" placeholder="Enter app description">
                </div>
            </div>

            
        </form>
    </div>
</div>
<hr class="primary" style="border-top: 1px solid #bbb1b1;">
<div class="row">
    <div class="col-lg-8 col-xs-12" id="app-apiInfo">
        <label class="control-label col-sm-2" for="pwd">Api 資訊</label>
        <div class="col-sm-10"> 
            <label>API</label>
            <div id="toolbarNewAppi">
                <button type="button" class="btn btn-primary" onclick="newApi()">新增API</button>
            </div>

            <table id="gridApiList" class="bootstrapTable" data-toggle="table" data-sort-name="row_id" data-toolbar="#toolbarNewAppi"
                   data-url="platform/getParameterList" data-height="398" data-pagination="true"
                   data-show-refresh="true" data-row-style="rowStyle" data-search="true"
                   data-show-toggle="true"  data-sortable="true"
                   data-striped="true" data-page-size="10" data-page-list="[5,10,20]"
                   data-click-to-select="false" data-single-select="false">
                <thead>
                <tr>
                    <th data-field="state" data-checkbox="true"></th>
                    <th data-field="row_id" data-sortable="true" data-visible="false">ID</th>
                     <th data-field="api_url" data-sortable="false">Api Action</th>
                    <th data-field="api_version" data-sortable="false">Api Version</th>
                    <th data-field="api_url" data-sortable="false">Api Url</th>
                </tr>
                </thead>
            </table>
          </div>
          <label class="control-label col-sm-2" for="pwd"></label>
          <div class="col-sm-10">
          <label>錯誤代碼</label>  
            <div id="toolbarNewErrorCode">
                <div class="form-group">
                    <span class="btn btn-primary btn-file">
                        新增錯誤代碼 <input type="file" id="file">
                    </span>
                </div>
                <div class="form-group">
                    <table  id="gridApiList" class="costum-table">
                        <tr>
                            <td width="36px"></td>
                            <td>目前錯誤代碼</td>
                        </tr>
                        <tr>
                            <td>
                            <label>
                                <input type="checkbox" name="">
                            </label>
                            </td>
                            <td></td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
<hr class="primary" style="border-top: 1px solid #bbb1b1;">
<div class="row">
    <div class="col-lg-8 col-xs-12" id="app-categoryInfo">
        <form class="form-horizontal" id="categoryInfoForm">
            <div class="form-group">
                <label class="control-label col-sm-2" for="email">應用程式分類</label>
                <div class="col-sm-10">
                    <select name="ddlAppCategory" class="form-control" id="ddlAppCategory" onchange="">
                        <option value="1">Common</option>
                        <option value="2">ERM</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-2" for="pwd">安全級別</label>
                <div class="col-sm-10"> 
                    <select name="ddlAKey" class="form-control" id="ddlAppKey" onchange="">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3" selected>3</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-2" for="pwd">App 描述</label>
                <div class="col-sm-10">
                    <div class="table-responsive">
                      <table class="table table-bordered">
                        <tr>
                            <td rowspan="3" class="bg-gray-light col-lg-4 col-xs-4" style="text-align: center;border:1px solid #ddd;vertical-align: middle;background-color:#f9edf7"">
                                <label>
                                    <input type="checkbox" data=""></input>
                                    BenQ
                                </label>
                            </td>
                            <td>
                                <label>
                                    <input type="checkbox" id="checkboxSuccess" value="option1">
                                    CEO
                                </label>
                            </td>
                            <td>
                                <label>
                                    <input type="checkbox" id="checkboxSuccess" value="option1">
                                    Finance
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>
                                    <input type="checkbox" id="checkboxSuccess" value="option1">
                                    HR
                                </label>
                            </td>
                            <td>
                                <label>
                                    <input type="checkbox" id="checkboxSuccess" value="option1">
                                    ITS
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>
                                    <input type="checkbox" id="checkboxSuccess" value="option1">
                                    Others
                                </label>
                            </td>
                            <td>
                                <label>
                                    <input type="checkbox" id="checkboxSuccess" value="option1">
                                    salse
                                </label>
                            </td>
                        </tr>
                      </table>

                      <table class="table table-bordered">
                        <tr>
                            <td rowspan="3" class="bg-gray-light col-lg-4 col-xs-4" style="text-align: center;border:1px solid #ddd;vertical-align: middle;background-color:#d9edf7">
                                <label>
                                    <input type="checkbox" id="checkboxSuccess" value="option1">
                                    Qisda
                                </label>
                            </td>
                            <td>
                                <label>
                                    <input type="checkbox" id="checkboxSuccess" value="option1">
                                    administrator
                                </label>
                            </td>
                            <td>
                                <label>
                                    <input type="checkbox" id="checkboxSuccess" value="option1">
                                    AIC0 RD
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>
                                    <input type="checkbox" id="checkboxSuccess" value="option1">
                                    CEO
                                </label>
                            </td>
                            <td>
                                <label>
                                    <input type="checkbox" id="checkboxSuccess" value="option1">
                                    Finance
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label>
                                    <input type="checkbox" id="checkboxSuccess" value="option1">
                                    ITS
                                </label>
                            </td>
                            <td>
                                <label>
                                    <input type="checkbox" id="checkboxSuccess" value="option1">
                                    Others
                                </label>
                            </td>
                        </tr>
                      </table>
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>

@section('dialog_content')
    <div id="addLangDialog" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h1 class="modal-title" id="addLangDialogTitle">新增語言</h1>
                </div>
                 <div class="modal-body">
                    <div class="radio">
                      <label>
                        <input type="radio" name="optionsRadios" id="optionsRadios1" value="option1" checked>
                        英文 en-us
                      </label>
                    </div>
                    <div class="radio">
                      <label>
                        <input type="radio" name="optionsRadios" id="optionsRadios2" value="option2">
                         繁體中文 zh-tw
                      </label>
                    </div>
                    <div class="radio">
                      <label>
                        <input type="radio" name="optionsRadios" id="optionsRadios3" value="option3" >
                         簡體中文 zh-ch
                      </label>
                    </div>
                    <div class="radio">
                      <label>
                        <input type="radio" name="optionsRadios" id="optionsRadios3" value="option4" >
                        泰文 XX-XX
                      </label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button"  class="btn btn-danger" onclick="">{{trans("messages.SAVE")}}</button>
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
                 <div class="modal-body">
                    <div class="checkbox">
                      <label>
                        <input type="checkbox" id="" value="option1">
                         英文 en-us
                      </label>
                    </div>
                    <div class="checkbox">
                      <label>
                        <input type="checkbox" id="" value="option1">
                        繁體中文 zh-tw
                      </label>
                    </div>
                    <div class="checkbox">
                      <label>
                        <input type="checkbox" id="" value="option1">
                        簡體中文 zh-ch
                      </label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button"  class="btn btn-danger" onclick="">{{trans("messages.SAVE")}}</button>
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
                 <div class="modal-body">
                    <div class="radio">
                      <label>
                        <input type="radio" name="optionsRadios" id="optionsRadios1" value="option1" checked>
                        英文 en-us
                      </label>
                    </div>
                    <div class="radio">
                      <label>
                        <input type="radio" name="optionsRadios" id="optionsRadios2" value="option2">
                         繁體中文 zh-tw
                      </label>
                    </div>
                    <div class="radio">
                      <label>
                        <input type="radio" name="optionsRadios" id="optionsRadios3" value="option3" >
                         簡體中文 zh-ch
                      </label>
                    </div>
                    <div class="radio">
                      <label>
                        <input type="radio" name="optionsRadios" id="optionsRadios3" value="option4" >
                        泰文 XX-XX
                      </label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button"  class="btn btn-danger" onclick="">{{trans("messages.SAVE")}}</button>
                    <button type="button"  class="btn btn-primary" data-dismiss="modal">{{trans("messages.CLOSE")}}</button>
                </div>
            </div>
        </div>
    </div>

    <div id="newApiDialog" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h1 class="modal-title" id="newApiDialogTitle">新增API</h1>
                </div>
                 <div class="modal-body">
                    <table>
                        <tr>
                            <td>Api Action:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" name="tbxApiAction"
                                       id="tbxApiAction" value=""/>
                            </td>
                        </tr>
                        <tr>
                            <td>Api Version:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" name="tbxApiVersion"
                                       id="tbxApiVersion" value=""/>
                            </td>
                        </tr>
                         <tr>
                            <td>Api Url:</td>
                            <td style="padding: 10px;">
                                <input type="text" data-clear-btn="true" name="tbxApiVersion"
                                       id="tbxApiVersion" value=""/>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="modal-footer">
                    <button type="button"  class="btn btn-danger" onclick="">{{trans("messages.SAVE")}}</button>
                    <button type="button"  class="btn btn-primary" data-dismiss="modal">{{trans("messages.CLOSE")}}</button>
                </div>
            </div>
        </div>
    </div>
@endsection
