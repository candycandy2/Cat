<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePostTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('qp_post', function (Blueprint $table) {
            $table->string('row_id',50)->unique();
            $table->string('ref_id', 50);
            $table->integer('board_id');
            $table->string('post_title', 250);
            $table->string('from_id', 250);
            $table->mediumText('content');
            $table->bigInteger('ctime');
            $table->string('status',1)->default('Y');
            $table->integer('created_user')->nullable()->default(NULL);
            $table->integer('updated_user')->nullable()->default(NULL);
            $table->softDeletes();
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
        Schema::drop('qp_post');
    }
}
