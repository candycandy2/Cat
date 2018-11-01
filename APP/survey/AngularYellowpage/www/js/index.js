/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        
    }
};

app.initialize();

var yellowPageApp = angular.module('yellowPage', []);

//配置config——变量
yellowPageApp.config(function($provide) {
    $provide.value('token', '5bd6a1677793d');
    $provide.value('pushToken', '140fe1da9e96bb6c81a');
    $provide.value('uuid', '140fe1da9e96bb6c81a');
    $provide.value('appKey', 'appyellowpagedev');
    $provide.value('appSercetKey', 'c103dd9568f8493187e02d4680e1bf2f');
})

//获取当前时间戳以及sercetKey加密
yellowPageApp.service('encTimeStamp', function(appSercetKey) {
    this.getTimeStamp = function() {
        return Math.round(new Date().getTime() / 1000).toString();
    }

    this.getSercetKey = function() {
        var hash = CryptoJS.HmacSHA256(this.getTimeStamp(), appSercetKey);
        return CryptoJS.enc.Base64.stringify(hash);
    }
});

//控制器
yellowPageApp.controller('queryEmp', function($scope, $http, encTimeStamp, appKey, uuid, token) {
    //初始值
    $scope.company = 'All Company';
    $scope.cnName = '';
    $scope.enName = '';
    $scope.dept = '';
    $scope.tel = '';
    
    //click event
    $scope.checkEmp = function() {

        //query data
        var queryData = '<LayoutHeader><Company>' + $scope.company + '</Company><Name_CH></Name_CH>' + $scope.cnName + '<Name_EN>' +
            $scope.enName + '</Name_EN><DeptCode>' + $scope.dept + '</DeptCode><Ext_No>' + $scope.tel + '</Ext_No></LayoutHeader>';

        //$http
        $http({
            method: 'POST',
            url: 'https://qplaydev.benq.com/qplayApi/public/v101/custom/'+appKey+'/QueryEmployeeData?lang=zh-cn&uuid='+uuid,
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'App-Key': appKey,
                'Signature-Time': encTimeStamp.getTimeStamp(),
                'Signature': encTimeStamp.getSercetKey(),
                'token': token
            },
            dataType: "json",
            data: queryData,
            async: true,
            cache: false,
            timeout: 30000
        }).then(function success(data) {
            console.log(data);

        }, function error() {});

        // $http.get('https://qplaydev.benq.com/widget/string/zh-cn.json').then(function success(data) {
        //     console.log(data)
        // }, function error() {});
    }
});