<?php 

class AccessControllerUnitTest extends TestCase
{
    protected function setUp()
    {
        parent::setUp();
    }

   
    /** @test */
    public function testGetContainerSASToken()
    {
        
         $this->withoutMiddleware([
            \App\Http\Middleware\VerifyWithBasicAuth::class,
            \App\Http\Middleware\Locale::class,
            \App\Http\Middleware\LogAferRequest::class
        ]);

        $signedStart = gmdate('Y-m-d\TH:i:s\Z',strtotime('now'));
        $signedExpiry = gmdate('Y-m-d\TH:i:s\Z',strtotime('+30minute'));

        $parameters = array(
                        'lang'=>'en-us',
                        'uuid'=>'1517bfd3f7a87ab9884',
                        'start'=>$signedStart,//'2018-03-16T03:30:00Z'
                        'expiry'=>$signedExpiry,//'2018-03-17T12:30:00Z'
                        'sp'=>'r'
                        );
        $server = array('HTTP_Content-Type'=>'application/json',
                        'HTTP_app-key'=>'appqforumdev',
                        'HTTP_Signature-Time'=>'1520585086',
                        'HTTP_Signature'=>'vxMVPn8gPlr7xiR2Lvdqd4rBW8BDIv/ep+aUFxZXC0g=',
                        'HTTP_target'=>'appqforumdev-picture-13-76f99fb4f1a24d29',
                        'HTTP_account'=>'1607279');
        // 用 GET 方法瀏覽網址 /post
        // call($method, $uri, $parameters = [], $cookies = [], $files = [], $server = [], $content = null)
        $result = $this->call('GET', 'v101/picture/sastoken/container', $parameters, [], [], $server );
        echo $result;
        // 改用 Laravel 內建方法
        // 實際就是測試是否為 HTTP 200
        $this->assertResponseOk();
    }

    /** @test */
    public function testGetBlobSASToken()
    {
        
        $this->withoutMiddleware([
            \App\Http\Middleware\VerifyWithBasicAuth::class,
            \App\Http\Middleware\Locale::class,
            \App\Http\Middleware\LogAferRequest::class
        ]);

        $parameters = array(
                        'lang'=>'en-us',
                        'uuid'=>'1517bfd3f7a87ab9884',
                        'start'=>'2018-03-16T03:30:00Z',
                        'expiry'=>'2018-03-17T12:30:00Z',
                        'sp'=>'r'
                        );
        $server = array('HTTP_Content-Type'=>'application/json',
                        'HTTP_app-key'=>'appqforumdev',
                        'HTTP_Signature-Time'=>'1520585086',
                        'HTTP_Signature'=>'vxMVPn8gPlr7xiR2Lvdqd4rBW8BDIv/ep+aUFxZXC0g=',
                        'HTTP_target'=>'appqforumdev-picture-13-76f99fb4f1a24d29/5aa7810f13643/5aa7810f13643_1024.jpg',
                        'HTTP_account'=>'1607279');
        // 用 GET 方法瀏覽網址 /post
        // call($method, $uri, $parameters = [], $cookies = [], $files = [], $server = [], $content = null)
        $result = $this->call('GET', 'v101/picture/sastoken/blob', $parameters, [], [], $server );
        echo $result;
        // 改用 Laravel 內建方法
        // 實際就是測試是否為 HTTP 200
        $this->assertResponseOk();
    }
}