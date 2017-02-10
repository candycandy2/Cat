<?php

namespace App\Http\Controllers;

use Request;

class testController extends Controller
{
    public function getAuthority(){

        $url = "http://localhost/EnterpriseAPPPlatform/API/ENS/public/v101/ens/getAuthority";
                $args = array('strXml' =>'<LayoutHeader><emp_no>1607279</emp_no></LayoutHeader>');
                $data["strXml"] = json_encode($args);
                
                $result = $this->doPost($url, $data);
                var_dump($result);

    }   

    private  function doPost($url, $data){//file_get_content
        $postdata = http_build_query($data);

        $opts = array('https' =>
            array(
                'method'  => 'POST',
                'header'  => 'Content-Type:application/json',
                'content' => $postdata
            )
        );
        $context = stream_context_create($opts);
        $result = file_get_contents($url, false, $context);
        return $result;
    }
}

