<?php

use App\Http\Controllers\AccommodationController;
use App\Http\Controllers\AccommodationImageController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\ReservationController;
use App\Models\AccommodationImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post("/login", [AuthController::class, "login"]);
Route::post("/register", [AuthController::class, "register"]);

Route::get("/accommodations", [AccommodationController::class, "index"]);
Route::get("/accommodations/{id}", [AccommodationController::class, "show"]);

Route::get("/locations", [LocationController::class, "index"]);
Route::get("/locations/{id}", [LocationController::class, "show"]);

Route::get("/reservations", [ReservationController::class, "index"]);
Route::get("/reservations/{id}", [ReservationController::class, "show"]);

Route::group(["middleware" => "auth:sanctum"], function () {
    Route::get("/me", [AuthController::class, "me"]);

    Route::get("/accommodations/me/{id}", [AccommodationController::class, "getByUserId"]);
    Route::get("/accommodations_token/me", [AccommodationController::class, "getByToken"]);
    Route::post("/accommodations", [AccommodationController::class, "store"]);
    Route::match(["put", "patch"], "/accommodations/{id}", [AccommodationController::class, "update"]);
    Route::delete("/accommodations/{id}", [AccommodationController::class, "destroy"]);

    Route::post('/accommodations/{id}/images', [AccommodationImageController::class, 'store']);
    Route::delete('/accommodations/images/{imageId}', [AccommodationImageController::class, 'destroy']);
    Route::delete('/accommodations_all/{id}/images', [AccommodationImageController::class, 'destroyAll']);

    Route::post("/locations", [LocationController::class, "store"]);
    Route::match(["put", "patch"], "/locations/{id}", [LocationController::class, "update"]);
    Route::delete("/locations/{id}", [LocationController::class, "destroy"]);

    Route::get("/reservations_token/me", [ReservationController::class, "getByToken"]);
    Route::post("/reservations", [ReservationController::class, "store"]);
    Route::match(["put", "patch"], "/reservations/{id}", [ReservationController::class, "update"]);
    Route::delete("/reservations/{id}", [ReservationController::class, "destroy"]);
});
