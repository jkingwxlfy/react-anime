"use client";
import { useState, useRef } from "react";
import { useAppSelector } from "@/hooks/redux";
import useObserver from "@/hooks/useObserver";
import useSearchData from "@/hooks/useSearchData";

import Searchbar from "@/components/searchbar/Searchbar";
import SearchList from "@/components/searchlist/SearchList";
import SearchFilter from "@/components/searchfilter/SearchFilter";
import { Spiner, ErrorMessage } from "@/components/UI";

import "./search.scss";

const Search: React.FC = () => {
    const { isShownSidebar } = useAppSelector((state) => state.userSlice);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const bottomBorder = useRef<HTMLDivElement | null>(null);
    const [offset, setOffset] = useState<number>(1);
    const { anime, status } = useSearchData(
        selectedGenres,
        searchQuery,
        offset,
        5
    );

    const onSearch = (value: string) => {
        if (value.trim().length) {
            setSearchQuery(value);
            setSelectedGenres([]);
            setOffset(0);
        }
    };

    useObserver(
        bottomBorder,
        status.isLoading,
        status.isAbleLoadNewAnime,
        () => {
            setOffset((prevState) => prevState + 1);
        }
    );

    if (status.isLoading) {
        return <Spiner />;
    } else if (status.isError) {
        return <ErrorMessage />;
    }

    return (
        <section className={`search${isShownSidebar ? " shown" : ""}`}>
            <Searchbar onSearch={onSearch} />
            <SearchFilter
                genres={selectedGenres}
                setGenres={setSelectedGenres}
                setOffset={setOffset}
            />
            <div className="search__list">
                <SearchList anime={anime} />
            </div>
            <div ref={bottomBorder} />
        </section>
    );
};

export default Search;
