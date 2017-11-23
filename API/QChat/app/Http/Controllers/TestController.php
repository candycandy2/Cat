<?php
namespace App\Http\Controllers;

use App\lib\CommonUtil;
use Illuminate\Support\Facades\Input;

class TestController extends Controller
{   
    /**
     * 透過此API可以測試圖片壓縮品質
     */
    public function compressImage(){
        $input = Input::get();
        $quility = (isset($input['q']))?$input['q']:10;
        $filename = 'ori';
        CommonUtil::compressImage("./". $filename.".jpg", "./".$filename."-".$quility."-r.jpg",$quility);
    }

}
