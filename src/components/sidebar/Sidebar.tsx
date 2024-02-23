"use client";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setIsShownSidebar } from "@/store/reducers/userSlice";

import "./sidebar.scss";

interface SidebarData {
    value: string;
    href: string;
    icon: string;
}

export const Sidebar: React.FC = () => {
    const dispatch = useAppDispatch();
    const { isShownSidebar } = useAppSelector((state) => state.userSlice);
    const data: SidebarData[] = [
        { value: "Home", href: "/", icon: "home" },
        { value: "Profile", href: `/user`, icon: "person" },
        { value: "Search", href: "/search", icon: "search" },
    ];

    return (
        <nav className={`sidebar${isShownSidebar ? " shown" : ""}`}>
            <ul>
                <li className="sidebar__title">
                    <span
                        className="material-icons"
                        onClick={() =>
                            dispatch(setIsShownSidebar(!isShownSidebar))
                        }
                    >
                        menu
                    </span>
                    <p>JKINGWXLFY</p>
                </li>
                {data.map((item) => (
                    <li key={item.href}>
                        <Link className="sidebar__link" href={item.href}>
                            <span className="material-icons">{item.icon}</span>
                            <p>{item.value}</p>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};
export default Sidebar;
