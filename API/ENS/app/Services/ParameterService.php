<?php
namespace App\Services;

use App\Repositories\ParameterRepository;


class ParameterService
{   

    protected $parameterRepository;
   

    public function __construct(ParameterRepository $parameterRepository)
    {
        $this->parameterRepository = $parameterRepository;
    }
    
    public function getParameterMapByType($parameterTypeId){
       
       $res = $this->parameterRepository->getParameterByType($parameterTypeId);
       $parameterMap = [];
       foreach ($res as  $value) {
            $parameterMap[$value->parameter_value] = $value->parameter_name;
       }
       return $parameterMap;
    }


}