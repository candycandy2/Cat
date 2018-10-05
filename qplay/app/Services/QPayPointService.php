<?php
/**
 * QPay Point - Service
 * @author  Darren.K.Ti darren.k.ti@benq.com
 */
namespace App\Services;

use App\Repositories\QPayPointTypeRepository;
use App\Repositories\QPayPointStoreRepository;
use App\Repositories\QPayMemberRepository;
use App\lib\ResultCode;
use Auth;
use Session;
use Excel;
use DB;
use Storage;

class QPayPointService
{

    protected $qpayPointTypeRepository;
    protected $qpayPointStoreRepository;
    protected $qpayMemberRepository;
    protected $pointStoreID = 0;
    protected $pointStoreSuccess = false;
    protected $excelDataInfo = [];
    protected $allEmpDataArray = [];
    protected $errorEmpNoArray = [];

    /**
     * QPayPointService constructor.
     * @param QPayPointTypeRepository $qpayPointTypeRepository
     * @param QPayPointStoreRepository $qpayPointStoreRepository
     * @param QPayMemberRepository $qpayMemberRepository
     */
    public function __construct(QPayPointTypeRepository $qpayPointTypeRepository,
                                QPayPointStoreRepository $qpayPointStoreRepository,
                                QPayMemberRepository $qpayMemberRepository)
    {
        $this->qpayPointTypeRepository = $qpayPointTypeRepository;
        $this->qpayPointStoreRepository = $qpayPointStoreRepository;
        $this->qpayMemberRepository = $qpayMemberRepository;
    }

    /**
     * Get QPay Point Type List
     * @return mixed
     */
    public function getQPayPointTypeList()
    {
        return $this->qpayPointTypeRepository->getQPayPointTypeList();
    }

    /**
     * Upload Excel Data and Process it.
     * @return excel data
     */
    public function uploadPointExcel($request)
    {
        if (Auth::user() == null || Auth::user()->login_id == null || Auth::user()->login_id == "") {
            return null;
        }

        $input = $request->all();

        //Upload Excel Data
        if (isset($input["excelFile"])) {
            $savedFileName = uniqid().".xlsx";
            $destinationPath = "temp_upload/";

            Session::set("excelFileOriginalName", $input["excelFile"]->getClientOriginalName());
            Session::set("excelFileSavedName", $savedFileName);
            Session::set("pointTypeID", $input["pointTypeID"]);

            if (!file_exists($destinationPath)) {
                mkdir($destinationPath, 0755, true);
            }

            $input["excelFile"]->move($destinationPath, $savedFileName);

            //Load Excel Data
            Excel::load($destinationPath.$savedFileName, function($reader) {

                $excelData = $reader->get();

                //Get All emp_no & datas
                $excelDataCount = 0;
                $excelEmpNoArray = [];
                $point = 0;

                foreach ($excelData as $data) {
                    if (strlen(strval(trim($data["empno"]))) == 0) {
                        continue;
                    }

                    $excelEmpNoArray[] = strval(trim($data["empno"]));
                    $point = strval(trim($data["point"]));

                    $empData = [
                        "company" => trim($data["company"]),
                        "department" => trim($data["department"]),
                        "namech" => trim($data["namech"]),
                        "nameen" => trim($data["nameen"]),
                        "empno" => strval(trim($data["empno"]))
                    ];
                    $this->allEmpDataArray[] = $empData;

                    $excelDataCount++;
                }

                //Count excel data
                $this->excelDataInfo["point"] = $point;
                $this->excelDataInfo["empCount"] = number_format($excelDataCount);
                $this->excelDataInfo["pointCount"] = number_format($excelDataCount * $point);
                Session::set("excelDataInfo", $this->excelDataInfo);

                //Find All emp_no which exist in `qp_user`
                $result = DB::table('qp_user')
                        -> select('emp_no')
                        -> whereIn('emp_no', $excelEmpNoArray)
                        -> where('resign', '=', 'N')
                        -> get();

                $result = array_map(function ($value) {
                    return (array) $value;
                }, $result);

                $userEmpNoArray = [];

                foreach ($result as $data) {
                    $userEmpNoArray[] = strval(trim($data["emp_no"]));
                }

                //Check if any emp_no not exist in `qp_user`
                $this->errorEmpNoArray = array_diff($excelEmpNoArray, $userEmpNoArray);

            });

            //Return the result
            $result = [];

            if (count($this->errorEmpNoArray) == 0) {
                $result["result_code"] = ResultCode::_1_reponseSuccessful;
                $result["all_empno"] = $this->allEmpDataArray;
                $result["excel_data_info"] = $this->excelDataInfo;
            } else {
                $errorEmpNo = [];

                foreach ($this->errorEmpNoArray as $key => $val) {
                    $errorEmpNo[] = $val;
                }

                $result["result_code"] = ResultCode::_000901_userNotExistError;
                $result["error_empno"] = $errorEmpNo;
            }

            return json_encode($result);
        } else {
            return false;
        }

    }

    /**
     * New Point Store
     * @return result
     */
    public function newPointStore()
    {
        $this->pointStoreID = $this->qpayPointStoreRepository->newPointStore();

        if (isset($this->pointStoreID) && is_numeric($this->pointStoreID)) {

            //Move Temp Excel file into saved_upload folder
            $tempPath = "temp_upload/";
            $savedPath = "saved_upload/";

            if (!file_exists($savedPath)) {
                mkdir($savedPath, 0755, true);
            }

            rename($tempPath."/".Session::get("excelFileSavedName"), $savedPath."/".Session::get("excelFileSavedName"));

            //Check emp from Excel exist in `qpay_member`
            Excel::load($savedPath."/".Session::get("excelFileSavedName"), function($reader) {

                $excelData = $reader->get();

                //Get all emp_no into string
                $excelEmpNoArray = [];

                foreach ($excelData as $data) {
                    if (strlen(strval(trim($data["empno"]))) == 0) {
                        continue;
                    }

                    $excelEmpNoArray[] = strval(trim($data["empno"]));
                }

                //Find exist member
                $existQPayMemberID = [];
                $existEmpNo = [];

                $result = $this->qpayMemberRepository->checkMemberExist($excelEmpNoArray);

                foreach ($result as $data) {
                    $existQPayMemberID[] = strval(trim($data["row_id"]));
                    $existEmpNo[] = strval(trim($data["emp_no"]));
                }

                $notExistEmpNo = array_diff($excelEmpNoArray, $existEmpNo);

                //Find emp data which not exist in `qpay_member`, Insert new data
                $result = DB::table('qp_user')
                        -> select('row_id', 'emp_id')
                        -> whereIn('emp_no', $notExistEmpNo)
                        -> get();

                $result = array_map(function ($value) {
                    return (array) $value;
                }, $result);

                foreach ($result as $data) {
                    $options = [
                        'cost' => '08',
                    ];
                    $trade_pwd = password_hash(substr(strval(trim($data["emp_id"])), -4), PASSWORD_BCRYPT, $options);

                    $memberID = $this->qpayMemberRepository->newMember($data["row_id"], $trade_pwd);
                    $existQPayMemberID[] = $memberID;
                }

                //Stored points to each member
                $storedMemberCount = 0;

                foreach ($existQPayMemberID as $memberID) {
                    $result = $this->qpayPointStoreRepository->newMemberPoint($memberID, $this->pointStoreID, Session::get("excelDataInfo")["point"]);

                    if (isset($result) && is_numeric($result)) {
                        $storedMemberCount++;
                    }
                }

                if ($storedMemberCount == count($existQPayMemberID)) {
                    $this->pointStoreSuccess = true;
                }

            });

        }

        //Forget SESSION
        Session::forget("excelFileOriginalName");
        Session::forget("excelFileSavedName");
        Session::forget("pointTypeID");
        Session::forget("excelDataInfo");

        if ($this->pointStoreSuccess) {
            $result["result_code"] = ResultCode::_1_reponseSuccessful;
        } else {
            $result["result_code"] = ResultCode::_999999_unknownError;
        }

        return json_encode($result);
    }

}