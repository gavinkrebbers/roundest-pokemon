<?php

namespace App\Http\Controllers;

use App\Jobs\UpdateElo;
use App\Models\Pokemon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PokemonController extends Controller
{

    public function updateElo(Request $request)
    {
        $winnerId = $request->input("winner")["id"];
        $loserId = $request->input("loser")["id"];
        $winningPokemon = Pokemon::findOrFail($winnerId);
        $losingPokemon = Pokemon::findOrFail($loserId);
        $winnerEloPrev = $winningPokemon->elo;
        $losingEloPrev = $losingPokemon->elo;

        $winnerExpectedScore = $this->expectedScore($winnerEloPrev, $losingEloPrev);
        $loserExpectedScore = $this->expectedScore($losingEloPrev, $winnerEloPrev);

        $kFactor = 96;

        $winnerEloFinal = $winnerEloPrev + $kFactor * (1 - $winnerExpectedScore);
        $loserEloFinal = $losingEloPrev + $kFactor * (0 - $loserExpectedScore);

        $winningPokemon->elo = (int) $winnerEloFinal;
        $winningPokemon->save();
        $losingPokemon->elo = (int) $loserEloFinal;
        $losingPokemon->save();
    }



    private function expectedScore($winnerElo, $loserElo)
    {
        return 1 / (1 + pow(10, ($loserElo - $winnerElo) / 400));
    }


    public function skillBasedPairs()
    {

        $allPokemon = Pokemon::all()->toArray();
        $size = sizeof($allPokemon);

        usort($allPokemon, function ($a, $b) {
            return $a['elo'] <=> $b['elo'];
        });
        $groupedList = [];
        for ($i = 0; $i < 100; $i++) {
            $startingIndex = rand(0, $size - 1);

            $competitorIndex = $this->generateIndexes($startingIndex, $size);
            $curPair = [];
            $curPair[] = $allPokemon[$startingIndex];
            $curPair[] = $allPokemon[$competitorIndex];
            $groupedList[] = $curPair;
        }
        return Inertia::render('Home', ["groupedList" => $groupedList]);
    }

    private function generateIndexes(int $startingIndex, int $size)
    {
        $offest = 0;
        while ($offest == 0) {
            $offest = rand(-20, 20);
        }
        $competitorIndex = $startingIndex + $offest;
        if ($competitorIndex >= $size || $competitorIndex <= 0) {
            $competitorIndex = $startingIndex - $offest;
        }
        return $competitorIndex;
    }



    public function index()
    {
        $paginatedData = Pokemon::orderBy('elo', 'desc')->paginate(200);
        $allPokemon = Pokemon::all();
        return inertia('Index', ['paginatedData' => $paginatedData, 'allPokemon' => $allPokemon]);
    }
}
