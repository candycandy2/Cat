<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class EventTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testExample()
    {
        $this->assertTrue(true);
    }

    public function testGetAuthority(){

         $headers['Content-Type'] = 'application/json';
         $authReturn = array('ResultCode'=>'1',
                             'Content'=>array(
                                'RoleList'=>array('admin','supervisor')
                                )
                            );
         $postBody = array(
                    'strXml'=>'<LayoutHeader><emp_no>1607279</emp_no></LayoutHeader>'
                    );
          $this->post('/v101/ens/getAuthority',$postBody,$headers)
             ->seeJson($authReturn);
    }
}
