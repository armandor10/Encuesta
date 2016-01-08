<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

use App\Http\Controllers\Controller;

use App\Models\Censador;
use App\Models\Usuarios;
use App\Models\Auxventanilla;
use DB;

class CensadorController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public  function index(){
        
        return DB::connection('ccv')
                ->select('select noDocumento from empleados');
    }


    public function indext()
    {
        //
        return DB::select("select empleados.*, usuarios.correo, 
                 usuarios.estado as state
                 from empleados 
                 LEFT JOIN usuarios ON empleados.id = usuarios.Empleados_id 
                 where cargos_id = :id", ['id'=> 7 ]);
    }
    
    public function getAuxVentanilla()
    {
        $data = DB::connection('ccv')
                ->select("SELECT noDocumento,nombres,apellidos FROM empleados where cargos_id= :id",
                        ['id'=> 36 ]);
        
               $list = array();
                foreach ($data as &$value) {
                   //return $value->noDocumento;
                    $auxventanilla["noDocumento"] = $value->noDocumento;
                    $auxventanilla["nombre"] = $value->nombres." ".$value->apellidos;
                    $auxventanilla["inicioStiker"] = "";
                    $auxventanilla["finStiker"] = "";
                    $auxventanilla["Entregados"] = "";
                    
                    $aux = Auxventanilla::
                            where('noDocumento', '=', $value->noDocumento)
                            ->first();                   
                    if( ! empty($aux) ){
                        $auxventanilla["inicioStiker"] = $aux->inicioStiker;
                        $auxventanilla["finStiker"] = $aux->finStiker;
                        $auxventanilla["Entregados"] = DB::connection('mysql')
                                            ->table("registro_asignacion")
                                            ->where('idAuxVentanilla', '=', $aux->id)
                                            ->count();
                        
                    }

                    array_push($list,$auxventanilla);                     
                }
                
        return $list;
        
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {           
            $data = $request->all();
            
            $codigoAnt = DB::select('select CODIGO from empleados order by CAST(codigo AS SIGNED) desc LIMIT 1');          
            
            $censador = new Censador();
            $censador->noDocumento = $data["noDocumento"];
            $censador->nombres = $data["nombres"];
            $censador->apellidos = $data["apellidos"];
            $censador->estado = 'Activo';
            $censador->Cargos_id= '7';
            $censador->TipoDocumentos_id = '1';
            $censador->direccion = $data["direccion"];
            $censador->telefono = $data["telefono"];
            $censador->codigo = $codigoAnt[0]->CODIGO + 1;
            $censador->save();
            
            $usuarios = new Usuarios();
            $usuarios->correo = $data["correo"];
            $usuarios->clave = "123456";
            $usuarios->Empleados_id = $censador->id;
            $usuarios->estado = 'A'; 
            $usuarios->save();
                                    
            return JsonResponse::create(array('message' => "Censador Guardado Correctamente", "request" => $censador), 200);                                                 
        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo guardar el Censo", "exception"=>$exc->getMessage(), "request" =>json_encode($data)), 401);
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
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try {           
            $data = $request->all();
            $censador = Censador::find($id);
            $censador->noDocumento = $data["noDocumento"];
            $censador->nombres = $data["nombres"];
            $censador->apellidos = $data["apellidos"];
            $censador->Cargos_id= '7';
            $censador->direccion = $data["direccion"];
            $censador->telefono = $data["telefono"];
            $censador->save();
                                    
            return JsonResponse::create(array('message' => "Censador Guardado Correctamente", "request" => $censador), 200);                                                 
        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo guardar el Censador", "exception"=>$exc->getMessage(), "request" =>json_encode($data)), 401);
        }
    }
    
    public function updateClave(Request $request, $id){
        try {           
            $data = $request->all();
            $usuarios = Usuarios::
            where('Empleados_id', '=', $id)
            ->first();
            
            $usuarios->clave = $data["clave"];
            $usuarios->save();
                                    
            return JsonResponse::create(array('message' => "Clave Cambiada Correctamente", "request" => $usuarios), 200);                                                 
        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo Cambiar la clave", "exception"=>$exc->getMessage(), "request" =>json_encode($data)), 401);
        }        
    }
    
    public function updateEstado(Request $request, $id){
        try {           
            $data = $request->all();
            $usuarios = Usuarios::
            where('Empleados_id', '=', $id)
            ->first();
            
            $usuarios->estado = $data["estado"];
            $usuarios->save();
                                    
            return JsonResponse::create(array('message' => "Estado Cambiado Correctamente", "request" => $usuarios), 200);                                                 
        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo Cambiar el estado", "exception"=>$exc->getMessage(), "request" =>json_encode($data)), 401);
        }                
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            
          $usuarios = Usuarios::
            where('Empleados_id', '=', $id)
            ->first();
          $usuarios->delete();
          
          $censador = Censador::find($id);
          $censador->delete();

            return JsonResponse::create(array('message' => "Censador Borrado Correctamente", "request" => $censador), 200);                                                 
        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo Borrar el Censador", "exception"=>$exc->getMessage(), "request" =>json_encode($data)), 401);
        }
    }
}
