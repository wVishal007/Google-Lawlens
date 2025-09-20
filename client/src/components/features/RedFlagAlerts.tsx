import React, { useState } from 'react'
import { Card, CardHeader, CardContent } from '../ui/Card'
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'

interface RedFlag {
  id: string
  severity: 'low' | 'medium' | 'high'
  title: string
  description: string
  clause: string
}

interface RedFlagAlertsProps {
  redFlags: RedFlag[]
  loading?: boolean
}

export const RedFlagAlerts: React.FC<RedFlagAlertsProps> = ({ redFlags, loading = false }) => {
  const [expandedFlags, setExpandedFlags] = useState<Set<string>>(new Set())

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedFlags)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedFlags(newExpanded)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-blue-600 bg-blue-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-semibold">Red Flag Alerts</h3>
          <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {redFlags.length}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {redFlags.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No red flags detected</p>
          ) : (
            redFlags.map((flag) => (
              <div key={flag.id} className="border border-gray-200 rounded-xl p-4">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleExpanded(flag.id)}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(flag.severity)}`}>
                      {flag.severity.toUpperCase()}
                    </span>
                    <h4 className="font-medium text-gray-900">{flag.title}</h4>
                  </div>
                  {expandedFlags.has(flag.id) ? 
                    <ChevronUp className="w-4 h-4 text-gray-400" /> : 
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  }
                </div>
                {expandedFlags.has(flag.id) && (
                  <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                    <p className="text-sm text-gray-600">{flag.description}</p>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs font-medium text-gray-500 mb-1">RELEVANT CLAUSE:</p>
                      <p className="text-sm text-gray-700 italic">"{flag.clause}"</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}