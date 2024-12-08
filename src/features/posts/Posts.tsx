import React, { useCallback, useRef } from "react";
import { Link } from "react-router";
import { api } from "../../app/api";

function Posts() {
  const {
    hasPreviousPage,
    hasNextPage,
    data,
    error,
    isFetching,
    isError,
    fetchNextPage,
    fetchPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
  } = api.endpoints.getInfinitePosts.useInfiniteQuery(0, {
    selectFromResult: (result) => {
      const firstPage = result.data?.pages?.[0];
      const lastPage = result.data?.pages?.[result.data?.pages?.length - 1];
      return {
        ...result,
        hasPreviousPage: firstPage?.previousId != null,
        hasNextPage: lastPage?.nextId != null,
      };
    },
  });

  const forwardIntObserver = useRef<IntersectionObserver | null>(null);
  const ref = useCallback(
    (node: HTMLButtonElement | null) => {
      if (isFetching) return;
      if (forwardIntObserver.current) forwardIntObserver.current.disconnect();
      forwardIntObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) forwardIntObserver.current.observe(node);
    },
    [hasNextPage, isFetching]
  );

  return (
    <div>
      <h1>Infinite Loading</h1>
      {isFetching ? (
        <p>Loading...</p>
      ) : isError ? (
        <span>Error: {error?.message}</span>
      ) : (
        <>
          <div>
            <button
              onClick={() => fetchPreviousPage()}
              disabled={!hasPreviousPage || isFetchingPreviousPage}
            >
              {isFetchingPreviousPage
                ? "Loading more..."
                : hasPreviousPage
                ? "Load Older"
                : "Nothing more to load"}
            </button>
          </div>
          {data?.pages.map((page) => (
            <React.Fragment key={page.nextId}>
              {page.data.map((project) => (
                <p
                  style={{
                    border: "1px solid gray",
                    borderRadius: "5px",
                    padding: "10rem 1rem",
                    background: `hsla(${project.id * 30}, 60%, 80%, 1)`,
                  }}
                  key={project.id}
                >
                  {project.name}
                </p>
              ))}
            </React.Fragment>
          ))}
          <div>
            <button
              ref={ref}
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {isFetchingNextPage
                ? "Loading more..."
                : hasNextPage
                ? "Load Newer"
                : "Nothing more to load"}
            </button>
          </div>
          <div>
            {isFetching && !isFetchingNextPage
              ? "Background Updating..."
              : null}
          </div>
        </>
      )}
      <hr />
      <Link to="/about">Go to another page</Link>
    </div>
  );
}

export default Posts;
