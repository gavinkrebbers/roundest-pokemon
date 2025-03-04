import Navbar from "@/Layouts/Navbar";
import { router } from "@inertiajs/react";
function Home({ pokemonList }) {
    const pokemon = pokemonList;

    const handleClick = (index) => {
        let winner = pokemon[index];
        let loser = +!index;
        loser = pokemon[loser];
        router.get(route("home", { winner: winner, loser: loser }));
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 text-white bg-gray-900 sm:px-6 lg:px-8">
            <h1 className="mb-8 text-4xl font-bold text-blue-400">
                Which Pokémon is Rounder?
            </h1>

            <div className="flex flex-col items-center justify-center w-full max-w-4xl gap-8 ">
                {pokemon.slice(0, 2).map((curPokemon, index) => (
                    <div
                        key={index}
                        className="w-full max-w-xs overflow-hidden transition-transform duration-300 ease-in-out transform bg-gray-800 rounded-lg hover:scale-105 sm:w-1/2"
                    >
                        <img
                            src={curPokemon.image_url}
                            alt={curPokemon.name}
                            className="object-contain w-full h-64 p-4 bg-gray-700"
                        />
                        <div className="p-4">
                            <button
                                onClick={() => handleClick(index)}
                                className="w-full px-4 py-3 text-lg font-medium text-white transition-colors duration-300 ease-in-out bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                {curPokemon.name}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <p className="mt-8 text-center text-gray-400">
                Click on the Pokémon you think is rounder!
            </p>
        </div>
    );
}

Home.layout = (page) => <Navbar children={page} />;

export default Home;
