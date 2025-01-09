<?php

namespace App\Console\Commands;

use App\Models\Pokemon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use SebastianBergmann\LinesOfCode\Counter;

class FetchPokemonData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'pokemon:fetch';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'gets the data for all the pokemon ';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // $this->info("dubg");
        $url = 'https://pokeapi.co/api/v2/pokemon?limit=1500';
        $response = Http::get($url);
        $this->info($response->successful());

        if ($response->successful()) {
            $pokemonList = $response->json()['results'];
            $counter = 0;
            foreach ($pokemonList as $pokemonData) {
                $pokemonDetail = Http::get($pokemonData['url'])->json();
                if (!str_contains($pokemonDetail['name'], '-')) {
                    Pokemon::create([
                        'name' => $pokemonDetail['name'],
                        'image_url' => $pokemonDetail['sprites']['front_default']
                    ]);
                    $counter++;
                    $this->info($counter);
                }
            }
            $this->info("succesfully fetched all pokemon data");
        } else {
            $this->info("an error occured");
        }
    }
}
