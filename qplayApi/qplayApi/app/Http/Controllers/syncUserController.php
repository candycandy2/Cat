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
                //1.1 read from excel and batch insert into user_sync and user_resign as temp
                $readyToSync = $this->syncUserService->insertUserDataIntoTemp($fileName, $sourceFrom);

                if( $readyToSync > 0){
                    Log::info('Ready To Sync: '.$readyToSync);
                }
                //1.2 merge qp_user_sync into qp_user
                $first = false;
                if((!is_null($request->input('first'))) && (strtolower($request->input('first')) == 'y')){
                    $first = true;
                }
                //1.3 delete register information and Jpush Tag
                $delUsers =  $this->syncUserService->getResignUsers();
                if(count($delUsers) > 0){
                    $this->registerService->unRegisterUserbyUserIds($delUsers);
                }
                //1.4 merge user
                $mergeResult = $this->syncUserService->mergeUser($sourceFrom, $first);
                Log::info('Update Inactive User Count: '.$mergeResult['updateInactive']);
                Log::info('Update Active User Count: '.$mergeResult['updateActive']);
                Log::info('New User Count: '.$mergeResult['insertNew']);
                $totalCount = $mergeResult['updateInactive'] + $mergeResult['updateActive'] + $mergeResult['insertNew'];
                Log::info('Total: '.$totalCount);
                
                //1.5 delete merged file
                Storage::delete($fileName);
                Log::info('Delete File: '.$fileName);
           }
        }
        Log::info('[Data Information]');
        //2. insert new company
        $companyRole = $this->roleService->addNewCompany();
        Log::info('Add company role:'.count($companyRole));
        //3. duplicate emp_no handle
        $duplicateUsers = $this->syncUserService->handlDuplicatedUser();
        Log::info('Duplicate users :'.count($duplicateUsers));

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