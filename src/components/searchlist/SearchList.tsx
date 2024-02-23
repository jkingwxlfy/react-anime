import type { IAnimeResult } from "@consumet/extensions";
import Link from "next/link";

import "./searchlist.scss";

interface ISearchListProps {
    anime: IAnimeResult[];
}

const SearchList: React.FC<ISearchListProps> = ({ anime }) => {
    return (
        <section className="searchlist">
            {anime.length ? (
                anime.map((item) => (
                    <div className="searchlist__item" key={item.id}>
                        <Link
                            href={`/anime/${item.id}`}
                            className="searchlist__image"
                        >
                            <img src={item.image} alt="image of anime title" />
                        </Link>
                        <div className="searchlist__info">
                            <Link
                                href={`/anime/${item.id}`}
                                className="searchlist__title"
                            >
                                {item.title && typeof item.title !== "string"
                                    ? item.title.english
                                    : item.title}
                            </Link>
                            <div className="searchlist__alttitle">
                                {item.title && typeof item.title !== "string"
                                    ? item.title.native
                                    : item.title}
                            </div>
                            <div className="searchlist__subinfo">
                                <p className="searchlist__type">{item.type}</p>
                                <p>/</p>
                                <p className="searchlist__year">
                                    {item.releaseDate}
                                </p>
                            </div>
                            <p className="searchlist__description">
                                {item.description}
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <div className="searchlist__empty">
                    Empty list of anime <br /> Try to search some or choose
                    genres
                </div>
            )}
        </section>
    );
};
export default SearchList;
