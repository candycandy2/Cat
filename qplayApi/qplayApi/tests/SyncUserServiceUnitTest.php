<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

use App\Services\SyncUserService;

class SyncUserServiceUnitTest extends TestCase
{   

    const UNDO_FOLDER ='undo';
    /** @test */
    public function testGetUserDataFromExcel()
    {   

        /** arrange */
        $target = App::make(SyncUserService::class);
        /** act */
        $fileName = 'syncuser/qcsflower/undo/20180623.xls';
        $sourceFrom = 'qcsflower';

        $result = $target->getUserDataFromExcel($fileName, $sourceFrom);
        var_dump($result);
        $this->assertTrue(true);
    }
}
