<?php
namespace App\Services;

use App\Repositories\CommentRepository;

class CommentService
{
    protected $commentRepository;

    public function __construct(CommentRepository $commentRepository)
    {
        $this->commentRepository = $commentRepository;
    }

    /**
     * 新增貼文
     * @param  Array  $data     貼文內容
     * @param  Object $userData 用戶資料
     * @return boolean
     */
    public function newComment(Array $data, $userData){
        $now = date('Y-m-d H:i:s',time());
        $insertData = [
                'post_id' => $data['post_id'],
                'content' => html_entity_decode($data['content'], ENT_QUOTES),
                'from_id' => $userData->login_id,
                'created_user' => $userData->row_id,
                'ctime' => time(),
                'created_at'=> $now
                ];
        return $this->commentRepository->newComment($insertData);
    }

    public function getComments($postId){
        return $this->commentRepository->getComments($postId);
    }
}