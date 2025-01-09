<?php

use App\Http\Controllers\PokemonController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::resource('pokemon', PokemonController::class);

Route::get('/{winner?}/{loser?}', [PokemonController::class, 'compare'])->name('home');
