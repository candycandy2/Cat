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
        $fileData = (is_array($fileData))?$fileData:(array)$fileData;
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

    public function getAttach($postId, $commentId=0){
        return $this->attachRepository->getAttach($postId, $commentId);
    }

    public function modifyAttach(Array $data, $userData){

        $now = date('Y-m-d H:i:s',time());
        $fileList = isset($data['file_list'])?$data['file_list']:null;
        $commentId = isset($data['comment_id'])?$data['comment_id']:0;
        $postId = $data['post_id'];
        $fileData = [];
        if(!is_null($fileList)){
            $fileData = $data['file_list']['file'];
            $fileData = (is_array($fileData))?$fileData:(array)$fileData;
        }
        $attachements = $this->getAttach($postId);
        $keepData = array_intersect($fileData, $attachements);
        $deleteData = array_diff($attachements, $keepData);
        $insertData = array_diff($fileData, $keepData);
        $addAttach =[];
        // $deleteAttach =[];
        // foreach ($deleteData as $fileUrl) {
        //     $deleteAttach[] = [
        //         'updated_user' => $userData->row_id,
        //         'updated_at' => $now,
        //         'deleted_at' => $now
        //     ];
        // }
        
        $deleteRs = $this->attachRepository->softDeleteAttach($postId, $keepData, $userData->row_id);

        foreach ($insertData as $fileUrl) {
            $addAttach[] = [
                'post_id' => $data['post_id'],
                'comment_id' => $commentId,
                'file_url' => $fileUrl,
                'created_user' => $userData->row_id,
                'created_at'=> $now
            ];
        }

        $insertRs = $this->attachRepository->addAttach($addAttach);
    }
}