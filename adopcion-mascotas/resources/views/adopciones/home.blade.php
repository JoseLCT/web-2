@extends('layouts.app')

@section('content')
    <div class="container">
        <div style="display: flex; align-content: center;">
            <h1 class="text-start">Lista de adopciones</h1>
            <a href="{{ url('adopciones/create') }}" class="btn btn-secondary mb-3 ms-3">
                <i class="bi bi-plus"></i>
            </a>
        </div>
        <table class="table table-striped table-hover mt-3">
            <thead>
            <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Mascota</th>
                <th>Fecha de adopción</th>
                <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
            @foreach($adopciones as $adopcion)
                <tr>
                    <td>{{ $adopcion->id }}</td>
                    <td>{{ $clientes->find($adopcion->id_cliente)->nombres }} {{ $clientes->find($adopcion->id_cliente)->apellidos }}</td>
                    <td>{{ $mascotas->find($adopcion->id_mascota)->nombre }} - {{ $mascotas->find($adopcion->id_mascota)->tipo }}</td>
                    <td>{{ $adopcion->fecha_adopcion }}</td>
                    <td>
                        <a href="{{ url('adopciones/edit/' . $adopcion->id) }}" class="btn btn-primary">
                            <i class="bi bi-pencil-square"></i>
                        </a>
                        <a href="{{ url('adopciones/delete/' . $adopcion->id) }}" class="btn btn-danger">
                            <i class="bi bi-trash"></i>
                        </a>
                    </td>
                </tr>
            @endforeach()
            </tbody>
        </table>
    </div>
@endsection
