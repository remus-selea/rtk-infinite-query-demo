import { createSelector } from "@reduxjs/toolkit";
import type {
  BaseQueryFn,
  TypedUseQueryStateResult,
} from "@reduxjs/toolkit/query/react";
import { useCallback, useRef, useState } from "react";
import { api, PokemonResponseBody } from "../../app/api";

type getPokemonSelectFromResultArg = TypedUseQueryStateResult<
  { pages: PokemonResponseBody[] },
  unknown,
  BaseQueryFn
>;

const selectCombinedPokemons = createSelector(
  (res: getPokemonSelectFromResultArg) => {
    return res.data;
  },
  (data) => data?.pages?.map((item) => item.results)?.flat()
);

function PokemonList() {
  const [manual, setManual] = useState(true);

  const initialPageParam = {
    offset: 40,
    limit: 20,
  };
  const {
    combinedData,
    hasPreviousPage,
    hasNextPage,
    // data,
    isFetching,
    isUninitialized,
    fetchNextPage,
    fetchPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    direction,
  } = api.endpoints.getInfinitePokemon.useInfiniteQuery(initialPageParam, {
    // initialPageParam,
    selectFromResult: (result) => {
      const firstPageParam = result?.data?.pageParams[0];
      const lastPageParam =
        result?.data?.pageParams?.[result?.data?.pageParams.length - 1];

      const lastPage = result.data?.pages?.[result.data?.pages?.length - 1];
      const remainingItems =
        (lastPage?.count ?? 0) - (lastPageParam?.offset ?? 0);

      return {
        ...result,
        combinedData: selectCombinedPokemons(result),
        hasPreviousPage:
          (firstPageParam?.offset ?? 0) - (firstPageParam?.limit ?? 0) >= 0,
        hasNextPage: remainingItems > 0,
      };
    },
  });

  const handlePreviousPage = async () => {
    const res = await fetchPreviousPage();
  };

  const handleNextPage = async () => {
    const res = await fetchNextPage();
  };

  const lastIntObserver = useRef<IntersectionObserver | null>(null);
  const lastRowRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetching) return;
      if (lastIntObserver.current) lastIntObserver.current.disconnect();
      lastIntObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) lastIntObserver.current.observe(node);
    },
    [hasNextPage, isFetching]
  );

  return (
    <div>
      <header>
        <h2>Pokemon Infinite Query</h2>

        <div className="pokemon-query-status">
          <div data-testid="isUninitialized">
            isUninitialized: {String(isUninitialized)}
          </div>
          <div data-testid="isFetching">isFetching: {String(isFetching)}</div>
          <div>isFetchingNextPage: {String(isFetchingNextPage)}</div>
          <div>isFetchingPreviousPage: {String(isFetchingPreviousPage)}</div>
          <div>direction: {String(direction)}</div>
          <div>
            <input
              type="checkbox"
              id="manual"
              checked={manual}
              onChange={() => setManual((prev) => !prev)}
            />
            <label htmlFor="manual">Fetch Manually</label>
          </div>
        </div>
      </header>
      <button
        disabled={!hasPreviousPage}
        data-testid="prevPage"
        onClick={() => handlePreviousPage()}
      >
        {isFetchingPreviousPage
          ? "Loading more..."
          : hasPreviousPage
          ? "Previous Page"
          : "Nothing more to load"}
      </button>
      <div data-testid="data">
        {combinedData?.map((pokemonInfo, index, arr) => {
          const ref = !manual && index === arr.length - 1 ? lastRowRef : null;
          return (
            <div key={index} className="row" ref={ref}>
              {pokemonInfo.name}
            </div>
          );
        })}
      </div>

      <button
        data-testid="nextPage"
        disabled={!hasNextPage}
        onClick={() => handleNextPage()}
      >
        {isFetchingNextPage
          ? "Loading more..."
          : hasNextPage
          ? "Next Page"
          : "Nothing more to load"}
      </button>
    </div>
  );
}

export default PokemonList;
