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
  persistStore,
  PersistedState,
} from "redux-persist";
import userSliceReducer from "../store/slices/userSlice";
import { useDispatch } from "react-redux";

const reducers = combineReducers({ user: userSliceReducer });

type AppRootState = ReturnType<typeof reducers>;

interface UserInterface {
  showSignUp: boolean;
  showSignIn: boolean;
  isAnyModalOpen: boolean;
}

const persistConfig = {
  key: "user-v4",
  storage,
  blacklist: ["avatars"],
  migrate: (state: AppRootState & PersistedState): Promise<AppRootState & PersistedState> => {
    if (state && state.user) {
      if (!state.user.interface) {
        state.user.interface = {
          showSignUp: false,
          showSignIn: false,
          isAnyModalOpen: false,
        } as UserInterface;
      }

      if (!state.user.user) {
        state.user.user = {
          info: null,
          profiles: [],
          watchlist: {
            items: [],
            loading: false,
            error: null,
          },
        };
      } else {
        if (!state.user.user.watchlist) {
          state.user.user.watchlist = {
            items: [],
            loading: false,
            error: null,
          };
        }
      }
    }
    return Promise.resolve(state);
  },
};

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

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
