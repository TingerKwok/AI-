import { GoogleGenAI, Type, Modality } from "@google/genai";
import { ScoreResult, PracticeItem, PracticeLevel } from '../types';

export const getPronunciationScore = async (
  audioBase64: string,
  mimeType: string,
  practiceItem: PracticeItem,
  practiceLevel: PracticeLevel,
): Promise<ScoreResult> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    let promptText = '';

    if (practiceLevel === PracticeLevel.Phonemes) {
      promptText = `The user is practicing the English phoneme represented by the IPA symbol: "${practiceItem.ipa}". A common word using this sound is "${practiceItem.exampleWord}". Please analyze the user's audio where they attempt to pronounce this single sound in isolation. Based on their pronunciation of this phoneme, provide:
1. A pronunciation accuracy score from 0 to 100.
2. Brief, actionable feedback in **Chinese** on how to improve. The feedback should be concise (1-2 sentences) and suitable for Chinese learners.
Please return the result in the specified JSON format.`;
    } else {
      promptText = `用户需要练习发音的英文是: "${practiceItem.text}"。请分析用户录制的音频，并完成以下任务： 1. 给出一个0到100的发音准确度分数，100分代表完美。 2. 用**中文**提供简短、可操作的发音改进建议，指出发音不准的地方。反馈应简洁明了，适合中国学习者，控制在一到两句话内。请严格按照定义的JSON格式返回结果。`;
    }


    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            text: promptText,
          },
          {
            inlineData: {
              mimeType: mimeType,
              data: audioBase64,
            },
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: {
              type: Type.NUMBER,
              description: 'A pronunciation accuracy score from 0 to 100.',
            },
            feedback: {
              type: Type.STRING,
              description: 'Concise, actionable feedback in Chinese on what to improve. Should be no more than 1-2 sentences.',
            },
          },
          required: ['score', 'feedback'],
        },
      },
    });
    
    const jsonString = response.text.trim();
    const result: ScoreResult = JSON.parse(jsonString);

    if (typeof result.score !== 'number' || typeof result.feedback !== 'string') {
        throw new Error("Invalid response format from API.");
    }

    return result;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get pronunciation score from the AI service.");
  }
};

export const getTextToSpeechAudio = async (text: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // If the text is a detailed phoneme prompt, use it as is.
    // Otherwise, wrap it with the British accent instruction.
    const prompt = text.toLowerCase().includes('pronounce the phoneme') 
      ? text
      : `In a standard British accent, say: "${text}"`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // A standard, clear voice capable of adopting accents from prompts
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error("No audio data returned from API.");
    }
    return base64Audio;
  } catch (error) {
    console.error("Error calling Gemini TTS API:", error);
    throw new Error("Failed to generate speech from the AI service.");
  }
};