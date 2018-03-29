<?php 

class JobControllerUnitTest extends TestCase
{
    protected function setUp()
    {
        parent::setUp();
    }

   
    /** @test */
    public function testDeleteAttachJob()
    {
        $this->withoutMiddleware([
            \App\Http\Middleware\VerifyWithBasicAuth::class,
            \App\Http\Middleware\Locale::class,
            \App\Http\Middleware\LogAferRequest::class
        ]);

        $signedStart = gmdate('Y-m-d\TH:i:s\Z',strtotime('now'));
        $signedExpiry = gmdate('Y-m-d\TH:i:s\Z',strtotime('+30minute'));

        $parameters = array();
        $server = array();
        // 用 GET 方法瀏覽網址 /post
        // call($method, $uri, $parameters = [], $cookies = [], $files = [], $server = [], $content = null)
        $result = $this->call('GET', '/v101/QForum/deleteAttachJob', $parameters, [], [], $server );
        echo $result;
        // 改用 Laravel 內建方法
        // 實際就是測試是否為 HTTP 200
        $this->assertResponseOk();
    }
}