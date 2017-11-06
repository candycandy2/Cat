<?php
namespace App\Http\Controllers;
use DateTime;
use Validator;
use App\lib\ResultCode;
use App\lib\CommonUtil;
use App\Repositories\ParameterRepository;
use App\Services\HistoryService;
use Illuminate\Support\Facades\Input;
use Illuminate\Http\Request;
use App\lib\Verify;
use Config;

class HistoryController extends Controller
{

    protected $parameterRepository;
    protected $historyService;
    protected $xml;
    protected $data;

    /**
     * HistoryController constructor.
     * @param ParameterRepository $parameterRepository
     * @param HistoryServices $historyServices
     */
    public function __construct(ParameterRepository $parameterRepository,
                                HistoryService $historyService)
    {      
        $input = Input::get();
        $this->parameterRepository = $parameterRepository;
        $this->historyService = $historyService;
        $this->xml=simplexml_load_string($input['strXml']);
        $this->data=json_decode(json_encode($this->xml),TRUE);
    }
    
    /**
     * 透過此API可以從QPlay端獲得單一聊天室內的歷史訊息
     * @return json
     */
    public function getQGroupHistoryMessage(){
        try {
            $required = Validator::make($this->data, [
                        'group_id' => 'required',
                        'sort' => 'required',
                        'begin_time' => 'required_without:cursor|required_without:cursor',
                        'end_time' => 'required_without:cursor|required_without:cursor',
                        'cursor' => 'required_without:begin_time|required_without:end_time'
                    ]);

            if($required->fails()){
                return $result = response()->json(['ResultCode'=>ResultCode::_025903_MandatoryFieldLost,
                            'Message'=>"必填字段缺失",
                            'Content'=>""]);
            }

            $groupId = $this->data['group_id'];
            $start = $this->data['begin_time'];
            $end = $this->data['end_time'];
            $cursor = $this->data['cursor'];
            $sort = $this->data['sort'];
            if(isset($cursor) && !is_array($cursor)){
                $data = $this->historyService->getHistoryByCursor($groupId, $cursor);
            }else{
                $data = $this->historyService->getHistoryByTime($groupId, $start, $end);
            }
            $conversation = [];
            $count = count($data);
            $conversation = [
                'total'=>$count,
                'cursor'=>($count > 0)?$data[$count-1]->create_time:"",
                'count'=>$count,
                'messages'=>[]
            ];

            foreach ($data as $key => $value) {
               $messages = [
                        'set_from_name'=>$value->from_name,
                        'from_paltform'=>null,
                        'target_name'=>$value->target_name,
                        'msg_type'=>$value->target_type,
                        'version'=>null,
                        'target_id'=>$value->target_id,
                        'sui_mtime'=>null,
                        'from_appkey'=>"f1007b6d14755a1e17e74195",
                        'from_name'=>$value->from_name,
                        'from_id'=>$value->from_id,
                        'from_type'=>$value->from_type,
                        'create_time'=>$value->create_time,
                        'target_type'=>$value->target_type,
                        'msgid'=>$value->msg_id,
                        'msg_ctime'=>$value->ctime,
                        'msg_level'=>null
                    ];

                $content = json_decode($value->content);
                foreach ($content as $mKey => $mValue) {
                      $messages['msg_body'][$mKey] = $mValue;
                }
                if($value->msg_type == 'image'){
                    $messages['msg_body']['qplay_media_path'] = url($value->lpath);
                    $messages['msg_body']['qplay_thumb_path'] = url($value->spath); 
                }
               array_push( $conversation['messages'], $messages);
            }
            return response()->json($conversation);
        }catch (\Exception $e) {
             $result = ['ResultCode'=>ResultCode::_025999_UnknownError,'Message'=>$e->getMessage()];
            return response()->json($result);
        } 
    }
}