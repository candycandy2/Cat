<?php
namespace App\Services;

use App\Repositories\UserRepository;
use App\Repositories\UserSyncRepository;
use Excel;
use Storage;
use Config;
use Mail;
use Exception;


class SyncUserService
{
    protected $userRepository;
    protected $userSyncRepository;

    public function __construct(UserRepository $userRepository,
                                UserSyncRepository $userSyncRepository)
    {
        $this->userRepository = $userRepository;
        $this->userSyncRepository = $userSyncRepository;
    }

    /**
     * remove all data from user sync table
     */
    public function clearSyncUserTable(){
        $this->userSyncRepository->truncatUser();
    }

    /**
     * merge qp_user and qp_user_sync
     * @param  boolean $first  is first time execute
     * @param  string  $sourceFrom source from, ex:flower|qcsflower|ehr|partner
     * @return array   merge result
     */
    public function mergeUser($sourceFrom, $first=false){
        $result = [ 'updateInactive' => 0,
                    'updateActive' => 0,
                    'insertNew' => 0
                  ];
        //1. update qp_user data by  where qp_user_sync.active = N 
        $result['updateInactive'] = $this->userRepository->syncInactiveUser($sourceFrom, $first);
        
        //2.update qp_user data by  where qp_user_sync.active = Y
        $result['updateActive'] = $this->userRepository->syncActiveUser($sourceFrom, $first);

        //3.batch insert new data from qp_user_sync to qp_user
        $users = $this->userSyncRepository->getNewUser($sourceFrom, $first);
        $total = count($users);
        $limit = 1000;
        $page = ceil($total / $limit);
        for ($i = 0; $i < $page; $i++) {
           $this->userRepository->insertUser(array_slice($users, $i*$limit, $limit)); 
        }
        $result['insertNew'] = $total;
        return $result;
    }

    /**
     * get resign user list
     * @return Array
     */
    public function getResignUsers(){
        return $this->userSyncRepository->getResignUser()->toArray();
    }

    /**
     * This function will send mail to admin,
     * if find out some one's emp_no is duplicated,
     * you can set up the reciver via .env Error Handler Parameters
     * @return Array duplicate users info
     */
    public function handlDuplicatedUser(){
        $duplicateUsers = $this->userRepository->getDuplicatedUser()->toArray();
        if(count($duplicateUsers) > 0){
                $data = array('columns'=>array_keys($duplicateUsers[0]),
                              'users'=>$duplicateUsers);
                Mail::send('emails.empno_duplicate', $data, function($message)
                {   
                    $from = \Config('app.error_mail_from');
                    $fromName = \Config('app.error_mail_from_name');
                    $to = explode(',',\Config('app.error_mail_to'));
                    if(count($to) > 0){
                        $subject = '**['.\Config('app.env').'] syncUserJob - QPlay User EmployeeNo Duplicate **';
                        $message->from( $from , $fromName);
                        $message->to($to)->subject($subject);
                    }
                });
        }
        return $duplicateUsers;
    }


    /**
     * extract user data from excel, and insert to qp_user
     * @param  string $fileName   source filename
     * @param  string $sourceFrom source
     * @return int                ready to sync count
     */
    public function insertUserDataIntoTemp($fileName, $sourceFrom){
        // truncat qp_user_sync
        $this->userSyncRepository->truncatUser();

        $fileName = str_replace('/', DIRECTORY_SEPARATOR, $fileName);
        if(Storage::disk('local')->has($fileName)){
            //read file and batch insert
            $path = storage_path(str_replace('/', DIRECTORY_SEPARATOR, 'app/'.$fileName));
            $readyToSync = 0;
            Excel::load($path, function($reader) use(&$sourceFrom, &$readyToSync){
                $result = $reader->toArray();
                $total = count($result);
                $limit = 1000;
                $batch = [];
                foreach ($result as $index => $row) {
                    $row['source_from'] = $sourceFrom;
                    $batch[] = array_map('trim', $row);
                    $batchCount = count($batch);
                    if( ($index + 1) == $total || $batchCount == $limit){
                        $this->userSyncRepository->insertUser($batch);
                        $readyToSync = $readyToSync + $batchCount;
                        $batch = [];
                    }
                }
            });
        }

        return $readyToSync;
    }

    /**
     * get source from directories, it will return all syncuser folder as source array
     * @param  String $rootFolderName target directory
     * @return array  returns an array of all of the files in a given directory. 
     */
    public function getSource($rootFolderName){
        $allSource = Storage::directories($rootFolderName);
        $source = [];
        foreach ($allSource as $name) {
            $source[] = explode('/', $name)[1];
        }
        return $source;
    }
    
}