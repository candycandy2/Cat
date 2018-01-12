<?php
namespace App\Services;

use App\Repositories\AttachRepository;

class AttachService
{
    protected $postRepository;

    public function __construct(AttachRepository $attachRepository)
    {
        $this->attachRepository = $attachRepository;
    }

    public function addAttach(Array $data, $userData){
        $now = date('Y-m-d H:i:s',time());
        $postId = $data['post_id'];
        $commentId = isset($data['comment_id'])?$data['comment_id']:NULL; 
        $fileData = $data['file_list']['file'];
        $insertData = [];
        foreach ($fileData as $fileUrl) {
            $insertData[] = [
                'post_id' => $data['post_id'],
                'comment_id' => $commentId,
                'file_url' => $fileUrl,
                'created_user' => $userData->row_id,
                'created_at'=> $now
                ];
        }
        return $this->attachRepository->addAttach($insertData);
    }
}