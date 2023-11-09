<?php

use App\Http\Controllers\AdopcionController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\MascotaController;
use App\Http\Controllers\ReferenciaController;
use Illuminate\Support\Facades\Route;

Route::get('/', [MascotaController::class, 'home'])->name('mascotas.home');
Route::get('/adopciones/register/{id}', [AdopcionController::class, 'register'])->name('adopciones.register');

Route::get('/clientes/home', [ClienteController::class, 'home'])->name('clientes.home');
Route::get('/clientes/form', [ClienteController::class, 'form'])->name('clientes.form');

Route::get('/adopciones/home', [AdopcionController::class, 'home'])->name('adopciones.home');
Route::get('/adopciones/form', [AdopcionController::class, 'form'])->name('adopciones.form');

Route::get('/referencias/home', [ReferenciaController::class, 'home'])->name('referencias.home');
Route::get('/referencias/form', [ReferenciaController::class, 'form'])->name('referencias.form');

Route::get('/mascotas', [MascotaController::class, 'index'])->name('mascotas');
Route::get('/mascotas/form', [MascotaController::class, 'form'])->name('mascotas.form');
Route::post('/mascotas', [MascotaController::class, 'store'])->name('mascotas.store');
