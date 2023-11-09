<?php

namespace App\Http\Controllers;

use App\Models\Adopcion;
use App\Models\Cliente;
use App\Models\Mascota;
use Illuminate\Http\Request;

class AdopcionController extends Controller
{
    public function form($id = null)
    {
        $adopcion = new Adopcion();
        $mascota = new Mascota();
        $mascotas = Mascota::where('esta_adoptado', false)->get();
        if ($id != null) {
            $adopcion = Adopcion::findOrFail($id);
            $mascota = Mascota::findOrFail($adopcion->id_mascota);
            $mascotas->push($mascota);
        }
        $clientes = Cliente::all();
        return view('adopciones.form', compact('adopcion', 'mascota', 'mascotas', 'clientes'));
    }

    public function adopting($id_mascota = null)
    {
        $adopcion = new Adopcion();
        $mascota = Mascota::findOrFail($id_mascota);
        $mascotas = Mascota::all();
        $clientes = Cliente::all();
        return view('adopciones.form', compact('adopcion', 'mascota', 'mascotas', 'clientes'));
    }

    public function home()
    {
        $adopciones = Adopcion::all();
        $mascotas = Mascota::all();
        $clientes = Cliente::all();
        return view('adopciones.home', compact('adopciones', 'mascotas', 'clientes'));
    }

    public function store(Request $request, $id = null)
    {
        $request->validate([
            'id_cliente' => 'required',
            'id_mascota' => 'required',
            'fecha_adopcion' => 'required',
        ]);
        if ($id == null) {
            $adopcion = new Adopcion();
        } else {
            $adopcion = Adopcion::findOrFail($id);
        }
        $adopcion->id_cliente = $request->id_cliente;
        $adopcion->id_mascota = $request->id_mascota;
        $adopcion->fecha_adopcion = $request->fecha_adopcion;
        $adopcion->save();
        $mascota = Mascota::findOrFail($request->id_mascota);
        $mascota->esta_adoptado = true;
        $mascota->save();
        return redirect()->route('adopciones.home');
    }

    public function destroy($id)
    {
        $adopcion = Adopcion::findOrFail($id);
        $mascota = Mascota::findOrFail($adopcion->id_mascota);
        $adopcion->delete();
        $mascota->esta_adoptado = false;
        $mascota->save();
        return redirect()->route('adopciones.home');
    }
}
