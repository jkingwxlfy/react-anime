/* eslint-disable max-params */
import type { IAnimeResult, ISearch } from '@consumet/extensions';
import { META } from '@consumet/extensions';
import { useState, useEffect } from 'react';

const useSearchData = (
    genres: string[],
    searchQuery: string,
    offset?: number,
    resultsPerPage?: number
) => {
    const [anime, setAnime] = useState<IAnimeResult[]>([]);
    const [status, setStatus] = useState({
        isLoading: true,
        isError: false,
        isAbleLoadNewAnime: true,
    });
    const anilist = new META.Anilist();

    const onAnimeLoaded = (data: ISearch<IAnimeResult>) => {
        const { results, hasNextPage } = data;

        if (offset === 0) {
            setAnime([]);
        } else {
            setAnime([...anime, ...results]);
        }

        setStatus({
            ...status,
            isLoading: false,
            isAbleLoadNewAnime: hasNextPage ? true : false,
        });
    };

    const fetchData = (fetchFunction: () => Promise<ISearch<IAnimeResult>>) => {
        fetchFunction()
            .then((data: ISearch<IAnimeResult>) => onAnimeLoaded(data))
            .catch((error) => {
                console.log(error);
                setStatus({
                    isAbleLoadNewAnime: false,
                    isError: true,
                    isLoading: false,
                });
            });
    };

    const fetchGenres = () =>
        fetchData(() =>
            anilist.fetchAnimeGenres(genres, offset, resultsPerPage)
        );
    const fetchPopular = () =>
        fetchData(() => anilist.fetchPopularAnime(offset, resultsPerPage));
    const fetchSearch = () =>
        fetchData(() => anilist.search(searchQuery, offset, resultsPerPage));

    useEffect(() => {
        if (genres.length) {
            fetchGenres();
        } else if (searchQuery.trim().length) {
            fetchSearch();
        } else {
            fetchPopular();
        }
    }, [offset]);

    return { anime, status };
};

export default useSearchData;
