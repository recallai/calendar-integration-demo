export interface Env {
  RECALL_API_KEY: string;
  RECALL_API_HOST: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
  "Access-Control-Max-Age": "86400",
};

function handleOptions(request: Request): Response {
  // Make sure the necessary headers are present
  // for this to be a valid pre-flight request
  const headers = request.headers;
  const accessControlRequestHeader = headers.get(
    "Access-Control-Request-Headers"
  );

  if (
    headers.get("Origin") !== null &&
    headers.get("Access-Control-Request-Method") !== null &&
    accessControlRequestHeader !== null
  ) {
    let respHeaders = {
      ...corsHeaders,
      "Access-Control-Allow-Headers": accessControlRequestHeader,
    };

    return new Response(null, {
      headers: respHeaders,
    });
  } else {
    return new Response(null, {
      headers: {
        Allow: "GET, HEAD, POST, OPTIONS",
      },
    });
  }
}

async function handleAuthenticate(
  request: Request,
  env: Env
): Promise<Response> {
  const { RECALL_API_HOST, RECALL_API_KEY } = env;
  const { headers } = request;
  const url = new URL(request.url);
  const contentType = headers.get("content-type") || "";

  let requestBody: { userId?: string } = {};
  if (contentType.includes("application/json")) {
    requestBody = await request.json();
  }

  let responseBody: {} = {};
  if (requestBody.userId) {
    const init = {
      body: JSON.stringify({ user_id: requestBody.userId }),
      method: "POST",
      headers: {
        "content-type": "application/json;charset=UTF-8",
        authorization: `Token ${RECALL_API_KEY}`,
      },
    };
    const tokenResponse = await fetch(
      `${RECALL_API_HOST}/calendar/authenticate/`,
      init
    );
    console.log(`${RECALL_API_HOST}/calendar/authenticate/`, tokenResponse, 'token response!')
    responseBody = await tokenResponse.json();
  }

  const response = new Response(JSON.stringify(responseBody), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.append("Vary", "Origin");

  return response;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    switch (request.method) {
      case "OPTIONS":
        return handleOptions(request);
      case "POST":
        return handleAuthenticate(request, env);
      default:
        return new Response("");
    }
  },
};
