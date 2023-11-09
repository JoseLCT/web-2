<?php

use App\Http\Controllers\AdopcionController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\MascotaController;
use App\Http\Controllers\ReferenciaController;
use Illuminate\Support\Facades\Route;

Route::get('/', [MascotaController::class, 'main'])->name('mascotas.main');
Route::get('/adopciones/register/{id}', [AdopcionController::class, 'register'])->name('adopciones.register');

//clientes
Route::get('/clientes/home', [ClienteController::class, 'home'])->name('clientes.home');
Route::get('/clientes/create', [ClienteController::class, 'form'])->name('clientes.form');
Route::get('/clientes/edit/{id}', [ClienteController::class, 'form'])->name('clientes.form');
Route::post('/clientes', [ClienteController::class, 'store'])->name('clientes.store');
Route::get('/clientes/{id}', [ClienteController::class, 'store'])->name('clientes.store');
Route::get('/clientes/delete/{id}', [ClienteController::class, 'destroy'])->name('clientes.destroy');


Route::get('/adopciones/home', [AdopcionController::class, 'home'])->name('adopciones.home');
Route::get('/adopciones/create', [AdopcionController::class, 'form'])->name('adopciones.form');
Route::get('/adopciones/edit/{id}', [AdopcionController::class, 'form'])->name('adopciones.form');
Route::get('/adopciones/adopting/{id}', [AdopcionController::class, 'adopting'])->name('adopciones.register');
Route::post('/adopciones', [AdopcionController::class, 'store'])->name('adopciones.store');
Route::get('/adopciones/{id}', [AdopcionController::class, 'store'])->name('adopciones.store');
Route::get('/adopciones/delete/{id}', [AdopcionController::class, 'destroy'])->name('adopciones.destroy');

//referencias
Route::get('/referencias/home', [ReferenciaController::class, 'home'])->name('referencias.home');
Route::get('/referencias/create', [ReferenciaController::class, 'form'])->name('referencias.form');
Route::get('/referencias/edit/{id}', [ReferenciaController::class, 'form'])->name('referencias.form');
Route::post('/referencias', [ReferenciaController::class, 'store'])->name('referencias.store');
Route::get('/referencias/{id}', [ReferenciaController::class, 'store'])->name('referencias.store');
Route::get('/referencias/delete/{id}', [ReferenciaController::class, 'destroy'])->name('referencias.destroy');


Route::get('/mascotas/home', [MascotaController::class, 'home'])->name('mascotas.home');
Route::get('/mascotas/create', [MascotaController::class, 'form'])->name('mascotas.form');
Route::get('/mascotas/edit/{id}', [MascotaController::class, 'form'])->name('mascotas.form');
Route::post('/mascotas', [MascotaController::class, 'store'])->name('mascotas.store');
Route::get('/mascotas/{id}', [MascotaController::class, 'store'])->name('mascotas.store');
Route::get('/mascotas/delete/{id}', [MascotaController::class, 'destroy'])->name('mascotas.destroy');
