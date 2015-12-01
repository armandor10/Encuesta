<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

use App\Http\Controllers\Controller;

use App\Models\Matriculado;
use DB;

class MatriculadoController extends Controller
{
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
                'latitud', 'longitud')
            ->get();
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
        /*try {           
            $data = $request->all();
        
            $matriculado = new Matriculado();
            $matriculado ->noMatriculado  = $data["noMatriculado"];
            $matriculado ->razonSocial_nombre = $data["razonSocial_nombre"];
            $matriculado ->propietario= $data["propietario"];
            $matriculado ->direccion = $data["direccion"];
            $matriculado ->telefono= $data["telefono"];
            $matriculado ->actividad = $data["actividad"];
            $matriculado ->save();   
     
            return JsonResponse::create(array('message' => "Matriculado Guardada Correctamente", "request" => $matriculado), 200);
            
        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo guardar el Matriculado", "exception"=>$exc->getMessage(), "request" =>json_encode($data)), 401);
        }*/

        return 'hola';

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
