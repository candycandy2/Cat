<?php
/**
 * 用戶Parameter相關資料處理
 * @author Cleo.W.Chan
 */
namespace App\Repositories;

use App\Models\QP_Parameter_Type;
use DB;

class ParameterRepository
{
    /** @var User Inject QP_User model */
    protected $parameterType;
    
    /**
     * ParameterRepository constructor.
     * @param QP_Parameter_Type $parameterType
     */
    public function __construct(QP_Parameter_Type $parameterType)
    {
        $this->parameterType = $parameterType;
    }

    /**
     * 取得最後一次同步時間
     * @return mixed
     */
    public function getLastQueryTime(){
        return $this->parameterType->where('parameter_type_name','=','qforum_job')->first()
                ->parameters()
                ->where('parameter_name', '=', 'last_deleted_at')
                ->select('parameter_value')
                ->first();
    }

    /**
     * 更新最後一次同步時間
     * @param  String $endTime YYYY-mm-dd
     * @return 
     */
    public function updateLastQueryTime($lastDeletedAt){
         return $this->parameterType->where('parameter_type_name','=','qforum_job')->first()
                ->parameters()
                ->where('parameter_name', '=', 'last_deleted_at')
                ->update(['parameter_value'=>$lastDeletedAt]);
    }
}