import Navbar from "@/Layouts/Navbar";
import { Link } from "@inertiajs/react";

function Index(pokemonData) {
    pokemonData = pokemonData.pokemonData;

    return (
        <div className="container w-full px-4 py-8 mx-auto">
            <h2 className="mb-8 text-3xl font-bold text-center text-blue-400">
                Roundest Pokemon
            </h2>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {pokemonData.data.map((pokemon, index) => (
                    <div
                        key={pokemon.id}
                        className="flex flex-col items-center p-4 transition-transform duration-300 ease-in-out transform bg-gray-800 rounded-lg hover:scale-105"
                    >
                        <div className="relative w-32 h-32 mb-4">
                            <img
                                src={pokemon.image_url}
                                alt={pokemon.name}
                                className="object-contain w-full h-full bg-gray-700 rounded-md"
                            />
                        </div>
                        <h3 className="mb-1 text-lg font-semibold text-white">
                            {pokemon.name}
                        </h3>
                        <p className="text-sm text-gray-400">
                            #{(pokemonData.current_page - 1) * 50 + index + 1}{" "}
                            with {pokemon.elo} elo ratings
                        </p>
                    </div>
                ))}
            </div>

            <nav className="flex justify-center mt-8">
                <ul className="flex space-x-2">
                    {pokemonData.links.map((link, index) => (
                        <li key={index}>
                            <Link
                                href={link.url}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-300 ${
                                    link.active
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                } ${
                                    !link.url && "opacity-50 cursor-not-allowed"
                                }`}
                                preserveState
                            >
                                {link.label === "&laquo; Previous"
                                    ? "← Prev"
                                    : link.label === "Next &raquo;"
                                    ? "Next →"
                                    : link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}

// return (
//     <>
//         <p>this is a test</p>
//         <p>{pokemonData.current_page}</p>
//     </>
// );

Index.layout = (page) => <Navbar children={page} />;

export default Index;
