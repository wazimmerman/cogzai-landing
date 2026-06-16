const UPSTREAM_URL = "https://cogzai.wmzm.workers.dev/_emdash/api/plugins/cogzai-ops/subscribe";

function buildResponseHeaders(upstreamHeaders) {
  const headers = new Headers();
  const contentType = upstreamHeaders.get("content-type");
  const cacheControl = upstreamHeaders.get("cache-control");

  headers.set("content-type", contentType || "application/json; charset=utf-8");
  headers.set("cache-control", cacheControl || "private, no-store");

  return headers;
}

export async function onRequestPost(context) {
  const body = await context.request.text();

  const upstreamResponse = await fetch(UPSTREAM_URL, {
    method: "POST",
    headers: {
      "content-type": context.request.headers.get("content-type") || "application/json",
      accept: "application/json",
    },
    body,
  });

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: buildResponseHeaders(upstreamResponse.headers),
  });
}

export function onRequestGet() {
  return new Response(JSON.stringify({
    error: {
      code: "METHOD_NOT_ALLOWED",
      message: "Use POST for subscription requests.",
    },
  }), {
    status: 405,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "private, no-store",
    },
  });
}
