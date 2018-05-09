<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDeleteEvaluationCalculateAvgScoreTrigger extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        DB::unprepared("
            CREATE TRIGGER delete_evaluation_calculate_avg_score
            AFTER DELETE ON `qp_app_evaluation` 
            FOR EACH ROW 
            BEGIN
                IF (OLD.device_type = 'ios') THEN
                    UPDATE `qp_app_head`
                    SET avg_score_ios = (SELECT AVG(score) FROM `qp_app_evaluation`
                             WHERE `app_row_id` = OLD.app_row_id
                             AND `device_type` = 'ios')
                    WHERE row_id = OLD.app_row_id;
                ELSE
                    UPDATE `qp_app_head`
                    SET avg_score_android = (SELECT AVG(score) FROM `qp_app_evaluation`
                             WHERE `app_row_id` = OLD.app_row_id
                             AND `device_type`= 'android')
                    WHERE row_id = OLD.app_row_id;
                END IF;
            END;
        ");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
