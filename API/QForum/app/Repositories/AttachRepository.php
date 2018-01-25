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

    public function softDeleteAttach($postId, $keepData, $userId){
        $now = date('Y-m-d H:i:s',time());
        return $this->attach->where('post_id', $postId)->whereNotIn('file_url', $keepData)->update([
                'updated_user' => $userId,
                'updated_at' => $now,
                'deleted_at' => $now
            ]);
    }

    
    public function getAttach($postId, $commentId=0){
        return $this->attach->where('post_id',$postId)
                            ->where('comment_id', $commentId)
                            ->where('deleted_at', null)
                            ->lists('file_url')->toArray();
    }
}
