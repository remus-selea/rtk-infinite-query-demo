import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { pokemonApi } from "./pokemonApi";

const rootReducer = combineSlices(pokemonApi);

export type RootState = ReturnType<typeof rootReducer>;

export const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(pokemonApi.middleware);
    },
    preloadedState,
  });
  // configure listeners using the provided defaults
  // optional, but required for `refetchOnFocus`/`refetchOnReconnect` behaviors
  setupListeners(store.dispatch);
  return store;
};

export const store = makeStore();
export type AppStore = typeof store;
export type AppDispatch = AppStore["dispatch"];
