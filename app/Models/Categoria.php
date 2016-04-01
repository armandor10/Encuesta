<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

/**
 * Description of Categoria
 *
 * @author SECREADMIN
 */
class Categoria extends Model  {
    protected $connection = 'biblioteca';
    //put your code here
    protected $table = 'categoria';

    public $timestamps = false;
}
