<?php
/**
 * Status Log - Resository
 * @author  Cleo.W.Chan cleo.W.chan@benq.com
 */
namespace App\Repositories;

use App\Model\Status_Log;
use DB;

class StatusLogRepository
{

    protected $statusLog;

    public function __construct(Status_Log $statusLog)
    {
        $this->statusLog = $statusLog;
    }

    /**
     * New data log
     * @param  Array $data log data
     * @return boolean
     */
    public function newStatusLog(Array $data)
    {
        return $this->statusLog
                    ->insert($data);
    }

    /**
     * Get log data formate to be insert
     * @param  string $table      modified table name
     * @param  int    $tableRowId modified row_id
     * @param  string $action     action update/delete
     * @param  string $loginId    user login id
     * @param  string $domain     user domain
     * @param  string $empNo      user emp_no
     * @param  Array  $content    modified content remark
     * @return Array
     */
    public static function getLogData($table, $tableRowId, $action, $loginId, $domain, $empNo, Array $content){
        return [
                    "table_name" => $table,
                    "table_row_id" => $tableRowId,
                    "action" => $action,
                    "login_id" => $loginId,
                    "domain" => $domain,
                    "emp_no" => $empNo,
                    "content" =>self::getFormatContent($content),
                    "created_at" => date('Y-m-d H:i:s',time())
                ];
    }
    
    /**
     * Get Formated Content to be insert to log content 
     * @param  Array $input content data
     * @return string
     */
    private static function getFormatContent(Array $input){

        return implode(', ', array_map(
            function ($v, $k) { return sprintf("%s:=>'%s'", $k, $v); },
            $input,
            array_keys($input)
        ));

    }

    /**
     * Get lasted updated user info by table and row_id
     * @param  string $tableName  table name
     * @param  int $tableRowId record row_id
     * @return mixed
     */
    public static function getLastUpdatedUser($tableName, $tableRowId){
        $statusLog = new EmpService_Data_Log();
        return $statusLog->where('table_name',$tableName)
                    ->where('table_row_id',$tableRowId)
                    ->orderby('created_at','desc')
                    ->first();
    }

    /**
     * Get table record last add user
     * @param  string $tableName  table name
     * @param  int $tableRowId    record row_id
     * @return mixed
     */
    public static function getLastCreatedUser($tableName, $tableRowId){
        $statusLog = new EmpService_Data_Log();
        return $statusLog->where('table_name', $tableName)
                    ->where('table_row_id', $tableRowId)
                    ->where('action','add')
                    ->orderby('created_at','desc')
                    ->first();
    }
}