<?php

namespace App\Http\Controllers;

use App\Jobs\UpdateElo;
use App\Models\Pokemon;
use Illuminate\Http\Request;
use Inertia\Inertia;

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

    public function updateElo(Request $request)
    {

        $winnerId = $request->input("winner")["id"];
        $loserId = $request->input("loser")["id"];
        // UpdateElo::dispatch($winnerId, $loserId);
        UpdateElo::dispatch($winnerId, $loserId);

        // dd($winnerId, $loserId);
    }


    public function generateSets()
    {
        $pokemonList = Pokemon::inRandomOrder()->limit(100)->get();
        $length = count($pokemonList);
        $groupedList = [];
        for ($i = 0; $i < $length; $i += 2) {
            $group = [
                $pokemonList[$i],
                $pokemonList[$i + 1]
            ];
            $groupedList[] = $group;
        }
        return Inertia::render('Home', ["groupedList" => $groupedList]);
    }

    public function index()
    {
        $paginatedData = Pokemon::orderBy('elo', 'desc')->paginate(200);
        $allPokemon = Pokemon::all();
        return inertia('Index', ['paginatedData' => $paginatedData, 'allPokemon' => $allPokemon]);
    }
}
