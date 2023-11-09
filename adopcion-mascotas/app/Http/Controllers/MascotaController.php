<?php

namespace App\Http\Controllers;

use App\Models\Mascota;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class MascotaController extends Controller
{
    public function home()
    {
        $mascotas = Mascota::all();
        return view('mascotas.home', compact('mascotas'));
    }
    public function index()
    {
        return Mascota::all();
    }

    public function form()
    {
        return view('mascotas.form');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required',
            'tipo' => 'required',
            'raza' => 'required',
            'color' => 'required',
            'tamano' => 'required',
            'esta_adoptado' => Rule::in(['on', 'off']),
        ]);
        $mascota = new Mascota();
        $mascota->nombre = $request->nombre;
        $mascota->tipo = $request->tipo;
        $mascota->raza = $request->raza;
        $mascota->color = $request->color;
        $mascota->tamano = $request->tamano;
        $mascota->esta_adoptado = $request->esta_adoptado == 'on' ? true : false;
        $mascota->save();
        return $mascota;
    }
}
