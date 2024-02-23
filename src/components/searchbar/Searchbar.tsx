"use client";
import type { ChangeEvent } from "react";
import { useState } from "react";

import "./searchbar.scss";

interface ISearchbarProps {
    onSearch: (value: string) => void;
}

const Searchbar: React.FC<ISearchbarProps> = ({ onSearch }) => {
    const [input, setInput] = useState("");

    const onUseSearch = () => {
        onSearch(input);
        setInput("");
    };

    return (
        <section className="searchbar">
            <div className="searchbar__input">
                <span className="material-icons">search</span>
                <input
                    type="text"
                    placeholder="enter a search query"
                    value={input}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                        setInput(event.target.value)
                    }
                />
            </div>
            <button onClick={onUseSearch}>Search</button>
        </section>
    );
};
export default Searchbar;
