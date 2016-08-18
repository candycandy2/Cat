@include("layouts.lang")
<?php
$menu_name = "USER_ACCOUNT_MAINTAIN";
?>
@extends('layouts.admin_template')
@section('content')
    <table id="gridUserList" data-toggle="table" data-sort-name="row_id"
           data-url="platform/getUserList" data-height="398" data-pagination="true"
           data-show-refresh="true" data-row-style="rowStyle" data-search="true"
           data-show-toggle="true" data-show-columns="true" data-sortable="true"
           data-striped="true">
        <thead>
        <tr>
            <th data-field="row_id" data-sortable="true">ID</th>
            <th data-field="login_id" data-sortable="true">Login ID</th>
            <th data-field="emp_no" data-sortable="true">Emp No</th>
            <th data-field="emp_name" data-sortable="true">Emp Name</th>
            <th data-field="email" data-sortable="true">Email</th>
            <th data-field="user_domain" data-sortable="true">Domain</th>
            <th data-field="company" data-sortable="true">Company</th>
            <th data-field="department" data-sortable="true">Department</th>
        </tr>
        </thead>
    </table>

    <script src="{{ asset('/plugins/jQuery/jquery-2.2.3.min.js') }}"></script>
    <script src="{{ asset('/bootstrap/js/bootstrap.min.js') }}"></script>
    <script src="{{ asset('/bootstrap/js/bootstrap-table.js') }}"></script>
    <script>
//        $(function () {
//            $('#gridUserList').bootstrapTable('refresh',{url:'/platform/getUserList'});
//        });
    </script>
@endsection

