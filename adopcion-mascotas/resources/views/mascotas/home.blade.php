@extends('layouts.app')

@section('content')
    <div class="container">
        <div style="display: flex; align-content: center;">
            <h1 class="text-start">Lista de mascotas</h1>
            <a href="{{ url('mascotas/create') }}" class="btn btn-secondary mb-3 ms-3">
                <i class="bi bi-plus"></i>
            </a>
        </div>
        <table class="table table-striped table-hover mt-3">
            <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Raza</th>
                <th>Color</th>
                <th>Tamaño</th>
                <th>Estado</th>
                <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
            @foreach($mascotas as $mascota)
                <tr>
                    <td>{{ $mascota->id }}</td>
                    <td>{{ $mascota->nombre }}</td>
                    <td>{{ $mascota->tipo }}</td>
                    <td>{{ $mascota->raza }}</td>
                    <td>{{ $mascota->color }}</td>
                    <td>{{ $mascota->tamano }}</td>
                    <td>{{ $mascota->esta_adoptado ? 'Adoptado' : 'Disponible' }}</td>
                    <td>
                        <a href="{{ url('mascotas/edit/' . $mascota->id) }}" class="btn btn-primary">
                            <i class="bi bi-pencil-square"></i>
                        </a>
                        <a href="{{ url('mascotas/delete/' . $mascota->id) }}" class="btn btn-danger">
                            <i class="bi bi-trash"></i>
                        </a>
                    </td>
                </tr>
            @endforeach()
            </tbody>
        </table>
    </div>
@endsection
