@extends('layouts.app')

@section('content')
    <div class="container">
        <div style="display: flex; align-content: center;">
            <h1 class="text-start">Mascotas</h1>
            <a href="{{ url('mascotas/form') }}" class="btn btn-secondary mb-3 ms-3">
                <i class="bi bi-plus"></i>
            </a>
        </div>
        <div class="mt-4" style="display: flex; flex-wrap: wrap; gap: 2.5rem;">
            @foreach($mascotas as $mascota)
                <div class="card" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title">{{ $mascota->nombre }}</h5>
                        <p class="card-text">{{ $mascota->tipo }} - {{ $mascota->raza }}</p>
                        <p class="card-text">Color: {{ $mascota->color }}</p>
                        <p class="card-text">Tamaño: {{ $mascota->tamano }}</p>
                        <a href="{{ url('adopciones/register/' . $mascota->id) }}" class="btn btn-primary w-100">Adoptar</a>
                    </div>
                </div>
            @endforeach
        </div>
    </div>
@endsection
