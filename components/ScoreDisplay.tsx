import React from 'react';

interface ScoreDisplayProps {
  score: number;
  feedback: string;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, feedback }) => {
  const circumference = 2 * Math.PI * 45; // 2 * pi * radius
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = () => {
    if (score >= 85) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStrokeColor = () => {
    if (score >= 85) return 'stroke-green-500';
    if (score >= 60) return 'stroke-yellow-500';
    return 'stroke-red-500';
  };

  return (
    <div className="my-4 p-4 bg-orange-50 dark:bg-gray-700/50 rounded-lg border border-orange-200 dark:border-gray-600">
      <div className="flex items-center gap-4">
        <div className="relative w-28 h-28">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              className="text-gray-200 dark:text-gray-600"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
            />
            {/* Progress circle */}
            <circle
              className={`${getStrokeColor()} transition-all duration-1000 ease-out`}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
              transform="rotate(-90 50 50)"
            />
          </svg>
          <div className={`absolute inset-0 flex items-center justify-center text-3xl font-bold ${getScoreColor()}`}>
            {score}
            <span className="text-lg -mt-3">%</span>
          </div>
        </div>
        <div className="flex-1">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">AI 反馈 (Feedback):</h4>
            <p className="text-gray-600 dark:text-gray-300">{feedback}</p>
        </div>
      </div>
    </div>
  );
};