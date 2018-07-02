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
     * insert data into qp_user_sync
     * @param  Array $userList   all user list from excel
     */
    public function insertDataIntoTemp($userList){
        $this->userSyncRepository->insertUser($userList);
    }

    /**
     * merge qp_user and qp_user_sync
     * @param  boolean $first  is first time execute
     * @param  string $sourceFrom source from, ex:flower|qcsflower|ehr|partner
     */
    public function mergeUser($sourceFrom, $first=false){

        //1. update qp_user data by  where qp_user_sync.active = N 
        $this->userRepository->syncInactiveUser($sourceFrom, $first);
        
        //2.update qp_user data by  where qp_user_sync.active = Y
        $this->userRepository->syncActiveUser($sourceFrom, $first);

        //3.insert new data from qp_user_sync to qp_user
        $users = $this->userSyncRepository->getNewUser($sourceFrom, $first);
        $this->userRepository->insertUser($users);
        
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
    }


    /**
     * extract user data from excel, prepare to insert to qp_user
     * @param  string $fileName   source filename
     * @param  string $sourceFrom source
     * @return array
     */
    public function getUserDataFromExcel($fileName, $sourceFrom){
        $fileName = str_replace('/', DIRECTORY_SEPARATOR, $fileName);
        $result = [];
        if(Storage::disk('local')->has($fileName)){
            $path = storage_path(str_replace('/', DIRECTORY_SEPARATOR, 'app/'.$fileName));
            Excel::load($path, function($reader) use(&$sourceFrom, &$result){
                $result = $reader->toArray();
                foreach ($result as $index => &$row) {
                   $row = array_map('trim', $row);
                   $row['source_from'] = $sourceFrom;
                }
            });
        }
        return $result;
        
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