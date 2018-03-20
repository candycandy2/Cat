<?php 

use App\Services\AzureBlobService;

class AzureBlobServiceUnitTest extends TestCase
{
    /** @var AzureBlobService */
    protected $target;

    protected function setUp()
    {
        parent::setUp();
        $this->target = App::make(AzureBlobService::class);
    }

    // /** @test */
    // public function checkContainerExist()
    // {
    //     /** arrange */
    //     $containerName = 'appqforumdev-picture-134-76f99fb4f1a24d29-5a9e5a8f3b7f7';

    //     /** act */
        
    //     $actual = $this->target->checkContainerExist(
    //         $containerName
    //     );

    //     /** assert */
    //     $expected = true;
    //     $this->assertEquals($expected, $actual);
    // }

    // /** @test */
    // public function 建立Container()
    // {
    //     /** arrange */

    //     /** act */
    //   //  $containerName = 'mycontainer';
    //     $containerName = 'appqforumdev-picture-13-76f99fb4f1a24d29-5a9e5a8f3b7f7';
    //     $actual = $this->target->createContainer($containerName);

    //     /** assert */
    //     $expected = true;
    //     $this->assertEquals($expected, $actual);
    // }


    // /** @test */
    // public function createBlockBlob()
    // {
    //     /** arrange */

    //     /** act */
    //     $containerName = 'appqforumdev-picture-13-76f99fb4f1a24d29-5a9e5a8f3b7f7';
    //     //$blobName = '5a9e5a8f3b7f7_full.jpg';
    //     // $filePath = 'C:\xampp\htdocs\EnterpriseAPPPlatform\API\qstorage\public\appqforumdev\picture\1\bb2cbbc0eb8411e7b4f300016cd4175c\5a9e5a8f3b7f7\5a9e5a8f3b7f7_full.jpg';
    //     $blobName = '5a9e647b7b37f_full.jpg';
    //     $filePath = 'C:\xampp\htdocs\EnterpriseAPPPlatform\API\qstorage\public\appqforumdev\picture\1\bb2cbbc0eb8411e7b4f300016cd4175c\5a9e647b7b37f\5a9e647b7b37f_full.jpg';
    //     $content = fopen($filePath , "r");
    //     $actual = $this->target->createBlockBlob($containerName, $blobName, $content);

    //     /** assert */
    //     $expected = true;
    //     $this->assertEquals($expected, $actual);
    // }
    
   
    // /** @test */
    // public function generateBlobServiceSharedAccessSignatureToken()
    // {
    //     /** arrange */
    //     $resourceName = 'appqforumdev-picture-13-76f99fb4f1a24d29-5a9e5a8f3b7f7';
    //     $signedPermissions = 'r';
    //     $signedExpiry = '2018-03-09T08:30:00Z'; 
    //     $signedStart = '2018-03-08T08:30:00Z';
    //     /** act */
        
    //     $actual = $this->target->generateBlobServiceSharedAccessSignatureToken(
    //         $resourceName,
    //         $signedPermissions,
    //         $signedExpiry, 
    //         $signedStart
    //     );

    //     /** assert */
    //     $this->assertNotEmpty($actual);
    // }
    
    /** @test */
    public function getFullBlobUrl()
    {   
        /** arrange */
        $containerName = 'appqforumdev-picture-13-76f99fb4f1a24d29';
        $prefix = '5a9e5a8f3b7f7';
        /** act */
        $result = $this->target->getFullBlobUrl($containerName, $prefix);
        foreach ($result as $name => $url) {
            echo $name.':'.$url.'<br>';
        }
        /** assert */
        $this->assertNotEmpty($result);

    }
} 