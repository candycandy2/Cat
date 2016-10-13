@include("layouts.lang")
<div class="row">
    <div class="col-lg-10 col-xs-12" id="app-icon">
        <form class="form-horizontal" id="iconForm">
             <div class="form-group">
                <label class="control-label col-sm-2">大圖示 :</label>
                <div class="col-sm-10">
                 
                    <div class="imgLi"
                        @if(!isset($appBasic[0]->icon_url) || $appBasic[0]->icon_url=="")
                            style="display:none"
                        @endif
                    >
                        <img class="icon-preview" src="{{$appBasic[0]->icon_url}}">
                        <img src="css/images/close_red.png" class="delete img-circle" style="display:none" data-source="icon"/>
                    </div>
                 
                    <div class="iconUpload"
                        @if(isset($appBasic[0]->icon_url) && $appBasic[0]->icon_url!="")
                            style="display:none"
                        @endif
                    >
                        <div class="icon-upl-btn js-icon-file"><div>+</div><div>新增大圖示</div></div>
                        <input type="file" id="fileIconUpload" class="js-upl-overlap" style="display:none">
                    </div>
                
                </div>
             </div>
        </form>
    </div>
</div>
<div class="row">
    <div class="col-lg-10 col-xs-12" id="app-screenShot">
         <form class="form-horizontal" id="screenShotForm">
             <div class="form-group">
                <label class="control-label col-sm-2">螢幕擷取畫面 :</label>
                <div class="col-sm-10 js-lang-tool-bar">
                    <!--Language Tool-->
                    <div class="form-group">
                        <div class="col-sm-10">
                            <span class="label-hint" id="hintPic">繁體中文 zh-tw</span>
                            <div class="btn-group js-switch-lang-btn">
                                <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">語言<span class="badge js-lang-count"  style="margin-left: 5px;padding: 2px 5px;" ></span><span class="caret" style="margin-left: 5px"></span></button>
                                <ul class="dropdown-menu js-switchLang" role="menu"  data-source="hintPic" id="switchPicLang">
                            
                                @foreach ($appBasic as $appData)
                                <li class="js-switch-lang" id="ddlPicLang_{{$appData->lang_row_id}}" data-toggle="{{$appData->lang_row_id}}"><a href="#">{{$appData->lang_desc}} {{$appData->lang_code}}</a></li>
                                @endforeach
                            
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="pic-dymaic-content">
                        @foreach ($appBasic as $appData)
                        <div class="lang js-lang-{{$appData->lang_row_id}}">
                            <ul class="nav nav-tabs">
                                <li role="presentation" class="active"><a href="#tab_android_{{$appData->lang_row_id}}" data-toggle="tab">Android</a></li>
                                <li role="presentation"><a href="#tab_ios_{{$appData->lang_row_id}}" data-toggle="tab">IOS</a></li>
                            </ul>
                            <div class="tab-content">
                                <ul class="form-group tab-pane fade in active sortable" id="tab_android_{{$appData->lang_row_id}}">
                                    
                                    <?php $i = 0; ?>
                                    @if(isset($picData[$appData->lang_row_id]['android_screenshot']))
                                        @foreach ($picData[$appData->lang_row_id]['android_screenshot'] as  $pic)
                                        <?php $i ++ ?>
                                            <li class="imgLi"><img src="{{$pic}}" class="screen-preview js-screen-file"><img src="css/images/close_red.png" class="delete img-circle" style="display:none" data-source="screenshot"/></li>
                                        @endforeach
                                    @endif
                                    @if($i < 5)
                                        <li class="screen-upl-btn js-screen-file" id="androidScreenUpl_{{$appData->lang_row_id}}">
                                            <div>+</div>
                                            <div>新增<br>螢幕擷取畫面</div>
                                            <input type="file" id="fileScreenUpload_{{$appData->lang_row_id}}" class="js-upl-addition" style="display:none" >
                                        </li>
                                    @endif
                                </ul>
                                <ul class="form-group tab-pane fade sortable" id="tab_ios_{{$appData->lang_row_id}}">
                                    <?php $j = 0; ?>
                                     @if(isset($picData[$appData->lang_row_id]['ios_screenshot']))
                                        @foreach ($picData[$appData->lang_row_id]['ios_screenshot'] as  $pic)
                                        <?php $j ++ ?>
                                         <li class="imgLi"><img src="{{$pic}}" class="screen-preview"><img src="css/images/close_red.png" class="delete img-circle" style="display:none" data-source="screenshot"/></li>
                                        @endforeach
                                    @endif  
                                    @if($j < 5)  
                                    <li class="screen-upl-btn js-screen-file" id="iosScreenUpl_{{$appData->lang_row_id}}">
                                        <div>+</div>
                                        <div>新增<br>螢幕擷取畫面</div>
                                        <input type="file" id="fileScreenUpload_{{$appData->lang_row_id}}" class="js-upl-addition" style="display:none">
                                    </li>
                                    @endif
                                </ul>
                            </div>
                        </div>
                        @endforeach
                    </div>
                </div>
             </div>
        </form>
    </div>
</div>

<!--Dymaic Div Content -->
<div id="picDymaicContent" style="display: none">
    <ul class="nav nav-tabs">
        <li role="presentation" class="active"><a href="#tab_android" data-toggle="tab">Android</a></li>
        <li role="presentation"><a href="#tab_ios" data-toggle="tab">IOS</a></li>
    </ul>
    <div class="tab-content">
        <div class="tab-pane fade in active" id="tab_android">
            <div class="screen-upl-btn js-img-file">
                <div>+</div>
                <div>新增<br>螢幕擷取畫面</div>
            </div>
        </div>
        <div class="tab-pane fade" id="tab_ios">
            <div class="screen-upl-btn js-img-file">
                <div>+</div>
                <div>新增<br>螢幕擷取畫面</div>
            </div>
        </div>
    </div>
</div>
<!--Dymaic Div Content -->