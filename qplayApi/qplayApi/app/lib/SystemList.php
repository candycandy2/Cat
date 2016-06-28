<?php
/**
 * Created by PhpStorm.
 * User: Moses.Zhu
 * Date: 16-6-20
 * Time: 下午2:30
 */

namespace App\lib;


class SystemList
{
    static $sys_list = array("qplay"=>"v101","yellowpage"=>"v101");
    public static function isSystemAllowed($sys)
    {
        return array_key_exists($sys, SystemList::$sys_list);
    }

    public static function isSystemVersionCorrect($sys, $version)
    {
        if(!SystemList::isSystemAllowed($sys))
        {
            return false;
        }

        return $sys == SystemList::$sys_list[$sys];
    }
}