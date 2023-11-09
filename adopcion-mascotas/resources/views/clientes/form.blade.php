@extends('layouts.app')

@section('content')
    <div class="card mt-5 m-auto" style="max-width: 600px;">
        <div class="card-header">
            <h1>Formulario de clientes</h1>
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
            <form method="{{ $cliente->exists ? 'put' : 'post' }}"
                  action="{{ $cliente->exists ? url('clientes/' . $cliente->id) : url('clientes') }}"
                  class="needs-validation" novalidate
                  style="display: flex; flex-direction: column; gap: 1rem;">
                @csrf
                <div class="form-group">
                    <label for="nombres">Nombres</label>
                    <input type="text" name="nombres" required class="form-control" id="nombres"
                           placeholder="Nombres del cliente" value="{{ $cliente->nombres }}">
                    <div class="invalid-feedback">
                        Por favor ingrese los nombres del cliente
                    </div>
                </div>
                <div class="form-group">
                    <label for="apellidos">Apellidos</label>
                    <input type="text" name="apellidos" required class="form-control" id="apellidos"
                           placeholder="Apellidos del cliente" value="{{ $cliente->apellidos }}">
                    <div class="invalid-feedback">
                        Por favor ingrese los apellidos del cliente
                    </div>
                </div>
                <div class="form-group">
                    <label for="telefono">Teléfono</label>
                    <input type="text" name="telefono" required class="form-control" id="telefono"
                           placeholder="Teléfono del cliente" value="{{ $cliente->telefono }}">
                    <div class="invalid-feedback">
                        Por favor ingrese el teléfono del cliente
                    </div>
                </div>
                <div class="form-group">
                    <label for="correo">Correo</label>
                    <input type="email" name="correo" required class="form-control" id="correo"
                           placeholder="Correo del cliente" value="{{ $cliente->correo }}">
                    <div class="invalid-feedback">
                        Por favor ingrese el correo del cliente
                    </div>
                </div>
                <input type="submit" value="Guardar" class="btn btn-primary mt-3">
            </form>
        </div>
    </div>
@endsection
