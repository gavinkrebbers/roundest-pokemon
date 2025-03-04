<?php

namespace App\Http\Controllers;

use App\Models\Pokemon;
use Illuminate\Http\Request;

class PokemonController extends Controller
{
    public function expectedScore($winnerElo, $loserElo)
    {
        return 1 / (1 + 10 ^ (($loserElo - $winnerElo) / 400));
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
            $loserEloFinal = $losingEloPrev + $kFactor * (-$loserExpectedScore);

            $winningPokemon->elo = (int) $winnerEloFinal;
            $winningPokemon->save();
            $losingPokemon->elo = (int) $loserEloFinal;
            $losingPokemon->save();
        }

        $pokemonList = Pokemon::inRandomOrder()->limit(2)->get();
        return inertia('Home', ['pokemonList' => $pokemonList]);
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pokemonData = Pokemon::orderBy('elo', 'desc')->paginate(50);
        return inertia('Index', ['pokemonData' => $pokemonData]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Pokemon $pokemon)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Pokemon $pokemon)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Pokemon $pokemon)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pokemon $pokemon)
    {
        //
    }
}
