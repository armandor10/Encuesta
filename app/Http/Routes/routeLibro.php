<?php

Route::get('Biblioteca','LibroController@index');
Route::post('Biblioteca','LibroController@store');
Route::put('Biblioteca/{id}','LibroController@update');
Route::delete('Biblioteca/{id}','LibroController@destroy');

Route::get('Biblioteca/TemasLibro','LibroController@getTemaandLibro');

Route::get('Biblioteca/Temas','LibroController@getLibrosandTemas');
Route::post('Biblioteca/Temas','LibroController@storeTema');
Route::put('Biblioteca/Temas/{id}','LibroController@temaUpdate');
Route::delete('Biblioteca/Temas/{id}','LibroController@destroyTema');