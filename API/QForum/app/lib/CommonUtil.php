<?php
namespace App\lib;

class CommonUtil
{
    /**
     * 根據輸入環境取得appkey
     * @return String 
     */
    public static function getContextAppKey($env,$key){
        $env = strtolower($env);
        $key = "app".$key;
        switch ($env)
        {
            case  "dev":
                $key = $key."dev";
                break;
            case  "test":
                $key = $key."test";
                break;
            case  "production":
                break;
            default :
                break;
        }
        return $key;
    }
}