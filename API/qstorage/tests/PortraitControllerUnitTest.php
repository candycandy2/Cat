<?php 
use  \Illuminate\Http\UploadedFile;

class PortraitControllerUnitTest extends TestCase
{

    protected function setUp()
    {
        parent::setUp();
    }

   
    /** @test */
    public function uploadPortrait()
    {
        $this->withoutMiddleware([
            \App\Http\Middleware\VerifyWithBasicAuth::class,
            \App\Http\Middleware\Locale::class,
            \App\Http\Middleware\LogAferRequest::class
        ]);



        $parameters = array(
                        'lang'=>'en-us',
                        'uuid'=>'1517bfd3f7a87ab9884',
                       );
        $server = array('HTTP_Content-Type'=>'multipart/form-data',
                        'HTTP_app-key'=>'appqplayev',
                        'HTTP_Signature-Time'=>'1520585086',
                        'HTTP_Signature'=>'vxMVPn8gPlr7xiR2Lvdqd4rBW8BDIv/ep+aUFxZXC0g=',
                        'HTTP_resource-id'=>'13/76f99fb4f1a24d29',
                        'HTTP_account'=>'1609009');


        $stub = __DIR__.'\stubs\test.jpg';
        $name = str_random(8).'.jpg';
        $path = sys_get_temp_dir().'/'.$name;

        copy($stub, $path);

        $file = new UploadedFile($path, $name, filesize($path), 'image/png', null, true);
        // 用 GET 方法瀏覽網址 /post
        $response = $this->call('POST', 'v101/portrait', $parameters, [], ['files' => $file], $server);
        echo $response; 
        $this->assertResponseOk();
    }

    /** @test */
    public function deletePortrait(){
        
        $this->withoutMiddleware([
            \App\Http\Middleware\VerifyWithBasicAuth::class,
            \App\Http\Middleware\Locale::class,
            \App\Http\Middleware\LogAferRequest::class
        ]);

        $parameters = array(
                        'lang'=>'en-us',
                        'uuid'=>'1517bfd3f7a87ab9884',
                       );
        $server = array('HTTP_Content-Type'=>'application/json',
                        'HTTP_app-key'=>'appqplayev',
                        'HTTP_Signature-Time'=>'1520585086',
                        'HTTP_Signature'=>'vxMVPn8gPlr7xiR2Lvdqd4rBW8BDIv/ep+aUFxZXC0g=',
                        'HTTP_account'=>'1609009');
        // 用 GET 方法瀏覽網址 /post
        
        $response = $this->call('DELETE', 'v101/portrait', $parameters, [], [], $server);
        echo $response; 
        $this->assertResponseOk();

    }
}