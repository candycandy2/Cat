<?php

namespace App\Repositories;

use App\Models\QP_Post;
use DB;
class PostRepository
{

    protected $post;

    public function __construct(QP_Post $post)
    {   
        $this->post = $post;
    }

    public function newPost(Array $data){
        return $this->post->insert($data);
    }

    public function modifyPost($postId, Array $data){
        return $this->post->where('row_id',$postId)->update($data);
    }

    public function softDeletePost($postId, $userData){
        $now = date('Y-m-d H:i:s',time());
        return $this->post
               ->where('row_id',$postId)
               ->where('status','Y')
               ->update(['status' => 'N',
                        'updated_at' => $now,
                        'updated_user' =>$userData->row_id,
                        'deleted_at' => $now]);
    }

    public function getPostData($postId, $boardId){
        $query = $this->post->where('qp_post.row_id', $postId);
           if(!is_null($boardId)){
                $query = $query->where('qp_post.board_id', $boardId);
           }
           $query = $query->join('qp_board','qp_board.row_id', '=', 'qp_post.board_id')
           ->join('qp_user','qp_user.row_id','=','qp_post.created_user')
           ->where('qp_post.status', 'Y')
           ->select('qp_board.row_id as board_id',
                    'qp_board.board_name as board_name',
                    'qp_board.status as board_status',
                    'qp_post.row_id as post_id',
                    'qp_post.post_title as post_title',
                    'qp_post.content as post_content',
                    'qp_user.login_id as post_creator',
                    'qp_post.created_at as post_create_time',
                    'qp_post.updated_at as post_update_time',
                    'qp_post.deleted_at as post_delete_time',
                    'qp_post.status as post_status',
                    'qp_post.ref_id as ref_id'
                )
           ->first();
        return $query;
    }

    public function getPostListByBoard($boardId){
        return $this->post
                    ->where('qp_post.board_id',$boardId)
                    ->where('qp_post.status','Y')
                    ->join('qp_board','qp_board.row_id', '=', 'qp_post.board_id')
                    ->join('qp_user','qp_user.row_id','=','qp_post.created_user')
                    ->select('qp_board.row_id as board_id',
                            'qp_board.board_name as board_name',
                            'qp_board.status as board_status',
                            'qp_post.row_id as post_id',
                            'qp_post.post_title as post_title',
                            'qp_post.content as post_content',
                            'qp_user.login_id as post_creator',
                            'qp_post.created_at as post_create_time',
                            'qp_post.updated_at as post_update_time',
                            'qp_post.status as post_status',
                            'qp_post.deleted_at as post_delete_time'
                        )
                    ->get();
    }
}
