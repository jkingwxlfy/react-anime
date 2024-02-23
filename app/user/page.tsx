"use client";
import type { IAnimeResult } from "@consumet/extensions";
import { useAppSelector } from "@/hooks/redux";
import { useState, useEffect } from "react";
import Link from "next/link";

import "./user.scss";

const User: React.FC = () => {
    const options = ["all", "planning", "watching", "complete", "favorite"];
    const { isShownSidebar, userList } = useAppSelector(
        (state) => state.userSlice
    );
    const [selectedList, setSelectedList] = useState<string>("all");
    const [anime, setAnime] = useState([] as IAnimeResult[]);

    useEffect(() => {
        userList.map((item) => {
            if (item.name === selectedList) {
                setAnime(item.list);
            }
            return item;
        });
        if (selectedList === "all") {
            setAnime([
                ...userList[0].list,
                ...userList[1].list,
                ...userList[2].list,
            ]);
        }
    }, [selectedList, userList]);

    return (
        <section className={`user${isShownSidebar ? " shown" : ""}`}>
            <div className="user__container">
                <div className="user__name">JKINGWXLFY</div>
                <div className="user__types">
                    {options.map((option) => (
                        <div
                            key={option}
                            className={`user__type${
                                selectedList === option ? " selected" : ""
                            }`}
                            onClick={() => setSelectedList(option)}
                        >
                            {option[0].toUpperCase() + option.slice(1)}
                        </div>
                    ))}
                </div>
                <div className="user__info">
                    <div className="user__info__cover" />
                    <div className="user__info__title">Title</div>
                    <div className="user__info__item">Type</div>
                    <div className="user__info__item">Release</div>
                    <div className="user__info__item">Status</div>
                </div>
                <div className="user__list">
                    {anime.map((item) => (
                        <div className="user__listItem" key={item.id}>
                            <img src={item.image} alt="image of anime title" />
                            <Link
                                href={`anime/${item.id}`}
                                className="user__listItem__title"
                            >
                                {item.title && typeof item.title !== "string"
                                    ? item.title.romaji
                                    : item.title}
                            </Link>
                            <div className="user__info__item">{item.type}</div>
                            <div className="user__info__item">
                                {item.releaseDate}
                            </div>
                            <div className="user__info__item">
                                {item.status}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
export default User;
