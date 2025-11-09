import React from 'react';
import { EvaluationResult, PhonemeScore, WordScore } from '../types';

interface ScoreDisplayProps {
  result: EvaluationResult;
}

const getScoreColor = (score: number) => {
  if (score >= 85) return 'text-green-500';
  if (score >= 60) return 'text-yellow-500';
  return 'text-red-500';
};

const getStrokeColor = (score: number) => {
  if (score >= 85) return 'stroke-green-500';
  if (score >= 60) return 'stroke-yellow-500';
  return 'stroke-red-500';
};

const getBgColor = (score: number) => {
    if (score >= 85) return 'bg-green-100 dark:bg-green-900/50 border-green-200 dark:border-green-700';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/50 border-yellow-200 dark:border-yellow-700';
    return 'bg-red-100 dark:bg-red-900/50 border-red-200 dark:border-red-700';
}

const getFeedbackMessage = (score: number): string => {
    if (score >= 90) return "太棒了，发音非常标准！";
    if (score >= 80) return "非常好，继续保持！";
    if (score >= 60) return "不错，继续努力！请特别注意得分较低的音素。";
    return "还需要多加练习哦，可以多听听示范发音。";
}


const ScoreCircle: React.FC<{ score: number }> = ({ score }) => {
  const circumference = 2 * Math.PI * 45; // 2 * pi * radius
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-28 h-28 flex-shrink-0">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-gray-200 dark:text-gray-600"
          strokeWidth="10" stroke="currentColor" fill="transparent"
          r="45" cx="50" cy="50"
        />
        <circle
          className={`${getStrokeColor(score)} transition-all duration-1000 ease-out`}
          strokeWidth="10" strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" fill="transparent"
          r="45" cx="50" cy="50" transform="rotate(-90 50 50)"
        />
      </svg>
      <div className={`absolute inset-0 flex items-center justify-center text-3xl font-bold ${getScoreColor(score)}`}>
        {Math.round(score)}
      </div>
    </div>
  );
};

const DetailScore: React.FC<{ label: string; score: number }> = ({ label, score }) => (
    <div className="text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className={`text-2xl font-bold ${getScoreColor(score)}`}>{Math.round(score)}</p>
    </div>
);

const PhonemeDisplay: React.FC<{ phoneme: PhonemeScore }> = ({ phoneme }) => {
    // Convert phoneme symbol from CMU-like (e.g., "IY") to IPA-like (e.g., /iː/) for display if needed.
    // For now, we'll display the returned phoneme symbol directly.
    return (
        <div className={`p-2 rounded-md text-center border ${getBgColor(phoneme.pronunciation)}`}>
            <p className="font-mono text-lg text-gray-800 dark:text-gray-200">{phoneme.phoneme}</p>
            <p className={`font-bold text-sm ${getScoreColor(phoneme.pronunciation)}`}>{Math.round(phoneme.pronunciation)}</p>
        </div>
    )
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ result }) => {
  const { overall, pronunciation, integrity, fluency, words } = result;
  const mainWord: WordScore | undefined = words?.[0];

  return (
    <div className="my-4 p-4 space-y-4 bg-orange-50 dark:bg-gray-700/50 rounded-lg border border-orange-200 dark:border-gray-600">
      {/* Main Score & Feedback */}
      <div className="flex items-center gap-4">
        <ScoreCircle score={overall} />
        <div className="flex-1">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">AI 综合评语:</h4>
            <p className="text-gray-600 dark:text-gray-300">{getFeedbackMessage(overall)}</p>
        </div>
      </div>
      
      {/* Detailed Scores */}
       <div className="grid grid-cols-3 gap-4 py-2 border-y border-orange-200 dark:border-gray-600">
          <DetailScore label="发音准确度" score={pronunciation} />
          <DetailScore label="完整度" score={integrity} />
          <DetailScore label="流畅度" score={fluency} />
      </div>

      {/* Phoneme Breakdown */}
      {mainWord && mainWord.phonemes && (
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">发音详情 ({mainWord.word}):</h4>
             <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {mainWord.phonemes.map((p, index) => (
                    <PhonemeDisplay key={index} phoneme={p} />
                ))}
            </div>
          </div>
      )}
    </div>
  );
};
