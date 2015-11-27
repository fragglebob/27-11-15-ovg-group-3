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
        $size = 10;
        if($since = \Illuminate\Support\Facades\Input::get('since_id', false)) {
            return App\Message::orderBy('id', 'asc')->take($size)->where('id', '>', $since)->get();
        } else {
            return App\Message::orderBy('id', 'desc')->take($size)->get();
        }
    });

    $router->get('api/trending', function () {

        return [
            "positive" => \App\Trend::where('Ongoing', 1)->orderBy('size', 'desc')->where('Tone', '>', 0)->take(3)->get(['Trend', 'Size']),
            "negative" => \App\Trend::where('Ongoing', 1)->orderBy('size', 'desc')->where('Tone', '<', 0)->take(3)->get(['Trend', 'Size'])
        ];

    });

    $router->post('api/registration_id', function(){
        $id = \Illuminate\Support\Facades\Input::get('registration_id');

        if($id) {
            $reg = new \App\Registration();
            $reg->Registration = $id;
            $reg->save();
        }

        return ['status' => true];
    });

});


