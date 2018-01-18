<?php

return [

    /*
    |--------------------------------------------------------------------------
    | PDO Fetch Style
    |--------------------------------------------------------------------------
    |
    | By default, database results will be returned as instances of the PHP
    | stdClass object; however, you may desire to retrieve records in an
    | array format for simplicity. Here you can tweak the fetch style.
    |
    */

    'fetch' => PDO::FETCH_CLASS,

    /*
    |--------------------------------------------------------------------------
    | Default Database Connection Name
    |--------------------------------------------------------------------------
    |
    | Here you may specify which of the database connections below you wish
    | to use as your default connection for all database work. Of course
    | you may use many connections at once using the Database library.
    |
    */

    'default' => env('DB_CONNECTION', 'mysql_qstorage'),

    /*
    |--------------------------------------------------------------------------
    | Database Connections
    |--------------------------------------------------------------------------
    |
    | Here are each of the database connections setup for your application.
    | Of course, examples of configuring each database platform that is
    | supported by Laravel is shown below to make development simple.
    |
    |
    | All database work in Laravel is done through the PHP PDO facilities
    | so make sure you have the driver for your particular database of
    | choice installed on your machine before you begin development.
    |
    */

    'connections' => [
        'mysql_qplay' => [
            'driver' => 'mysql',
            'host' => env('DB_HOST_QPLAY', 'localhost'),
            'port' => env('DB_PORT_QPLAY', '3306'),
            'database' => env('DB_DATABASE_QPLAY', ''),
            'username' => env('DB_USERNAME_QPLAY', ''),
            'password' => env('DB_PASSWORD_QPLAY', ''),
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_general_ci',
            'prefix' => '',
            'strict' => false,
            'engine' => null,
        ],
        'mysql_qstorage' => [
            'driver' => 'mysql',
            'host' => env('DB_HOST_QSTORAGE', 'localhost'),
            'port' => env('DB_PORT_QSTORAGE', '3306'),
            'database' => env('DB_DATABASE_QSTORAGE', ''),
            'username' => env('DB_USERNAME_QSTORAGE', ''),
            'password' => env('DB_PASSWORD_QSTORAGE', ''),
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_general_ci',
            'prefix' => '',
            'strict' => false,
            'engine' => null,
        ],
        'mongodb_qstorage' => [
            'driver'   => 'mongodb',
            'host'     => env('MONGO_HOST_QSTORAGE'),
            'port'     => env('MONGO_PORT_QSTORAGE'),
            'database' => env('MONGO_DB_QSTORAGE'),
            'username' => env('MONGO_USERNAME_QSTORAGE'),
            'password' => env('MONGO_PWD_QSTORAGE'),
            'options' => [
                'database' => env('MONGO_AUTH_DB_QSTORAGE'), // sets the authentication database required by mongo 3
                'username' => env('MONGO_AUTH_USERNAME_QSTORAGE'),
                'password' => env('MONGO_AUTH_PWD_QSTORAGE'),
            ]
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Migration Repository Table
    |--------------------------------------------------------------------------
    |
    | This table keeps track of all the migrations that have already run for
    | your application. Using this information, we can determine which of
    | the migrations on disk haven't actually been run in the database.
    |
    */

    'migrations' => 'migrations',

    /*
    |--------------------------------------------------------------------------
    | Redis Databases
    |--------------------------------------------------------------------------
    |
    | Redis is an open source, fast, and advanced key-value store that also
    | provides a richer set of commands than a typical key-value systems
    | such as APC or Memcached. Laravel makes it easy to dig right in.
    |
    */

    'redis' => [

        'cluster' => false,

        'default' => [
            'host' => env('REDIS_HOST', 'localhost'),
            'password' => env('REDIS_PASSWORD', null),
            'port' => env('REDIS_PORT', 6379),
            'database' => 0,
        ],

    ],

];
