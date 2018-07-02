<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

use App\Repositories\UserRepository;

class UserRepositoryUnitTest extends TestCase
{
    /** @test */
    public function testGetDuplicatedUser()
    {
        /** arrange */
        $target = App::make(UserRepository::class);
        /** act */
        $duplicateUsers = $target->getDuplicatedUser()->toArray();
        if(count($duplicateUsers) > 0){
                $data = array('columns'=>array_keys($duplicateUsers[0]),
                              'users'=>$duplicateUsers);
        }
        var_dump($data);exit();
        $this->assertTrue(true);
    }
}
