<?php

namespace App\Http\Controllers;

use App\Models\Mascota;
use Illuminate\Http\Request;

class AdopcionController extends Controller
{
    public function register($id)
    {
        if (!is_numeric($id)) {
            abort(404);
        }
        $mascota = Mascota::find($id);
        if (!$mascota) {
            abort(404);
        }
        return view('adopciones.register', compact('mascota'));
    }

    public function home()
    {
        return view('adopciones.home');
    }

    public function form()
    {
        return view('adopciones.form');
    }
}
