<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\lib\ResultCode;
use App\lib\Verify;
use Validator;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        
        Validator::extend('greater_than', function($attribute, $value, $params, $validator){
            return intval($value) > intval($params[0]);
        });

        Validator::extend('board_auth', function($attribute, $value, $params, $validator){
            $empNo = $params[0];
            return $this->checkUserBoardAuth($empNo, $value);
        });
        
        Validator::extend('post_auth', function($attribute, $value, $params, $validator){
            $empNo = $params[0];
            return $this->checkBoardAuthWithPostId($empNo, $value);
        });

        Validator::extend('belone_board', function($attribute, $value, $params, $validator){
            $boardId = $params[0];
            return $this->checkPostBeloneBoard($value, $boardId);
        });

        Validator::extend('post_exist', function($attribute, $value, $params, $validator){
            return $this->checkPostExist($value);
        });

        Validator::extend('post_owner', function($attribute, $value, $params, $validator){
            $empNo = $params[0];
            return $this->checkPostOwner($empNo, $value);
        });

        Validator::extend('post_is_open', function($attribute, $value, $params, $validator){
            return $this->checkPostIsOpen($value);
        });

        Validator::extend('board_is_open', function($attribute, $value, $params, $validator){
            return $this->checkBoardIsOpen($value);
        });

        Validator::extend('parent_board_is_open', function($attribute, $value, $params, $validator){
            return $this->checkBoardIsOPtnWithPostId($value);
        });

        Validator::extend('is_my_post', function($attribute, $value, $params, $validator){
            $empNo = $params[0];
            return $this->IsMyPost($empNo, $value);
        });
    
        Validator::replacer('greater_than', function($message, $attribute, $rule, $params) {
            return ResultCode::_047905_FieldFormatError;
        });

        Validator::replacer('board_auth', function($message, $attribute, $rule, $params) {
            return ResultCode::_047904_NoAuthorityToAccessThisBoard;
        });

        Validator::replacer('post_auth', function($message, $attribute, $rule, $params) {
            return ResultCode::_047904_NoAuthorityToAccessThisBoard;
        });

        Validator::replacer('belone_board', function($message, $attribute, $rule, $params) {
            return ResultCode::_047998_NoData;
        });

        Validator::replacer('post_exist', function($message, $attribute, $rule, $params) {
            return ResultCode::_047904_NoAuthorityToAccessThisBoard;
        });

        Validator::replacer('post_owner', function($message, $attribute, $rule, $params) {
            return ResultCode::_047906_FieldFormatError;
        });

        Validator::replacer('post_is_open', function($message, $attribute, $rule, $params) {
            return ResultCode::_047910_PostIsClosed;
        });

        Validator::replacer('board_is_open', function($message, $attribute, $rule, $params) {
            return ResultCode::_047911_BoardIsClosed;
        });


        Validator::replacer('parent_board_is_open', function($message, $attribute, $rule, $params) {
            return ResultCode::_047911_BoardIsClosed;
        });

        Validator::replacer('is_my_post', function($message, $attribute, $rule, $params) {
            return ResultCode::_047906_FieldFormatError;
        });

        Validator::replacer('required', function($message, $attribute, $rule, $params) {
            return ResultCode::_047903_MandatoryFieldLost;
        });

        Validator::replacer('numeric', function($message, $attribute, $rule, $params) {
            return ResultCode::_047905_FieldFormatError;
        });

        Validator::replacer('string', function($message, $attribute, $rule, $params) {
            return ResultCode::_047905_FieldFormatError;
        });

        Validator::replacer('array', function($message, $attribute, $rule, $params) {
            return ResultCode::_047905_FieldFormatError;
        });

        Validator::replacer('size', function($message, $attribute, $rule, $params) {
            return ResultCode::_047905_FieldFormatError;
        });

        Validator::replacer('max', function($message, $attribute, $rule, $params) {
            return ResultCode::_047905_FieldFormatError;
        });

        Validator::replacer('min', function($message, $attribute, $rule, $params) {
            return ResultCode::_047905_FieldFormatError;
        });
        
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * 以貼文id查詢有無此討論版權限
     * @param  string $empNo   員工編號
     * @param  string $postId  貼文編號
     * @return boolean
     */
    private function checkBoardAuthWithPostId($empNo, $postId){
         $result = \DB::table("qp_post")->where('row_id', '=', $postId)->select('board_id')->first();

         if(!is_null ($result)){
           return $this->checkUserBoardAuth($empNo, $result->board_id);
         }
         return false;
    }

    /**
     * 檢查使用者有無討論版權限
     * @param  string $empNo   員工編號
     * @param  int $boardId 討論版編號
     * @return boolean
     */
    private function checkUserBoardAuth($empNo, $boardId){
        $board = \DB::table("qp_board")
                ->where('row_id', '=', $boardId)
                ->select('public_type')
                ->first();
        if(!is_null($board)){
            if($board->public_type == 1){ //開放給全集團
                return true;
            }else if($board->public_type == 2){//開放給特定公司
                $companys = \DB::table("qp_board_company")->where('board_id', '=', $boardId)->lists('qp_board_company.company');

                if(count($companys) > 0){
                    $user = \DB::table("qp_user")->where('emp_no', '=', $empNo)
                            ->whereIn('company',$companys)
                            ->select('row_id','company')->get();
                    if(count($user) > 0){
                        return true;
                    }
                }
            }else if($board->public_type == 3){//開放給特定用戶
                $user = \DB::table("qp_board_user")
                        ->where('board_id', '=', $boardId)
                        ->where('emp_no',$empNo)
                        ->select('row_id')->get();
                if(count($user) > 0){
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 檢查貼文是否存在討論版
     * @param  string $postId  貼文編號
     * @param  int $boardId 討論版編號
     * @return boolean
     */
    private function checkPostBeloneBoard($postId, $boardId){
         $result = \DB::table("qp_post")
                            ->where('row_id', '=', $postId)
                            ->where('board_id', '=', $boardId)
                            ->select('row_id')->get();
        if(count($result) > 0){
            return true;
        }
        return false;
    }

    /**
     * 檢查貼文是否存在
     * @param  string $postId  貼文編號
     * @return boolean
     */
    private function checkPostExist($postId){
         $result = \DB::table("qp_post")
                            ->where('row_id', '=', $postId)
                            ->select('row_id')->get();
        if(count($result) > 0){
            return true;
        }
        return false;
    }

    private function checkPostOwner($empNo, $postId){
        $postRs = \DB::table("qp_post")
                    ->where('row_id','=',$postId)
                    ->select('board_id','created_user')
                    ->first();
        if(!is_null($postRs)){
            $boardRs = \DB::table("qp_board")
                    ->where('row_id','=',$postRs->board_id)
                    ->select('manager')
                    ->first();
            $manager = explode(',',$boardRs->manager);
            if(in_array($empNo, $manager)){
                return true;
            }
            $UserRs = \DB::table("qp_user")
                    ->where('row_id','=',$postRs->created_user)
                    ->select('emp_no')
                    ->first();
            if($UserRs->emp_no == $empNo){
                return true;
            }
        } 
        return false; 
    }

    private function IsMyPost( $empNo, $postId){
        $user = \DB::table("qp_user")->where('emp_no', $empNo)->select('row_id')->first();
        if(!is_null($user)){
            $post = \DB::table("qp_post")
                        ->where("row_id",$postId)
                        ->where("created_user", $user->row_id)
                        ->get();
            if(count($post) > 0){
                return true;
            }
        }
        return false; 
    }


    private function IsMyComment( $empNo, $commrntId){
        $user = \DB::table("qp_user")->where('emp_no', $empNo)->select('row_id')->first();
        if(!is_null($user)){
            $comment = \DB::table("qp_comment")
                        ->where("row_id",$commrntId)
                        ->where("created_user", $user->row_id)
                        ->get();
            if(count($comment) > 0){
                return true;
            }

        }
        return false; 
    }

    private function checkBoardIsOPtnWithPostId($postId){
         $result = \DB::table("qp_post")->where('row_id', '=', $postId)->select('board_id')->first();

         if(!is_null ($result)){
           return $this->checkBoardIsOpen($result->board_id);
         }
         return false;
    }

    private function checkBoardIsOpen($boardId){
        $board = \DB::table("qp_board")
                ->where('row_id', '=', $boardId)
                ->select('status')
                ->first();
        if(!is_null($board) && $board->status == 'Y'){
            return true;
        }
        return false; 
    }

    private function checkPostIsOpen($postId){
        $post = \DB::table("qp_post")
                ->where('row_id', '=', $postId)
                ->select('status')
                ->first();

        if(!is_null($post) && $post->status == 'Y'){
            return true;
        }
        return false; 
    }
}
