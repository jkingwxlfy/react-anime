"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type { IAnimeResult } from "@consumet/extensions";

import "./slider.scss";

interface ISliderProps {
    slides: IAnimeResult[];
}

const Slider: React.FC<ISliderProps> = ({ slides }) => {
    const [offset, setOffset] = useState(0);
    const myRef = useRef<HTMLDivElement>(null);

    const onNext = () => {
        if (offset === 1300 || offset > 1300) {
            setOffset(0);
        } else {
            setOffset((prev) => prev + 260);
        }
    };

    const onPrevious = () => {
        if (offset === 0 || offset < 0) {
            setOffset(1300);
        } else {
            setOffset((prev) => prev - 260);
        }
    };

    useEffect(() => {
        myRef.current!.style.transform = `translateX(-${offset}px)`;
    }, [offset]);

    return (
        <section className="slider">
            <div className="slider__container">
                <div className="slider__arrow" onClick={onPrevious}>
                    <span className="material-icons">arrow_back</span>
                </div>
                <div className="slider__wrapper">
                    <div className="slider__inner" ref={myRef}>
                        {slides.map((item) => (
                            <Link
                                className="slider__slide"
                                key={item.id}
                                href={`/anime/${item.id}`}
                            >
                                <img
                                    src={item.image}
                                    alt="image of anime title"
                                />
                                <p className="slider__title">
                                    {item.title &&
                                    typeof item.title !== "string"
                                        ? item.title.romaji
                                        : item.title}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="slider__arrow" onClick={onNext}>
                    <span className="material-icons">arrow_forward</span>
                </div>
            </div>
        </section>
    );
};
export default Slider;
