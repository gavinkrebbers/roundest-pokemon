"use client";

import Navbar from "@/Layouts/Navbar";
import { router, usePage } from "@inertiajs/react";
import { useState, useEffect, useCallback } from "react";
import bgImage from "/public/pile_of_pokemon_by_happycrumble_d37wz2i-fullviewupscale.jpg";
import { Sun } from "lucide-react";
import Cookies from "js-cookie";

export default function Home({ groupedList }) {
    const [currentPair, setCurrentPair] = useState(groupedList[0]);
    const [index, setIndex] = useState(0);
    const [loadedImages, setLoadedImages] = useState([false, false]);
    const [showBg, setShowBg] = useState(false);
    const [totalClicks, setTotalClicks] = useState(0);
    const [eloUpdateQueue, setEloUpdateQueue] = useState([]);

    const handleImageLoad = (imgIndex) => {
        setLoadedImages((prev) => {
            const newLoadedImages = [...prev];
            newLoadedImages[imgIndex] = true;
            return newLoadedImages;
        });
    };

    const preloadImages = useCallback(
        (nextIndex) => {
            if (nextIndex < groupedList.length) {
                groupedList[nextIndex].forEach((pokemon) => {
                    const img = new Image();
                    img.src = pokemon.image_url;
                });
            }
        },
        [groupedList]
    );

    useEffect(() => {
        if (eloUpdateQueue.length > 0) {
            const timer = setTimeout(() => {
                const update = eloUpdateQueue[0];
                router.post(route("updateElo"), update);
                setEloUpdateQueue((prev) => prev.slice(1));
            }, 0);

            return () => clearTimeout(timer);
        }
    }, [eloUpdateQueue]);

    useEffect(() => {
        preloadImages(index + 1);
    }, [index, preloadImages]);

    useEffect(() => {
        let bgCookie = Cookies.get("showBG");
        const counterCookie = Cookies.get("totalClicks");

        if (counterCookie == undefined) {
            Cookies.set("totalClicks", "0");
            setTotalClicks(0);
        } else {
            setTotalClicks(Number(counterCookie));
        }

        if (bgCookie === undefined) {
            Cookies.set("showBG", "false");
            bgCookie = "false";
        }

        setShowBg(bgCookie === "true");

        preloadImages(0);
    }, [preloadImages]);

    const handleClick = (cardIndex) => {
        // Update total clicks
        setTotalClicks((prevCount) => {
            const nextCount = Number(prevCount) + 1;
            Cookies.set("totalClicks", String(nextCount));
            return nextCount;
        });

        const winner = currentPair[cardIndex];
        const loser = currentPair[+!cardIndex];
        setEloUpdateQueue((prev) => [...prev, { winner, loser }]);

        setIndex((prevIndex) => {
            const nextIndex = prevIndex + 1;

            setLoadedImages([false, false]);

            if (nextIndex >= groupedList.length) {
                router.get(route("home"));
                return prevIndex;
            } else {
                setCurrentPair(groupedList[nextIndex]);

                setTimeout(() => {
                    preloadImages(nextIndex + 1);
                }, 100);

                return nextIndex;
            }
        });
    };

    const toggleBg = () => {
        setShowBg((prev) => {
            const newValue = !prev;
            Cookies.set("showBG", newValue ? "true" : "false");
            return newValue;
        });
    };

    return (
        <Navbar>
            <div
                className="flex flex-col items-center justify-center min-h-screen px-4 py-12 text-white bg-gray-900 sm:px-6 lg:px-8"
                style={{
                    backgroundImage: showBg ? `url(${bgImage})` : "none",
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
                    onClick={toggleBg}
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
                                key={`${curPokemon.name}-${index}-${i}`}
                                className="w-full max-w-xs overflow-hidden transition-transform duration-300 ease-in-out transform bg-gray-800 rounded-lg sm:w-1/2"
                            >
                                <div className="relative h-64 bg-gray-700">
                                    <img
                                        src={curPokemon.image_url}
                                        alt={curPokemon.name}
                                        className={`object-contain w-full h-64 p-4 transition-opacity duration-300`}
                                        onLoad={() => handleImageLoad(i)}
                                        loading="eager"
                                    />
                                    {!loadedImages[i] && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                                        </div>
                                    )}
                                </div>
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

                    <p className="mt-8 text-center text-gray-100">
                        You have only voted {totalClicks} times. Get those
                        numbers up.
                    </p>
                </div>
            </div>
        </Navbar>
    );
}
