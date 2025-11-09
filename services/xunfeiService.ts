import { PracticeItem, PracticeLevel, EvaluationResult } from '../types';

/**
 * Gets a pronunciation score from our backend proxy, which uses the Xunfei evaluation engine.
 */
export const getPronunciationScore = async (
  audioBase64: string,
  audioMimeType: string, // This is now always 'audio/mpeg' (MP3)
  item: PracticeItem,
  level: PracticeLevel
): Promise<EvaluationResult> => {
    const url = `/api/evaluation`;
    const referenceText = level === PracticeLevel.Phonemes ? item.exampleWord || item.text : item.text;

    const requestBody = {
        audioBase64,
        audioMimeType,
        referenceText,
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        const result = await response.json();

        if (!response.ok) {
            // Check for specific error code from our proxy to provide better feedback.
            if (result.code === 'XF_TIMEOUT') {
                throw new Error('AI 引擎响应超时。\n这通常意味着讯飞的“语音评测”服务尚未在您的应用ID下正确开通，或服务已到期。请登录讯飞开放平台检查。');
            }
            throw new Error(result.error || `AI评分服务网络错误: ${response.statusText}`);
        }
        
        return result as EvaluationResult;

    } catch (error: any) {
        console.error("Error getting pronunciation score (via proxy):", error);
        // Re-throw the specific error message from the proxy or a generic one.
        throw new Error(error.message || 'AI评分服务暂时不可用，请稍后再试。');
    }
};

/**
 * Gets Text-to-Speech (TTS) audio from our backend proxy.
 * @param text The text to synthesize into speech.
 * @returns A base64 encoded string of the audio data.
 */
export const getTtsAudio = async (text: string): Promise<string> => {
    const url = `/api/tts`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || `音频合成服务网络错误: ${response.statusText}`);
        }

        return result.audioBase64;
    } catch (error: any) {
        console.error("Error getting TTS audio (via proxy):", error);
        throw new Error(error.message || '示范音频服务暂时不可用。');
    }
};