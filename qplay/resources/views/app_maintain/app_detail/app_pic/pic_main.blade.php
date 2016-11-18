@include("layouts.lang")
<div class="row">
    <div class="col-lg-10 col-xs-12" id="app-icon">
        <form class="form-horizontal" id="iconForm">
             <div class="form-group">
                <label class="control-label col-sm-2">{{trans('messages.ICON')}} :</label>
                <div class="col-sm-10">
                    <div style="margin: 10px" class="text-muted">(512 * 512)</div>
                    <?= $src = ""?>
                    <div class="imgLi"
                        @if(!isset($appBasic[0]->icon_url) || $appBasic[0]->icon_url=="")
                            style="display:none"
                        @else
                            <?=$src = \App\lib\FilePath::getIconUrl(app('request')->input('app_row_id'),$appBasic[0]->icon_url);?>
                        @endif
                    >
                        <img class="icon-preview" data-url="{{$appBasic[0]->icon_url}}" src="{{$src}}">
                        <img src="css/images/close_red.png" class="delete img-circle" style="display:none" data-source="icon"/>
                    </div>
                 
                    <div class="iconUpload"
                        @if(isset($appBasic[0]->icon_url) && $appBasic[0]->icon_url!="")
                            style="display:none"
                        @endif
                    >
                        <div class="icon-upl-btn js-icon-file"><div>+</div><div>{{trans('messages.NEW_ICON')}}</div></div>
                        <input type="file" name="fileIconUpload" id="fileIconUpload" class="js-upl-overlap" style="display:none" accept=".jpeg,.jpg,.png">
                    </div>
                
                </div>
             </div>
        </form>
    </div>
</div>
<div class="row">
    <div class="col-lg-10 col-xs-12" id="app-screenShot">
         <form class="form-horizontal" id="screenShotForm"  enctype="multipart/form-data">
             <div class="form-group">
                <label class="control-label col-sm-2">{{trans('messages.SCREENSHOT')}} :</label>
                <div class="col-sm-10 js-lang-tool-bar">
                    <!--Language Tool-->
                    <div style="margin: 10px" class="text-muted">(768 * 1024)</div>
                    <div class="form-group">
                        <div class="col-sm-10">
                            <span class="label-hint" id="hintPic"></span>
                            <div class="btn-group js-switch-lang-btn">
                                <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">{{trans('messages.BTN_LANGUAGE')}}<span class="badge js-lang-count"  style="margin-left: 5px;padding: 2px 5px;" ></span><span class="caret" style="margin-left: 5px"></span></button>
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
                                        @foreach ($picData[$appData->lang_row_id]['android_screenshot'] as $picId => $pic)
                                        <?php $i ++ ?>
                                            <li class="imgLi" data-picid="{{$picId}}" data-url="{{$pic}}" data-lang="{{$appData->lang_row_id}}" data-device="android"><img src="{{ \App\lib\FilePath::getScreenShotUrl(app('request')->input('app_row_id'),$appData->lang_row_id,'android',$pic)}}" class="screen-preview"><img src="css/images/close_red.png" class="delete img-circle" style="display:none" data-source="screenshot"/>
                                            </li>
                                        @endforeach
                                    @endif
                                    <li class="screen-upl-btn js-screen-file" id="androidScreenUpl_{{$appData->lang_row_id}}" @if($i >= 5)  style="display:none"   @endif>
                                        <div>+</div>
                                        <div>{{trans('messages.NEW')}}<br>{{trans('messages.SCREENSHOT')}}</div>
                                        <input type="file" accept=".jpeg,.jpg,.png" name="androidScreenUpload_{{$appData->lang_row_id}}" id="androidScreenUpload_{{$appData->lang_row_id}}" class="js-upl-addition" style="display:none" multiple>
                                    </li>
                                </ul>
                                <ul class="form-group tab-pane fade sortable" id="tab_ios_{{$appData->lang_row_id}}">
                                    <?php $j = 0; ?>
                                     @if(isset($picData[$appData->lang_row_id]['ios_screenshot']))
                                        @foreach ($picData[$appData->lang_row_id]['ios_screenshot'] as $picId => $pic)
                                        <?php $j ++ ?>
                                         <li class="imgLi" data-picid="{{$picId}}"  data-url="{{$pic}}" data-lang="{{$appData->lang_row_id}}" data-device="ios"><img src="{{ \App\lib\FilePath::getScreenShotUrl(app('request')->input('app_row_id'),$appData->lang_row_id,'ios',$pic)}}" class="screen-preview"><img src="css/images/close_red.png" class="delete img-circle" style="display:none" data-source="screenshot"/>
                                         </li>
                                        @endforeach
                                    @endif  
                                    <li class="screen-upl-btn js-screen-file" @if($i >= 5)  style="display:none"   @endif id="iosScreenUpl_{{$appData->lang_row_id}}">
                                        <div>+</div>
                                        <div>{{trans('messages.NEW')}}<br>{{trans('messages.SCREENSHOT')}}</div>
                                        <input type="file" accept=".jpeg,.jpg,.png" name="iosScreenUpload_{{$appData->lang_row_id}}" id="iosScreenUpload_{{$appData->lang_row_id}}" class="js-upl-addition" style="display:none" multiple>
                                    </li>
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
        <li role="presentation" class="active"><a href="#tab_android_{langId}" data-toggle="tab">Android</a></li>
        <li role="presentation"><a href="#tab_ios_{langId}" data-toggle="tab">IOS</a></li>
    </ul>
    <div class="tab-content">
        <ul class="form-group tab-pane fade in active sortable" id="tab_android_{langId}">
            <li class="screen-upl-btn js-screen-file" id="androidScreenUpl_{langId}">
                <div>+</div>
                <div>{{trans('messages.NEW')}}<br>{{trans('messages.SCREENSHOT')}}</div>
                <input type="file" name="androidScreenUpload_{langId}" id="androidScreenUpload_{langId}" class="js-upl-addition" style="display:none" accept=".jpeg,.jpg,.png" multiple>
            </li>
        </ul>
        <ul class="form-group tab-pane fade sortable sortable" id="tab_ios_{langId}">
            <li class="screen-upl-btn js-screen-file" id="iosScreenUpl_{langId}">
                <div>+</div>
                <div>{{trans('messages.NEW')}}<br>{{trans('messages.SCREENSHOT')}}</div>
                <input type="file" name="iosScreenUpload_{langId}" id="iosScreenUpload_{langId}" class="js-upl-addition" style="display:none" multiple>
            </li>
        </ul>
    </div>
</div>
<!--Dymaic Div Content -->