@extends('testapp')

@section('content')
    <?php
    $csrf_token = csrf_token();
            ?>

    <input type="hidden" name="_token" value="{{$csrf_token}}">

    <input type="button" value="QueryEmployeeData" onclick="QueryEmployeeData()">
    <input type="button" value="QueryEmployeeDataDetail" onclick="QueryEmployeeDataDetail()">
    <input type="button" value="AddMyPhoneBook" onclick="AddMyPhoneBook()">
    <input type="button" value="DeleteMyPhoneBook" onclick="DeleteMyPhoneBook()">
    <input type="button" value="QueryMyPhoneBook" onclick="QueryMyPhoneBook()">
    <input type="button" value="QueryCompanyData" onclick="QueryCompanyData()">

    <div id="resultContent"></div>

    <script>
        var sectoryKey = 'swexuc453refebraXecujeruBraqAc4e';

        var QueryEmployeeData = function () {
            var param = "<LayoutHeader><Company>Qisda</Company><Name_CH></Name_CH><Name_EN>Steven</Name_EN><DeptCode></DeptCode><Ext_No></Ext_No></LayoutHeader>";
            $.ajax({
                url: "v101/yellowpage/QueryEmployeeData?lang=en-us&uuid=chaosTest",
                type: "POST",
                contentType: "application/json",
                data:param,
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "yellowpage");
                    request.setRequestHeader("signature", "Moses824");
                    request.setRequestHeader("signature-time", "1000000000");
                    request.setRequestHeader("token", "57a93c3dbee41");
                },
                success: function (d, status, xhr) {
                    alert(d.ResultCode + "-" + d.Message);
                    var h = "";
                    $.each(d.Content, function(i, item) {
                        h += "Company: " + item.Company + "<br />";
                        h += "Ext_No: " + item.Ext_No + "<br />";
                        h += "Name_CH: " + item.Name_CH + "<br />";
                        h += "Name_EN: " + item.Name_EN + "<br /><br /><br /><br />";
                    });
                    $("#resultContent").html(h);
                },
                error: function (e) {
                    alert(e.responseText);
                    //alert(d.ResultCode + "-" + d.Message);
                }
            });
        };

        var QueryEmployeeDataDetail = function() {
            var param = "<LayoutHeader><Companny>Qisda</Companny><Name_EN>Steven</Name_EN></LayoutHeader>";
            $.ajax({
                url: "v101/yellowpage/QueryEmployeeDataDetail?lang=en-us&uuid=chaosTest",
                type: "POST",
                contentType: "application/json",
                data:param,
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "yellowpage");
                    request.setRequestHeader("signature", "Moses824");
                    request.setRequestHeader("signature-time", "1000000000");
                    request.setRequestHeader("token", "57a93c3dbee41");
                },
                success: function (d, status, xhr) {
                    alert(d.ResultCode + "-" + d.Message);
                },
                error: function (e) {
                    alert(e);
                }
            });
        };

        var AddMyPhoneBook = function () {
            var param = "<LayoutHeader><User_EmpID>0407731</User_EmpID><Add_EmpID>1207952</Add_EmpID><Add_Company>BenQ</Add_Company></LayoutHeader>";
            $.ajax({
                url: "v101/yellowpage/AddMyPhoneBook?lang=en-us&uuid=chaosTest",
                type: "POST",
                contentType: "application/json",
                data:param,
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "yellowpage");
                    request.setRequestHeader("signature", "Moses824");
                    request.setRequestHeader("signature-time", "1000000000");
                    request.setRequestHeader("token", "57a93c3dbee41");
                },
                success: function (d, status, xhr) {
                    alert(d.ResultCode + "-" + d.Message);
                },
                error: function (e) {
                    alert(e);
                }
            });
        };

        var DeleteMyPhoneBook = function () {
            var param = "<LayoutHeader><User_EmpID>0407731</User_EmpID><Delete_EmpID>1207952</Delete_EmpID><Delete_Company>BenQ</Delete_Company></LayoutHeader>";
            $.ajax({
                url: "v101/yellowpage/DeleteMyPhoneBook?lang=en-us&uuid=chaosTest",
                type: "POST",
                contentType: "application/json",
                data:param,
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "yellowpage");
                    request.setRequestHeader("signature", "Moses824");
                    request.setRequestHeader("signature-time", "1000000000");
                    request.setRequestHeader("token", "57a93c3dbee41");
                },
                success: function (d, status, xhr) {
                    alert(d.ResultCode + "-" + d.Message);
                },
                error: function (e) {
                    alert(e);
                }
            });
        };

        var QueryMyPhoneBook = function () {
            var param = "<LayoutHeader><User_EmpID>0407731</User_EmpID></LayoutHeader>";
            $.ajax({
                url: "v101/yellowpage/QueryMyPhoneBook?lang=en-us&uuid=chaosTest",
                type: "POST",
                contentType: "application/json",
                data:param,
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "yellowpage");
                    request.setRequestHeader("signature", "Moses824");
                    request.setRequestHeader("signature-time", "1000000000");
                    request.setRequestHeader("token", "57a93c3dbee41");
                },
                success: function (d, status, xhr) {
                    alert(d.ResultCode + "-" + d.Message);
                },
                error: function (e) {
                    alert(e);
                }
            });
        };

        var QueryCompanyData = function () {
            var param = "<LayoutHeader><User_EmpID>0407731</User_EmpID></LayoutHeader>";
            $.ajax({
                url: "v101/yellowpage/QueryCompanyData?lang=en-us&uuid=chaosTest",
                type: "POST",
                contentType: "application/json",
                data:param,
                beforeSend:function (request) {
                    request.setRequestHeader("app-key", "yellowpage");
                    request.setRequestHeader("signature", "Moses824");
                    request.setRequestHeader("signature-time", "1000000000");
                    request.setRequestHeader("token", "57a93c3dbee41");
                },
                success: function (d, status, xhr) {
                    alert(d.ResultCode + "-" + d.Message);
                },
                error: function (e) {
                    alert(e);
                }
            });
        };
    </script>
@endsection


