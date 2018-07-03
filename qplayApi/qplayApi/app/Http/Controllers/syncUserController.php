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
        set_time_limit(0);
        $timeStart = microtime(true); 
        DB::beginTransaction();
        try{
            //1.arrange data by each source
            $source = Config::get('syncuser.source');
            foreach ($source as $sourceFrom) {
                $undo = self::SYNC_FOLDER.DIRECTORY_SEPARATOR.
                            $sourceFrom.DIRECTORY_SEPARATOR.
                            self::UNDO_FOLDER.DIRECTORY_SEPARATOR;

                $files = Storage::allFiles($undo);
                foreach ($files as $fileName) {
                    //1.1 read file from server
                    $userList = $this->syncUserService->getUserDataFromExcel($fileName, $sourceFrom);

                    //1.2 insert into user_sync and user_resign as temp
                    $this->syncUserService->clearSyncUserTable();
                    $this->syncUserService->insertDataIntoTemp($userList);

                    //1.3 merge qp_user_sync into qp_user
                    $first = false;
                    if((!is_null($request->input('first'))) && (strtolower($request->input('first')) == 'y')){
                        $first = true;
                    }
                    //1.4 delete register information and Jpush Tag
                    $delUsers =  $this->syncUserService->getResignUsers();
                    if(count($delUsers) > 0){
                            $this->registerService->unRegisterUserbyUserIds($delUsers);
                    }
                    $this->syncUserService->mergeUser($sourceFrom, $first);

                    //1.5 delete file
                    Storage::delete($fileName);
               }
            }
            
            //2. insert new company
            $companyRole = $this->roleService->addNewCompany();
            
            //3. duplicate emp_no handle
            $this->syncUserService->handlDuplicatedUser();

            Storage::deleteDirectory(self::SYNC_FOLDER);
            $timeEnd = microtime(true);
            $executionTime = ($timeEnd - $timeStart)/60;

            DB::commit();
            $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
                'message'=>trans("messages.MSG_CALL_SERVICE_SUCCESS"),
                'content'=>'syncUserJob execution time : '.$executionTime
            ];
            return response()->json($result);
        }catch(Exception $e){
            DB::rollBack();
            throw $e;
        }
    }
}