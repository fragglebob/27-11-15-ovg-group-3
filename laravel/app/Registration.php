<?php
/**
 * Created by PhpStorm.
 * User: rob
 * Date: 27/11/2015
 * Time: 16:22
 */

namespace App;


use Illuminate\Database\Eloquent\Model;

class Registration extends Model
{
    public $table = "Registrations";

    public $timestamps = false;
}