@include("layouts.lang")
<div class="row">
    <div class="col-lg-8 col-xs-12" id="app-icon">
        <form class="form-horizontal" id="iconForm">
             <div class="form-group">
                <label class="control-label col-sm-2">大圖示 :</label>
                <div class="col-sm-10">
                    <div class="icon-preview js-img-file"><div>+</div><div>新增大圖示</div>
                    </div>
                    <input type="file" id="fileIconUpload" style="display:none">
                </div>
             </div>
        </form>
    </div>
</div>
<div class="row">
    <div class="col-lg-8 col-xs-12" id="app-screenShot">
         <form class="form-horizontal" id="screenShotForm">
             <div class="form-group">
                <label class="control-label col-sm-2">螢幕擷取畫面 :</label>
                <div class="col-sm-10">
                    <!--Language Tool-->
                    <div class="form-group">
                        <div class="col-sm-10">
                            <span class="label-hint" id="hintPic">繁體中文 zh-tw</span>
                            <div class="btn-group">
                                <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" >語言<span class="badge"  style="margin-left: 5px;padding: 2px 5px;">3</span><span class="caret" style="margin-left: 5px"></span></button>
                                <ul class="dropdown-menu" role="menu" data-source="hintPic">
                                    <li class="js-switch-lang" data-toggle="1"><a href="#">English en-us</a></li>
                                    <li class="js-switch-lang" data-toggle="2"><a href="#">簡體中文 zh-cn</a></li>
                                    <li class="js-switch-lang" data-toggle="3"><a href="#">繁體中文 zh-tw</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <ul class="nav nav-tabs">
                        <li role="presentation" class="active"><a href="#tab_android" data-toggle="tab">Android</a></li>
                        <li role="presentation"><a href="#tab_ios" data-toggle="tab">IOS</a></li>
                    </ul>
                    <div class="tab-content">
                        <div class="tab-pane fade in active" id="tab_android">
                            <div class="screen-preview js-img-file">
                                <div>+</div>
                                <div>新增<br>螢幕擷取畫面</div>
                            </div>
                        </div>
                        <div class="tab-pane fade" id="tab_ios">
                            <div class="screen-preview js-img-file">
                                <div>+</div>
                                <div>新增<br>螢幕擷取畫面</div>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
        </form>
    </div>
</div>
