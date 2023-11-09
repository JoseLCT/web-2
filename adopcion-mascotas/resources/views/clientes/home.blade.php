@extends('layouts.app')

@section('content')
    <div class="container">
        <div style="display: flex; align-content: center;">
            <h1 class="text-start">Lista de clientes</h1>
            <a href="{{ url('clientes/create') }}" class="btn btn-secondary mb-3 ms-3">
                <i class="bi bi-plus"></i>
            </a>
        </div>
        <table class="table table-striped table-hover mt-3">
            <thead>
            <tr>
                <th>ID</th>
                <th>Nombres</th>
                <th>Apellidos</th>
                <th>Teléfono</th>
                <th>Correo</th>
                <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
            @foreach($clientes as $cliente)
                <tr>
                    <td>{{ $cliente->id }}</td>
                    <td>{{ $cliente->nombres }}</td>
                    <td>{{ $cliente->apellidos }}</td>
                    <td>{{ $cliente->telefono }}</td>
                    <td>{{ $cliente->correo }}</td>
                    <td>
                        <a href="{{ url('clientes/edit/' . $cliente->id) }}" class="btn btn-primary">
                            <i class="bi bi-pencil-square"></i>
                        </a>
                        <a href="{{ url('clientes/delete/' . $cliente->id) }}" class="btn btn-danger">
                            <i class="bi bi-trash"></i>
                        </a>
                    </td>
                </tr>
            @endforeach()
            </tbody>
        </table>
    </div>
@endsection
