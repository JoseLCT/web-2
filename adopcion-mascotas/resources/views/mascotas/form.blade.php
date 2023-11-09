@extends('layouts.app')

@php

    $tamanos = [
        'Pequeño',
        'Mediano',
        'Grande'
    ];

    $tipos = [
        'Perro',
        'Gato',
        'Pez',
        'Ave',
        'Reptil'
    ];

@endphp

@section('content')
    <div class="card mt-5 m-auto" style="max-width: 600px;">
        <div class="card-header">
            <h1>Formulario de mascotas</h1>
        </div>
        <div class="card-body">
            @if($errors->any())
                <div class="alert alert-danger">
                    <h6>Por favor corrige los siguientes errores:</h6>
                    <ul>
                        @foreach($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach()
                    </ul>
                </div>
            @endif
            <form method="{{ $mascota->exists ? 'put' : 'post' }}"
                  action="{{ $mascota->exists ? url('mascotas/' . $mascota->id) : url('mascotas') }}"
                  class="needs-validation" novalidate
                  style="display: flex; flex-direction: column; gap: 1rem;">
                @csrf
                <div class="form-group">
                    <label for="nombre">Nombre</label>
                    <input type="text" name="nombre" required class="form-control" id="nombre"
                           placeholder="Nombre de la mascota" value="{{ $mascota->nombre }}">
                    <div class="invalid-feedback">
                        Por favor ingrese el nombre de la mascota
                    </div>
                </div>
                <div class="form-group">
                    <label for="tipo">Tipo</label>
                    <select name="tipo" required class="form-control" id="tipo">
                        <option value="">Seleccione el tipo de mascota</option>
                        @foreach($tipos as $tipo)
                            <option
                                value="{{ $tipo }}" {{ $mascota->tipo === $tipo ? 'selected' : '' }}>{{ $tipo }}</option>
                        @endforeach
                    </select>
                    <div class="invalid-feedback">
                        Por favor seleccione el tipo de mascota
                    </div>
                </div>
                <div class="form-group">
                    <label for="raza">Raza</label>
                    <input type="text" name="raza" required class="form-control" id="raza"
                           placeholder="Raza de la mascota" value="{{ $mascota->raza }}">
                    <div class="invalid-feedback">
                        Por favor ingrese la raza de la mascota
                    </div>
                </div>
                <div class="form-group">
                    <label for="color">Color</label>
                    <input type="text" name="color" required class="form-control" id="color"
                           placeholder="Color de la mascota" value="{{ $mascota->color }}">
                    <div class="invalid-feedback">
                        Por favor ingrese el color de la mascota
                    </div>
                </div>
                <div class="form-group">
                    <label for="tamano">Tamaño</label>
                    <select name="tamano" required class="form-control" id="tamano">
                        <option value="">Seleccione el tamaño de la mascota</option>
                        @foreach($tamanos as $tamano)
                            <option
                                value="{{ $tamano }}" {{ $mascota->tamano === $tamano ? 'selected' : '' }}>{{ $tamano }}</option>
                        @endforeach
                    </select>
                    <div class="invalid-feedback">
                        Por favor seleccione el tamaño de la mascota
                    </div>
                </div>
                <input type="submit" value="Guardar" class="btn btn-primary mt-3">
            </form>
        </div>
    </div>
@endsection
