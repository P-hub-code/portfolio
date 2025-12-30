<?php

use App\Models\Shelf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\BoxController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PecaController;
use App\Http\Controllers\Api\PartsController;
use App\Http\Controllers\Api\ShelfController;
use App\Http\Controllers\Api\CabinetController;
use App\Http\Controllers\Api\PartsSalesController;

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

Route::middleware('auth:sanctum')
    ->prefix("v1")
    ->group(function () {
        Route::get("/user", function (Request $request) {
            return $request->user();
        });
        Route::post("/logout", [AuthController::class, 'logout']);
        Route::apiResource('/parts', PartsController::class);
        Route::apiResource('/boxes', BoxController::class);
        Route::apiResource('/shelves', ShelfController::class);
        Route::apiResource('/cabinets', CabinetController::class);
        Route::apiResource('/sales', PartsSalesController::class);
    });

/**
 * Auth routes using prefix v1
 */
Route::prefix("v1")->group(function () {
    Route::post("/login", [AuthController::class, 'login']);
    Route::post("/register", [AuthController::class, 'register']);
});
