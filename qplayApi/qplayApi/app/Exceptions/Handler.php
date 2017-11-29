<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Mail;
use Config;

class Handler extends ExceptionHandler
{
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
        if ($this->shouldReport($e)) {
            if(\Config('app.error_mail_to')!=""){
                Mail::send('emails.error_report', ['e' => $e], function($message)
                {   
                    $from = \Config('app.error_mail_from');
                    $fromName = \Config('app.error_mail_from_name');
                    $to = explode(',',\Config('app.error_mail_to'));
                    $subject = '['.\Config('app.env').']QPlay API Error Occur!!';
                    $message->from( $from , $fromName);
                    $message->to($to)->subject($subject);
                });
            }
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
        return parent::render($request, $e);
    }
}
