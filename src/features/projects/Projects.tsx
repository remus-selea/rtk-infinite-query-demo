import React, { useCallback, useRef } from "react";
import { Link, useLocation } from "react-router";
import { api } from "../../app/api";

function Projects() {
  const {
    hasPreviousPage,
    hasNextPage,
    data,
    error,
    isFetching,
    isLoading,
    isError,
    fetchNextPage,
    fetchPreviousPage,
    isFetchingNextPage, // "Loading more..." will not appear until implemented
    isFetchingPreviousPage, // "Loading more..." will not appear until implemented
  } = api.endpoints.getProjectsCursor.useInfiniteQuery(undefined, {
    selectFromResult: (result) => {
      const firstPage = result.data?.pages?.[0];
      const lastPage = result.data?.pages?.[result.data?.pages?.length - 1];
      return {
        ...result,
        hasPreviousPage: firstPage?.before != null,
        hasNextPage: lastPage?.after != null,
      };
    },
  });

  const forwardIntObserver = useRef<IntersectionObserver | null>(null);
  const ref = useCallback(
    (node: HTMLButtonElement | null) => {
      if (isFetching) return;
      if (forwardIntObserver.current) forwardIntObserver.current.disconnect();
      forwardIntObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage(); // It's fine to try on each intersection as maybe new projects have been added. Think of a timeline like facebook
        }
      });
      if (node) forwardIntObserver.current.observe(node);
    },
    [isFetching]
  );
  const location = useLocation();

  return (
    <div>
      <h2>Infinite Scroll Example</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <span>Error: {error.message}</span>
      ) : null}
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
          <React.Fragment key={page.after}>
            {page.projects.map((project) => (
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
          {/* Background Updating will not appear after isFetchingNextPage is implemented */}
          {isFetching && !isFetchingNextPage ? "Background Updating..." : null}
        </div>
      </>

      <hr />
      <Link to="/about" state={{ from: location.pathname }}>
        Go to another page
      </Link>
    </div>
  );
}

export default Projects;
