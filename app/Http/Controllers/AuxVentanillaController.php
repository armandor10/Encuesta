<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Models\Auxventanilla;
use DB;

class AuxVentanillaController extends Controller
{
    
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
                        . '(select id from auxventanilla where noDocumento=:noD)'
                        . 'order by fecha desc',
                        ['noD' => $data["noDocumento"]]);        
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
        //
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
