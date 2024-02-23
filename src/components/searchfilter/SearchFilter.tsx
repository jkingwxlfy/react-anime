import { useState } from "react";

import "./searchfilter.scss";

interface ISearchFilterProps {
    setGenres: (genres: string[]) => void;
    genres: string[];
    setOffset: (value: number) => void;
}

const SearchFilter: React.FC<ISearchFilterProps> = ({
    genres,
    setGenres,
    setOffset,
}) => {
    const [isOpened, setIsOpened] = useState<boolean>(true);

    const options = [
        "Action",
        "Adventure",
        "Romance",
        "Psychological",
        "Drama",
        "Comedy",
        "Horror",
        "Sports",
        "Fantasy",
        "Music",
        "Mystery",
        "Supernatural",
        "Mecha",
        "Sci-Fi",
        "Thriller",
    ];

    const onSelectGenre = (
        event: React.ChangeEvent<HTMLInputElement>,
        genre: string
    ) => {
        if (event.target.checked) {
            setGenres([...genres, genre]);
        } else {
            setGenres([...genres].filter((item) => item !== genre));
        }
        setOffset(0);
    };

    const onResetGenres = () => {
        setGenres([]);
        setOffset(0);
    };

    return (
        <section className="search-filter">
            <div className={`search-filter__list${isOpened ? "" : " hidden"}`}>
                <div className="search-filter__header">
                    <p>Genres</p>
                    <button onClick={() => setIsOpened(!isOpened)}>
                        {isOpened ? "hide" : "open"}
                    </button>
                    <button onClick={onResetGenres}>reset all</button>
                </div>
                <div className="search-filter__wrapper">
                    {options.map((item) => (
                        <label key={item}>
                            <input
                                type="checkbox"
                                checked={
                                    genres.filter((genre) => item === genre)[0]
                                        ? true
                                        : false
                                }
                                onChange={(event) => onSelectGenre(event, item)}
                            />
                            <p>{item}</p>
                        </label>
                    ))}
                </div>
            </div>
        </section>
    );
};
export default SearchFilter;
