@extends('layouts.app')

@section('content')
    <div class="card mt-5 m-auto" style="max-width: 600px;">
        <div class="card-header">
            <h1 class="card-title">Formulario de adopción</h1>
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
            <form method="{{ $adopcion->exists ? 'put' : 'post' }}"
                  action="{{ $adopcion->exists ? url('adopciones/' . $adopcion->id) : url('adopciones') }}"
                  class="needs-validation" novalidate
                  style="display: flex; flex-direction: column; gap: 1rem;">
                @csrf
                <div class="form-group">
                    <label for="id_cliente">Cliente</label>
                    <select name="id_cliente" id="id_cliente" class="form-select" required>
                        <option value="">Seleccione un cliente</option>
                        @foreach($clientes as $cliente)
                            <option value="{{ $cliente->id }}"
                                {{ $cliente->id == $adopcion->id_cliente ? 'selected' : '' }}>
                                {{ $cliente->nombres }} {{ $cliente->apellidos }}
                            </option>
                        @endforeach()
                    </select>
                </div>
                <div class="form-group">
                    <label for="id_mascota">Mascota</label>
                    <select name="id_mascota" id="id_mascota" class="form-select" required>
                        <option value="">Seleccione una mascota</option>
                        @foreach($mascotas as $objMascota)
                            <option value="{{ $objMascota->id }}"
                                {{ $objMascota->id == $mascota->id ? 'selected' : '' }}>
                                {{ $objMascota->nombre }}
                            </option>
                        @endforeach()
                    </select>
                </div>
                <div class="form-group">
                    <label for="fecha_adopcion">Fecha de adopción</label>
                    <input type="date" name="fecha_adopcion" required class="form-control" id="fecha_adopcion"
                           placeholder="Fecha de adopción" value="{{ $adopcion->fecha_adopcion }}">
                </div>
                <input type="submit" value="Guardar" class="btn btn-primary mt-3">
            </form>
        </div>
    </div>
@endsection
