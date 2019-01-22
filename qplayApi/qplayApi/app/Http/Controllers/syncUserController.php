<?php

namespace App\Http\Controllers;
use App\lib\Verify;
use App\lib\ResultCode;
use Illuminate\Http\Request;
use App\Services\SyncUserService;
use App\Services\RegisterService;
use App\Services\RoleService;
use Storage;
use DB;
use Config;
use Exception;
use Log;

class syncUserController extends Controller
{   

    protected $syncUserService;
    protected $registerService;
    protected $roleService;
    const SYNC_FOLDER ='syncuser';
    const UNDO_FOLDER ='undo';

    public function __construct(SyncUserService $syncUserService,
                                RegisterService $registerService,
                                RoleService $roleService){
        $this->syncUserService = $syncUserService;
        $this->registerService = $registerService;
        $this->roleService = $roleService;
    }

    /**
     * This API can sync and merge user 
     * @return json
     */
    public function syncUserJob(Request $request){

        Log::info('==========Start SyncUserJob==========');
        ini_set("memory_limit","2048M");
        set_time_limit(0);
        $timeStart = microtime(true); 
        //1.arrange data by each source
        $source = Config::get('syncuser.source');
        foreach ($source as $sourceFrom) {
            $undo = self::SYNC_FOLDER.DIRECTORY_SEPARATOR.
                        $sourceFrom.DIRECTORY_SEPARATOR.
                        self::UNDO_FOLDER.DIRECTORY_SEPARATOR;

            $files = Storage::allFiles($undo);
            foreach ($files as $fileName) {

                Log::info('[Sync '.$sourceFrom.'-'.$fileName.']');
                //User Data Sync - 1. read from excel and batch insert into user_sync and user_resign as temp
                $readyToSync = $this->syncUserService->insertUserDataIntoTemp($fileName, $sourceFrom);

                if( $readyToSync > 0){
                    Log::info('Ready To Sync: '.$readyToSync);
                }
                //User Data Sync - 2. delete register information and Jpush Tag
                $delUsers =  $this->syncUserService->getResignUsers();
                $this->registerService->unRegisterUserbyUserIds($delUsers);

                //User Data Sync - 3. merge user
                $mergeResult = $this->syncUserService->mergeUser($sourceFrom);

                Log::info('Update Inactive User Count: '.$mergeResult['updateInactive']);
                Log::info('Update Active User Count: '.$mergeResult['updateActive']);
                Log::info('New User Count: '.$mergeResult['insertNew']);

                $totalCount = $mergeResult['updateInactive'] + $mergeResult['updateActive'] + $mergeResult['insertNew'];

                Log::info('Total: '.$totalCount);
                
                //User Data Sync - 4. delete merged file
                Storage::delete($fileName);

                Log::info('Delete File: '.$fileName);
           }
        }
        
        $ehrUndo = self::SYNC_FOLDER.DIRECTORY_SEPARATOR.
                        'ehr'.DIRECTORY_SEPARATOR.
                        self::UNDO_FOLDER.DIRECTORY_SEPARATOR;
        $ehrFiles = Storage::allFiles($ehrUndo);

        foreach ($ehrFiles as $ehrFileName) {

            Log::info('[Sync '.$sourceFrom.'-'.$ehrFileName.']');

            //eHR Data Sync - 0. INSERT Data Into  `qp_user_sync` which prepare to sync 
            $readyToSyncEHR = $this->syncUserService->insertUserDataIntoTemp($ehrFileName, 'ehr');
            if( $readyToSyncEHR > 0){
                Log::info('Ready To Sync EHR: '.$readyToSyncEHR);
            }
            //eHR Data Sync - 1. INSERT Data Into `qp_user` from `qp_ehr_user` which emp_no not exist in `qp_user`
            $newUserEHR = $this->syncUserService->insertFromQPeHRUser();
            Log::info('New EHR User Count: '.$newUserEHR);
            //eHR Data Sync - 2. UPDATE Data in `qp_user` from `qp_ehr_user`, ignore the Data which was just INSERT.
            $updateUserEHR = $this->syncUserService->updateFromQPeHRUser();
            Log::info('Update EHR User Count: '.$updateUserEHR);
            //eHR Data Sync - 3. Delete register info and JPush Tag which the user in `qp_ehr_uaer` were resign.
            $delUsersEHR = $this->syncUserService->getResignUsersFromQPeHRUser();
            $this->registerService->unRegisterUserbyUserIds($delUsersEHR);

            Log::info('Delete EHR User Count: '.count($delUsersEHR));

            Storage::delete($ehrFileName);
        }

        Log::info('[Data Information]');

        //2. Insert new company
        $companyRole = $this->roleService->addNewCompany();
        Log::info('Add company role:'.count($companyRole));

        //3. Duplicate emp_no handle
        $duplicateUsers = $this->syncUserService->handlDuplicatedUser();
        Log::info('Duplicate users :'.count($duplicateUsers));

        //4. Auto resign user which was not been updated today
        $sourceAll = Config::get('syncuser.source');
        array_push($sourceAll, 'ehr');
        $autoResignUsers = $this->syncUserService->autoResignUser($sourceAll);
        $this->registerService->unRegisterUserbyUserIds($autoResignUsers);
        Log::info('Auto Resign users :'.count($autoResignUsers));
    
        Storage::deleteDirectory(self::SYNC_FOLDER);
        Log::info('Delete Folder: '.self::SYNC_FOLDER);

        $timeEnd = microtime(true);
        $executionTime = ($timeEnd - $timeStart);
        Log::info('SyncUserJob execution time :'.$executionTime.' seconds');
        $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
            'message'=>trans("messages.MSG_CALL_SERVICE_SUCCESS"),
            'content'=>'syncUserJob execution time : '.$executionTime.' seconds'
        ];
        Log::info('==========End SyncUserJob==========');
        return response()->json($result);
    }
}