<?php

namespace App\Repositories;

use App\Models\QP_Attach;
use DB;
class AttachRepository
{

    protected $attach;

    public function __construct(QP_Attach $attach)
    {   
        $this->attach = $attach;
    }

    public function addAttach(Array $data){
        return $this->attach->insert($data);
    }
}
