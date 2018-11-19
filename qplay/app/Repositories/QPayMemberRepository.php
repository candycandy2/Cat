<?php
/**
 * QPay Member - Resository
 * @author  Darren.K.Ti darren.k.ti@benq.com
 */
namespace App\Repositories;

use App\Model\QPay_Member;
use DB;
use Auth;
use Session;

class QPayMemberRepository
{

    protected $qpayMember;

    /**
     * QPayMemberRepository constructor.
     * @param QPay_Member $qpayMember
     */
    public function __construct(QPay_Member $qpayMember)
    {
        $this->qpayMember = $qpayMember;
    }

    /**
     * Check Member Exist
     * @return Exist qpay_member row_id
     */
    public function checkMemberExist($excelEmpNoArray)
    {
        $result = DB::table('qpay_member')
                    -> leftJoin("qp_user", "qp_user.row_id", "=", "qpay_member.user_row_id")
                    -> select('qpay_member.row_id', 'qp_user.emp_no')
                    -> whereIn('qp_user.emp_no', $excelEmpNoArray)
                    -> get();

        $result = array_map(function ($value) {
            return (array) $value;
        }, $result);

        return $result;
    }

    /**
     * New Member
     * @return latest row_id
     */
    public function newMember($userRowID, $tradePWD)
    {
        $now = date('Y-m-d H:i:s',time());

        return  DB::table("qpay_member")
                -> insertGetId([
                    'user_row_id' => $userRowID,
                    'trade_password' => $tradePWD,
                    'created_at' => $now,
                    'created_user' => Auth::user()->row_id
                ]);
    }

    /**
     * Get QPay member list
     * @param  int $pointType     qpay_point_type.row_id
     * @param  string $department department
     * @param  string $empNo      employee number
     * @param  int $limit         limit
     * @param  int $offset        offset
     * @param  string $sort       sort by field
     * @param  string $order      order by
     * @return mix
     */
    public function getQPayMemberList($pointType, $department, $empNo, $limit, $offset, $sort, $order){

        $query = $this->qpayMember
                ->join('qpay_member_point','qpay_member_point.member_row_id', '=', 'qpay_member.row_id')
                ->join('qp_user','qp_user.row_id', '=', 'qpay_member.user_row_id')
                ->join('qpay_point_store','qpay_point_store.row_id', '=', 'qpay_member_point.point_store_row_id')
                ->join('qpay_point_type', 'qpay_point_type.row_id','=', 'qpay_point_store.point_type_row_id');

                if(!is_null($pointType)){
                    $query = $query->where('qpay_point_store.point_type_row_id',$pointType);
                }

                if(!is_null($department)){
                    $query = $query->where('qp_user.department',$department);
                }

                if(!is_null($empNo)){
                    $query = $query->where('qp_user.emp_no',$empNo);
                }

        $query = $query->orderBy($sort, $order);
        $query = $query->groupBy('qpay_point_type.name','emp_no');
        $query = $query->select(
                      'qpay_point_type.name as point_type',
                      'qp_user.row_id as user_id',
                      'qp_user.emp_no as emp_no',
                      'qp_user.emp_name as emp_name',
                      'qp_user.department as department',
                      'qpay_point_type.color as color',
                      'qpay_member_point.created_at as store_time',
                      'qpay_member.trade_password as trade_password')
                ->Paginate($limit,['*'],null,($offset/$limit)+1);//paginate(rowCount, ['*'], page, current])

        return $query;
    }

    /**
     * get QPay member infomation by user_ow_id
     * @param  int $userId qp_user.row_id
     * @return mixed
     */
    public function getQPayMemberInfo($userId){
        $qpayMember =  $this->qpayMember
                ->where('user_row_id',$userId)
                ->select('row_id','trade_password')
                ->first();
        return $qpayMember;
    }

    /**
     * update user's QPay trad password
     * @param  int    $QPayMemberId qpay_member.row_id
     * @param  string $newPwd new pass word
     */
    public function resetTradPassword($QPayMemberId, $newPwd){

        $user = $this->qpayMember::find($QPayMemberId);
        $user->trade_password = $newPwd;
        $user->timestamps = false;
        $user->save();

    }

}