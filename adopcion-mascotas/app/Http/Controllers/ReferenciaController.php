<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ReferenciaController extends Controller
{
    public function home()
    {
        return view('referencias.home');
    }

    public function form()
    {
        return view('referencias.form');
    }
}
