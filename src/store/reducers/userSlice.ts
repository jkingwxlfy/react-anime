import { createSlice } from "@reduxjs/toolkit/react";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { IUserListItem, TypeOfList } from "@/models/IUserList";
import type { IAnimeResult } from "@consumet/extensions";

interface IUserState {
    isShownSidebar: boolean;
    userList: IUserListItem[]
}

interface PayloadActionList<A, T> {
    payload: {
        animeInfo: A,
        type: T
    }
}

interface PayloadActionFavorite<A, T> {
    payload: {
        animeInfo: A,
        isFavorite: T
    }
}

const initialState: IUserState = {
    isShownSidebar: false,
    userList: [
        {name: "planning", list: []},
        {name: "watching", list: []},
        {name: "complete", list: []},
        {name: "favorite", list: []}
    ]
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setIsShownSidebar: (state, action: PayloadAction<boolean>) => {
            state.isShownSidebar = action.payload;
        },
        addOneToList: (state, action: PayloadActionList<IAnimeResult, TypeOfList>) => {
            const {animeInfo, type} = action.payload;
            state.userList = state.userList.map((item) => {
                if (item.name === type) {
                    if (item.list.some(item => item.id === animeInfo.id)) {
                        return item;
                    } else {
                        item.list.push(animeInfo);
                    }
                }
                return item;
            })
        },
        setFavorite: (state, action: PayloadActionFavorite<IAnimeResult, boolean>) => {
            const {animeInfo, isFavorite} = action.payload;
            if (isFavorite) {
                state.userList = state.userList.map((item) => {
                    if (item.name === "favorite") {
                        if (item.list.includes(animeInfo)) {
                            return item;
                        } else {
                            item.list.push(animeInfo);
                        }
                    }
                    return item;
                })
            } else {
                state.userList = state.userList.map((item) => {
                    if (item.name === "favorite") {
                        return {...item, list: item.list.filter(item => item.id !== animeInfo.id)}
                    }
                    return item;
                })
            }
        }
    },
});

const { actions, reducer } = userSlice;

export const { setIsShownSidebar, addOneToList, setFavorite } = actions;
export default reducer;
