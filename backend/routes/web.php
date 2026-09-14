<?php

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/uploads/{path}', function (string $path) {
    if (Storage::disk('public')->exists($path)) {
        return response()->file(Storage::disk('public')->path($path));
    }

    $legacyPath = base_path($path);
    abort_unless(str_starts_with($path, 'uploads/') && is_file($legacyPath), 404);

    return response()->file($legacyPath);
})->where('path', '.*');
