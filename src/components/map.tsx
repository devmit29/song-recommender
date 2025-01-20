'use client'

import { GoogleMap, MarkerF } from "@react-google-maps/api";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { Button } from "./ui/button";

const MapComponent = () => {
    const [fromInput, setFromInput] = useState(""); 
    const [toInput, setToInput] = useState(""); 
    const [fromLocation, setFromLocation] = useState({ lat: 0, lng: 0 });
    const [toLocation, setToLocation] = useState({ lat: 0, lng: 0 });
    const fromRef = useRef<HTMLInputElement>(null); 
    const toRef = useRef<HTMLInputElement>(null); 
    const [weather, setWeather] = useState("");

    interface Song {
        title: string;
        videoId: string;
        description: string;
        thumbnail: string;
    }
    const [songList, setSongList] = useState<Song[]>([]);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API || "",
        libraries: ["places"], 
    });

    useEffect(() => {
        if (isLoaded && !loadError) {
            const fromAutocomplete = new google.maps.places.Autocomplete(fromRef.current!, {});
            const toAutocomplete = new google.maps.places.Autocomplete(toRef.current!, {});

            fromAutocomplete.addListener("place_changed", () => {
                const place = fromAutocomplete.getPlace();
                setFromInput(place.formatted_address || "");
            });

            toAutocomplete.addListener("place_changed", () => {
                const place = toAutocomplete.getPlace();
                setToInput(place.formatted_address || "");
            });
        }
    }, [isLoaded, loadError]);

    const geocodeAddress = useCallback(async (address: string) => {
        const geocoder = new google.maps.Geocoder();
        const { results } = await geocoder.geocode({ address });
        if (results && results.length > 0) {
            const { lat, lng } = results[0].geometry.location;
            return { lat: lat(), lng: lng() };
        }
        return null;
    }, []);

    const fromhandleChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        setFromInput(input);
        if (input) {
            const coords = await geocodeAddress(input);
            if (coords) setFromLocation(coords);
        } else {
            setFromLocation({ lat: 0, lng: 0 });
        }
    }, [geocodeAddress]);

    const tohandleChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        setToInput(input);
        if (input) {
            const coords = await geocodeAddress(input);
            if (coords) setToLocation(coords);
        } else {
            setToLocation({ lat: 0, lng: 0 });
        }
    }, [geocodeAddress]);

    const getSongs = useCallback(async () => {
        if (weather) {
            const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=hindi+songs+for+long+drive+in+${weather}+weather&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API}`;
            const youtubeOptions = {
                method: "GET",
                type: "video",
            };

            try {
                const youtubeResponse = await fetch(youtubeUrl, youtubeOptions);
                const youtubeResult = await youtubeResponse.json();
                const songs = youtubeResult.items.map((item: any) => ({
                    title: item.snippet.title,
                    videoId: item.id.videoId,
                    description: item.snippet.description,
                    thumbnail: item.snippet.thumbnails.default.url,
                }));
                setSongList(songs);
                const songContainer = document.querySelector('#recommend');
                if (songContainer) {
                    songContainer.classList.toggle('hidden', songs.length === 0);
                    songContainer.classList.toggle('flex', songs.length > 0);
                }
            } catch (youtubeError) {
                console.error(youtubeError);
            }
        }
    }, [weather]);

    useEffect(() => {
        getSongs();
    }, [weather, getSongs]);

    const handleSubmit = useCallback(async () => {
        const url = `https://api.weatherstack.com/current?access_key=${process.env.NEXT_PUBLIC_WEATHER_API}&query=${toLocation.lat},${toLocation.lng}`;
        const options = {
            method: "GET",
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            const weather = result.current.weather_descriptions[0];
            setWeather(weather);
            console.log(weather);
        } catch (error) {
            console.error(error);
        }
    }, [toLocation]);

    const defaultMapContainerStyle = {
        width: '100%',
        height: '100vh',
        borderRadius: '15px 0px 0px 15px',
    };

    const defaultMapCenter = {
        lat: 28.6139,
        lng: 77.2090
    };

    const defaultMapZoom = 7;

    const defaultMapOptions = {
        zoomControl: true,
        tilt: 0,
        gestureHandling: 'auto',
        mapTypeId: 'roadmap',
    };

    return (
        <div className="w-full relative">
            <div className="-z-10">
                <GoogleMap
                    mapContainerStyle={defaultMapContainerStyle}
                    center={defaultMapCenter}
                    zoom={defaultMapZoom}
                    options={defaultMapOptions}>
                    {fromLocation && <MarkerF position={fromLocation} label="A" />}
                    {toLocation && <MarkerF position={toLocation} label="B" icon={{ url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }} />}
                </GoogleMap>
            </div>
            <div className="max-w-screen-2xl w-full mx-auto p-4 flex flex-col z-10 absolute top-10 left-1/2 transform -translate-x-1/2 justify-around">
                <div className="flex justify-around">
                    <div className="bg-slate-50 p-4 flex flex-col rounded-lg">
                        <label htmlFor="from" className="text-black text-xl mb-2">From</label>
                        <input
                            id="from"
                            ref={fromRef}
                            onChange={fromhandleChange}
                            value={fromInput}
                            type="text"
                            placeholder="Search for a place"
                            className="w-96 p-2 rounded-lg"
                            name="from"
                        />
                    </div>
                    <div className="bg-slate-50 p-4 flex flex-col rounded-lg">
                        <label htmlFor="to" className="text-black text-xl mb-2">To</label>
                        <input
                            id="to"
                            ref={toRef}
                            value={toInput}
                            onChange={tohandleChange}
                            type="text"
                            placeholder="Search for a place"
                            className="w-96 p-2 rounded-lg"
                            name="to"
                        />
                    </div>
                </div>
                <div className="my-8 mx-auto">
                    <Button className="text-xl p-6" onClick={handleSubmit}>Get Recommendations</Button>
                </div>
                <div id='recommend' className="hidden flex-row bg-slate-600/60 p-8 rounded-lg mt-16 overflow-x-auto whitespace-nowrap">
                    {songList.map((song, index) => (
                        <div key={index}
                            onClick={() => window.open(`https://www.youtube.com/watch?v=${song.videoId}`, '_blank')}
                            className="bg-slate-50 p-4 cursor-pointer flex flex-col rounded-lg min-w-64 m-4 ">
                            <img src={song.thumbnail} alt={song.title} className="rounded-lg" />
                            <h3 className="text-black font-semibold overflow-ellipsis text-xl my-2 line-clamp-2">{song.title}</h3>
                            <p className="text-black line-clamp-2">{song.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export { MapComponent };
