<?php

use App\Http\Controllers\AdminApplicationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\StudentApplicationController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'updatePassword']);

Route::get('/student/application/{user_id}', [StudentApplicationController::class, 'get']);
Route::post('/student/application', [StudentApplicationController::class, 'saveProfile']);
Route::post('/student/application/requirements', [StudentApplicationController::class, 'saveApplication']);
Route::delete('/student/application/{user_id}', [StudentApplicationController::class, 'destroy']);

Route::get('/admin/applications', [AdminApplicationController::class, 'index']);
Route::put('/admin/applications/{application}/status', [AdminApplicationController::class, 'updateStatus']);
Route::put('/admin/applications/{application}/schedule', [AdminApplicationController::class, 'schedule']);
Route::put('/admin/applications/{application}/message', [AdminApplicationController::class, 'message']);
Route::delete('/admin/applications/{application}', [AdminApplicationController::class, 'destroy']);
