<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App\Models;


use Illuminate\Database\Eloquent\Model;
/**
 * Description of regAsignacion
 *
 * @author SECREADMIN
 */
class regAsignacion extends Model 
{
    protected $connection = 'mysql';
    
    protected $table = 'registro_asignacion';

    public $timestamps = false;
}
