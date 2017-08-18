<?php

namespace App\Model;

use Illuminate\Database\Eloquent\Model;

class QM_History_File extends Model
{   
    protected $connection = 'mysql_qmessage';
    protected $table = 'qm_history_file';
    protected $primaryKey = 'row_id';
}