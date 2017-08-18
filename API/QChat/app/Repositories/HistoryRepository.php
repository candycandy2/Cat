<?php
/**
 * 用戶Parameter相關資料處理
 * @author Cleo.W.Chan
 */
namespace App\Repositories;

use App\Model\QM_History;
use App\Model\QM_History_File;
use App\Model\MNG_History;
use App\Model\MNG_History_File;

use DB;

class HistoryRepository
{
    /** @var User Inject QP_User model */
    protected $parameterType;
    
    /**
     * HistoryRepository constructor.
     * @param QM_History $history
     * @param QM_History_File $historyFile
     * @param MNG_History $history
     * @param MNG_History_File $historyFile
     */
    public function __construct(QM_History $history, QM_History_File $historyFile,
                                MNG_History $mngHistory, MNG_History_File $mngHistoryFile)
    {
        $this->history = $history;
        $this->historyFile = $historyFile;
        $this->mngHistory = $mngHistory;
        $this->mngHistoryFile = $mngHistoryFile;
    }

    /**
     * 寫入歷史訊息
     * @param  Array $historyData  歷史訊息資料 
     */
    public function insertHistory($historyData){
        $this->history->insert($historyData);
        $this->mngHistory->insert($historyData);
    }

    /**
     * 寫入歷史訊息檔案資訊
     * @param  Array $historyFileData 歷史訊息檔案資料
     */
    public function insertHistoryFile($historyFileData){
        $this->historyFile->insert($historyFileData);
        //$this->mngHistoryFile->insert($historyData);
    }
}