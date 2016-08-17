<!-----訊息區塊------>
@if(Session::has('errormsg') )
    <script>
        $(document).ready(function () {
            alert("{{Session::get('errormsg')}}");
            $('#errModal').modal('show');
        });

    </script>
@endif

