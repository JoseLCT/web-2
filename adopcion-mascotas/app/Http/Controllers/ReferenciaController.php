<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use App\Models\Referencia;
use Illuminate\Http\Request;

class ReferenciaController extends Controller
{
    public function home()
    {
        $referencias = Referencia::all();
        $clientes = Cliente::all();
        return view('referencias.home', compact('referencias', 'clientes'));
    }

    public function form($id = null)
    {
        $referencia = new Referencia();
        if ($id != null) {
            $referencia = Referencia::findOrFail($id);
        }
        $clientes = Cliente::all();
        return view('referencias.form', compact('referencia', 'clientes'));
    }

    public function store(Request $request, $id = null)
    {
        $request->validate([
            'id_cliente' => 'required',
            'nombres' => 'required',
            'contacto' => 'required',
            'parentesco' => 'required',
        ]);
        if ($id == null) {
            $referencia = new Referencia();
        } else {
            $referencia = Referencia::findOrFail($id);
        }
        $referencia->id_cliente = $request->id_cliente;
        $referencia->nombres = $request->nombres;
        $referencia->contacto = $request->contacto;
        $referencia->parentesco = $request->parentesco;
        $referencia->save();
        return redirect()->route('referencias.home');
    }

    public function destroy($id)
    {
        $referencia = Referencia::findOrFail($id);
        $referencia->delete();
        return redirect()->route('referencias.home');
    }
}
