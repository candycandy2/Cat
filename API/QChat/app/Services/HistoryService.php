<?php
/**
 * 歷史訊息相關邏輯處理
 * @author Cleo.W.Chan
 */
namespace App\Services;

use App\Repositories\HistoryRepository;
use App\Repositories\MngHistoryRepository;
use App\lib\ResultCode;
use App\lib\CommonUtil;

class HistoryService
{   

    protected $historyRepository;
    protected $mngHistoryRepository;
    protected $jmessage;

    public function __construct(HistoryRepository $historyRepository,
                                MngHistoryRepository $mngHistoryRepository)
    {
        $this->historyRepository = $historyRepository;
        $this->mngHistoryRepository = $mngHistoryRepository;
    }

    /**
     * 寫入歷史訊息，若已存在則更新訊息
     * @param  Array $historyData  歷史訊息資料 
     */
    public function upsertHistory($historyData){
        $this->historyRepository->upsertHistory($historyData);
        $this->mngHistoryRepository->insertHistory($historyData);
    }

    /**
     * 寫入歷史訊息檔案資訊，若已存在則更新資訊
     * @param  Array $historyFileData 歷史訊息檔案資料
     */
    public function upsertHistoryFile($historyFileData){
        $this->historyRepository->upsertHistoryFile($historyFileData);
        $this->mngHistoryRepository->insertHistoryFile($historyFileData);
    }

}