<?php

use App\Http\Controllers\PokemonController;
use App\Http\Controllers\ProfileController;
use App\Models\Pokemon;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::resource('pokemon', PokemonController::class);

Route::get('/pokemon', [PokemonController::class, 'index'])->name('index');
Route::get('/', [PokemonController::class, 'skillBasedPairs'])->name('home');
Route::post('/updateElo', [PokemonController::class, 'updateElo'])->name('updateElo');

// Route::get('/skillbased', [PokemonController::class, 'skillBasedPairs'])->name('skillBased');
