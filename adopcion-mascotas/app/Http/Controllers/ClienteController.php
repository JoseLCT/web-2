<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ClienteController extends Controller
{
    public function home()
    {
        return view('clientes.home');
    }

    public function form()
    {
        return view('clientes.form');
    }
}
