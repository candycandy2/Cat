<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBoardTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('qp_board', function (Blueprint $table) {
            $table->increments('row_id')->unique();
            $table->integer('board_type_id');
            $table->string('board_name', 200);
            $table->string('manager', 200);
            $table->string('public_type', 1)->default(3);
            $table->string('company', 250)->nullable()->default(NULL);
            $table->string('status',1)->default('Y');
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
        Schema::drop('qp_board');
    }
}
