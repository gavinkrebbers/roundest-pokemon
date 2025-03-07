import Navbar from "@/Layouts/Navbar";
import { router, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import bgImage from "/public/pile_of_pokemon_by_happycrumble_d37wz2i-fullview.jpg";
import { Sun } from "lucide-react";

function Home({ groupedList }) {
    const [currentPair, setCurrentPair] = useState(groupedList[0]);
    const [index, setIndex] = useState(0);
    const [loadedImages, setLoadedImages] = useState([false, false]);
    const { url } = usePage();
    const [showBg, setShowBg] = useState(false);

    const route = (routeName, params = {}) => {
        const currentUrl = new URL(url, window.location.origin);
        const baseUrl = currentUrl.origin;

        const routeUrl = baseUrl + window.route(routeName, params);
        return routeUrl;
    };

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
            router.get(window.route("home"));
            return;
        }
        setIndex((prev) => prev + 1);
        setCurrentPair((pair) => groupedList[index]);

        setTimeout(() => {
            router.post(window.route("updateElo"), {
                winner: currentPair[cardIndex],
                loser: currentPair[+!cardIndex],
            });
        }, 0);
    };

    const changeBg = () => {
        setShowBg(!showBg);
    };

    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen px-4 py-12 text-white bg-gray-900 sm:px-6 lg:px-8"
            style={{
                backgroundImage: showBg
                    ? `url(/placeholder.svg?height=1080&width=1920)`
                    : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                position: "relative",
            }}
        >
            {showBg && (
                <div
                    className="absolute inset-0 bg-black bg-opacity-70"
                    style={{ zIndex: 0 }}
                ></div>
            )}

            <button
                className={`absolute z-20 p-2 text-white transition-colors duration-300 rounded-full top-4 right-4 ${
                    showBg
                        ? "bg-gray-700 hover:bg-gray-800"
                        : "bg-gray-700 hover:bg-gray-800"
                }`}
                aria-label="Toggle background"
                onClick={changeBg}
            >
                <Sun className="w-6 h-6" />
            </button>

            <div className="relative z-10 flex flex-col items-center w-full">
                <h1
                    className={`p-4 mb-8 text-4xl font-bold text-blue-400 ${
                        showBg && "bg-gray-800"
                    } rounded-lg`}
                >
                    Which Pokémon is Rounder?
                </h1>

                <div className="flex flex-row items-center justify-center w-full max-w-4xl gap-8">
                    {currentPair.slice(0, 2).map((curPokemon, i) => (
                        <div
                            key={i}
                            className="w-full max-w-xs overflow-hidden transition-transform duration-300 ease-in-out transform bg-gray-800 rounded-lg sm:w-1/2"
                        >
                            <img
                                src={
                                    curPokemon.image_url ||
                                    "/placeholder.svg?height=256&width=256"
                                }
                                alt={curPokemon.name}
                                className={`object-contain w-full h-64 p-4 bg-gray-700 ${
                                    loadedImages[i] ? "" : "bg-gray-600"
                                }`}
                                onLoad={() => handleImageLoad(i)}
                                loading="lazy"
                            />
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-lg font-medium text-white">
                                        {curPokemon.name
                                            .charAt(0)
                                            .toUpperCase() +
                                            curPokemon.name.slice(1)}
                                    </h3>
                                    <div className="px-2 py-1 text-sm font-semibold text-yellow-300 bg-gray-700 rounded-md">
                                        ELO: {curPokemon.elo}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleClick(i)}
                                    className="w-full px-4 py-3 text-lg font-medium text-white transition-colors duration-300 ease-in-out bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Select
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <p className="mt-8 text-center text-gray-400">
                    Click on the Pokémon you think is rounder!
                </p>
            </div>
        </div>
    );
}

Home.layout = (page) => <Navbar children={page} />;

export default Home;
