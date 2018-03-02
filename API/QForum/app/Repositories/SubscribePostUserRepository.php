<?php

namespace App\Repositories;

use App\Models\QP_Subscribe_Post_User;
use DB;
class SubscribePostUserRepository
{

    protected $subscribePostUser;

    public function __construct(QP_Subscribe_Post_User $subscribePostUser)
    {   
        $this->subscribePostUser = $subscribePostUser;
    }

    public function subscribePost($data){
        return $this->subscribePostUser->insert($data);
    }

    public function getSubscribePostUser($postId){
        return $this->subscribePostUser->where('post_id',$postId)->get();
    }

}
