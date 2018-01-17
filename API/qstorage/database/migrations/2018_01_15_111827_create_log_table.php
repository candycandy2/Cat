<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLogTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
         Schema::create('qs_api_log', function (Blueprint $table) {
            $table->increments('row_id')->unique();
            $table->integer('user_row_id')->default(0);
            $table->string('app_key', 50)->default(0);
            $table->string('api_version', 50)->default('v101');
            $table->string('action', 50);
            $table->string('latitude', 50)->default(NULL);
            $table->string('longitude', 50)->default(NULL);
            $table->string('ip', 50);
            $table->string('country', 50)->default(NULL);
            $table->string('city', 50)->default(NULL);
            $table->string('url_parameter', 500);
            $table->text('request_header');
            $table->mediumtext('request_body')->default(NULL);
            $table->text('response_header')->default(NULL);  
            $table->mediumtext('response_body')->default(NULL);  
            $table->integer('signature_time');
            $table->float('operation_time');
            $table->timestamp('created_at')->default('0000-00-00 00:00:00');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('qs_api_log');
    }
}
