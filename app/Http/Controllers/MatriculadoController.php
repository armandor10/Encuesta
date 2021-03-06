<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

use App\Http\Controllers\Controller;

use App\Models\Matriculado;
use DB;

class MatriculadoController extends Controller
{
    public function upload(Request $request){
        $fila = 1;
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $file->move( public_path().'/temp', $file->getClientOriginalName() );
            
            $fila = 0;
            if (($gestor = fopen( public_path().'/temp/m6.csv', "r") ) !== FALSE) {
                while (($datos = fgetcsv($gestor, 100000, ",")) !== FALSE) {
                    $numero = count($datos);
                    //echo "<p> $numero de campos en la línea $fila: <br /></p>\n";
                    
                    if( $fila >= 1) {
                        $estable = explode( ";", (string)$datos[0] );//split('[;.-]', (string)$datos[0]);
                        if( is_numeric($estable[0]) ){
                              if ($estable[0] == "109419" ){
                                    return $datos[0]; 
                                }
                            if( $estable[0] == "109250" || $estable[0] == "109381" ){
                              
                                //return $estable;                                 
                            }else{
                            $mat = Matriculado::where("noMatricula","=", $estable[0])
                                    ->first();
                            if( empty($mat) ){
                                $mat = new Matriculado();                      
                            }

                            $mat ->noMatricula  = $estable[0];
                            $mat ->razonSocial_nombre = $estable[1];
                            $mat ->propietario= $estable[4];
                            $mat->direccion = $estable[2];
                            $mat ->telefono= $estable[5];
                            $mat ->actividad = '4';

                            if( $estable[3] == 'MA' ){
                               $mat ->estado = 'A';                            
                            }elseif ($estable[3] == 'MC') {
                               $mat ->estado = 'C';    
                            } else {
                               $mat ->estado = 'I'; 
                            }

                            $mat->save();
                            
                            }

                        } 
                        //(string)$datos[0]
                    }
                    $fila++;
                    //echo $datos[$c] . "<br />\n";
                    
                }
                fclose($gestor);
            }
            
            return 'Cargado';
        }else{
            return 'No cargado';
        } 
        //return $request->file();
    }

    public function  getMatriculado(Request $request){
        $data = $request->all();
        $mat = Matriculado::where("noMatricula","=",$data["noMatricula"])->first();
        return $mat;                
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        return DB::table('matriculado')
            ->leftjoin('ubicacion', 'matriculado.id', '=', 'ubicacion.matriculado_id')
            ->leftjoin('actividad', 'matriculado.actividad', '=', 'actividad.id')
            ->select('matriculado.id','noMatricula', 'razonSocial_nombre',
                'propietario','direccion','telefono','actividad.actividad',
                'latitud', 'longitud','matriculado.actividad as idactividad')
            ->get();
    }

    public function save(Request $request){
                //
        try {           
            $data = $request->all();
        
            $matriculado = new Matriculado();
            $matriculado ->noMatricula  = $data["noMatricula"];            
            $matriculado ->razonSocial_nombre = $data["razonSocial_nombre"];
            $matriculado ->propietario= $data["propietario"];
            $matriculado ->direccion = $data["direccion"];
            $matriculado ->telefono= $data["telefono"];
            $matriculado ->actividad = $data["actividad"];
            $matriculado ->save();   
     
            return JsonResponse::create(array('message' => "Matriculado Guardada Correctamente", "request" => $matriculado), 200);
            
        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo guardar el Matriculado", "exception"=>$exc->getMessage(), "request" =>json_encode($data)), 401);
        }


    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
        try {           
            $data = $request->all();
        
            $matriculado = new Matriculado();
            $matriculado ->noMatricula  = $data["noMatricula"];
            $matriculado ->razonSocial_nombre = $data["razonSocial_nombre"];
            $matriculado ->propietario= $data["propietario"];
            $matriculado ->direccion = $data["direccion"];
            $matriculado ->telefono= $data["telefono"];
            $matriculado ->actividad = $data["actividad"];
            $matriculado ->save();   
     
            return JsonResponse::create(array('message' => "Matriculado Guardada Correctamente", "request" => $matriculado), 200);
            
        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo guardar el Matriculado", "exception"=>$exc->getMessage(), "request" =>json_encode($data)), 401);
        }

    }
    
    public function upMatriculados(Request $request){
        try {
            $data = $request->all();
            //return $data;
                if( ! empty($data) ){
                    foreach ($data as &$value) {                      
                        $mat = Matriculado::where("noMatricula","=", $value["MAT"])
                                ->first();
                        if( empty($mat) ){
                            $mat = new Matriculado();                      
                        }
                            $mat ->noMatricula  = $value["MAT"];
                            $mat ->razonSocial_nombre = $value["RAZONSOCIAL"];
                            $mat ->propietario= $value["PROPIETARIO"];
                            $mat->direccion = $value["DIRECCION"];
                            $mat ->telefono= $value["TELEFONO1"];
                            $mat ->actividad = '4';

                            if($value["EST"] == 'MA'){
                                $mat ->estado = 'A';                            
                            }elseif ($value["EST"] == 'MC') {
                                $mat ->estado = 'C';    
                            }else{
                                $mat ->estado = 'I'; 
                            }

                        $mat->save();
                    }
                     return JsonResponse::create(array('message' => "Matriculado Guardada Correctamente", "request" => ""), 200);
                }  
           
      
            }catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo guardar los Matriculados", "exception"=>$exc->getMessage(), "request" =>json_encode($data)), 401);
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
        try {
            
            $data = $request->all();
            
            /*$matriculado = Matriculado::find($id);

            $matriculado ->noMatricula  = $data["noMatricula"];
            $matriculado ->razonSocial_nombre = $data["razonSocial_nombre"];
            $matriculado ->propietario= $data["propietario"];
            $matriculado ->direccion = $data["direccion"];
            $matriculado ->telefono= $data["telefono"];
            $matriculado ->actividad = $data["actividad"];
            
            $matriculado->save();   */
            return $data;
            
        //return JsonResponse::create(array('message' => "Matricula Modificada Correctamente", "request" =>json_encode($data)), 200);
            
        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo Modificar la marca", "exception"=>$exc->getMessage(), "request" =>json_encode($data)), 401);
        }
    }
   
    public  function Actualizar(Request $request, $id){
        try {
            
            $data = $request->all();
            
            $matriculado = Matriculado::find($id);

            $matriculado ->noMatricula  = $data["noMatricula"];
            $matriculado ->razonSocial_nombre = $data["razonSocial_nombre"];
            $matriculado ->propietario= $data["propietario"];
            $matriculado ->direccion = $data["direccion"];
            $matriculado ->telefono= $data["telefono"];
            $matriculado ->actividad = $data["actividad"];
            
            $matriculado->save();  
            
            return JsonResponse::create(array('message' => "Matricula Modificada Correctamente", "request" =>json_encode($data)), 200);
            
        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo Modificar la Matricula", "exception"=>$exc->getMessage(), "request" =>json_encode($data)), 401);
        }
        
    }
    
     public  function Act(Request $request, $id){
        return $id;    
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
