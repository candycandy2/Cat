<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSubscribePostUserTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('qp_subscribe_post_user', function (Blueprint $table) {
            $table->increments('row_id')->unique();
            $table->string('post_id',50);
            $table->string('emp_no', 50);
            $table->integer('created_user')->nullable()->default(NULL);
            $table->integer('updated_user')->nullable()->default(NULL);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('qp_subscribe_post_user');
    }
}
