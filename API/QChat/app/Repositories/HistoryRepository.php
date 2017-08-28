<?php
/**
 *  MySQL歷史訊息Repository
 * @author Cleo.W.Chan
 */
namespace App\Repositories;

use App\Model\QM_History;
use App\Model\QM_History_File;

use DB;

class HistoryRepository
{
    /** @var QM_History Inject History repository */
    protected $history;

    /** @var QM_History_File Inject History repository */
    protected $historyFile;
    
    public static $db = 'mysql_qmessage';

    public static $historyTable = 'qm_history';

    public static $historyFileTable = 'qm_history_file';

    public static $historyColumn = 'msg_id, msg_type, from_id, from_type, target_id, target_name, target_type, ctime, content';

    public static $historyFileColumn = 'msg_id, fname, fsize, format, npath, lpath, spath';
    /**
     * HistoryRepository constructor.
     * @param QM_History $history
     * @param QM_History_File $historyFile
     */
    public function __construct(QM_History $history, QM_History_File $historyFile)
    {
        $this->history = $history;
        $this->historyFile = $historyFile;
    }

    /**
     * 寫入歷史訊息
     * @param  Array $historyData  歷史訊息資料 
     */
    public function upsertHistory($historyData){
        $this->upsertData(self::$db,
                          self::$historyTable,
                          self::$historyColumn,
                          $historyData);
    }

    /**
     * 寫入歷史訊息檔案資訊
     * @param  Array $historyFileData 歷史訊息檔案資料
     */
    public function upsertHistoryFile($historyFileData){
        $this->upsertData(self::$db,
                          self::$historyFileTable,
                          self::$historyFileColumn,
                          $historyFileData);
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