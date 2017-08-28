<?php
/**
 * MongoDB歷史訊息Repository
 * @author Cleo.W.Chan
 */
namespace App\Repositories;
use Config;
use App\Model\MNG_History;
use App\Model\MNG_History_File;
use Mongo;
use DB;

class MngHistoryRepository
{
    /** @var MNG_History Inject MngHistory repository */
    protected $history;

    /** @var MNG_History_File Inject MngHistory repository */
    protected $historyFile;

    protected $conn;
    /**
     * MngHistoryRepository constructor.
     * @param MNG_History $history
     * @param MNG_History_File $historyFile
     */
    public function __construct(MNG_History $history, MNG_History_File $historyFile)
    {
        $this->history = $history;
        $this->historyFile = $historyFile;
    }

    /**
     * 寫入歷史訊息，若已存在則更新訊息
     * @param  Array $historyData  歷史訊息資料 
     */
    public function insertHistory($historyData){
        $this->history->insert($historyData);
    }

    /**
     * 寫入歷史訊息檔案資訊，若已存在則更新資訊
     * @param  Array $historyFileData 歷史訊息檔案資料
     */
    public function insertHistoryFile($historyFileData){
        $this->historyFile->insert($historyFileData);
    }
}