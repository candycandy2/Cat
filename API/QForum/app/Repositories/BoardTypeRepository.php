<?php

namespace App\Repositories;

use App\Models\QP_Board_type;

class BoardTypeRepository
{

    protected $boardType;

    public function __construct(QP_Board_type $boardType)
    {   
        $this->boardType = $boardType;
    }

    /**
     * 取得討論版類型列表
     * @return mixed
     **/    
    public function getBoardTypeList(){
       return $this->boardType->select('row_id','type_name')->get();
    }
}
