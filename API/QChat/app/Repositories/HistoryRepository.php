<?php
/**
 *  MySQL歷史訊息Repository
 * @author Cleo.W.Chan
 */
namespace App\Repositories;

use App\Model\QP_History;
use App\Model\QP_History_File;

use DB;

class HistoryRepository
{
    /** @var QM_History Inject History repository */
    protected $history;

    /** @var QM_History_File Inject History repository */
    protected $historyFile;
    
    public static $db = 'mysql_qplay';

    public static $historyTable = 'qp_history';

    public static $historyFileTable = 'qp_history_file';

    public static $historyColumn = 'msg_id, msg_type, from_id, from_type, target_id, target_name, target_type, ctime, create_time, content';

    public static $historyFileColumn = 'msg_id, fname, fsize, format, npath, lpath, spath';
    /**
     * HistoryRepository constructor.
     * @param QM_History $history
     * @param QM_History_File $historyFile
     */
    public function __construct(QP_History $history, QP_History_File $historyFile)
    {
        $this->history = $history;
        $this->historyFile = $historyFile;
    }

    /**
     * 寫入歷史訊息
     * @param  Array $historyData  歷史訊息資料 
     */
    public function upsertHistory($historyData){
        if(count($historyData) > 0){
            $this->upsertData(self::$db,
                          self::$historyTable,
                          self::$historyColumn,
                          $historyData);
        }
    }

    /**
     * 寫入歷史訊息檔案資訊
     * @param  Array $historyFileData 歷史訊息檔案資料
     */
    public function upsertHistoryFile($historyFileData){
        if(count($historyFileData) > 0){
            $this->upsertData(self::$db,
                          self::$historyFileTable,
                          self::$historyFileColumn,
                          $historyFileData);
        }
    }

    /**
     * 寫入歷史訊息
     * @param  Array $historyData  歷史訊息資料 
     */
    public function insertHistory($historyData){
        if(count($historyData) > 0){
         $this->history->insert($historyData);
        }
    }

    /**
     * 寫入歷史訊息檔案資訊
     * @param  Array $historyFileData 歷史訊息檔案資料
     */
    public function insertHistoryFile($historyFileData){
        if(count($historyFileData) > 0){
         $this->historyFile->insert($historyFileData);
        }
    }

    /**
     * 根據開始及結束時間取得歷史訊息
     * @param  string $groupId 聊天室id(group_id)
     * @param  int $start   開始時間
     * @param  int $end     結束時間
     * @param  int $sort         0:asc | 1:desc
     * @return mixed
     */
    public function getHistoryByTime($groupId, $start, $end, $sort){
         return $this->history
             ->leftjoin('qp_history_file','qp_history.msg_id','=','qp_history_file.msg_id')
             ->where('target_id',$groupId)
             ->where('ctime','>=',$start)
             ->where('ctime','<=',$end)
             ->orderBy('ctime',$sort)
             ->get();
    }

    /**
     * 根據指標取得歷史訊息
     * @param  string $groupId 聊天室id(group_id)
     * @param  int    $cursor  指標，這裡用來查create_time > $cursor以後的資料
     * @param  int $sort         0:asc | 1:desc
     * @return mixed
     */
    public function getHistoryByCursor($groupId, $cursor, $sort){
         return $this->history
             ->leftjoin('qp_history_file','qp_history.msg_id','=','qp_history_file.msg_id')
             ->where('target_id',$groupId)
             ->where('ctime','>',$cursor)
             ->orderBy('ctime',$sort)
             ->get();
            
    }
    
    /**
     * 新增或更新資料
     * @param  string $db      DB connection
     * @param  string $table   table name
     * @param  string $columns 要批次寫入的欄位(逗號分隔)
     * @param  Array  $data    寫入的資料(多筆)
     */
    private function upsertData($db, $table, $columns, $data){
        $array = [];
        foreach ($data as $idx => $obj) {
            $str = '( ';
            $i = 0;
            foreach ($obj as $key => $value) {
                if($i == 0){
                    $str = $str . "'" . $value . "'";
                }else{
                    $str = $str . ',' . "'" . $value. "'";
                }
                $i++;
            }
            $str = $str . ')';
            $array[] = $str;
        }
        $values = implode(",", $array);
        $sql = "INSERT IGNORE  INTO " . $table . " (" . $columns . ") VALUES " . $values ;
        \DB::connection( $db )->statement( $sql );
    }

}