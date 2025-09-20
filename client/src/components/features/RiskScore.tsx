import React from 'react'
import { Card } from '../ui/Card'
import { CircularProgress } from '../ui/CircularProgress'
import { AlertTriangle, Shield, CheckCircle } from 'lucide-react'

interface RiskScoreProps {
  score: number
  loading?: boolean
}

export const RiskScore: React.FC<RiskScoreProps> = ({ score, loading = false }) => {
  const getRiskLevel = () => {
    if (score >= 70) return { level: 'High', color: 'text-red-600', icon: AlertTriangle }
    if (score >= 40) return { level: 'Medium', color: 'text-yellow-600', icon: Shield }
    return { level: 'Low', color: 'text-green-600', icon: CheckCircle }
  }

  const risk = getRiskLevel()
  const RiskIcon = risk.icon

  if (loading) {
    return (
      <Card className="text-center">
        <div className="animate-pulse">
          <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-24 mx-auto mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-32 mx-auto"></div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="text-center">
      <div className="space-y-4">
        <CircularProgress value={score} />
        <div>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <RiskIcon className={`w-5 h-5 ${risk.color}`} />
            <span className={`font-semibold ${risk.color}`}>{risk.level} Risk</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Risk Score</h3>
          <p className="text-sm text-gray-600 mt-2">
            Based on analysis of legal clauses and your context
          </p>
        </div>
      </div>
    </Card>
  )
}