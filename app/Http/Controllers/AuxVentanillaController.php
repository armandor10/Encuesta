<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Models\Auxventanilla;
use DB;

class AuxVentanillaController extends Controller
{
    public static $id_cargo_auxventanilla = "36";
    
    public function getRangoStiker(Request $request)
    {
        $data = $request->all();
        //return $data;
        $list = array();
            if( ! empty($data) ){
                foreach ($data["noDocumento"] as &$value) {
                    //return $value;
                    $aux = Auxventanilla::
                            where('noDocumento', '=', $value)
                            ->first();                   
                    if( ! empty($aux) ){
                        $auxventanilla["noDocumento"] = $value;
                        $auxventanilla["inicioStiker"] = $aux->inicioStiker;
                        $auxventanilla["finStiker"] = $aux->finStiker;
                        $auxventanilla["Entregados"] = DB::connection('mysql')
                                            ->table("registro_asignacion")
                                            ->where('idAuxVentanilla', '=', $aux->id)
                                            ->count();
                        array_push($list,$auxventanilla);                                                
                    }                    
                }
            }
        return $list;
    }
    
    public function saveRango(Request $request){
        $data = $request->all();
        
        $aux = DB::connection('mysql')
                ->select('select * from auxventanilla '
                        . 'where noDocumento != :noD',
                        ['noD' => $data["noDocumento"]]);
        
        foreach ($aux as &$value) {
            if($data["inicioStiker"] >= $value->inicioStiker 
                    && $data["inicioStiker"] <= $value->finStiker){
                return array('state'=>'KO','message' => "El rango se cruza con uno existente!!!", "request" => "");                 
            }
            
            if($data["finStiker"] >= $value->inicioStiker  
                    && $data["finStiker"] <= $value->finStiker){
                return array('state'=>'KO','message' => "El rango se cruza con uno existente!!!", "request" => "");                  
            }
            
            if(    $data["finStiker"] >= $value->inicioStiker 
                && $data["finStiker"] >= $value->finStiker 
                && $data["inicioStiker"] <= $value->inicioStiker ){
                return array('state'=>'KO','message' => "El rango se cruza con uno existente!!!", "request" => "");  
            }
            
            if(    $data["inicioStiker"] <= $value->inicioStiker 
                && $data["inicioStiker"] <= $value->finStiker 
                && $data["finStiker"] >= $value->finStiker ){
                return array('state'=>'KO','message' => "El rango se cruza con uno existente!!!", "request" => "");  
            }
            
        }
        
        $aux = DB::connection('mysql')
                ->select('select min(inicioStiker) as minimo,max(finStiker)'
                        . ' as maximo from auxventanilla'. 
                        ' where noDocumento != :noD',
                        ['noD' => $data["noDocumento"]]);
        
        //return $aux[0]->minimo;
        if( $aux[0]->minimo >= $data["inicioStiker"] 
                && $aux[0]->maximo <= $data["finStiker"]){
            return array('state'=>'KO','message' => "El rango se cruza con uno existente!!!", "request" => "");                         
        }
        
            $aux = Auxventanilla::
                    where('noDocumento', '=', $data["noDocumento"])
                    ->first();
            
            if( empty($aux) ){
                $aux = new Auxventanilla();
                $aux->noDocumento = $data["noDocumento"];
                $aux->inicioStiker = $data["inicioStiker"]; 
                $aux->finStiker = $data["finStiker"];                
                
            } else {
                $aux->inicioStiker = $data["inicioStiker"]; 
                $aux->finStiker = $data["finStiker"];
                
            }
            
            $aux->save();
            $responce = array('state'=>'OK','message' => "El rango a sido guardado", "request" => $aux); 
            
        return $responce;
    }
    
    
    public function  getRegistroAsignacion(Request $request){
        $data = $request->all();
        return  DB::connection('mysql')
                ->select('select * from registro_asignacion,matriculado '
                        . 'where registro_asignacion.idmatriculado = matriculado.id && '
                        . 'idAuxVentanilla = '
                        . '(select id from auxventanilla where noDocumento=:noD) '
                        . '&& YEAR(fecha) <= YEAR(now()) '
                        . 'order by fecha desc',
                        ['noD' => $data["noDocumento"]]);        
    }

    public function getAuxVentanilla()
    {
        /* Consulto todas las auxiliares de ventanilla. Sino existen en la tabla 
         * Auxventanilla, las creo en la misma */
        
        $data = DB::connection('ccv')
                ->select("SELECT noDocumento FROM empleados where cargos_id= :id",
                        ['id'=> self::$id_cargo_auxventanilla ]);
        
        foreach ($data as &$value) {
            $a = Auxventanilla::where("noDocumento","=",$value->noDocumento)->first();
            if( empty($a) ){
                $a = new Auxventanilla();
                $a->noDocumento = $value->noDocumento;
                $a->save();
            }                        
        }
        
        $aux = Auxventanilla::all();
        
               $list = array();
                foreach ($aux as &$value) {
                    $auxventanilla["noDocumento"] = $value->noDocumento;
                    $data = DB::connection('ccv')
                            ->select("SELECT Cargos_id,nombres,apellidos,nombre as cargo FROM empleados as e
                                     INNER JOIN cargos as c ON e.Cargos_id = c.id 
                                     where noDocumento= :d",
                                    ['d'=> $value->noDocumento ]);
                    
                    $auxventanilla["nombre"] = $data[0]->nombres." ".$data[0]->apellidos;
                    $auxventanilla["inicioStiker"] = $value->inicioStiker;
                    $auxventanilla["finStiker"] = $value->finStiker;
                    $auxventanilla["Cargos_id"] = $data[0]->Cargos_id;
                    $auxventanilla["cargo"] = $data[0]->cargo;
                    $auxventanilla["Entregados"] = DB::connection('mysql')
                            ->select('select count(id) as count from registro_asignacion '
                            . 'where idAuxVentanilla = :id'
                            . '&& YEAR(fecha) <= YEAR(now())',
                            ['id' => $value->id])[0]->count;
                            
                            
                            DB::connection('mysql')
                                            ->table("registro_asignacion")
                                            ->where('idAuxVentanilla', '=', $value->id)
                                            ->count();

                    array_push($list,$auxventanilla);                     
                }
                
        return $list;
        
    }

}
