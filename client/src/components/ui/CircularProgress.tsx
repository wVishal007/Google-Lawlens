import React from 'react'

interface CircularProgressProps {
  value: number
  size?: number
  strokeWidth?: number
  className?: string
  showValue?: boolean
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 120,
  strokeWidth = 8,
  className = '',
  showValue = true
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference

  const getColor = () => {
    if (value >= 70) return '#ef4444' // red
    if (value >= 40) return '#f59e0b' // yellow
    return '#10b981' // green
  }

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-in-out"
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">{value}%</span>
        </div>
      )}
    </div>
  )
}