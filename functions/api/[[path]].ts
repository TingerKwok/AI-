/**
 * @file This file implements a Cloudflare Pages function that acts as a secure
 * proxy to the iFlytek (Xunfei) speech evaluation API.
 *
 * It handles POST requests to `/api/evaluation`, establishes a WebSocket
 * connection to the Xunfei service, performs HMAC-SHA256 authentication,
 * sends the audio data for evaluation, and returns the detailed result.
 */

// Define the expected request body structure from the frontend.
interface EvaluationRequestBody {
  audioBase64: string;
  audioMimeType: string;
  referenceText: string;
}

// Minimal type definition for a Cloudflare Pages function handler.
type PagesFunction = (context: {
  request: Request;
  env: Record<string, any>;
}) => Promise<Response>;

// --- Hashing and Encoding Helpers ---
const toBase64 = (buffer: ArrayBuffer): string => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
};

const utf8StringToBuf = (str: string): ArrayBuffer => {
    return new TextEncoder().encode(str).buffer;
};

// --- Xunfei Authentication Logic ---
async function getXunfeiAuthUrl(env: Record<string, any>): Promise<string> {
  const host = 'cn-east-1.ws-api.xf-yun.com';
  const requestLine = 'GET /v1/private/s8e098720 HTTP/1.1';
  const date = new Date().toUTCString();

  const signatureOrigin = `host: ${host}\ndate: ${date}\n${requestLine}`;

  const secretKey = env.XUNFEI_API_SECRET;
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    utf8StringToBuf(secretKey),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, utf8StringToBuf(signatureOrigin));
  const signature = toBase64(signatureBuffer);

  const authorizationOrigin = `api_key="${env.XUNFEI_API_KEY}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`;
  const authorization = btoa(authorizationOrigin);

  const params = new URLSearchParams({
    host: host,
    date: date,
    authorization: authorization,
  });

  return `wss://${host}/v1/private/s8e098720?${params.toString()}`;
}

/**
 * Handles POST requests to the /api/evaluation endpoint.
 */
export const onRequestPost: PagesFunction = async ({ request, env }) => {
  const url = new URL(request.url);
  if (url.pathname !== '/api/evaluation') {
    return new Response('Not Found', { status: 404 });
  }

  try {
    const { audioBase64, referenceText } = await request.json() as EvaluationRequestBody;
    const { XUNFEI_APP_ID, XUNFEI_API_KEY, XUNFEI_API_SECRET } = env;

    if (!XUNFEI_APP_ID || !XUNFEI_API_KEY || !XUNFEI_API_SECRET) {
      console.error('Xunfei environment variables not set.');
      return new Response(JSON.stringify({ error: 'Server configuration error.' }), { status: 500, headers: { 'Content-Type': 'application/json' }});
    }

    const authUrl = await getXunfeiAuthUrl(env);

    const result = await new Promise((resolve, reject) => {
      const ws = new WebSocket(authUrl);

      ws.addEventListener('open', () => {
        // Construct and send the business request frame
        const requestFrame = {
          header: { app_id: XUNFEI_APP_ID, status: 2 }, // status 2 for a complete, non-streaming request
          parameter: {
            st: {
              lang: 'en',
              core: 'word', // Evaluate as a single word
              refText: referenceText,
              phoneme_output: 1, // Crucial: get phoneme-level scores
              result: {
                encoding: 'utf8',
                compress: 'raw',
                format: 'json',
              },
            },
          },
          payload: {
            data: {
              encoding: 'lame', // Assuming input is mp3-compatible
              sample_rate: 16000,
              channels: 1,
              bit_depth: 16,
              status: 2, // status 2 for final audio frame
              audio: audioBase64,
            },
          },
        };
        ws.send(JSON.stringify(requestFrame));
      });

      ws.addEventListener('message', (event) => {
        const response = JSON.parse(event.data as string);
        if (response.header.code === 0) {
          // Success
          const resultText = response.payload.result.text;
          const decodedResult = atob(resultText);
          const finalJson = JSON.parse(decodedResult);
          resolve(finalJson.result); // Resolve with the actual result object
        } else {
          // Error from Xunfei API
          console.error('Xunfei API Error:', response.header.message);
          reject(new Error(`AI 引擎错误: ${response.header.message}`));
        }
        ws.close();
      });

      ws.addEventListener('error', (event) => {
        console.error('WebSocket Error:', event);
        reject(new Error('与 AI 评分服务连接失败。'));
      });
      
      ws.addEventListener('close', (event) => {
        if (!event.wasClean) {
            reject(new Error('与 AI 评分服务的连接意外断开。'));
        }
      });

    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error during Xunfei evaluation proxy:', error);
    const errorMessage = error.message || 'An unknown error occurred.';
    return new Response(JSON.stringify({ error: `服务错误: ${errorMessage}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
