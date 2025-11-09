/**
 * @file This file implements a Cloudflare Pages function that acts as a secure
 * proxy to the SiliconFlow API for a two-stage pronunciation evaluation.
 *
 * It handles POST requests to `/api/evaluation`.
 * Stage 1: Transcribes user audio to text using an ASR model.
 * Stage 2: Sends the transcribed text and reference text to a powerful LLM
 *          to get an intelligent score and feedback.
 */

// Define the expected request body structure from the frontend.
interface EvaluationRequestBody {
  audioBase64: string;
  audioMimeType: string;
  referenceText: string;
}

// Define the final JSON structure we want to send to the frontend.
interface ScoreResult {
  score: number;
  feedback: string;
}

// Helper function to convert Base64 to Blob
const base64ToBlob = (base64: string, mimeType: string): Blob => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
}

// FIX: Define the PagesFunction type to resolve the "Cannot find name 'PagesFunction'" error.
// This provides a minimal type definition for a Cloudflare Pages function handler.
type PagesFunction = (context: {
  request: Request;
  env: unknown;
}) => Promise<Response>;

/**
 * Handles POST requests to the /api/evaluation endpoint.
 */
export const onRequestPost: PagesFunction = async ({ request, env }) => {
  const url = new URL(request.url);

  // This function only handles the /api/evaluation path.
  if (url.pathname !== '/api/evaluation') {
    return new Response('Not Found', { status: 404 });
  }

  try {
    // FIX: Changed to use a type assertion `as` because the standard `request.json()` method does not accept generic type arguments.
    const { audioBase64, audioMimeType, referenceText } = (await request.json()) as EvaluationRequestBody;

    if (!audioBase64 || !audioMimeType || !referenceText) {
      return new Response(JSON.stringify({ error: 'Missing required fields.' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = (env as any).SILICONFLOW_API_KEY;
    if (!apiKey) {
      console.error('SILICONFLOW_API_KEY environment variable not set.');
      return new Response(JSON.stringify({ error: 'Server configuration error.' }), {
        status: 500, headers: { 'Content-Type': 'application/json' },
      });
    }

    // --- STAGE 1: Audio Transcription ---
    const audioBlob = base64ToBlob(audioBase64, audioMimeType);
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');
    formData.append('model', 'FunAudioLLM/SenseVoiceSmall');
    
    const transcriptionResponse = await fetch('https://api.siliconflow.cn/v1/audio/transcriptions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}` },
        body: formData,
    });

    if (!transcriptionResponse.ok) {
        const errorBody = await transcriptionResponse.text();
        console.error(`SiliconFlow Transcription API error: ${transcriptionResponse.status}`, errorBody);
        throw new Error(`语音转文本服务失败: ${transcriptionResponse.statusText}`);
    }

    const transcriptionResult = await transcriptionResponse.json();
    const transcribedText = (transcriptionResult as any).text.trim();

    // --- STAGE 2: Intelligent Scoring with LLM ---
    const prompt = `
# Role
You are a professional English pronunciation coach.

# Task
Strictly compare the "Standard Pronunciation" with the "User's Transcribed Pronunciation". Then, provide a score from 0 to 100 and a short, constructive feedback in Chinese.

# Scoring Criteria
- If the two texts are identical, the score should be above 90.
- If there are minor differences (e.g., 'see' vs 'shee'), the score should be between 70-85, and you must point out the specific issue.
- If the difference is significant, the score should be below 60.

# Input Data
- Standard Pronunciation text: "${referenceText}"
- User's Transcribed Pronunciation: "${transcribedText}"

# Output Format
You MUST respond ONLY with a valid JSON object in the following format, with no extra text, explanations, or code block markers:
{
  "score": number,
  "feedback": "string"
}
`;

    const chatRequestBody = {
        model: "deepseek-ai/DeepSeek-R1-0528-Qwen3-8B",
        messages: [
            { role: "user", content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 150,
        response_format: { type: "json_object" } // Ask for JSON output explicitly
    };

    const chatResponse = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(chatRequestBody)
    });

    if (!chatResponse.ok) {
        const errorBody = await chatResponse.text();
        console.error(`SiliconFlow Chat API error: ${chatResponse.status}`, errorBody);
        throw new Error(`智能评分服务失败: ${chatResponse.statusText}`);
    }

    const chatResult = await chatResponse.json();
    const content = (chatResult as any).choices[0]?.message?.content;
    
    if (!content) {
        throw new Error("智能评分模型未返回有效内容。");
    }

    // Parse the JSON string from the LLM's response.
    try {
        const finalResult: ScoreResult = JSON.parse(content);
        return new Response(JSON.stringify(finalResult), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (parseError) {
        console.error("Failed to parse JSON from LLM response:", content, parseError);
        throw new Error("智能评分模型返回了无效的格式。");
    }

  } catch (error: any) {
    console.error('Error during pronunciation evaluation:', error);
    const errorMessage = error.message || 'An unknown error occurred.';
    return new Response(JSON.stringify({ error: `服务错误: ${errorMessage}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
