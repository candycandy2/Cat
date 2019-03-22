<?php
namespace App\Services;

use App\Repositories\AppEvaluationRepository;
use Mail;

class AppEvaluationService
{
    protected $appEvaluationRepository;

    public function __construct(AppEvaluationRepository $appEvaluationRepository)
    {
        $this->appEvaluationRepository = $appEvaluationRepository;
    }

    /**
     * 更新或修改評論
     * @param  int $appId       APP id，qp_app.row_id
     * @param  string $deviceType  裝置類型(ios|android)
     * @param  int $versionCode 目前上架中版本
     * @param  int $score       評分
     * @param  string $comment  評論內容
     * @param  int $userId      使用者id，qp_user.row_id
     * @return int              新增的qp_evaulation.row_id或是更新的qp_evaulation.row_id
     */
    public function upsertAppEvaluation($appId, $deviceType, $versionCode, $score, $comment, $userId){
        return $evaulationId = $this->appEvaluationRepository->upsertAppEvaluation($appId, $deviceType, $versionCode, $score, $comment, $userId);
    }

    /**
    * Send Evaluation Mail to QPlay Team
    * @param Array $data       mail data
    */
    public function sendEvaluationToQPlay($data){
        
        $userMail = $data['email'];
        $userName = $data['emp_name'];

        Mail::send('emails.user_evaluation', $data, function($message) use($userMail, $userName)
                {   
                    $from = env('MAIL_USER_MAIL_ADDRESS');
                    if(!is_null($userMail) && $userMail != ""){
                        $from = $userMail;    
                    }
                    $to = explode(',',env('MAIL_TO'));
                    $subject = '【QPlay 使用者評論通知】 用戶 '.$userName.' 發表了評論';
                    $message->from($from);
                    $message->to($to)->subject($subject); 
                });

        return true;
    }
}