<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class QP_User extends Model
{   
    protected $connection = 'mysql_qplay';
    protected $table = 'qp_user';
    protected $primaryKey = 'row_id';

    /**
     * 取得表名稱
     * @return String
     */
    public function getTableName(){
        return $this->table;
    }
}
