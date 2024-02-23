import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./reducers/userSlice";

export const makeStore = () => {
    return configureStore({
        reducer: { userSlice },
    });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
