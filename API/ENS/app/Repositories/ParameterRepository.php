<?php
namespace App\Repositories;

use Doctrine\Common\Collections\Collection;
use App\Model\EN_Parameter_type;
use App\Model\EN_Parameter;
use DB;

class ParameterRepository
{
   
    /** @var parameter Inject EN_Parameter model */
    protected $parameter;
    /**
     * ParameterRepository constructor.
     * @param EN_Parameter_type $parameterType
     * @param EN_Parameter $parameter
     */
    public function __construct(EN_Parameter $parameter)
    {
        
        $this->parameter = $parameter;
    }

    public function getParameterByType($parameterTypeId){
         return $this->parameter
         ->where('parameter_type_row_id', $parameterTypeId)
         ->select('parameter_name','parameter_value')
         ->get();
    }

}