'use client';
import type { IAnimeInfo } from '@consumet/extensions';
import { META } from '@consumet/extensions';
import { useEffect, useState, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { addOneToList, setFavorite } from '@/store/reducers/userSlice';
import type { TypeOfList } from '@/models/IUserList';
import Link from 'next/link';

import { Spiner, ErrorMessage } from '@/components/UI';

import './anime.scss';

interface IAnimePageProps {
    params: {
        id: string | number;
    };
}

const AnimePage: React.FC<IAnimePageProps> = ({ params }) => {
    const anilist = new META.Anilist();
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const [anime, setAnime] = useState({} as IAnimeInfo);
    const [status, setStatus] = useState({
        isLoading: true,
        isError: false,
    });
    const { isShownSidebar, userList } = useAppSelector(
        (state) => state.userSlice
    );
    const [isWidenedDescription, setIsWidenedDescription] = useState(false);
    const descriptionRef = useRef<HTMLDivElement | null>(null);
    const [isAbove, setIsAbove] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    const [isFavorite, setIsFavorite] = useState<boolean>(false);
    const [episodeNextDate, setEpisodeNextDate] = useState<string>('');
    const [isHiddenRecommendations, setIsHiddenRecommendations] =
        useState<boolean>(true);

    useEffect(() => {
        userList.map((item) => {
            if (item.name === 'favorite') {
                item.list.map((item) => {
                    if (item.id === params.id) {
                        setIsFavorite(true);
                    } else {
                        setIsFavorite(false);
                    }
                    return item;
                });
            }
            return item;
        });

        anilist
            .fetchAnimeInfo(`${params.id}`)
            .then((data) => {
                setAnime(data);
                setStatus({ ...status, isLoading: false });
            })
            .catch((error) => {
                console.log(error);
                setStatus({ isError: true, isLoading: false });
            });
    }, []);

    useEffect(() => {
        if (descriptionRef.current !== null) {
            const height = descriptionRef.current.offsetHeight;
            if (height >= 200) {
                setIsAbove(true);
            }
        }
        if (anime.nextAiringEpisode) {
            const { airingTime, timeUntilAiring, episodes } =
                anime.nextAiringEpisode;
            const airingDate: Date = new Date(airingTime * 1000);
            const nextEpisodeDate: Date = new Date(
                airingDate.getTime() + timeUntilAiring * 1000
            );
            const nextEpisodeDay: number = nextEpisodeDate.getDate();

            setEpisodeNextDate(
                `Expected to be released in ${nextEpisodeDay} days ${
                    episodes ? `${episodes} episode` : ''
                }`
            );

            console.log(airingTime, timeUntilAiring, episodes);
        }
    }, [anime]);

    const onSelectList = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const list: TypeOfList = event.target.value as TypeOfList;

        const isValidListValue = (value: string): value is TypeOfList => {
            return (
                value === 'complete' ||
                value === 'watching' ||
                value === 'planning'
            );
        };

        if (!isValidListValue(list)) {
            return;
        }

        dispatch(addOneToList({ animeInfo: anime, type: list }));
    };

    const onSetFavorite = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isFavorite = event.target.checked;
        setIsFavorite(isFavorite);
        dispatch(setFavorite({ animeInfo: anime, isFavorite }));
    };

    if (status.isLoading) {
        return <Spiner />;
    } else if (status.isError) {
        return <ErrorMessage />;
    }

    return (
        <section className="anime">
            <div className="anime__cover">
                <img src={anime.cover} alt="image of anime's cover" />
            </div>
            <div
                className={`anime__container${isShownSidebar ? ' shown' : ''}`}
            >
                <div className="anime__wrapper">
                    <div className="anime__header">
                        <div className="anime__header_left">
                            <img src={anime.image} alt="image of anime" />
                            <div className="anime__header_left_input">
                                <select
                                    className="anime__select"
                                    onChange={(event) => onSelectList(event)}
                                >
                                    <option value="0" selected disabled>
                                        Add to list
                                    </option>
                                    <option value="complete">Complete</option>
                                    <option value="watching">Watching</option>
                                    <option value="planning">Planning</option>
                                </select>
                                <label className="anime__checkbox">
                                    <input
                                        type="checkbox"
                                        checked={isFavorite}
                                        onChange={(event) =>
                                            onSetFavorite(event)
                                        }
                                    />
                                    <span />
                                </label>
                            </div>
                        </div>
                        <div className="anime__header_right">
                            <div className="anime__title">
                                {anime.title && typeof anime.title !== 'string'
                                    ? anime.title.romaji
                                    : anime.title}
                            </div>

                            <div
                                className={`anime__description${
                                    isWidenedDescription ? ' widened' : ''
                                }${isAbove ? ' above' : ''}`}
                                ref={descriptionRef}
                            >
                                <div
                                    style={{ minHeight: '0' }}
                                    dangerouslySetInnerHTML={{
                                        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                                        __html: anime.description?.replace(
                                            /<br> <br>/g,
                                            '\n'
                                        )!,
                                    }}
                                >
                                    {}
                                </div>
                            </div>

                            <button
                                className={`anime__readmore${
                                    !isAbove ? ' hidden' : ''
                                }`}
                                onClick={() =>
                                    setIsWidenedDescription(
                                        !isWidenedDescription
                                    )
                                }
                            >
                                Read more
                            </button>
                        </div>
                    </div>
                    <div className="anime__info">
                        <div className="anime__info__col">
                            <div className="anime__info__item">Episodes</div>
                            <div
                                className={`anime__info__item ${
                                    anime.status === 'Completed' ? 'hidden' : ''
                                }`}
                            >
                                Next episode
                            </div>
                            <div className="anime__info__item">Type</div>
                            <div className="anime__info__item">Genres</div>
                            <div className="anime__info__item">Status</div>
                            <div className="anime__info__item">
                                Release Date
                            </div>
                        </div>
                        <div className="anime__info__col">
                            <div className="anime__info__item">
                                {anime.duration}
                            </div>
                            <div
                                className={`anime__info__item ${
                                    anime.status === 'Completed' ? 'hidden' : ''
                                }`}
                            >
                                {episodeNextDate}
                            </div>
                            <div className="anime__info__item">
                                {anime.type}
                            </div>
                            <div className="anime__info__item">
                                {anime.genres?.toString().replace(/,/g, ', ')}
                            </div>
                            <div className="anime__info__item">
                                {anime.status}
                            </div>
                            <div className="anime__info__item">
                                {anime.releaseDate}
                            </div>
                        </div>
                    </div>
                    <div className="anime__recommendations">
                        <div className="anime__recommendations__title">
                            <div>Recommendations</div>
                            <div
                                className="anime__recommendations__button"
                                onClick={() =>
                                    setIsHiddenRecommendations(
                                        !isHiddenRecommendations
                                    )
                                }
                            >
                                {isHiddenRecommendations
                                    ? 'View all'
                                    : 'View less'}
                            </div>
                        </div>
                        <div
                            className={`anime__recommendations__container ${
                                isHiddenRecommendations ? '' : 'opened'
                            }`}
                        >
                            {anime.recommendations?.map((item) => {
                                return (
                                    <Link
                                        className="anime__recommendations__item"
                                        key={item.id}
                                        href={`/anime/${item.id}`}
                                    >
                                        <div className="anime__recommendations__item__title">
                                            <div className="anime__recommendations__item__img">
                                                <img
                                                    src={item.image}
                                                    alt="image of anime title"
                                                />
                                            </div>
                                            <div>
                                                {item.title &&
                                                typeof item.title !== 'string'
                                                    ? item.title.romaji
                                                    : item.title}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
export default AnimePage;
