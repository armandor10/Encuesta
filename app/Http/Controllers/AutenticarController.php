<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use DB;

class autenticarController extends Controller
{
    
    public function autenticar(Request $request){
        try {                                 
          $data = $request->all();
             $usuario = $data['username'];
             $clave = $data['pass'];
              $user = DB::connection('ccv')->
                      select(DB::raw(
                        "Select u.*, e.nombres, e.apellidos, e.noDocumento from usuarios as u
                            INNER JOIN empleados as e ON e.id = u.Empleados_id
                         WHERE u.correo =  '".$usuario."'  AND u.clave = '".$clave."'"
                    ));      
           if (empty($user)){
                return JsonResponse::create(array('message' => "KO", "request" =>json_encode('Datos Incorrectos')), 200);
            }else{     
                 return JsonResponse::create(array('message' =>"OK", "request" =>json_encode($user)), 200);
              
            }
        
      
        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se puedo autenticar el usuario", "request" =>json_encode($data)), 401);
        }
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
