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
    protected $newInsertData;

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
            $readyToSync = 0;
            $path = storage_path(str_replace('/', DIRECTORY_SEPARATOR, 'app/'.$fileName));
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

    /**
     * INSERT Data Into `qp_user` from `qp_ehr_user` which emp_no not exist in `qp_user`
     */
    public function insertFromQPeHRUser()
    {
        // Get all active ehr data
        $eHRActiveUser = $this->userSyncRepository->getEHRActiveUser();
        $eHREmpNoActiveArray = [];

        foreach ($eHRActiveUser as $data) {
            $eHREmpNoActiveArray[] = strval(trim($data["emp_no"]));
        }

        // Get all emp_no from `qp_user`
        $allEmpNumber = $this->userSyncRepository->getAllEmpNumber();
        $userEmpNoArray = [];

        foreach ($allEmpNumber as $data) {
            $userEmpNoArray[] = strval(trim($data["emp_no"]));
        }

        // Find `qp_ehr_user`.emp_no Not IN `qp_user`.emp_no,
        // then Only INSERT these data.
        $this->newInsertData = array_diff($eHREmpNoActiveArray, $userEmpNoArray);

        foreach ($eHRActiveUser as $EHRData) {
            if (in_array(strval(trim($EHRData["emp_no"])), $this->newInsertData)) {

                $empID = strval(trim($EHRData["emp_id"]));
                $empNO = strval(trim($EHRData["emp_no"]));

                $options = [
                    'cost' => '08'
                ];
                $pwd = password_hash($empID, PASSWORD_BCRYPT, $options);

                if (trim($EHRData["active"]) === "Y") {
                    $resign = "N";
                } else {
                    $resign = "Y";
                }

                $now = date('Y-m-d H:i:s',time());

                $insertData = [
                    "login_id"          => $empNO,
                    "emp_no"            => $empNO,
                    "emp_name"          => strval(trim($EHRData["emp_name"])),
                    "password"          => $pwd,
                    "emp_id"            => $empID,
                    "email"             => strval(trim($EHRData["mail_account"])),
                    "ext_no"            => strval(trim($EHRData["ext_no"])),
                    "user_domain"       => strval(trim($EHRData["company"])),
                    "company"           => strval(trim($EHRData["company"])),
                    "department"        => strval(trim($EHRData["dept_code"])),
                    "status"            => "Y",
                    "resign"            => $resign,
                    "register_message"  => "N",
                    "ad_flag"           => "Y",
                    "reset_pwd"         => "N",
                    "source_from"       => "ehr",
                    "created_user"      => "-1",
                    "updated_user"      => "-1",
                    "created_at"        => $now
                ];

                $this->userSyncRepository->insertUserFromEHR($insertData);

            }
        }
    }

    /**
     * Update `qp_user` set login_id = qp_ehr_user.emp_no, emp_name = emp_name, email = mail_account, ext_no = ext_no,
     *         company = company, resign = !active
     */
    public function updateFromQPeHRUser()
    {
        // Get all ehr data
        $eHRAllUser = $this->userSyncRepository->getEHRAllUser();
        $ehrEmpNoArray = [];

        foreach ($eHRAllUser as $data) {
            //Check if string [emp_no] contain [*],
            //it means this emp had internal transfer between two company before, ignore this data.
            if (strpos($data["emp_no"], "*")) {
                continue;
            }

            $ehrEmpNoArray[] = strval(trim($data["emp_no"]));
        }

        // Ignore the Data which was just INSERT
        $oldExistData = array_diff($ehrEmpNoArray, $this->newInsertData);

        // Get data from `qp_user` which emp_no exist in `qp_ehr_user`
        $allUser = $this->userSyncRepository->getUserByEmpNO($oldExistData);

        $userDataArray = [];

        foreach ($allUser as $data) {
            $userDataArray[strval(trim($data["emp_no"]))] = $data;
        }

        foreach ($eHRAllUser as $EHRData) {
            //Ignore active=N data
            if (trim($EHRData["active"]) === "N") {
                continue;
            }

            $empNO = strval(trim($EHRData["emp_no"]));
            $empID = strval(trim($EHRData["emp_id"]));

            //Check if string [emp_no] contain [*],
            //it means this emp had internal transfer between two company before, ignore this data.
            if (strpos($empNO, "*")) {
                continue;
            }

            if (in_array($empNO, $oldExistData)) {

                if (trim($EHRData["active"]) === "Y") {
                    $resign = "N";
                } else {
                    $resign = "Y";
                }

                $now = date('Y-m-d H:i:s',time());

                $updateData = [
                    "emp_name"      => strval(trim($EHRData["emp_name"])),
                    "email"         => strval(trim($EHRData["mail_account"])),
                    "ext_no"        => strval(trim($EHRData["ext_no"])),
                    "company"       => strval(trim($EHRData["company"])),
                    "user_domain"   => strval(trim($EHRData["company"])),
                    "resign"        => $resign,
                    "updated_at"    => $now
                ];

                //Check if login_id is not English/Number
                if (!preg_match('/^[a-zA-Z0-9@-_. ]+$/', $userDataArray[$empNO]["login_id"])) {
                    echo ">>".$userDataArray[$empNO]["login_id"]."<br>";
                    $login_id = $empNO;
                    $updateData["login_id"] = $login_id;
                }

                //Check if emp_id is null
                if (is_null($userDataArray[$empNO]["emp_id"])) {
                    $options = [
                        'cost' => '08',
                    ];
                    $pwd = password_hash($empID, PASSWORD_BCRYPT, $options);

                    $updateData["emp_id"] = $empID;
                    $updateData["password"] = $pwd;
                }

                $this->userSyncRepository->updateUserFromEHR($empNO, $updateData);

            }
        }
    }

}