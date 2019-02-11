<?php

namespace App\Http\Controllers;
use App\lib\ResultCode;
use Illuminate\Http\Request;
use DB;
use Exception;
use Validator;

class tableJobController extends Controller
{   

    /**
     * move record to monthly table
     * @return json
     */
    public function monthlyTable(Request $request){
        
        ini_set("memory_limit","2048M");
        set_time_limit(0);
        $timeStart = microtime(true); 
        $movedRecords = 0;
        //parameter verify
        $validator = Validator::make($request->all(),
            [
            'source_table' => 'required',
            'target_table' => 'required',
            'time_zone' =>  ['required','size:5']
            ]
        );

        if ($validator->fails()) {
            return response()->json(['result_code'=>ResultCode::_999001_requestParameterLostOrIncorrect,
                                      'message'=>$validator->errors()->all()]);
        }

        $tableName = $request->target_table;
        $sourceTale = $request->source_table;
        $timeZone = strtolower($request->time_zone);

        $symbol = (substr($timeZone, 0, 1) == "p")?"+":"-";
        $hour = substr($timeZone, 1, 2);
        $minutes = substr($timeZone, 3, 2);
        try{
                $dateArray = DB::table($sourceTale)
                            -> select(DB::raw("date_format((CONVERT_TZ(created_at,'+00:00','".$symbol.$hour.":".$minutes."')),'%Y%m') as month"))
                            -> distinct()
                            -> get();

                foreach ($dateArray as $date) {
                    
                    $total = DB::table($sourceTale)
                                    -> where(DB::raw("date_format((CONVERT_TZ(created_at,'+00:00','".$symbol.$hour.":".$minutes."')),'%Y%m')"), $date->month)
                                    -> count();
                    if($total > 0){
                        $limit = 1000;
                        $round = ceil($total / $limit);
                        $times = 0;
                        $pointer = 0;

                        $monthTableName = $tableName.'_'.$date->month.'_'.$timeZone; //201901_p0800

                        //beacuse not delete, so need to clear all table
                        \DB::statement("DROP TABLE IF EXISTS " . $monthTableName );
                        $createTableRs = \DB::statement("CREATE TABLE IF NOT EXISTS " . $monthTableName . " like ".$tableName);
                    
                        while($times < $round){
                            
                            $record = DB::table($sourceTale)
                                            -> where(DB::raw("date_format((CONVERT_TZ(created_at,'+00:00','".$symbol.$hour.":".$minutes."')),'%Y%m')"), $date->month)
                                            -> where('row_id' ,'>', $pointer)
                                            -> select()
                                            -> limit($limit)
                                            -> orderby('row_id','asc')
                                            -> get();
                            
                            $cnt = count($record);

                            if($cnt > 0){
                                $pointer = $record[$cnt-1]->row_id; 
                                $record = array_map(function ($value) {
                                    $value->row_id = null;
                                    return (array)$value;
                                }, $record);
                                
                                // insert each record
                                $chunk = array_chunk($record,1);
                                foreach ($chunk as $data) {
                                   \DB::table($monthTableName)->insert($data);
                                    $movedRecords = $movedRecords + count($data);
                                }
                                
                                /*if($insertRs){
                                    $deleteRs = \DB::table($tableName)
                                            -> where(\DB::raw("date_format((CONVERT_TZ(created_at,'+00:00','".$symbol.$hour.":".$minutes."')),'%Y%m')"), $date->month)
                                            -> delete();
                                }*/
                            }

                            $times ++ ;

                        }

                    }
                }
                
                $result = ['result_code'=>ResultCode::_1_reponseSuccessful,
                        'message'=>$movedRecords. " records have been moved"];
            }catch (\Exception $e){               
                $result = ['result_code'=>ResultCode::_999999_unknownError,
                        'message'=> $e->getMessage()];
            }

            $timeEnd = microtime(true);
            $executionTime = ($timeEnd - $timeStart);
            $result['content'] = "execute time : ".$executionTime;

        return response()->json($result);
    }

}