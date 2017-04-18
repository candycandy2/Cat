<div id="messageDialog" class="modal fade">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h1 class="modal-title" id="messageDialogTitle"></h1>
            </div>
            <div class="modal-body">
                <p id="messageDialogContent"></p>
                <p class="text-danger"><small id="messageDialogWarningContent"></small></p>
            </div>
            <div class="modal-footer">
                <button type="button"  class="btn btn-primary" data-dismiss="modal" data-dismiss="modal" id="confirmBtn">確定</button>
            </div>
        </div>
    </div>
</div>
<script>
    var hideMessageDialog = function() {
        $("#messageDialog").modal('hide');
    };

    var showMessageDialog = function (title, content, warning, needReload) {
        $("#messageDialogTitle").text("");
        $("#messageDialogContent").html("");
        $("#messageDialogWarningContent").html("");
        if(title) {
            $("#messageDialogTitle").text(title);
        }

        if(content) {
            $("#messageDialogContent").html(content);
        }

        if(warning) {
            $("#messageDialogWarningContent").html(warning);
        }

        $("#messageDialog").modal('show');
        
        if(needReload){
            $("#confirmBtn").on( "click", function() {
              location.reload();
            });

        }

    };

</script>