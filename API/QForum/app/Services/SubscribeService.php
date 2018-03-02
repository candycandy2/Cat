<?php
namespace App\Services;

use App\Repositories\SubscribePostUserRepository;

class SubscribeService
{
    protected $subscribePostUserRepository;

    public function __construct(SubscribePostUserRepository $subscribePostUserRepository)
    {
        $this->subscribePostUserRepository = $subscribePostUserRepository;
    }

    public function subscribePost($data, $userData){
        $oldSubscribeUser = $this->subscribePostUserRepository->getSubscribePostUser($data['post_id'])->pluck('emp_no')->toArray();
        $now = date('Y-m-d H:i:s',time());
        $newSubscribeUser = array_diff(array_unique($data['subscribe_user_list']),$oldSubscribeUser);
        $insertDataArr = [];
        foreach ($newSubscribeUser as $empNo) {
            $insertData = [
                'post_id' => $data['post_id'],
                'emp_no' =>  $empNo,
                'created_user' => $userData->row_id,
                'created_at'=> $now
                ];
            $insertDataArr[] = $insertData;
        }
       return $this->subscribePostUserRepository->subscribePost($insertDataArr);
    }
}