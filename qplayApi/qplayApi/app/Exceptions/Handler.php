<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use App\lib\ResultCode;
use App\Jobs\SendErrorMail;
use App\Jobs\SendErrorMailExecption;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Mail;
use Config;
use Request;

class Handler extends ExceptionHandler
{
    use DispatchesJobs;
    /**
     * A list of the exception types that should not be reported.
     *
     * @var array
     */
    protected $dontReport = [
        AuthorizationException::class,
        HttpException::class,
        ModelNotFoundException::class,
        ValidationException::class,
        SendErrorMailExecption::class
    ];

    /**
     * Report or log an exception.
     *
     * This is a great spot to send exceptions to Sentry, Bugsnag, etc.
     *
     * @param  \Exception  $e
     * @return void
     */
    public function report(Exception $e)
    {
        parent::report($e);
        try{
            $errMessage = $e->getMessage();
            $connectionNotFound = (preg_match("/No connector for \[\w*\]/", $errMessage)) ? true : false;
            if($connectionNotFound){
                //if queue commend line error,send error mail once
                $data = [];
                $data['errorObj'] = serialize($this->error);
                $mailer->send('emails.error_report', $data, function($message)
                {   
                    $from = \Config('app.error_mail_from');
                    $fromName = \Config('app.error_mail_from_name');
                    $to = explode(',',\Config('app.error_mail_to'));
                    $subject = '**['.\Config('app.env').'] '.\Config('app.name').' Error Occur **';
                    $message->from( $from , $fromName);
                    $message->to($to)->subject($subject);
                });

            }else if ($this->shouldReport($e)) {
                if(\Config('app.error_mail_to')!=""){
                    $error = [
                        'message' => $e->getMessage(),
                        'code' => $e->getCode(),
                        'file' => $e->getFile(),
                        'line' => $e->getLine(),
                        'url' => \Request::url(),
                        'input' => json_encode(\Request::all()),
                        'trace' =>$e->getTraceAsString()
                    ];
                    $job = (new SendErrorMail($error))->onQueue(\Config('app.name').'_ErrorMail');
                    $this->dispatch($job);
                }
            }
        }catch (\Exception $e){
            Log::error($e);
        }
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Exception  $e
     * @return \Illuminate\Http\Response
     */
    public function render($request, Exception $e)
    {
        $result = ['result_code'=>ResultCode::_999999_unknownError,
                    'message'=>trans('messages.MSG_CALL_SERVICE_ERROR'),
                    'content'=>""];
        $result = response()->json($result);
        return $result;
       //return parent::render($request, $e);
    }
}
