<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class SyncUserControllerUnitTest extends TestCase
{
    /** @test */
    public function syncUserJob()
    {   

        $parameters = array(
                        'lang'=>'en-us',
                        'uuid'=>'1517bfd3f7a87ab9884',
                       );
        $response = $this->call('GET', '/v101/qplay/syncUserJob', $parameters);
        echo $response; 
        $this->assertTrue(true);
    }
}
