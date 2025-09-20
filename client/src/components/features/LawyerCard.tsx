import React from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Star, MapPin, Clock } from 'lucide-react'

interface Lawyer {
  id: string
  name: string
  specialization: string
  experience: number
  rating: number
  location: string
  hourlyRate: number
  avatar?: string
}

interface LawyerCardProps {
  lawyer: Lawyer
  onRequestConsultation: (lawyerId: string) => void
}

export const LawyerCard: React.FC<LawyerCardProps> = ({ lawyer, onRequestConsultation }) => {
  return (
    <Card hover className="h-full">
      <div className="space-y-4">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            {lawyer.avatar ? (
              <img src={lawyer.avatar} alt={lawyer.name} className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <span className="text-xl font-semibold text-gray-600">
                {lawyer.name.split(' ').map(n => n[0]).join('')}
              </span>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900">{lawyer.name}</h3>
            <p className="text-sm text-gray-600">{lawyer.specialization}</p>
            <div className="flex items-center space-x-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i < lawyer.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                />
              ))}
              <span className="text-sm text-gray-500 ml-1">({lawyer.rating})</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span>{lawyer.experience} years experience</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{lawyer.location}</span>
          </div>
          <div className="text-sm text-gray-900 font-medium">
            ${lawyer.hourlyRate}/hour
          </div>
        </div>
        
        <Button 
          variant="primary" 
          className="w-full"
          onClick={() => onRequestConsultation(lawyer.id)}
        >
          Request Consultation
        </Button>
      </div>
    </Card>
  )
}