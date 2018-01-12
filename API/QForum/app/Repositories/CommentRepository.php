<?php

namespace App\Repositories;

use App\Models\QP_Comment;
use DB;

class CommentRepository
{

    protected $comment;

    public function __construct(QP_Comment $comment)
    {   
        $this->comment = $comment;
    }

    public function newComment(Array $data){
        return $this->comment->insertGetId($data);
    }

    public function getComments($postId){
        return $this->comment->where('post_id','=',$postId)
                     ->join('qp_user','qp_user.row_id', '=', 'qp_comment.created_user')
                     ->select('qp_comment.row_id as comment_id','sequence_id','content as reply_content',
                               'login_id as reply_user','qp_comment.updated_user' ,
                               'qp_comment.created_at as reply_create_time' ,
                               'qp_comment.updated_at as reply_update_time',
                               'qp_comment.deleted_at as reply_delete_time')
                      ->get();
    }
}
