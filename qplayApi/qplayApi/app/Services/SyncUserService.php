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
     * @param  string  $sourceFrom source from, ex:flower|qcsflower|ehr|partner
     * @return array   merge result
     */
    public function mergeUser($sourceFrom){

        $result = [ 'updateInactive' => 0,
                    'updateActive' => 0,
                    'insertNew' => 0
                  ];

        //1. update qp_user data by  where qp_user_sync.active = N 
        $result['updateInactive'] = $this->userSyncRepository->syncInactiveUser($sourceFrom);
        
        //2.update qp_user data by  where qp_user_sync.active = Y
        $result['updateActive'] = $this->userSyncRepository->syncActiveUser($sourceFrom);

        //3.batch insert new data from qp_user_sync to qp_user
        $users = $this->userSyncRepository->getNewUser($sourceFrom);
        $total = count($users);
        $limit = 1000;
        $page = ceil($total / $limit);
        for ($i = 0; $i < $page; $i++) {
           $this->userSyncRepository->insertUser(array_slice($users, $i*$limit, $limit)); 
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
        $duplicateUsers = $this->userSyncRepository->getDuplicatedUser()->toArray();
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
     * extract user data from excel, and insert to `qp_user_sync`
     * @param  string $fileName   source file name
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
                    //get insert data mapping
                    $batch[] = $this->getTampData($sourceFrom, $row);
                    $batchCount = count($batch);

                    //insert data each limit count
                    if( ($index + 1) == $total || $batchCount == $limit){

                        $this->userSyncRepository->insertUserSync($batch);
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
        // Get all ehr data
        $this->eHRAllUser = $this->userSyncRepository->getEHRAllUser();
        $eHREmpNoArray = [];
        $newUserCount = 0;

        foreach ($this->eHRAllUser as $data) {
            //Check if string [emp_no] contain [*],
            //it means this emp had internal transfer between two company before, ignore this data.
            if (strpos($data["emp_no"], "*")) {
                continue;
            }

            $eHREmpNoArray[] = strval(trim($data["emp_no"]));
        }

        // Get all emp_no from `qp_user`
        $allEmpNumber = $this->userSyncRepository->getAllEmpNumber();
        $userEmpNoArray = [];

        foreach ($allEmpNumber as $data) {
            $userEmpNoArray[] = strval(trim($data["emp_no"]));
        }

        // Find `qp_ehr_user`.emp_no Not IN `qp_user`.emp_no,
        // then Only INSERT these data.
        $this->newInsertData = array_diff($eHREmpNoArray, $userEmpNoArray);

        foreach ($this->eHRAllUser as $EHRData) {
            if (in_array(strval(trim($EHRData["emp_no"])), $this->newInsertData)) {
                
                $newUserCount ++;

                if (trim($EHRData["active"]) === "Y") {
                    $status = "Y";
                    $resign = "N";
                } else {
                    $status = "N";
                    $resign = "Y";
                }

                $now = date('Y-m-d H:i:s',time());

                $insertData = [
                    "login_id"          => strval(trim($EHRData["login_name"])),
                    "emp_no"            => strval(trim($EHRData["emp_no"])),
                    "emp_name"          => strval(trim($EHRData["emp_name"])),
                    "password"          => strval(trim($EHRData["password"])),
                    "password_original" => strval(trim($EHRData["password_original"])),
                    "trade_pwd_original"=> strval(trim($EHRData["trade_pwd_original"])),
                    "email"             => strval(trim($EHRData["mail_account"])),
                    "ext_no"            => strval(trim($EHRData["ext_no"])),
                    "user_domain"       => strval(trim($EHRData["domain"])),
                    "company"           => strval(trim($EHRData["company"])),
                    "department"        => strval(trim($EHRData["dept_code"])),
                    "status"            => $status,
                    "resign"            => $resign,
                    "ad_flag"           => strval(trim($EHRData["ad_flag"])),
                    "register_message"  => "N",
                    "change_pwd"        => "N",
                    "source_from"       => "ehr",
                    "created_user"      => "-1",
                    "updated_user"      => "-1",
                    "created_at"        => $now
                ];

                if ($resign === "Y") {
                    $insertData["deleted_at"] = $EHRData["dimission_date"];
                }

                $this->userSyncRepository->insertUserFromEHR($insertData);

            }
        }

        return $newUserCount;
    }

    /**
     * Update `qp_user` set login_id = qp_ehr_user.emp_no, emp_name = emp_name, email = mail_account, ext_no = ext_no,
     *         company = company, resign = !active
     */
    public function updateFromQPeHRUser()
    {
        // Get all ehr data
        $eHREmpNoArray = [];
        $updateCount = 0;
        foreach ($this->eHRAllUser as $data) {
            //Check if string [emp_no] contain [*],
            //it means this emp had internal transfer between two company before, ignore this data.
            if (strpos($data["emp_no"], "*")) {
                continue;
            }

            $eHREmpNoArray[] = strval(trim($data["emp_no"]));
        }

        // Ignore the Data which was just INSERT
        $oldExistData = array_diff($eHREmpNoArray, $this->newInsertData);

        // Get data from `qp_user` which emp_no exist in `qp_ehr_user`
        $allUSer = $this->userSyncRepository->getUserByEmpNO($oldExistData);

        $userDataArray = [];

        foreach ($allUSer as $data) {
            $userDataArray[strval(trim($data["emp_no"]))] = $data;
        }

        foreach ($this->eHRAllUser as $EHRData) {
            $empNO = strval(trim($EHRData["emp_no"]));
            //$empID = strval(trim($EHRData["emp_id"]));

            //Check if string [emp_no] contain [*],
            //it means this emp had internal transfer between two company before, ignore this data.
            if (strpos($empNO, "*")) {
                continue;
            }

            if (in_array($empNO, $oldExistData)) {
                $updateCount ++;
                $now = date('Y-m-d H:i:s',time());

                //Check if source_form=ehr or other
                if ($userDataArray[$empNO]["source_from"] == "ehr") {
                    $updateData = [
                        "emp_name"      => strval(trim($EHRData["emp_name"])),
                        "email"         => strval(trim($EHRData["mail_account"])),
                        "ext_no"        => strval(trim($EHRData["ext_no"])),
                        "company"       => strval(trim($EHRData["company"])),
                        "user_domain"   => strval(trim($EHRData["domain"])),
                        "department"    => strval(trim($EHRData["dept_code"])),
                        "ad_flag"       => strval(trim($EHRData["ad_flag"])),
                        "updated_at"    => $now,
                    ];
                } else {
                    $updateData = [
                        "company"       => strval(trim($EHRData["company"])),
                        "department"    => strval(trim($EHRData["dept_code"])),
                        "ad_flag"       => strval(trim($EHRData["ad_flag"])),
                        "updated_at"    => $now
                    ];
                }

                //Only process `qp_ehr_user`.active = N
                if (trim($EHRData["active"]) === "N") {
                    $updateData["resign"] = "Y";
                    $updateData["status"] = "N";
                    $updateData["deleted_at"] = $EHRData["dimission_date"];

                    //Store all regisn user from eHR
                    $this->resignUserFormEHR[] = $userDataArray[$empNO];
                }

                //Check if login_id is not English/Number
                /*
                if (!preg_match('/^[a-zA-Z0-9@-_. ]+$/', $userDataArray[$empNO]["login_id"])) {
                    echo ">>".$userDataArray[$empNO]["login_id"]."<br>";
                    $login_id = $empNO;
                    $updateData["login_id"] = $login_id;
                }
                */

                //Check if password_original is null
                if (is_null($userDataArray[$empNO]["password_original"])) {
                    $updateData["password"] = $EHRData["password"];
                    $updateData["password_original"] = $EHRData["password_original"];
                    $updateData["trade_pwd_original"] = $EHRData["trade_pwd_original"];
                }

                $this->userSyncRepository->updateUserFromEHR($empNO, $updateData);
            }
        }
        return $updateCount;
    }

    /**
     * Get all user_row_id of resign user form eHR
     * @return Array
     */
    public function getResignUsersFromQPeHRUser()
    {
        $resignUserRowIDArray = [];

        if (isset($this->resignUserFormEHR)) {
            foreach ($this->resignUserFormEHR as $data) {
                $resignUserRowIDArray[] = $data["row_id"];
            }
        }

        return $resignUserRowIDArray;
    }

    /**
     * Get Data format to insert into `qp_user_sync`
     * @param  string $sourceFrom source_from
     * @param  Array $row        execl user raw data
     * @return Array
     */
    private function getTampData($sourceFrom, Array $row){

        $row['source_from'] = $sourceFrom;

        $pwdQAccount        = NULL;
        $pwdTrade           = NULL;
        $domain             = NULL;
        $adFlag             = 'Y';
        $loginNameCH        = NULL;
        $siteCode           = NULL;
        $dimissionDate      = '0000-00-00 00:00:00';

        if (isset($row['domain'])) {
            $domain = strval(trim($row["domain"]));
        }else{
            if(strtoupper(trim($row["company"])) == "QISDA"){
                $domain = "Qgroup";
            }else{
                $domain = strval(trim($row["company"]));
            }
        }

        if (isset($row['login_name'])) {
            $loginName =   strval(trim($row['login_name']));
        }else{
            $loginName =   strval(trim($row['emp_name']));
        }

        if (isset($row['emp_name_ch'])) {
            $loginNameCH =   strval(trim($row['emp_name_ch']));
        }
        
        if (isset($row['site_code'])) {
            $siteCode =   strval(trim($row['site_code']));
        }

        if(isset($row['dimission_date'])){
            $dimissionDate = $row['dimission_date'];
        }

        if(strtolower($sourceFrom) == 'ehr'){
            
            //Create QAccount Password
            $options = [
                'cost' => '08'
            ];
            $pwdQAccount = password_hash( $row['emp_id'], PASSWORD_BCRYPT, $options);

            //Create Trade Password
            $options = [
                'cost' => '08'
            ];
            $pwdTrade = password_hash(substr( $row['emp_id'], -4), PASSWORD_BCRYPT, $options);

            $adFlag =  strval(trim($row["welfare"]));

        }

        
        $data = [
                "emp_no"            => strval(trim($row['emp_no'])),
                "login_name"        => $loginName,
                "emp_name"          => strval(trim($row['emp_name'])),
                "emp_name_ch"       => $loginNameCH,
                "password"          => $pwdQAccount,
                "password_original" => $pwdQAccount,
                "trade_pwd_original"=> $pwdTrade,
                "mail_account"      => strval(trim($row["mail_account"])),
                "ext_no"            => strval(trim($row["ext_no"])),
                "domain"            => $domain,
                "site_code"         => $siteCode,
                "company"           => strval(trim($row["company"])),
                "dept_code"         => strval(trim($row["dept_code"])),
                "active"            => strval(trim($row["active"])),
                "ad_flag"           => $adFlag ,
                "source_from"       => $sourceFrom,
                "dimission_date"    => $dimissionDate
            ];

        return $data;
    }
}