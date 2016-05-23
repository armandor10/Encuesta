<?php

namespace App\Http\Controllers;

use DateTime;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Models\Auxventanilla;
use App\Models\Matriculado;
use App\Models\regAsignacion;
use DB;

class regAsignacionController extends Controller
{
    public static $id_cargo_auxventanilla = "36";


    public function getLikeStiker(Request $request){
        $data = $request->all();
        $list = array();
        $registro = DB::connection('mysql')
                ->select("SELECT * FROM registro_asignacion,auxventanilla,matriculado "
                        . "where idmatriculado=matriculado.id &&stiker && "
                        . "idAuxVentanilla=auxventanilla.id "
                        . "&& stiker like '%".$data["stiker"]."%' order by fecha desc");
        foreach ($registro  as &$value) {
           $empleado = DB::connection('ccv')
                ->select("SELECT Cargos_id,nombres,apellidos,nombre as cargo FROM empleados as e
                          INNER JOIN cargos as c ON e.Cargos_id = c.id 
                          where noDocumento= :d",
                          ['d'=> $value->noDocumento ]);
           
           $re["noDocumento"] = $value->noDocumento;
           $re["stiker"] = $value->stiker;
           $re["fecha"] = $value->fecha;
           $re["matricula"] = $value->noMatricula;
           $re["nombre"] = $empleado[0]->nombres.' '.$empleado[0]->apellidos;
           $re["nomatriculado"] = $value->razonSocial_nombre;
           $re["Cargos_id"] = $empleado[0]->Cargos_id;
           $re["cargo"] = $empleado[0]->cargo;
           
           array_push($list,$re);           
        }
        return $list; 
    }
    
    public function getLikeMatricula(Request $request){
        $data = $request->all();
        $list = array();
        $registro = DB::connection('mysql')
                ->select("SELECT * FROM registro_asignacion,auxventanilla,matriculado "
                        . "where idmatriculado=matriculado.id &&stiker && "
                        . "idAuxVentanilla=auxventanilla.id "
                        . "&& noMatricula like '%".$data["matricula"]."%' order by fecha desc");
        foreach ($registro  as &$value) {
           $empleado = DB::connection('ccv')
                ->select("SELECT Cargos_id,nombres,apellidos,nombre as cargo FROM empleados as e
                          INNER JOIN cargos as c ON e.Cargos_id = c.id 
                          where noDocumento= :d",
                          ['d'=> $value->noDocumento ]);
           
           $re["noDocumento"] = $value->noDocumento;
           $re["stiker"] = $value->stiker;
           $re["fecha"] = $value->fecha;
           $re["matricula"] = $value->noMatricula;
           $re["nombre"] = $empleado[0]->nombres.' '.$empleado[0]->apellidos;
           $re["nomatriculado"] = $value->razonSocial_nombre;
           $re["Cargos_id"] = $empleado[0]->Cargos_id;
           $re["cargo"] = $empleado[0]->cargo;
           
           array_push($list,$re);           
        }
        return $list; 
    }

    public function store(Request $request)
    {
        $data = $request->all();
        if( empty($data['noDocumento']) ){
            return array('estado'=>'KO','message'=>'Error al procesar la solicitud. Inicie sesión e inténtelo nuevamente');                                    
        }
        $aux = Auxventanilla::
                where('noDocumento','=',$data['noDocumento'])
                ->first();
        
        if( empty($aux) ){         
            //return array('estado'=>'KO','message'=>'No se encontró el Auxiliar de ventanilla en la base de datos');
            $aux = new Auxventanilla();
            $aux->noDocumento = $data['noDocumento'];
            $aux->save();            
        }
        
        if( ($data['stiker'] >= $aux->inicioStiker && $data['stiker'] <= $aux->finStiker) || 
                $data["cargo_id"] != self::$id_cargo_auxventanilla ){
            
            $reg = DB::connection('mysql')
                    ->select("SELECT * FROM registro_asignacion where stiker='".$data['stiker']."' "
                            . "&& YEAR(fecha) <= YEAR(now())");
            if( empty($reg) ){
                $matriculado = DB::connection('mysql')
                    ->select("SELECT * FROM matriculado where noMatricula='".$data['matricula']."'");               
                
                $regAsig = new regAsignacion();
                 
                if( empty($matriculado) ){
                    $matriculado = new Matriculado();
                    $matriculado->noMatricula = $data['matricula'];
                    $matriculado->razonSocial_nombre = $data['razonSocial_nombre'];
                    $matriculado->save();
                    
                    $regAsig->idmatriculado = $matriculado->id;
                    
                }  else {
                    /* Actualizo el matriculado */
                    $matriculado = Matriculado::find($matriculado[0]->id);
                    $matriculado->razonSocial_nombre = $data['razonSocial_nombre'];
                    $matriculado->save();
                    
                    $regAsig->idmatriculado = $matriculado->id;
                    $reg = DB::connection('mysql')
                            ->select("SELECT * FROM registro_asignacion where idmatriculado='".$matriculado->id."' "
                                    . "&& YEAR(fecha) <= YEAR(now())");
                    if( ! empty($reg) ){
                        return array('estado'=>'KO','message'=>'La matrícula ya tiene un Stiker asignado');                                                 
                    }                    
                }
                               
                $regAsig->stiker = $data['stiker'];
                $regAsig->fecha = $data['fecha'] ;
                $regAsig->idAuxVentanilla = $aux->id;
                
                $regAsig->save();
                 return array('estado'=>'OK','message'=>'Registro Guardado');                          
                
                
            }else{
                return array('estado'=>'KO','message'=>'Este Stiker ya está asignado');                
            }
                                    
        }else{
            return array('estado'=>'KO','message'=>'Este Stiker no está dentro de su rango');
        }
                
    }
    
    public function consecutivoAux(Request $request){
        $data = $request->all();
        $auxVen = Auxventanilla::where('noDocumento','=',$data['noDocumento'])->first();
        
        if( empty($auxVen) ){
            return "";            
        } else {
            $reg = DB::connection('mysql')
                    ->select("SELECT stiker as max 
                                FROM registro_asignacion 
                                where idAuxVentanilla=".$auxVen->id.
                                " and YEAR(fecha) <= YEAR(now())
                                order by cast(stiker as unsigned) desc limit 1");
        
            return intval($reg[0]->max) +1;    
        }
            
    }
        public function getRegistroAuxFecha(Request $request){
        $data = $request->all();
        /*return DB::connection('mysql')
                ->select("select * from registro_asignacion where fecha>='". $data["fecha"]."'");*/
        return  DB::connection('mysql')
                ->select('select * from registro_asignacion,matriculado '
                        . 'where registro_asignacion.idmatriculado = matriculado.id '
                        . '&& idAuxVentanilla = (select id from auxventanilla where noDocumento=:noD) '
                        . "&& fecha >= CAST( '". $data["fecha"]."' AS DATE ) "
                        . "&& fecha < CAST( DATE_ADD('". $data["fecha"]."',INTERVAL 1 DAY) AS DATE )"
                        . 'order by fecha desc',
                        ['noD' => $data["noDocumento"]]);
        
    }

}
