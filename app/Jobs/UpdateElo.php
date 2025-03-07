<?php

namespace App\Jobs;

use App\Models\Pokemon;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class UpdateElo implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(protected int $winnerId, protected int $loserId)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $winningPokemon = Pokemon::findOrFail($this->winnerId);
        $losingPokemon = Pokemon::findOrFail($this->loserId);
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
}
