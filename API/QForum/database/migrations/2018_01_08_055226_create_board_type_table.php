<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBoardTypeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('qp_board_type', function (Blueprint $table) {
            $table->increments('row_id')->unique();
            $table->string('type_name', 50);
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
        Schema::drop('qp_board_type');
    }
}
