import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import userSlice from "../features/userSlice";

const persistConfig = {
  key: "user",
  storage,
  blacklist: ['avatars'],
  migrate: (state) => {
    if (state && state.user && !state.user.ui) {
      state.user.ui = {
        showSignUp: false,
        showSignIn: false,
      };
    }
    return Promise.resolve(state);
  }
};

const reducers = combineReducers({ user: userSlice });

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
