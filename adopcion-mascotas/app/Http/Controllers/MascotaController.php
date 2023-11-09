<?php

namespace App\Http\Controllers;

use App\Models\Mascota;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class MascotaController extends Controller
{
    public function main()
    {
        $mascotas = Mascota::where('esta_adoptado', false)->get();
        return view('mascotas.main', compact('mascotas'));
    }

    public function home()
    {
        $mascotas = Mascota::all();
        return view('mascotas.home', compact('mascotas'));
    }

    public function form($id = null)
    {
        $mascota = new Mascota();
        if ($id != null) {
            $mascota = Mascota::findOrFail($id);
        }
        return view('mascotas.form', compact('mascota'));
    }

    public function store(Request $request, $id = null)
    {
        $request->validate([
            'nombre' => 'required',
            'tipo' => 'required',
            'raza' => 'required',
            'color' => 'required',
            'tamano' => 'required',
            'esta_adoptado' => Rule::in(['on', 'off']),
        ]);
        if ($id == null) {
            $mascota = new Mascota();
        } else {
            $mascota = Mascota::findOrFail($id);
        }
        $mascota->nombre = $request->nombre;
        $mascota->tipo = $request->tipo;
        $mascota->raza = $request->raza;
        $mascota->color = $request->color;
        $mascota->tamano = $request->tamano;
        $mascota->esta_adoptado = $request->esta_adoptado == 'on' ? true : false;
        $mascota->save();
        return redirect()->route('mascotas.home');
    }

    public function destroy($id)
    {
        $mascota = Mascota::findOrFail($id);
        $mascota->delete();
        return redirect()->route('mascotas.home');
    }
}
