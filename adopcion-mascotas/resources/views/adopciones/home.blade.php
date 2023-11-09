@extends('layouts.app')

@section('content')
    <div class="container">
        <div style="display: flex; align-content: center;">
            <h1 class="text-start">Lista de adopciones</h1>
            <a href="{{ url('adopciones/form') }}" class="btn btn-secondary mb-3 ms-3">
                <i class="bi bi-plus"></i>
            </a>
        </div>
    </div>
@endsection
