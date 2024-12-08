import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/posts", ({ request }) => {
    const url = new URL(request.url);
    const cursor = url.searchParams.get("cursor");

    if (!cursor) {
      return new HttpResponse(null, { status: 404 });
    }
    const cursorNum = Number(cursor);
    const pageSize = 5;

    const data = Array(pageSize)
      .fill(0)
      .map((_, i) => {
        return {
          name: `Post ${i + cursorNum} (server time: ${Date.now()})`,
          id: i + cursorNum,
        };
      });

    const nextId = cursorNum < 10 ? data[data.length - 1].id + 1 : null;
    const previousId = cursorNum > -10 ? data[0].id - pageSize : null;
    return HttpResponse.json({ data, nextId, previousId });
  }),
];
