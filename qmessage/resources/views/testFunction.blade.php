<?php
/*
echo date("ymdhis");

echo url()->current();

echo public_path("index.php");
*/
echo ' web-root = '.$_SERVER['DOCUMENT_ROOT'].'<br>';
echo ' current-file = '.__FILE__.'<br>';
echo ' current-dir = '.dirname(__FILE__).'<br>';

echo ' http-root = '.$_SERVER['HTTP_HOST'].'<br>';
echo ' web-position = '.$_SERVER['PHP_SELF'].'<br>';
$file='c:/webroot/index.php';
echo ' file-position = '.$file.'<br>';

$fileWebAddress='http://'.str_replace($_SERVER['DOCUMENT_ROOT'],$_SERVER['HTTP_HOST'],$file);
echo ' file-web-position = '.$fileWebAddress.'<br>';

echo "----------------------------------------------------------".'<br>';
echo public_path("index.php").'<br>';
echo $_SERVER['DOCUMENT_ROOT'].'<br>';
echo str_replace($_SERVER['DOCUMENT_ROOT'],"",public_path("index.php"));
echo "----------------------------------------------------------".'<br>';
echo $_SERVER['PHP_SELF'];