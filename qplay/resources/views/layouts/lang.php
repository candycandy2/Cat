<?php
App::setLocale("en-us");
if(Session::has('lang') && Session::get("lang") != "") {
    App::setLocale(Session::get("lang"));
}


