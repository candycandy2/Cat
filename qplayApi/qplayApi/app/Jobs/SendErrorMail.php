<?php

namespace App\Jobs;

use App\Jobs\Job;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Contracts\Mail\Mailer;
use Config;
use Log;

class SendErrorMail extends Job implements ShouldQueue
{
    use InteractsWithQueue, SerializesModels;

    protected $error;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($error)
    {   
        $this->error = $error;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle(Mailer $mailer)
    {   
        try{

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

        }catch (\Exception $e){
            Log::error($e); 
            throw new SendErrorMailExecption("Send Error Mail Error", 1);
        }
        
    }
}
