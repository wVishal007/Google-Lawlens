import React, { useState } from 'react'
import { Card, CardHeader, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { CaseEventCard } from '../components/features/CaseEventCard'
import { Plus, Calendar, Clock, AlertCircle } from 'lucide-react'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { addNotification } from '../redux/slices/uiSlice'

interface CaseEvent {
  id: string
  title: string
  description: string
  date: string
  time: string
  priority: 'low' | 'medium' | 'high'
}

const mockEvents: CaseEvent[] = [
  {
    id: '1',
    title: 'Contract Review Meeting',
    description: 'Review employment contract with legal team',
    date: '2025-02-15',
    time: '10:00 AM',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Document Submission Deadline',
    description: 'Submit all required documents for case filing',
    date: '2025-02-20',
    time: '5:00 PM',
    priority: 'high'
  },
  {
    id: '3',
    title: 'Client Consultation Call',
    description: 'Follow-up call to discuss case progress',
    date: '2025-02-25',
    time: '2:00 PM',
    priority: 'medium'
  }
]

export const CaseBoard: React.FC = () => {
  const dispatch = useAppDispatch()
  const [events, setEvents] = useState<CaseEvent[]>(mockEvents)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CaseEvent | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    priority: 'medium' as CaseEvent['priority']
  })

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      priority: 'medium'
    })
    setEditingEvent(null)
  }

  const handleAddEvent = () => {
    resetForm()
    setModalOpen(true)
  }

  const handleEditEvent = (event: CaseEvent) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      priority: event.priority
    })
    setModalOpen(true)
  }

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId))
    dispatch(addNotification({
      type: 'success',
      message: 'Event deleted successfully'
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingEvent) {
      // Update existing event
      setEvents(events.map(e => 
        e.id === editingEvent.id 
          ? { ...editingEvent, ...formData }
          : e
      ))
      dispatch(addNotification({
        type: 'success',
        message: 'Event updated successfully'
      }))
    } else {
      // Create new event
      const newEvent: CaseEvent = {
        id: Date.now().toString(),
        ...formData
      }
      setEvents([...events, newEvent])
      dispatch(addNotification({
        type: 'success',
        message: 'Event created successfully'
      }))
    }
    
    setModalOpen(false)
    resetForm()
  }

  const upcomingEvents = events
    .filter(e => new Date(`${e.date} ${e.time}`) > new Date())
    .sort((a, b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime())

  const pastEvents = events
    .filter(e => new Date(`${e.date} ${e.time}`) <= new Date())
    .sort((a, b) => new Date(`${b.date} ${b.time}`).getTime() - new Date(`${a.date} ${a.time}`).getTime())

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">Case Board</h1>
            <p className="text-gray-600">Manage your legal events and deadlines</p>
          </div>
          <Button onClick={handleAddEvent}>
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Calendar className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{upcomingEvents.length}</p>
                  <p className="text-sm text-gray-600">Upcoming Events</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {upcomingEvents.filter(e => e.priority === 'high').length}
                  </p>
                  <p className="text-sm text-gray-600">High Priority</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Clock className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{pastEvents.length}</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Events */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Events</h2>
            {upcomingEvents.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No upcoming events</p>
                  <p className="text-sm text-gray-400 mt-1">Add your first event to get started</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <CaseEventCard
                    key={event.id}
                    event={event}
                    onEdit={handleEditEvent}
                    onDelete={handleDeleteEvent}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Past Events */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Past Events</h2>
            {pastEvents.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No past events</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pastEvents.map((event) => (
                  <CaseEventCard
                    key={event.id}
                    event={event}
                    onEdit={handleEditEvent}
                    onDelete={handleDeleteEvent}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add/Edit Event Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false)
            resetForm()
          }}
          title={editingEvent ? 'Edit Event' : 'Add New Event'}
          size="md"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Title"
              placeholder="Enter event title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                className="w-full h-24 px-4 py-3 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter event description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
              <Input
                label="Time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as CaseEvent['priority'] })}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setModalOpen(false)
                  resetForm()
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                {editingEvent ? 'Update Event' : 'Create Event'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  )
}