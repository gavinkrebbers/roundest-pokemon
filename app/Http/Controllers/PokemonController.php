<?php

namespace App\Http\Controllers;

use App\Models\Pokemon;
use Illuminate\Http\Request;

class PokemonController extends Controller
{
    public function expectedScore($winnerElo, $loserElo)
    {
        return 1 / (1 + pow(10, ($loserElo - $winnerElo) / 400));
    }


    public function compare($winner = null, $loser = null)
    {
        if ($winner && $loser) {
            $winningPokemon = Pokemon::findOrFail($winner);
            $losingPokemon = Pokemon::findOrFail($loser);

            $winnerEloPrev = $winningPokemon->elo;
            $losingEloPrev = $losingPokemon->elo;

            $winnerExpectedScore = $this->expectedScore($winnerEloPrev, $losingEloPrev);
            $loserExpectedScore = $this->expectedScore($losingEloPrev, $winnerEloPrev);

            $kFactor = 32;

            $winnerEloFinal = $winnerEloPrev + $kFactor * (1 - $winnerExpectedScore);
            $loserEloFinal = $losingEloPrev + $kFactor * (0 - $loserExpectedScore);

            $winningPokemon->elo = (int) $winnerEloFinal;
            $winningPokemon->save();
            $losingPokemon->elo = (int) $loserEloFinal;
            $losingPokemon->save();
        }

        $pokemonList = Pokemon::inRandomOrder()->limit(2)->get();
        return inertia('Home', ['pokemonList' => $pokemonList]);
    }


    public function index()
    {
        $pokemonData = Pokemon::orderBy('elo', 'desc')->paginate(50);
        return inertia('Index', ['pokemonData' => $pokemonData]);
    }
}
