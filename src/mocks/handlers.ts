import { delay, http, HttpResponse } from "msw";

const getCursorParams = (url: URL) => {
  const beforeCursorParam = url.searchParams.get("before");
  const afterCursorParam = url.searchParams.get("after");
  return { beforeCursorParam, afterCursorParam };
};

const getPageSize = (url: URL) => {
  const limitParam = url.searchParams.get("limit") || "5";
  return parseInt(limitParam, 10);
};

const calculateAdjustedCursor = (
  cursor: number,
  totalItems: number,
  isBefore: boolean
) => {
  if (Math.abs(cursor) > totalItems) {
    return isBefore ? -totalItems : totalItems;
  }
  return cursor;
};

const generateProjects = (
  cursor: number,
  adjustedCursor: number,
  totalItems: number,
  pageSize: number
) => {
  return Array(Math.abs(cursor) > totalItems ? totalItems % pageSize : pageSize)
    .fill(0)
    .reduce((acc, _, i) => {
      const id = adjustedCursor + i;
      if (id < totalItems) {
        acc.push({
          name: `Project ${id} (server time: ${Date.now()})`,
          id,
        });
      }
      return acc;
    }, []);
};

export const handlers = [
  http.get("https://example.com/api/projectsCursor", async ({ request }) => {
    const url = new URL(request.url);
    const { beforeCursorParam, afterCursorParam } = getCursorParams(url);
    const pageSize = getPageSize(url);
    const cursor = parseInt((beforeCursorParam || afterCursorParam) ?? "0", 10);

    const isBefore = beforeCursorParam != null;
    const totalItems = isBefore ? 13 : 22;

    const adjustedCursor = calculateAdjustedCursor(
      cursor,
      totalItems,
      isBefore
    );
    const projects = generateProjects(
      cursor,
      adjustedCursor,
      totalItems,
      pageSize
    );

    const hasPrevious = cursor > -totalItems;
    const previousId = hasPrevious ? projects[0].id - pageSize : null;

    const hasNext = cursor < totalItems - pageSize;
    const nextId = hasNext ? projects[projects.length - 1].id + 1 : null;

    await delay(1000);

    return HttpResponse.json({
      projects: projects,
      before: previousId,
      after: nextId,
    });
  }),
];
