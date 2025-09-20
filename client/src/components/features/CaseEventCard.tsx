import React from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Calendar, Clock, Edit, Trash2 } from 'lucide-react'

interface CaseEvent {
  id: string
  title: string
  description: string
  date: string
  time: string
  priority: 'low' | 'medium' | 'high'
}

interface CaseEventCardProps {
  event: CaseEvent
  onEdit: (event: CaseEvent) => void
  onDelete: (eventId: string) => void
}

export const CaseEventCard: React.FC<CaseEventCardProps> = ({ event, onEdit, onDelete }) => {
  const getPriorityColor = () => {
    switch (event.priority) {
      case 'high': return 'border-l-red-500 bg-red-50'
      case 'medium': return 'border-l-yellow-500 bg-yellow-50'
      case 'low': return 'border-l-green-500 bg-green-50'
      default: return 'border-l-gray-500 bg-gray-50'
    }
  }

  return (
    <Card className={`border-l-4 ${getPriorityColor()} hover:shadow-md transition-all duration-200`}>
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-gray-900">{event.title}</h3>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={() => onEdit(event)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(event.id)}>
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        </div>
        
        <p className="text-sm text-gray-600">{event.description}</p>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{event.time}</span>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            event.priority === 'high' ? 'bg-red-100 text-red-800' :
            event.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {event.priority.toUpperCase()}
          </span>
        </div>
      </div>
    </Card>
  )
}