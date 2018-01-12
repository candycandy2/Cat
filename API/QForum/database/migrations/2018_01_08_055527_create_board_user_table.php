<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBoardUserTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('qp_board_user', function (Blueprint $table) {
            $table->increments('row_id')->unique();
            $table->integer('board_id');
            $table->string('emp_no', 50);
            $table->integer('created_user')->default(NULL);
            $table->integer('updated_user')->default(NULL);
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
        Schema::drop('qp_board_user');
    }
}
