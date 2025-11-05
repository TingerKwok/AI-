// Define the structure of the environment variables for type safety.
interface Env {
  BAIDU_API_KEY: string;
  BAIDU_SECRET_KEY: string;
}

// This is a Cloudflare Pages Function that acts as a secure proxy.
// It catches all requests to `/api/*`.
// FIX: Replaced missing 'PagesFunction' type with an inline type for the context object to resolve the type error.
export const onRequest = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  let baiduUrl;

  // Route the request based on the path.
  if (path.startsWith('/api/token')) {
    // For token requests, construct the URL with secrets from the environment.
    baiduUrl = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${env.BAIDU_API_KEY}&client_secret=${env.BAIDU_SECRET_KEY}`;
  } else if (path.startsWith('/api/text2audio')) {
    // For TTS requests, forward the query parameters.
    baiduUrl = `https://tsn.baidu.com/text2audio${url.search}`;
  } else if (path.startsWith('/api/evaluation')) {
    // For evaluation requests, forward the query parameters.
    baiduUrl = `https://aip.baidubce.com/rpc/2.0/mt/speech/v1/evaluation${url.search}`;
  } else {
    // If the path is unknown, return an error.
    return new Response('Invalid API path', { status: 404 });
  }

  // Create a new request to the Baidu API, preserving the method, headers, and body
  // of the original request from the browser.
  const baiduRequest = new Request(baiduUrl, request);
  
  // Forward the request to Baidu and return the response directly to the browser.
  return fetch(baiduRequest);
};
