<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QP_Comment extends Model
{
    protected $connection = 'mysql_qplay';
    protected $table = 'qp_comment';
    protected $primaryKey = 'row_id';

    /**
    * 取得此回應的貼文
    */
    public function post()
    {
        return $this->belongsTo('App\Models\QP_Post', 'post_id');
    }
}
