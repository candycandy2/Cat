<!-----訊息區塊------>
@if(Session::has('errormsg') )
    <script>
        $(document).ready(function () {
            showMessageDialog("{{trans("messages.MESSAGE")}}", "{{Session::get('errormsg')}}", "");
        });

    </script>
@endif

