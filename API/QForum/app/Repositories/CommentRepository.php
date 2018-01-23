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

    public function getComments($postId ,$from, $to){
        return $this->comment->where('post_id','=',$postId)
                     ->join('qp_user','qp_user.row_id', '=', 'qp_comment.created_user')
                     ->where('qp_comment.sequence_id','>=',$from)
                     ->where('qp_comment.sequence_id','<=',$to)
                     ->select('qp_comment.row_id as comment_id','sequence_id','content as reply_content',
                               'login_id as reply_user','qp_comment.updated_user' ,
                               'qp_comment.created_at as reply_create_time' ,
                               'qp_comment.updated_at as reply_update_time',
                               'qp_comment.status as reply_status',
                               'qp_comment.deleted_at as reply_delete_time')
                    ->get();
    }

    public function getCommentCount($postId){
        return $this->comment->where('post_id','=',$postId)
                     ->join('qp_user','qp_user.row_id', '=', 'qp_comment.created_user')
                     ->select('qp_comment.row_id as comment_id','sequence_id','content as reply_content',
                               'login_id as reply_user','qp_comment.updated_user' ,
                               'qp_comment.created_at as reply_create_time' ,
                               'qp_comment.updated_at as reply_update_time',
                               'qp_comment.status as reply_status',
                               'qp_comment.deleted_at as reply_delete_time')
                    ->count();
    }
}
