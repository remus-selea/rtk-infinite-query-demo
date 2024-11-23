import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface PokemonResponseBody {
  count: number;
  next: string;
  previous: any;
  results: PokemonInfo[];
}

export interface PokemonInfo {
  name: string;
  url: string;
}

export interface InitialPageParamType {
  offset: number;
  limit: number;
}

export const pokemonApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "https://pokeapi.co/api/v2/" }),
  tagTypes: [],
  endpoints: (builder) => ({
    getPokemonByName: builder.query({
      query: (name: string) => `pokemon/${name}`,
    }),
    getInfinitePokemon: builder.infiniteQuery<
      PokemonResponseBody,
      InitialPageParamType,
      InitialPageParamType
    >({
      infiniteQueryOptions: {
        initialPageParam: {
          offset: 40,
          limit: 20,
        },
        getNextPageParam: (
          lastPage,
          allPages,
          lastPageParam,
          allPageParams
        ) => {
          const nextOffset = lastPageParam.offset + lastPageParam.limit;
          const remainingItems = lastPage?.count - lastPageParam.offset;

          if (remainingItems <= 0) {
            return undefined;
          }

          return {
            ...lastPageParam,
            offset: nextOffset,
          };
        },
        getPreviousPageParam: (
          firstPage,
          allPages,
          firstPageParam,
          allPageParams
        ) => {
          const prevOffset = firstPageParam.offset - firstPageParam.limit;
          if (prevOffset < 0) return undefined;

          return {
            ...firstPageParam,
            offset: firstPageParam.offset - firstPageParam.limit,
          };
        },
      },
      query: ({ offset, limit }) => {
        return {
          url: `/pokemon?offset=${offset}&limit=${limit}`,
          method: "GET",
        };
      },
    }),
  }),
});

// Export hooks for usage in functional components
export const { useGetPokemonByNameQuery } = pokemonApi;
