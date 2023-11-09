@extends('layouts.app')

@section('content')
    <div class="card mt-5 m-auto" style="max-width: 600px;">
        <div class="card-header">
            <h1>Formulario de referencias</h1>
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
            <form method="{{ $referencia->exists ? 'put' : 'post' }}"
                  action="{{ $referencia->exists ? url('referencias/' . $referencia->id) : url('referencias') }}"
                  class="needs-validation" novalidate
                  style="display: flex; flex-direction: column; gap: 1rem;">
                @csrf
                <div class="form-group">
                    <label for="nombres">Nombres</label>
                    <input type="text" name="nombres" required class="form-control" id="nombres"
                           placeholder="Nombres del referente" value="{{ $referencia->nombres }}">
                    <div class="invalid-feedback">
                        Por favor ingrese los nombres del referente
                    </div>
                </div>
                <div class="form-group">
                    <label for="contacto">Contacto</label>
                    <input type="text" name="contacto" required class="form-control" id="contacto"
                           placeholder="Contacto del referente" value="{{ $referencia->contacto }}">
                    <div class="invalid-feedback">
                        Por favor ingrese el contacto del cliente
                    </div>
                </div>
                <div class="form-group">
                    <label for="id_cliente">Cliente</label>
                    <select name="id_cliente" id="id_cliente" class="form-select" required>
                        <option value="">Seleccione un cliente</option>
                        @foreach($clientes as $cliente)
                            <option value="{{ $cliente->id }}"
                                    {{ $cliente->id == $referencia->id_cliente ? 'selected' : '' }}>
                                {{ $cliente->nombres }} {{ $cliente->apellidos }}
                            </option>
                        @endforeach()
                    </select>
                </div>
                <div class="form-group">
                    <label for="parentesco">Parentesco</label>
                    <input type="text" name="parentesco" required class="form-control" id="parentesco"
                           placeholder="Parentesco con el cliente" value="{{ $referencia->parentesco }}">
                    <div class="invalid-feedback">
                        Por favor ingrese el parentesco del cliente
                    </div>
                </div>
                <input type="submit" value="Guardar" class="btn btn-primary mt-3">
            </form>
        </div>
    </div>
@endsection
