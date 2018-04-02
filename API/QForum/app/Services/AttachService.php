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

    public function addAttach($postId, $commentId, Array $fileData, $userId){
        $now = date('Y-m-d H:i:s',time());
        $insertData = [];
        foreach ($fileData as $fileUrl) {
            $insertData[] = [
                'post_id' => $postId,
                'comment_id' => $commentId,
                'file_url' => $fileUrl,
                'created_user' => $userId,
                'created_at'=> $now
                ];
        }
        return $this->attachRepository->addAttach($insertData);
    }

    public function getAttach($postId, $commentId=0){
        return $this->attachRepository->getAttach($postId, $commentId);
    }

    public function modifyAttach($postId, $commentId, Array $fileData, $userId){

        $now = date('Y-m-d H:i:s',time());
        $attachements = $this->getAttach($postId, $commentId);
        $keepData = array_intersect($fileData, $attachements);
        $deleteData = array_diff($attachements, $keepData);
        $insertData = array_diff($fileData, $keepData);
        $addAttach =[];        
        $deleteRs = $this->attachRepository->softDeleteAttach($postId, $commentId, $keepData, $userId);

        foreach ($insertData as $fileUrl) {
            $addAttach[] = [
                'post_id' => $postId,
                'comment_id' => $commentId,
                'file_url' => $fileUrl,
                'created_user' => $userId,
                'created_at'=> $now
            ];
        }

        $insertRs = $this->attachRepository->addAttach($addAttach);
    }

    public function deleteAttach($postId, $commentId, $userId){
        $now = date('Y-m-d H:i:s',time());
        $postId = $postId;
        $keepData = [];
        $deleteRs = $this->attachRepository->softDeleteAttach($postId, $commentId, $keepData, $userId);
    }

    public function getDeletedAttach($lastDeleteAt=""){
        return $this->attachRepository->getDeletedAttach($lastDeleteAt);
    }
}