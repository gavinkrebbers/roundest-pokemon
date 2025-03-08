import Navbar from "@/Layouts/Navbar";
import { Link } from "@inertiajs/react";
import { Search } from "lucide-react";
import { useState } from "react";

function Index({ paginatedData, allPokemon }) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredPokemon = searchTerm
        ? allPokemon.filter((pokemon) =>
              pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : paginatedData.data;
    return (
        <div className="w-full min-h-screen px-4 py-6 mx-auto overflow-hidden bg-gray-900 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <h2 className="mb-6 text-2xl font-bold text-center text-blue-400 sm:text-3xl">
                    Roundest Pokemon
                </h2>

                <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search Pokémon"
                        className="w-full p-3 pl-10 text-white bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {filteredPokemon.map((pokemon, index) => (
                        <div
                            key={pokemon.id}
                            className="flex flex-col items-center p-4 transition-transform duration-300 ease-in-out transform bg-gray-800 rounded-lg hover:scale-105"
                        >
                            <div className="relative w-24 h-24 mb-3 sm:w-32 sm:h-32">
                                <img
                                    src={
                                        pokemon.image_url ||
                                        "/placeholder.svg?height=128&width=128"
                                    }
                                    alt={pokemon.name}
                                    className="object-contain w-full h-full p-2 bg-gray-700 rounded-md"
                                    loading="lazy"
                                />
                            </div>
                            <h3 className="mb-1 text-base font-semibold text-center text-white capitalize sm:text-lg">
                                {pokemon.name}
                            </h3>
                            <div className="flex items-center justify-between w-full mt-1">
                                <span className="text-xs text-gray-400 sm:text-sm">
                                    #
                                    {(paginatedData.current_page - 1) * 50 +
                                        index +
                                        1}
                                </span>
                                <span className="px-2 py-1 text-xs font-semibold text-yellow-300 bg-gray-700 rounded-md sm:text-sm">
                                    ELO: {pokemon.elo}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {!searchTerm && (
                    <nav className="flex flex-wrap justify-center gap-2 mt-8">
                        {paginatedData.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || "#"}
                                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-300 ${
                                    link.active
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                } ${
                                    !link.url && "opacity-50 cursor-not-allowed"
                                }`}
                            >
                                {link.label === "&laquo; Previous"
                                    ? "← Prev"
                                    : link.label === "Next &raquo;"
                                    ? "Next →"
                                    : link.label}
                            </Link>
                        ))}
                    </nav>
                )}
            </div>
        </div>
    );
}

Index.layout = (page) => <Navbar children={page} />;

export default Index;
