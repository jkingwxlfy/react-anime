import { useEffect, useRef } from 'react';

// eslint-disable-next-line max-params
export default function useObserver<T extends HTMLElement>(
    ref: React.RefObject<T>,
    isLoading: boolean,
    canLoad: boolean,
    callback: () => void
) {
    const observer = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        if (isLoading) return;

        if (observer.current) observer.current.disconnect();

        const onObserve = function (entries: IntersectionObserverEntry[]) {
            if (entries[0].isIntersecting && canLoad) {
                callback();
            }
        };

        observer.current = new IntersectionObserver(onObserve);
        if (ref.current) {
            observer.current.observe(ref.current);
        }
    }, [isLoading]);
}
