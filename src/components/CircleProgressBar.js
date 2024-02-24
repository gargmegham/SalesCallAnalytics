export default function CircleProgressBar({ size = 80, color = 'indigo', percent = 0 }) {
  const radius = size / 2;
  const circumference = 2 * Math.PI * radius;
  const finalPercent = percent > 100 ? 100 : percent < 0 ? 0 : percent;
  return (
    <div className="inline-flex items-center justify-center overflow-hidden rounded-full">
      <svg style={{ width: `${size}px`, height: `${size}px` }}>
        <circle
          className="text-gray-300"
          strokeWidth={5}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={radius}
          cy={radius}
        />
        <circle
          className={`text-${color}-600`}
          strokeWidth={5}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (finalPercent / 100) * circumference}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <span className={`absolute text-xl text-${color}-700`}>{finalPercent}%</span>
    </div>
  );
}
