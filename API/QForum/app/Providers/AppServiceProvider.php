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

        Validator::extend('post_owner', function($attribute, $value, $params, $validator){
            $empNo = $params[0];
            return $this->checkPostOwner($empNo, $value);
        });

        Validator::extend('is_my_post', function($attribute, $value, $params, $validator){
            $empNo = $params[0];
            return $this->IsMyPost($empNo, $value);
        });

        Validator::extend('is_my_comment', function($attribute, $value, $params, $validator){
            $empNo = $params[0];
            return $this->IsMyComment($empNo, $value);
        });
    
        Validator::replacer('greater_than', function($message, $attribute, $rule, $params) {
            return ResultCode::_047905_FieldFormatError;
        });

        Validator::replacer('post_owner', function($message, $attribute, $rule, $params) {
            return ResultCode::_047906_FieldFormatError;
        });

        Validator::replacer('is_my_post', function($message, $attribute, $rule, $params) {
            return ResultCode::_047906_OnlyCanModifyYourOwnPost;
        });

        Validator::replacer('is_my_comment', function($message, $attribute, $rule, $params) {
            return ResultCode::_047906_OnlyCanModifyYourOwnPost;
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
     * 檢查是否為貼文的發文者或是討論版管理者
     * @param  string $empNo  員工編號
     * @param  string $postId 討論版id
     * @return boolean
     */
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
}
