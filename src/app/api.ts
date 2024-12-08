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

export interface InitialPokemonPageParam {
  offset: number;
  limit: number;
}

export interface Post {
  name: string;
  id: number;
}

export interface PostsResponse {
  data: Post[];
  previousId: number;
  nextId: number;
}
export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "" }),
  tagTypes: [],
  endpoints: (builder) => ({
    getPosts: builder.query<PostsResponse, number>({
      query: (cursor) => ({
        url: `/posts?cursor=${cursor}`,
      }),
    }),
    getInfinitePosts: builder.infiniteQuery<PostsResponse, number, number>({
      infiniteQueryOptions: {
        initialPageParam: 0,
        getPreviousPageParam: (
          firstPage,
          allPages,
          firstPageParam,
          allPageParams
        ) => {
          return firstPage.previousId;
        },
        getNextPageParam: (
          lastPage,
          allPages,
          lastPageParam,
          allPageParams
        ) => {
          return lastPage.nextId;
        },
      },
      query: (pageParam) => ({
        url: `/posts?cursor=${pageParam}`,
      }),
    }),
    getPokemonByName: builder.query({
      query: (name: string) => `pokemon/${name}`,
    }),
    getPokemons: builder.query<
      {
        name: string;
      }[],
      void
    >({
      query: () => `/pokemon`,
      transformResponse: (result: {
        results: {
          name: string;
        }[];
      }) => result.results,
    }),
    evolvePokemon: builder.mutation({
      query: ({ newName }) => ({
        url: `pokemon/${newName}`,
        method: "GET",
      }),
      async onQueryStarted({ prevName }, { dispatch, queryFulfilled }) {
        try {
          const { data: evolvedPokemon } = await queryFulfilled;

          dispatch(
            api.util.upsertQueryData(
              "getPokemonByName",
              prevName,
              evolvedPokemon
            )
          );
        } catch {}
      },
    }),
    getInfinitePokemon: builder.infiniteQuery<
      PokemonResponseBody,
      InitialPokemonPageParam,
      InitialPokemonPageParam
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
export const { useGetPokemonByNameQuery } = api;
