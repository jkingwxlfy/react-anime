/* eslint-disable max-params */
import type { IAnimeResult, ISearch } from "@consumet/extensions";
import { META } from "@consumet/extensions";
import {useState, useEffect} from "react";

enum TypeOfAnime {
    POPULAR = "popular",
    TRENDING = "trending"
}

const useSliderData = (
    offset?: number, 
    resultsPerPage?: number, 
) => {
    const [popularAnime, setPopularAnime] = useState<IAnimeResult[]>([]);
    const [trendingAnime, setTrendingAnime] = useState<IAnimeResult[]>([]);
    const [status, setStatus] = useState({ isLoading: true, isError: false, isAbleLoadNewAnime: true });
    const anilist = new META.Anilist();

    const onAnimeLoaded = (
        data: ISearch<IAnimeResult>,
        type: TypeOfAnime
    ) => {
        const { results, hasNextPage } = data;

        if (offset) {
            if (type === TypeOfAnime.POPULAR) {setPopularAnime([...popularAnime, ...results])}
            if (type === TypeOfAnime.TRENDING) {setTrendingAnime([...trendingAnime, ...results])}
        } else {
            if (type === TypeOfAnime.POPULAR) {setPopularAnime(results)}
            if (type === TypeOfAnime.TRENDING) {setTrendingAnime(results)}
        }
        
        setStatus({
            ...status,
            isLoading: false,
            isAbleLoadNewAnime: hasNextPage ? true : false,
        });
    };
    
    const fetchData = (
        fetchFunction: () => Promise<ISearch<IAnimeResult>>,
        type: TypeOfAnime
    ) => {
        fetchFunction()
            .then((data: ISearch<IAnimeResult>) =>
                onAnimeLoaded(data, type)
            )
            .catch((error) => {
                console.log(error);
                setStatus({
                    isAbleLoadNewAnime: false,
                    isError: true,
                    isLoading: false,
                });
            });
    };
    
    const fetchPopular = () => fetchData(() => anilist.fetchPopularAnime(offset, resultsPerPage), TypeOfAnime.POPULAR);
    const fetchTrending = () => fetchData(() => anilist.fetchTrendingAnime(offset, resultsPerPage), TypeOfAnime.TRENDING);

    useEffect(() => {
        fetchPopular();
        fetchTrending();
    }, [offset, resultsPerPage]);

    return { popularAnime, trendingAnime, status };
};

export default useSliderData;