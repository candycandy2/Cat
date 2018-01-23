<?php
namespace App\Services;

use App\Repositories\PostRepository;

class PostService
{
    protected $postRepository;

    public function __construct(PostRepository $postRepository)
    {
        $this->postRepository = $postRepository;
    }

    /**
     * 新增貼文
     * @param  Array  $data     貼文內容
     * @param  Object $userData 用戶資料
     * @return boolean
     */
    public function newPost(Array $data, $userData){
        $now = date('Y-m-d H:i:s',time());
        $insertData = [
                'board_id' => $data['board_id'],
                'row_id' => $data['post_id'],
                'post_title' => $data['post_title'],
                'content' => html_entity_decode($data['content'], ENT_QUOTES),
                'from_id' => $userData->login_id,
                'created_user' => $userData->row_id,
                'ctime' => time(),
                'created_at'=> $now
                ];
        return $this->postRepository->newPost($insertData);
    }

    /**
     * 取得貼文資訊
     * @param  string $postId 貼文id
     * @param  int $boardId 討論版id
     * @return mixed
     */
    public function getPostData($postId, $boardId=null){
        return $this->postRepository->getPostData($postId, $boardId);
    }

    public function getPostDetails($boardId, $postId){
        return $this->postRepository->getPostDetails($boardId, $postId);
    }
}