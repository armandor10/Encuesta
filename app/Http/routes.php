<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/m', function () {
    return 'welcome';
});

/* Router Autenticar*/
Route::post('usuario/autenticar','AutenticarController@autenticar');


/* Router Menu*/
Route::get('Menu','MenuController@index');

/* Router Matriculado */
//Route::resource('Matriculado','MatriculadoController');
Route::get('Matriculado','MatriculadoController@index');
Route::post('Matriculado/save','MatriculadoController@save');
Route::put('Matriculado/{id}', 'MatriculadoController@Actualizar');
Route::post('Matriculado/upload','MatriculadoController@upload');
Route::post('Matriculado/upMatriculados','MatriculadoController@upMatriculados');
Route::post('Matriculado/upload','MatriculadoController@upload');
Route::post('Matriculado/getMatriculado','MatriculadoController@getMatriculado');

/* Router Actividad */
Route::get('Actividad','ActividadController@index');

/* Router Censo */

Route::get('Censo','CensoController@index');
Route::get('Censo/{id}','CensoController@show');
Route::get('Censo/{id}/{idSeccion}','CensoController@getPreguntas');
Route::post('/Censo','CensoController@store');
Route::post('/Seccion','CensoController@storeSeccion');
Route::post('/Pregunta','CensoController@storePregunta'); //'CensoController@storePregunta'
Route::post('/otra','CensoController@otra'); 
Route::put('Censo/{id}','CensoController@update');
Route::put('Censo/Config/{id}','CensoController@updateCensoConfig');
Route::put('Pregunta/{id}','CensoController@updatePregunta');
Route::delete('Censo/{id}','CensoController@destroy');
Route::delete('Seccion/{id}','CensoController@destroySeccion');
Route::delete('Pregunta/{id}','CensoController@destroyPregunta');

/* Router Censador*/
Route::resource('Censador','CensadorController');
Route::put('Censador/CambiarClave/{id}','CensadorController@updateClave');
Route::put('Censador/CambiarEstado/{id}','CensadorController@updateEstado');

/* Router Auxiliar de Ventanilla */
Route::get('Empleado/AuxVentanilla','AuxVentanillaController@getAuxVentanilla');
Route::post('Empleado/AuxVentanilla/getRangoStiker','AuxVentanillaController@getRangoStiker');
Route::post('Empleado/AuxVentanilla/saveRango','AuxVentanillaController@saveRango');
Route::post('Empleado/AuxVentanilla/getRegistroAsignacion','AuxVentanillaController@getRegistroAsignacion');

/* Router Registro de Asignacion */
Route::post('regAsignacion/getLikeStiker','regAsignacionController@getLikeStiker');
Route::post('regAsignacion/getLikeMatricula','regAsignacionController@getLikeMatricula');
Route::post('regAsignacion','regAsignacionController@store');
Route::post('regAsignacion/getRegistroAsignacion','regAsignacionController@getRegistroAuxFecha');

/* Router Biblioteca*/
include 'Routes/routeLibro.php';
