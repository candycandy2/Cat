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

    /**
     * 依據回應排序取得評論資料
     * @param  string $postId 貼文id
     * @param  int    $from   起始的排序
     * @param  int    $to     結束的排序
     * @return mixed
     */
    public function getComments($postId ,$from, $to){
        return $this->commentRepository->getComments($postId ,$from, $to);
    }

    public function getComment($commentId){
        return $this->commentRepository->getComment($commentId);
    }

    /**
     * 取得該貼文的評論總數
     * @param  string $postId 貼文id
     * @return int
     */
    public function getCommentCount($postId){
        return $this->commentRepository->getCommentCount($postId);
    }


    /**
     * 修改評論
     * @param  Array  $data     貼文內容
     * @param  Object $userData 用戶資料
     * @return boolean
     */
    public function modifyComment($commentId, $content, $userId){
        $now = date('Y-m-d H:i:s',time());
        $updateData = [
                'content' => html_entity_decode($content, ENT_QUOTES),
                'updated_user' => $userId,
                'updated_at'=> $now
                ];
        return $this->commentRepository->modifyComment($commentId, $updateData);
    }

    /**
     * 刪除評論
     * @param  int $commentId 評論id
     * @param  int $userId    qp_user.row_id
     * @return boolean
     */
    public function softDeleteComment($commentId, $userId){
        $now = date('Y-m-d H:i:s',time());
        $updateData = [
                'status' => 'N',
                'deleted_at'=>$now,
                'updated_user' => $userId,
                'updated_at'=> $now
                ];
        return $this->commentRepository->modifyComment($commentId, $updateData);   
    }
}