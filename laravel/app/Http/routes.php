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

Route::group(['middleware' => 'cors'], function(\Illuminate\Routing\Router $router){
    $router->get('api/messages', function () {
        $size = 20;
        if($since = \Illuminate\Support\Facades\Input::get('since_id', false)) {
            return App\Message::orderBy('id', 'asc')->take($size)->where('id', '>', $since)->get();
        } else {
            return App\Message::orderBy('id', 'desc')->take($size)->get();
        }
    });

    $router->get('api/trending', function () {

        return [
            "positive" => ['Server', "Ducks", "Robots"],
            "negative" => ['Domains', 'SSL']
        ];


    });
});


