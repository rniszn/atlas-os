export default function FocusChart({ focusPercentage }) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (focusPercentage / 100) * circumference;

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
        {/* Background Circle (Distracted) */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="transparent"
          stroke="#7f1d1d"
          strokeWidth="12"
        />
        
        {/* Foreground Circle (Focused) */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="transparent"
          stroke="#06b6d4"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: 'stroke-dashoffset 1s ease-out',
          }}
        />
      </svg>
      
      {/* Center Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-white tabular-nums">
          {Math.round(focusPercentage)}%
        </span>
        <span className="text-xs text-cyan-400 uppercase tracking-wider mt-1">
          Focus Score
        </span>
      </div>
    </div>
  );
}
