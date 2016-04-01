<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Models\Libro;
use App\Models\Tema;
use App\Models\Categoria;
use App\Models\TemasCategoria;
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
                ->select("select t.*,tc.categoria from tema as t 
                    left join temas_categoria as tc 
                    on tc.tema=t.id where libro = :id",
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
    
    public function getCategoria(){
       return DB::connection('biblioteca')->select('SELECT * from categoria');          
    }
    
    public function storeCategoria(Request $request){
        try {           
            $data = $request->all();
            $categoria = new Categoria();
            
            $categoria->parent = $data["parent"];
            $categoria->text = $data["text"];
            
            $categoria->save();
            
            return JsonResponse::create(array('message' => "Guardado Correctamente", "request" => $categoria), 201);                                         
                        
        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo guardar el Tema", "exception"=>$exc->getMessage(), "request" =>json_encode($data)), 401);
        }                
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
            
            $temasCategoria = new TemasCategoria();
            $temasCategoria->categoria = $data["categoria"];
            $temasCategoria->tema = $tema->id;
            $temasCategoria->save();
            
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
            
            $temasCategoria = TemasCategoria::where('tema','=',$id)->first();
            if( empty($temasCategoria) ){
                $temasCategoria = new TemasCategoria();
            }
            $temasCategoria->categoria = $data["categoria"];
            $temasCategoria->tema = $id;
            $temasCategoria->save();
            
            return JsonResponse::create(array('message' => "Actualizado Correctamente", "request" => $tema), 201);                                         
                        
        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo Actualizar el Tema", "exception"=>$exc->getMessage(), "request" =>json_encode($data)), 401);
        }
    }
    
    public function destroyTema($id)
    {
        try {
            $tema = Tema::find($id);
            $temasCategoria = TemasCategoria::where('tema','=',$id)->first();
            $temasCategoria->delete();
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
    
    public function destroyCategoria($id){
        try {
            if( $this->BuscarCategoria($id) || $this->BuscarCategoraChild($id) ){
                return JsonResponse::create(array('message' => "No se pudo Eliminar la categoría o subcategoría porque "
                    . "tiene asignado uno o varios temas asignados", 
                    "request" => null), 201); 
                
            } else {
                $categoria = Categoria::find($id);
                $categoria->delete();
                return JsonResponse::create(array('message' => "Categoría Eliminada Correctamente", 
                    "request" => null), 201); 
                
            }           
        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo Eliminar la categoría", 
                "exception"=>$exc->getMessage(), "request" =>json_encode($data)), 401);
        }
        
    }
    
    public function BuscarCategoria($id){        
        $categoriaTema = DB::connection('biblioteca')->select("SELECT * FROM temas_categoria"
                    . " where categoria='".$id."' limit 1");
        if( !empty($categoriaTema) ){
            return true;
        }
        
        $categoria = Categoria::find($id);
        if ($categoria->parent != '#') {
            return $this->BuscarCategoria($categoria->parent);        
        }
        
        return false;  
    }
    
    public function BuscarCategoraChild($id){
        $categoria = DB::connection('biblioteca')->select("SELECT * FROM categoria"
                    . " where parent='".$id."'");
        if( ! empty($categoria) ){
            foreach ($categoria as &$value) {
                $categoriaTema = DB::connection('biblioteca')->select("SELECT * FROM temas_categoria"
                            . " where categoria='".$value->id."' limit 1");
                if( !empty($categoriaTema) ) {
                    return true;                    
                } else {
                    return $this->BuscarCategoraChild($value->id);                     
                }                
            }            
        }
        return false;
    }
    
    public function getTemasxCategoria($id){
        $t = DB::connection('biblioteca')->select("select t.*,tc.categoria,l.codigo,l.titulo
                                from tema as t 
                                left join temas_categoria as tc on tc.tema=t.id 
                                inner join libro as l on l.id=t.libro 
                                where categoria=".$id);
        $tema = array();

        if( !empty($t) ){
            foreach ($t as &$value) {
                array_push( $tema, $value);                                
            }            
        }
        //return $tema;
        return $this->getChildCategoria( $id, $tema);
    }
    
    public function getChildCategoria(&$id,&$tema){
        $categoria = DB::connection('biblioteca')->select("SELECT * FROM categoria"
                    . " where parent='".$id."'");
        if( ! empty($categoria) ){
            foreach ($categoria as &$value) {
                $t = DB::connection('biblioteca')->select("select t.*,tc.categoria,l.codigo,l.titulo
                                        from tema as t 
                                        left join temas_categoria as tc on tc.tema=t.id 
                                        inner join libro as l on l.id=t.libro 
                                        where categoria=".$value->id);
                if( !empty($t) ){
                    foreach ($t as &$val) {
                        array_push( $tema, $val);                                
                    }            
                }
                return $this->getChildCategoria($value->id, $tema); 
            }            
        }
        return $tema;
    }

}
