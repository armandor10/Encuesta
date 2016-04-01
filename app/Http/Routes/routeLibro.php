<?php

Route::get('Biblioteca/Categoria','LibroController@getCategoria');
Route::get('Biblioteca/Categoria/{id}','LibroController@getTemasxCategoria');
Route::post('Biblioteca/Categoria','LibroController@storeCategoria');
Route::delete('Biblioteca/Categoria/{id}','LibroController@destroyCategoria');

Route::get('Biblioteca','LibroController@index');
Route::post('Biblioteca','LibroController@store');
Route::put('Biblioteca/{id}','LibroController@update');
Route::delete('Biblioteca/{id}','LibroController@destroy');

Route::get('Biblioteca/TemasLibro','LibroController@getTemaandLibro');

Route::get('Biblioteca/Temas','LibroController@getLibrosandTemas');
Route::post('Biblioteca/Temas','LibroController@storeTema');
Route::put('Biblioteca/Temas/{id}','LibroController@temaUpdate');
Route::delete('Biblioteca/Temas/{id}','LibroController@destroyTema');