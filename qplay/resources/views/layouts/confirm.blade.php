<div id="confirmDialog" class="modal fade">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h1 class="modal-title" id="confirmDialogTitle"></h1>
            </div>
            <div class="modal-body">
                <p id="confirmDialogContent"></p>
                <p class="text-warning"><small id="confirmDialogWarningContent"></small></p>
            </div>
            <div class="modal-footer">
                <button type="button" id="btnConfirmDialogConfirm" class="btn btn-danger" >{{trans("messages.CONFIRM")}}</button>
                <button type="button"  class="btn btn-primary" data-dismiss="modal" data-dismiss="modal">{{trans("messages.CANCEL")}}</button>
            </div>
        </div>
    </div>
</div>
<script>
    var hideConfirmDialog = function () {
        $("#confirmDialog").modal('hide');
    };

    var showConfirmDialog = function (title, content, warning, confirmFunction) {
        if(title) {
            $("#confirmDialogTitle").text(title);
        }

        if(content) {
            $("#confirmDialogContent").html(content);
        }

        if(warning) {
            $("#confirmDialogWarningContent").text(warning);
        }

        $("#btnConfirmDialogConfirm").unbind();
        $("#btnConfirmDialogConfirm").one('click', confirmFunction);

        $("#confirmDialog").modal('show');
    }
</script>