<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

/**
 * Description of Libro
 *
 * @author SECREADMIN
 */
class Libro extends Model  {
    protected $connection = 'biblioteca';
    //put your code here
    protected $table = 'libro';

    public $timestamps = false;
}
