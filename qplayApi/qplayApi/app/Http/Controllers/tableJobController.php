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
            'time_zone' =>  ['required','size:5'],
            'start' => ['required','size:6'],
            'end' => ['required','size:6']
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
                $dateArray = self::getDateArray($request->start, $request->end);

                foreach ($dateArray as $date) {
                
                        $limit = 1000;
                        $cnt;
                        $pointer = 0;

                        $monthTableName = $tableName.'_'.$date.'_'.$timeZone; //201901_p0800
                        $createTableRs = \DB::statement("CREATE TABLE IF NOT EXISTS " . $monthTableName . " like ".$tableName);
                    
                        do{

                            DB::beginTransaction();
                            try {
                                $record = DB::table($sourceTale)
                                                -> where(DB::raw("date_format((CONVERT_TZ(created_at,'+00:00','".$symbol.$hour.":".$minutes."')),'%Y%m')"), $date)
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
                                DB::commit();
                            } catch (\Exception $e) {
                                DB::rollBack();
                                throw $e;
                            }

                        }while($cnt > 0);
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

    private function getDateArray($start, $end){
        $dateArray = [];
        $startDate = date_create_from_format('Ymd H:i:s', $start.'01 00:00:00');
        $startDate = $startDate->getTimestamp();
        $tempDate = $startDate; 
        $endDate = date_create_from_format('Ymd H:i:s', $end.'01 00:00:00');
        $endDate = $endDate->getTimestamp();
         do{
            $dateArray[] = date('Ym', $tempDate);
            $tempDate = strtotime('+1 month', $tempDate); 
         }while ( $tempDate <= $endDate);
        
        return $dateArray;
    }
}