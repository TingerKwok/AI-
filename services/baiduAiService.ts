import { PracticeItem, PracticeLevel, ScoreResult } from '../types';

/**
 * Gets a pronunciation score from our backend proxy, which now uses SiliconFlow.
 */
export const getPronunciationScore = async (
  audioBase64: string,
  audioMimeType: string,
  item: PracticeItem,
  level: PracticeLevel
): Promise<ScoreResult> => {
    // The URL points to our secure serverless proxy.
    const url = `/api/evaluation`;

    // The text to be evaluated. For phonemes, an example word provides better context for the AI.
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
            // Forward the error message from the proxy/API if available.
            throw new Error(result.error || `AI评分服务网络错误: ${response.statusText}`);
        }
        
        // The proxy now returns data in the exact format the frontend needs.
        return result as ScoreResult;

    } catch (error) {
        console.error("Error getting pronunciation score (via proxy):", error);
        // Provide a user-friendly error message.
        throw new Error('AI评分服务暂时不可用，请稍后再试。');
    }
};
