import React from 'react';

export default function ScoreSidebar({ current, total, score, timer }) {
  const percent = total ? Math.round((current / total) * 100) : 0;
  // Format timer as mm:ss
  const formatTime = (secs) => {
    if (secs == null) return '';
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };
  return (
    <aside className="h-full w-56 bg-white border-r border-gray-200 flex flex-col items-center py-8 shadow-lg">
      <div className="mb-8 flex flex-col items-center">
        <span className="text-lg font-semibold text-gray-700 mb-2">Progress</span>
        <div className="relative h-48 w-6 flex items-end justify-center">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-full bg-gray-200 rounded-full" />
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 bg-blue-500 rounded-full transition-all duration-300"
            style={{ height: `${percent}%` }}
          />
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-500">{current} / {total}</span>
        </div>
      </div>
      {typeof score === 'number' && (
        <div className="mb-8 flex flex-col items-center">
          <span className="text-lg font-semibold text-gray-700 mb-2">Score</span>
          <span className="text-2xl font-bold text-blue-600">{score}</span>
        </div>
      )}
      {typeof timer === 'number' && (
        <div className="flex flex-col items-center">
          <span className="text-lg font-semibold text-gray-700 mb-2">Time Left</span>
          <span className="text-xl font-mono text-red-500">{formatTime(timer)}</span>
        </div>
      )}
    </aside>
  );
} 