<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCommentTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('qp_comment', function (Blueprint $table) {
            $table->increments('row_id')->unique();
            $table->string('post_id',50);
            $table->integer('sequence_id');
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
        Schema::drop('qp_comment');
    }
}
