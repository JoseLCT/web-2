<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;

class ClienteController extends Controller
{
    public function home()
    {
        $clientes = Cliente::all();
        return view('clientes.home', compact('clientes'));
    }

    public function form($id = null)
    {
        $cliente = new Cliente();
        if ($id != null) {
            $cliente = Cliente::findOrFail($id);
        }
        return view('clientes.form', compact('cliente'));
    }

    public function store(Request $request, $id = null)
    {
        $request->validate([
            'nombres' => 'required',
            'apellidos' => 'required',
            'telefono' => 'required',
            'correo' => 'required',
        ]);
        if ($id == null) {
            $cliente = new Cliente();
        } else {
            $cliente = Cliente::findOrFail($id);
        }
        $cliente->nombres = $request->nombres;
        $cliente->apellidos = $request->apellidos;
        $cliente->telefono = $request->telefono;
        $cliente->correo = $request->correo;
        $cliente->save();
        return redirect()->route('clientes.home');
    }

    public function destroy($id)
    {
        $cliente = Cliente::findOrFail($id);
        $cliente->delete();
        return redirect()->route('clientes.home');
    }
}
