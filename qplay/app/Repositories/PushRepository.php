<?php
/**
 * Push service - Resository
 * @author  Candy
 */
namespace App\Repositories;

use App\Model\QP_Message;
use App\Model\QP_Message_Send;
use App\Model\QP_Message_Batch;
use DB;


class PushRepository
{
    protected $message;
    protected $messagesend;
    protected $messagebatch;

     /**
     * PushRepository constructor.
     * @param QP_Message_Batch $message
     * @param QP_Message_Send  $messagesend
     * @param QP_Message_Batch $messagebatch
     */
    public function __construct(QP_Message $message, QP_Message_Send $messagesend,QP_Message_Batch $messagebatch)
    {
        $this->message       = $message;
        $this->messagesend   = $messagesend;
        $this->messagebatch  = $messagebatch;
    }

   /**
     * Get all  data
     * @return mixed data
     */
    public function getPushBatchServiceListR() {
        $newMessageId = \DB::table("qp_message_batch")
            ->leftJoin("qp_user", "qp_user.row_id", "=", "qp_message_batch.created_user")
            ->select("qp_message_batch.file_original", "qp_user.login_id", "qp_message_batch.created_at")
            ->get();
        return $newMessageId;
    }






}