'use client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAppSelector } from '@/hooks/redux';
import useSliderData from '@/hooks/useSliderData';
import useObserver from '@/hooks/useObserver';
import { useState, useRef, useEffect } from 'react';
import { redirect } from 'next/navigation';

import { Spiner, ErrorMessage } from '@/components/UI';

import './animelist.scss';

enum CategoryOfAnimeList {
    POPULAR = 'popular',
    TRENDING = 'trending',
}

const Anime: React.FC = () => {
    const searchParams = useSearchParams();
    const { isShownSidebar } = useAppSelector((state) => state.userSlice);
    const category = searchParams.get('category');
    const [offset, setOffset] = useState(0);
    const { popularAnime, trendingAnime, status } = useSliderData(offset, 20);
    const bottomBorder = useRef<HTMLDivElement | null>(null);
    const array =
        category === CategoryOfAnimeList.POPULAR ? popularAnime : trendingAnime;

    if (
        category !== CategoryOfAnimeList.POPULAR &&
        category !== CategoryOfAnimeList.TRENDING
    ) {
        redirect('/');
    }

    useObserver(
        bottomBorder,
        status.isLoading,
        status.isAbleLoadNewAnime,
        () => {
            setOffset((prevState) => prevState + 1);
        }
    );

    useEffect(() => {
        setOffset(1);
    }, []);

    if (status.isLoading) {
        return <Spiner />;
    } else if (status.isError) {
        return <ErrorMessage />;
    }

    return (
        <section className={`animelist${isShownSidebar ? ' shown' : ''}`}>
            <div className="animelist__container">
                <h1>
                    {category === CategoryOfAnimeList.POPULAR
                        ? 'Popular '
                        : 'Trending '}
                    Anime
                </h1>
                <div className="animelist__list">
                    {array.map((item) => (
                        <Link
                            className="animelist__item"
                            href={`/anime/${item.id}`}
                            key={item.id}
                        >
                            <div className="animelist__item__img">
                                <img
                                    src={item.image}
                                    alt="image of anime title"
                                />
                            </div>
                            <div className="animelist__item__title">
                                {item.title && typeof item.title !== 'string'
                                    ? item.title.english ||
                                      item.title.userPreferred
                                    : item.title}
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="animelist__bottom" ref={bottomBorder} />
            </div>
        </section>
    );
};
export default Anime;
