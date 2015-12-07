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



/* Router Menu*/
Route::get('Menu','MenuController@index');

/* Router Matriculado */
//Route::resource('Matriculado','MatriculadoController');
Route::get('Matriculado','MatriculadoController@index');
Route::post('Matriculado/save','MatriculadoController@save');
Route::put('Matriculado/{id}', 'MatriculadoController@Actualizar');

/* Router Actividad */
Route::get('Actividad','ActividadController@index');

