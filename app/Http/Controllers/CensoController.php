<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

use App\Http\Controllers\Controller;

use App\Models\Censo;
use App\Models\Seccion;
use App\Models\Pregunta;
use App\Models\Respuesta;
use DB;

class CensoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        // return Censo::all();
        return DB::select('select * from censo where oculto = :o', ['o'=>'N']);
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
            
            $repeat =  DB::select('select * from censo where nombre = :n and oculto = :o',
                    ['n' => strtoupper($data["nombre"]), 'o' => 'N']);;
            
            //return  array('r'=>$repeat, 'data' => strtoupper($data["nombre"]));
            
             if( empty( $repeat  ) ){
                $censo = new Censo();
                $censo ->nombre  = strtoupper($data["nombre"]);
                $censo ->estado = 'I'; 
                $censo ->oculto = 'N'; 
                $censo ->gps = 'N'; 
                $censo ->foto = 'N'; 
                $censo ->grabacion = 'N'; 
                $censo ->save();   
     
                return JsonResponse::create(array('message' => "Censo Guardado Correctamente", "request" => $censo), 200);            
             }  else {
                 return JsonResponse::create(array('message' => "El censo ya existe!!!", "request" => null), 201);                                          
             }              
            
        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo guardar el Censo", "exception"=>$exc->getMessage(), "request" =>json_encode($data)), 401);
        }
    }
    
    public  function storeSeccion(Request $request){
        try {           
            $data = $request->all();            
            $repeat =  DB::select('select * from seccion where nombre = :n and censo = :c', 
                    ['n' => strtoupper($data["nombre"]), 'c' => $data["censo"]]);

             if( empty( $repeat  ) ){
                $seccion = new Seccion();
                $seccion ->nombre  = strtoupper($data["nombre"]);
                $seccion ->censo = $data["censo"]; 
                $seccion ->oculto = 'N'; 
                $seccion ->save();   
     
                return JsonResponse::create(array('message' => "Sección Guardada Correctamente", "request" => $seccion), 200);            
             }  else {
                 return JsonResponse::create(array('message' => "La sección ya existe!!!", "request" => 'Puede que la sección esta oculta en la base de datos'), 201);                                          
             }              
            
        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo guardar la Sección", "exception"=>$exc->getMessage(), "request" =>json_encode($data)), 401);
        }
    }
    
    public  function storePregunta(Request $request){
        try {           
            $data = $request->all();
            
            $pre = new Pregunta();
            $pre->pregunta = $data["pregunta"];
            $pre->requerido = $data["requerido"];
            $pre->tipo = $data["tipo"];
            $pre->seccion = $data["seccion"]; 
            $pre->save();
            
            $respuestas = $request->input('respuestas');
            //return $respuestas;
            if( ! empty($respuestas) ){
                foreach ($respuestas as &$value) {
                    $res =  new Respuesta();
                    $res->respuesta = $value;
                    $res->pregunta = $pre->id;
                    $res->save();
                    //return $value;
                }
            } 
 
            return JsonResponse::create(array('message' => "Pregunta Guardada Correctamente", "request" => $pre), 200);            
            
        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo guardar la Sección", "exception"=>$exc->getMessage(), "request" =>json_encode($data)), 401);
        }        
    }

    public function otra(Request $request){
        $data = $request->input('res');        
        return $data;        
        if( ! empty( $data ) ){
            foreach ($data as &$value) {
                return $value;             
            }            
        }
                
        return $data;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {        
         return DB::select('select * from seccion where censo=:id and oculto = :o', ['id' =>$id ,'o'=>'N']);
    }
    
    /* El id de la seccion */
    public function getPreguntas($id, $idSeccion){
        
        $seccion= DB::table('seccion')
            ->where('censo', '=', $id)
            ->where('id', '=', $idSeccion)
            ->get();
        
        $pregunta = DB::table('pregunta')
            ->where('seccion', '=', $idSeccion)
            ->get();
        
        foreach ($pregunta as &$value) {
            
            $respuesta = DB::table('respuesta')
            ->where('pregunta', '=', $value->id)
            ->get();          
            
            if( ! empty( $respuesta ) )
            {
                //return $respuesta;
                //$data2 = array('respuesta' => $respuesta);
                //$date3 = array('preguntas' => $value);
               //empty array
                //array_push($date3, $data2 );
            //$value->append($respuesta);
                $value ->respuestas = $respuesta;
            }
            
        }
        
        $data = array(
            'seccion'  => $seccion,
            'preguntas'   => $pregunta
        );

       return $data;
        
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
            $censo = Censo::find($id);
            $censo ->estado  = $data["estado"];            
            $censo->save();  
            
            return JsonResponse::create(array('message' => "Censo Modificado", "request" =>json_encode($data)), 200);
            
        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo Modificar el Censo", "exception"=>$exc->getMessage(), "request" =>json_encode($data)), 401);
        }
    }
    
    public function updateCensoConfig(Request $request, $id)
    {
        try {
            
            $data = $request->all();            
            $censo = Censo::find($id);
            $censo[$data["campo"]]  = $data["value"];            
            $censo->save();  
            
            return JsonResponse::create(array('message' => "Censo Modificado", "request" =>json_encode($data)), 200);
            
        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo Modificar el Censo", "exception"=>$exc->getMessage(), "request" =>json_encode($data)), 401);
        }
    }
    
    public function updatePregunta(Request $request, $id){
        try {
            
            $data = $request->all();
            
            $list = DB::table('respuesta')
                    ->where('pregunta', '=', $data["id"])
                    ->get();
            //return $list;
             if( ! empty( $list ) ){
                 foreach ($list as &$value) {
                     $res = Respuesta::find($value->id);
                     $res->delete();                     
                 }                 
             }
    
            $pre = Pregunta::find($id);
            $pre->pregunta = $data["pregunta"];
            $pre->requerido = $data["requerido"];
            $pre->tipo = $data["tipo"];
            $pre->seccion = $data["seccion"]; 
            $pre->save();
            
            $respuestas = $request->input('respuestas');
            if( ! empty($respuestas) ){
                foreach ($respuestas as &$value) {
                    $res =  new Respuesta();
                    $res->respuesta = $value;
                    $res->pregunta = $pre->id;
                    $res->save();
                    //return $value;
                }
            }  
            
            return JsonResponse::create(array('message' => "Pregunta Modificada", "request" =>json_encode($data)), 200);
            
        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo Modificar el Censo", "exception"=>$exc->getMessage(), "request" =>json_encode($data)), 401);
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
            $censo = Censo::find($id);
            $censo->oculto = 'S';
            $censo->save();
            
            return JsonResponse::create(array('message' => "Censo Eliminado Correctamente", "request" =>json_encode($id)), 200);
        } catch (Exception $ex) {
            return JsonResponse::create(array('message' => "No se pudo Eliminar el Censo", "exception"=>$ex->getMessage(), "request" =>json_encode($id)), 401);
        }
    }
    
    public function destroySeccion($id)
    {
        try {
            $seccion = Seccion::find($id);
            $seccion->oculto = 'S';
            $seccion->save();
            
            return JsonResponse::create(array('message' => "Sección Eliminada Correctamente", "request" =>json_encode($id)), 200);
        } catch (Exception $ex) {
            return JsonResponse::create(array('message' => "No se pudo Eliminar la Sección", "exception"=>$ex->getMessage(), "request" =>json_encode($id)), 401);
        }
    }
    
    public function destroyPregunta($id){
        
         try {
            $pre = Pregunta::find($id);
       
            $list = DB::table('respuesta')
                    ->where('pregunta', '=', $pre->id)
                    ->get();
            //return $list;
             if( ! empty( $list ) ){
                 foreach ($list as &$value) {
                     $res = Respuesta::find($value->id);
                     $res->delete();                     
                 }                 
             }
            $pre->delete();
            return JsonResponse::create(array('message' => "Pregunta Eliminada Correctamente", "request" =>json_encode($id)), 200);
         }catch (Exception $ex) {
            return JsonResponse::create(array('message' => "No se pudo Eliminar la pregunta", "exception"=>$ex->getMessage(), "request" =>json_encode($id)), 401);
         }       
    }
}
