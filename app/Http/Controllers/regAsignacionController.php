<?php

namespace App\Http\Controllers;

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
                ->select("SELECT nombres,apellidos FROM empleados "
                        . "where noDocumento = :n", 
                        ['n' => $value->noDocumento ]);
           
           $re["noDocumento"] = $value->noDocumento;
           $re["stiker"] = $value->stiker;
           $re["fecha"] = $value->fecha;
           $re["matricula"] = $value->noMatricula;
           $re["nombre"] = $empleado[0]->nombres.' '.$empleado[0]->apellidos; 
           
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
                ->select("SELECT nombres,apellidos FROM empleados "
                        . "where noDocumento = :n", 
                        ['n' => $value->noDocumento ]);
           
           $re["noDocumento"] = $value->noDocumento;
           $re["stiker"] = $value->stiker;
           $re["fecha"] = $value->fecha;
           $re["matricula"] = $value->noMatricula;
           $re["nombre"] = $empleado[0]->nombres.' '.$empleado[0]->apellidos; 
           
           array_push($list,$re);           
        }
        return $list; 
    }



    
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = $request->all();
        $aux = Auxventanilla::
                where('noDocumento','=',$data['noDocumento'])
                ->first();
        
        if( empty($aux) ){         
            return array('estado'=>'KO','message'=>'No se encontró el Auxiliar de ventanilla en la base de datos');
                        
        }
                
        if($data['stiker'] >= $aux->inicioStiker && $data['stiker'] <= $aux->finStiker ){
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
                    $matriculado->save();
                    
                    $regAsig->idmatriculado = $matriculado->id;
                    
                }  else {
                    $regAsig->idmatriculado = $matriculado[0]->id;
                    $reg = DB::connection('mysql')
                            ->select("SELECT * FROM registro_asignacion where idmatriculado='".$matriculado[0]->id."' "
                                    . "&& YEAR(fecha) <= YEAR(now())");
                    if( ! empty($reg) ){
                        return array('estado'=>'OK','message'=>'La matrícula ya tiene un Stiker asignado');                                                 
                    }
                    
                }
                
               
                $regAsig->stiker = $data['stiker'];
                $regAsig->fecha = DB::connection('mysql')->select("select now() as now")[0]->now ;
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

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
