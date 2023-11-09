@extends('layouts.app')

@section('content')
    <div class="card mt-5 m-auto" style="max-width: 600px;">
        <div class="card-header">
            <h1>Formulario de mascotas</h1>
        </div>
        <div class="card-body">
            <form method="post" action="{{ url('mascotas') }}" class="needs-validation" novalidate
                  style="display: flex; flex-direction: column; gap: 1rem;">
                @csrf
                <div class="form-group">
                    <label for="nombre">Nombre</label>
                    <input type="text" name="nombre" required class="form-control" id="nombre"
                           placeholder="Nombre de la mascota">
                    <div class="invalid-feedback">
                        Por favor ingrese el nombre de la mascota
                    </div>
                </div>
                <div class="form-group">
                    <label for="tipo">Tipo</label>
                    <select name="tipo" required class="form-control" id="tipo">
                        <option value="">Seleccione el tipo de mascota</option>
                        <option value="Perro">Perro</option>
                        <option value="Gato">Gato</option>
                        <option value="Pez">Pez</option>
                        <option value="Ave">Ave</option>
                        <option value="Reptil">Reptil</option>
                    </select>
                    <div class="invalid-feedback">
                        Por favor seleccione el tipo de mascota
                    </div>
                </div>
                <div class="form-group">
                    <label for="raza">Raza</label>
                    <input type="text" name="raza" required class="form-control" id="raza"
                           placeholder="Raza de la mascota">
                    <div class="invalid-feedback">
                        Por favor ingrese la raza de la mascota
                    </div>
                </div>
                <div class="form-group">
                    <label for="color">Color</label>
                    <input type="text" name="color" required class="form-control" id="color"
                           placeholder="Color de la mascota">
                    <div class="invalid-feedback">
                        Por favor ingrese el color de la mascota
                    </div>
                </div>
                <div class="form-group">
                    <label for="tamano">Tamaño</label>
                    <select name="tamano" required class="form-control" id="tamano">
                        <option value="">Seleccione el tamaño de la mascota</option>
                        <option value="pequeno">Pequeño</option>
                        <option value="mediano">Mediano</option>
                        <option value="grande">Grande</option>
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
