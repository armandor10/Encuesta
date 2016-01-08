<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

/**
 * Description of Auxventanilla
 *
 * @author SECREADMIN
 */
class Auxventanilla extends Model {
    
    protected $connection = 'mysql';
    //put your code here
    protected $table = 'auxventanilla';

    public $timestamps = false;
}
