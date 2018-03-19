<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Auth App 註冊JPush的驗證資訊
    |--------------------------------------------------------------------------
    |
    | APP_ID : 與JPush註冊的app key
    | SECRET_KEY : 與JPush註冊的 masterSecretKey
    |
    */

    'auth' => [
        'qplay'=>[
            'app_id'=>'e343504d536ebce16b70167e',
            'master_secret'=>'62f87cad6de67db6c968ba50'
        ],
        'qchat'=>[
            'app_id'=>'f1007b6d14755a1e17e74195',
            'master_secret'=>'1c33fd43b7c962ebaf14893a'
        ],
        'ens'=>[
            'app_id'=>'6e51cf3c174910d247ac76f3',
            'master_secret'=>'335a12f8b4b9d71c9d813e7d'
        ]
    ],
];
