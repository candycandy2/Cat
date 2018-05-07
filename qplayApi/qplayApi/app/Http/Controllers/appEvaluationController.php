<?php

namespace App\Http\Controllers;

use App\Services\AppEvaluationService;
use App\Services\AppVersionService;
use App\Services\ProjectService;
use Illuminate\Http\Request;
use App\lib\Verify;
use App\lib\ResultCode;
use App\lib\CommonUtil;
use Validator;

class appEvaluationController extends Controller
{
    protected $appEvaluationService;
    protected $appVersionService;
    protected $projectService;

    public function __construct(
        AppEvaluationService $appEvaluationService,
        AppVersionService $appVersionService,
        ProjectService $projectService
    ) {
        $this->appEvaluationService = $appEvaluationService;
        $this->appVersionService = $appVersionService;
        $this->projectService = $projectService;
    }

    /**
     * 透過此API可以新增APP的評論包含星等及評論描述
     * @param Request
     */
    public function addAppEvaluation(Request $request)
    {
        //basic verify
        $Verify = new Verify();
        $verifyResult = $Verify->verify();
        if ($verifyResult["code"] != ResultCode::_1_reponseSuccessful) {
            return response()->json(['result_code'=>$verifyResult["code"],
                'message'=>CommonUtil::getMessageContentByCode($verifyResult["code"]),
                'content'=>'']);
        }
        //parameter verify
        $validator = Validator::make(
            $request->all(),
            [
            'uuid'=>'required',
            'app_key' => 'required',
            'device_type' => 'required|in:ios,android',
            'score'=> 'required_without:comment|numeric',
            'comment'=> 'required_without:score|string'
        ],
        [
            'required' => ResultCode::_999001_requestParameterLostOrIncorrect,
            'required_without' => ResultCode::_000921_scoreOrCommentIsRequired
        ]
        );
        if ($validator->fails()) {
            return response()->json(['result_code'=>$validator->errors()->first(),
                                      'message'=>CommonUtil::getMessageContentByCode($validator->errors()->first())], 200);
        }
        //parameter arrange
        $uuid = $request->query('uuid');
        $appKey = $request->query('app_key');
        $deviceType = $request->query('device_type');
        $score = $request->input('score');
        $comment = $request->input('comment');

        //user status verify
        $verifyUserStatusRs = $Verify->checkUserStatusByUuid($uuid);

        if ($verifyUserStatusRs["result_code"] != ResultCode::_1_reponseSuccessful) {
            return response()->json($verifyUserStatusRs);
        }
        $userInfo = $verifyUserStatusRs['content'];
        // app verify
        if (!Verify::chkAppKeyExist($appKey)) {
            return response()->json(['result_code'=>ResultCode::_999010_appKeyIncorrect,
                'message'=>CommonUtil::getMessageContentByCode(ResultCode::_999010_appKeyIncorrect),
                'content'=>'']);
        }
        //1.get app information from url app_key
        $appInfo = $this->projectService->getAppInfoByAppKey($appKey);
        //2.get version information which is published
        $publicVersionInfo = $this->appVersionService->getPublishedVersion($appInfo->app_id, $deviceType);
        if (is_null($publicVersionInfo)) {
            return response()->json(['result_code'=>ResultCode::_000922_canNotEvaluateUnpublishedApp,
                'message'=>CommonUtil::getMessageContentByCode(ResultCode::_000922_canNotEvaluateUnpublishedApp),
                'content'=>'']);
        }
        //3.insert app evaulation
        $this->appEvaluationService
             ->upsertAppEvaluation(
                $appInfo->app_id,
                $deviceType,
                $publicVersionInfo->version_code,
                $score,
                $comment,
                $userInfo->row_id
             );

        return response()->json(['result_code'=>ResultCode::_1_reponseSuccessful,
            'message'=>trans("messages.MSG_CALL_SERVICE_SUCCESS"),
            'content'=>""
        ]);
    }
}
