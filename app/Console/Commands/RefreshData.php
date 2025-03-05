<?php

namespace App\Console\Commands;

use App\Models\Pokemon;
use Illuminate\Console\Command;

class RefreshData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'refresh:data';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $allPokemon  = Pokemon::all();
        foreach ($allPokemon as $pokemon) {
            $pokemon->elo = 1000;
            $pokemon->save();
            $this->info($pokemon->name);
        }
    }
}
