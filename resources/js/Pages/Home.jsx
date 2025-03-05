import Navbar from "@/Layouts/Navbar";
import { router } from "@inertiajs/react";
import { useState, useEffect } from "react";

function Home({ groupedList }) {
    const [currentPair, setCurrentPair] = useState(groupedList[0]);
    const [index, setIndex] = useState(0);
    const [loadedImages, setLoadedImages] = useState([false, false]);

    const handleImageLoad = (imgIndex) => {
        setLoadedImages((prev) => {
            const newLoadedImages = [...prev];
            newLoadedImages[imgIndex] = true;
            return newLoadedImages;
        });
    };

    const preloadImages = (nextIndex) => {
        if (nextIndex < groupedList.length) {
            groupedList[nextIndex].forEach((pokemon) => {
                const img = new Image();
                img.src = pokemon.image_url;
            });
        }
    };

    useEffect(() => {
        preloadImages(index + 1);
    }, [index]);

    const handleClick = (cardIndex) => {
        if (index + 1 >= groupedList.length) {
            router.get(route("home"));
            return;
        }
        setIndex((prev) => prev + 1);
        setCurrentPair((pair) => groupedList[index]);

        setTimeout(() => {
            router.post(route("updateElo"), {
                winner: currentPair[cardIndex],
                loser: currentPair[+!cardIndex],
            });
        }, 0);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 text-white bg-gray-900 sm:px-6 lg:px-8">
            <h1 className="mb-8 text-4xl font-bold text-blue-400">
                Which Pokémon is Rounder?
            </h1>

            <div className="flex flex-row items-center justify-center w-full max-w-4xl gap-8">
                {currentPair.slice(0, 2).map((curPokemon, i) => (
                    <div
                        key={i}
                        className="w-full max-w-xs overflow-hidden transition-transform duration-300 ease-in-out transform bg-gray-800 rounded-lg hover:scale-105 sm:w-1/2"
                    >
                        <img
                            src={curPokemon.image_url}
                            alt={curPokemon.name}
                            className={`object-contain w-full h-64 p-4 bg-gray-700 ${
                                loadedImages[i] ? "" : "bg-gray-600"
                            }`}
                            onLoad={() => handleImageLoad(i)}
                            loading="lazy"
                        />
                        <div className="p-4">
                            <button
                                onClick={() => handleClick(i)}
                                className="w-full px-4 py-3 text-lg font-medium text-white transition-colors duration-300 ease-in-out bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                {curPokemon.name.charAt(0).toUpperCase() +
                                    curPokemon.name.slice(1)}
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
