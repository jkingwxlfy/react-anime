'use client';
import { useAppSelector } from '@/hooks/redux';
import Link from 'next/link';
import useSliderData from '@/hooks/useSliderData';

import Slider from '@/components/slider/Slider';
import { ErrorMessage, Spiner } from '@/components/UI';

import './home.scss';

const Home: React.FC = () => {
    const { isShownSidebar } = useAppSelector((state) => state.userSlice);
    const { popularAnime, trendingAnime, status } = useSliderData();

    if (status.isLoading) {
        return <Spiner />;
    } else if (status.isError) {
        return <ErrorMessage />;
    }

    return (
        <section className={`home${isShownSidebar ? ' shown' : ''}`}>
            <div className="home__container">
                <div className="home__title">
                    <h2>Popular Anime</h2>
                    <Link href="/anime?category=popular">view all</Link>
                </div>
                <Slider slides={popularAnime} />
                <div className="home__title">
                    <h2>Trending Anime</h2>
                    <Link href="/anime?category=trending">view all</Link>
                </div>
                <Slider slides={trendingAnime} />
            </div>
        </section>
    );
};
export default Home;
