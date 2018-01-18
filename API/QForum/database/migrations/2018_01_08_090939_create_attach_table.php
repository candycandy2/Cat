<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAttachTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('qp_attach', function (Blueprint $table) {
            $table->increments('row_id')->unique();
            $table->string('post_id',50);
            $table->integer('comment_id');
            $table->text('file_url');
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
        Schema::drop('qp_attach');
    }
}
