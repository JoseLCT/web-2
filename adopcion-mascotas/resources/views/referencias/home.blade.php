@extends('layouts.app')

@section('content')
    <div class="container">
        <div style="display: flex; align-content: center;">
            <h1 class="text-start">Lista de referencias</h1>
            <a href="{{ url('referencias/create') }}" class="btn btn-secondary mb-3 ms-3">
                <i class="bi bi-plus"></i>
            </a>
        </div>
        <table class="table table-striped table-hover mt-3">
            <thead>
            <tr>
                <th>ID</th>
                <th>Nombres</th>
                <th>Contacto</th>
                <th>Cliente</th>
                <th>Parentesco</th>
                <th>Acciones</th>
            </tr>
            </thead>
            <tbody>
            @foreach($referencias as $referencia)
                <tr>
                    <td>{{ $referencia->id }}</td>
                    <td>{{ $referencia->nombres }}</td>
                    <td>{{ $referencia->contacto }}</td>
                    <td>{{ $clientes->find($referencia->id_cliente)->nombres }} {{ $clientes->find($referencia->id_cliente)->apellidos }}</td>
                    <td>{{ $referencia->parentesco }}</td>
                    <td>
                        <a href="{{ url('referencias/edit/' . $referencia->id) }}" class="btn btn-primary">
                            <i class="bi bi-pencil-square"></i>
                        </a>
                        <a href="{{ url('referencias/delete/' . $referencia->id) }}" class="btn btn-danger">
                            <i class="bi bi-trash"></i>
                        </a>
                    </td>
                </tr>
            @endforeach()
            </tbody>
        </table>
    </div>
@endsection
