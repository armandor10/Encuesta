<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Models\Libro;
use App\Models\Tema;
use DB;

class LibroController extends Controller
{
    public function index()
    {
        return Libro::all();
    }
    
    public function getLibrosandTemas(){
        $libros = Libro::all();
        foreach ($libros as &$value) {
            $temas =  DB::connection('biblioteca')
                ->select("select * from tema
                          where libro = :id",
                          ['id'=> $value->id ]);
            $value->temas = $temas;            
        }
        return $libros;
    }
    
    public function getTemaandLibro(){
       return DB::connection('biblioteca')->select('SELECT codigo,titulo,fecha,tema,pagina FROM
                    biblioteca.tema AS T RIGHT JOIN biblioteca.libro AS L 
                    ON L.ID = T.libro');    
    }

    public function storeTema(Request $request)
    {
        try {           
            $data = $request->all();
            $tema = new Tema();
            $tema->tema =$data["tema"];
            $tema->pagina = $data["pagina"];
            $tema->libro = $data["libro"];
            $tema->save();
            
            return JsonResponse::create(array('message' => "Guardado Correctamente", "request" => $tema), 201);                                         
                        
        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo guardar el Tema", "exception"=>$exc->getMessage(), "request" =>json_encode($data)), 401);
        }
    }
    
    public function store(Request $request){
        try {           
            $data = $request->all();
            $libro = new Libro();
            $libro->codigo = $data["codigo"];
            $libro->titulo = $data["titulo"];
            $libro->fecha = $data["fecha"];
            $libro->save();
            
            return JsonResponse::create(array('message' => "Guardado Correctamente", "request" => $libro), 201);                                         
                        
        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo guardar el Libro", "exception"=>$exc->getMessage(), "request" =>json_encode($data)), 401);
        }
                
    }
    
    public function update(Request $request, $id)
    {
        try {           
            $data = $request->all();
            $libro = Libro::find($id);
            $libro->titulo = $data["titulo"];
            $libro->fecha = $data["fecha"];
            $libro->save();
            
            return JsonResponse::create(array('message' => "Actualizado Correctamente", "request" => null), 201);                                         
                        
        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo Actualizar el Libro", "exception"=>$exc->getMessage(), "request" =>json_encode($data)), 401);
        }
    }
    
    public function temaUpdate(Request $request, $id)
    {
        try {           
            $data = $request->all();
            $tema= Tema::find($id);
            $tema->tema =$data["tema"];
            $tema->pagina = $data["pagina"];
            $tema->save();
            
            return JsonResponse::create(array('message' => "Actualizado Correctamente", "request" => null), 201);                                         
                        
        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo Actualizar el Tema", "exception"=>$exc->getMessage(), "request" =>json_encode($data)), 401);
        }
    }
    
    public function destroyTema($id)
    {
        try {
            $tema = Tema::find($id);
            $tema->delete();
            
            return JsonResponse::create(array('message' => "Eliminado Correctamente", "request" => null), 201);                                         
                        
        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo Eliminar el Tema", "exception"=>$exc->getMessage(), "request" =>json_encode($data)), 401);
        }
    }

    public function destroy($id)
    {
        try {
            $libro = Libro::find($id);
            $libro->delete();
            
            return JsonResponse::create(array('message' => "Libro Eliminado Correctamente", "request" => null), 201);                                         
                        
        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo Eliminar el Libro", "exception"=>$exc->getMessage(), "request" =>json_encode($data)), 401);
        }
    }
}
