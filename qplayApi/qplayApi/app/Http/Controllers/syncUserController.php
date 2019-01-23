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
    protected $sourceUserArray=[];

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
        $sourceUserArray = []; // record the user number from each source
        
        //1.arrange data by each source
        $source = Config::get('syncuser.source');
        foreach ($source as $sourceFrom) {
            
            $this->sourceUserArray[$sourceFrom] = 0;

            $undo = self::SYNC_FOLDER.DIRECTORY_SEPARATOR.
                        $sourceFrom.DIRECTORY_SEPARATOR.
                        self::UNDO_FOLDER.DIRECTORY_SEPARATOR;

            $files = Storage::allFiles($undo);

            if($sourceFrom == 'ehr'){
                $this->syncEHRUser($sourceFrom, $files);
            }else{
                $this->syncUser($sourceFrom, $files);
            }
            
        }

        Log::info('[Data Information]');

        //2. Insert new company
        $companyRole = $this->roleService->addNewCompany();
        Log::info('Add company role:'.count($companyRole));

        //3. Duplicate emp_no handle
        $duplicateUsers = $this->syncUserService->handlDuplicatedUser();
        Log::info('Duplicate users :'.count($duplicateUsers));

        //4. IF all source has users, execute auto resign user which was not been updated today
        if(!array_search(0, $this->sourceUserArray)){
            
            $autoResignUsers = $this->syncUserService->autoResignUser($source);
            $this->registerService->unRegisterUserbyUserIds($autoResignUsers);
            
            Log::info('Auto Resign users :'.count($autoResignUsers));
        }
    
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

    /**
     * Sync user from source file
     * @param string sourceFrom
     * @param file files  
     */
    private function syncUser($sourceFrom, $files){

        foreach ($files as $fileName) {
            Log::info('[Sync '.$sourceFrom.'-'.$fileName.']');
            //User Data Sync - 1. read from excel and batch insert into user_sync and user_resign as temp
            $readyToSync = $this->syncUserService->insertUserDataIntoTemp($fileName, $sourceFrom);

            $this->sourceUserArray[$sourceFrom] = $this->sourceUserArray[$sourceFrom] + $readyToSync;
            Log::info('Ready To Sync: '.$readyToSync);
            
            //User Data Sync - 2. delete register information and Jpush Tag
            $delUsers =  $this->syncUserService->getResignUsers();
            $this->registerService->unRegisterUserbyUserIds($delUsers);
            Log::info('Delete User Count: '.count($delUsers));
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

    /**
     * Sync eHr user from source file
     * @param string sourceFrom
     * @param file files  
     */
    private function syncEHRUser($sourceFrom, $files){

        foreach ($files as $fileName) {

            Log::info('[Sync '.$sourceFrom.'-'.$fileName.']');

            //eHR Data Sync - 0. INSERT Data Into  `qp_user_sync` which prepare to sync 
            $readyToSync = $this->syncUserService->insertUserDataIntoTemp($fileName, $sourceFrom);

            $this->sourceUserArray[$sourceFrom] = $this->sourceUserArray[$sourceFrom] + $readyToSync;
            Log::info('Ready To Sync EHR: '.$readyToSync);
            
            //eHR Data Sync - 1. INSERT Data Into `qp_user` from `qp_ehr_user` which emp_no not exist in `qp_user`
            $newUsers = $this->syncUserService->insertFromQPeHRUser();
            Log::info('New EHR User Count: '.$newUsers);
            //eHR Data Sync - 2. UPDATE Data in `qp_user` from `qp_ehr_user`, ignore the Data which was just INSERT.
            $updateUsers = $this->syncUserService->updateFromQPeHRUser();
            Log::info('Update EHR User Count: '.$updateUsers);
            //eHR Data Sync - 3. Delete register info and JPush Tag which the user in `qp_ehr_uaer` were resign.
            $delUsers = $this->syncUserService->getResignUsersFromQPeHRUser();
            $this->registerService->unRegisterUserbyUserIds($delUsers);
            
            Log::info('Delete EHR User Count: '.count($delUsers));

            Storage::delete($fileName);

        }
    }
}